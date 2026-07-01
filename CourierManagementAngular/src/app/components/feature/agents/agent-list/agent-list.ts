import { ChangeDetectorRef, Component } from '@angular/core';
import { PolicestationService } from '../../../../services/policestation.service';
import { AgentService } from '../../../../services/agent.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-agent-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './agent-list.html',
  styleUrl: './agent-list.css',
})
export class AgentList {

 imageUrl = environment.imgUrl+'agent/'


  editingAgent: any | null = null;
  editForm: any = {};
  editImage: File | null = null;
  saving = false;

  agents: any[] = [];
  hubs: any[] = [];

  searchTerm: string = '';
  selectedHubId: number | null = null;

  loading = true;
  errorMessage: string | null = null;

  constructor(
    private agentService: AgentService,
    private hubService: PolicestationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAgents();
    this.loadHubs();
  }

 openEditModal(agent: any): void {
    this.editingAgent = agent;
    // Clone so we don't mutate the list directly while typing
    this.editForm = {
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      designation: agent.designation,
      hubId: agent.hubId,
      // add any other editable fields your AgentRequestDTO expects
    };
    this.editImage = null;
  }

  closeEditModal(): void {
    this.editingAgent = null;
    this.editForm = {};
    this.editImage = null;
  }


  loadAgents(): void {
    this.loading = true;
    this.errorMessage = null;

    this.agentService.getAllAgents().subscribe({
      next: (res) => {
        this.agents = res || [];

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Could not load agents. Please try again.';
        this.loading = false;
      }
    });
  }
onEditImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.editImage = input.files[0];
    }
  }


  loadHubs(): void {
    // Used only to populate the "Filter by Hub" dropdown and to show
    // a readable hub name on each card (agents only store hubId).
    this.hubService.getAll().subscribe({
      next: (res) => {
        this.hubs = res || [];
        this.cdr.markForCheck();
      }
      ,
      error: (err) => console.error(err)
    });
  }

  /** Combined client-side filter: text search + hub filter */
  get filteredAgents(): any[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.agents.filter(agent => {
      const matchesSearch = !term ||
        agent.name?.toLowerCase().includes(term) ||
        agent.email?.toLowerCase().includes(term) ||
        agent.phone?.toLowerCase().includes(term) ||
        agent.designation?.toLowerCase().includes(term);

      const matchesHub = !this.selectedHubId || agent.hubId === this.selectedHubId;

      return matchesSearch && matchesHub;
    });
  }

  hubName(hubId: number): string {
    return this.hubs.find(h => h.id === hubId)?.name || '—';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedHubId = null;
  }

  /**
   * Adjust these property names to whatever your API actually returns
   * for the agent's photo (e.g. imageUrl, photoUrl, imagePath...).
   */
  getAgentImage(agent: any): string | null {
    return agent.image ? this.imageUrl + agent.image : '';
  }

  onImageError(agent: any): void {
    agent._imageError = true;
  }

  deleteAgent(agent: any): void {
    if (!confirm(`Delete agent "${agent.name}"? This cannot be undone.`)) {
      return;
    }

    this.agentService.deleteAgent(agent.id).subscribe({
      next: () => {
        this.agents = this.agents.filter(a => a.id !== agent.id);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to delete agent.');
      }
    });
  }


  saveAgent(): void {
    if (!this.editingAgent) return;

    this.saving = true;
    this.agentService.updateAgent(this.editingAgent.id, this.editForm, this.editImage ?? undefined)
      .subscribe({
        next: (updated) => {
          // Replace the item in the list with the fresh data from the server
          const idx = this.agents.findIndex(a => a.id === this.editingAgent.id);
          if (idx !== -1) this.agents[idx] = updated;

          this.saving = false;
          this.closeEditModal();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
          this.saving = false;
          alert('Failed to update agent.');
        }
      });
  }

}
