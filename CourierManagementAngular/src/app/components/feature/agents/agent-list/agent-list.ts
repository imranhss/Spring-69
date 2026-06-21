import { ChangeDetectorRef, Component } from '@angular/core';
import { PolicestationService } from '../../../../services/policestation.service';
import { AgentService } from '../../../../services/agent.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './agent-list.html',
  styleUrl: './agent-list.css',
})
export class AgentList {

  

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
    return agent.imageUrl || agent.photoUrl || agent.image || null;
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

}
