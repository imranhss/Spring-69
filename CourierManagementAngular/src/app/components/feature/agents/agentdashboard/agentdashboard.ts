import { ChangeDetectorRef, Component } from '@angular/core';
import { LoginResponse } from '../../../../models/auth.model';
import { KEYS, StorageService } from '../../../../services/storage.service';
import { AuthService } from '../../../../services/auth.service';
import { AgentService } from '../../../../services/agent.service';
import { AgentResponseModel } from '../../../../models/agent.model';
import { CommonModule } from '@angular/common';
import { PARCEL_STATUS_META, ParcelResponse, ParcelStatus } from '../../../../models/parcel.model';
import { ZoneService } from '../../../../services/zone.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-agentdashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './agentdashboard.html',
  styleUrl: './agentdashboard.css',
})
export class Agentdashboard {

  user: LoginResponse | null = null;
  userId!: number;
  agent: AgentResponseModel | null = null;
  imageUrl = 'http://localhost:8085/images/agent/';
 
  // ── Stats ─────────────────────────────────────────────────────
  totalParcels    = 0;
  pendingParcels  = 0;
  inTransit       = 0;
  outForDelivery  = 0;
  deliveredToday  = 0;
  totalRiders     = 0;
 
  // ── Recent parcels ────────────────────────────────────────────
  recentParcels: ParcelResponse[] = [];
  parcelsLoading = true;
 
  readonly statusMeta = PARCEL_STATUS_META;
 
  constructor(
    private storage: StorageService,
    private auth: AuthService,
    private agentService: AgentService,
    private zoneService: ZoneService,
    private cdr: ChangeDetectorRef
  ) { }
 
  ngOnInit(): void {
    this.user = this.storage.getUser();
 
    if (this.user?.userId) {
      this.userId = this.user.userId;
    }
 
    // Use cached agent profile if available, otherwise fetch fresh
    const cached = this.storage.getData<AgentResponseModel>(KEYS.AGENT);
    if (cached) {
      this.agent = cached;
      this.afterAgentLoaded();
    } else {
      this.loadAgent();
    }
  }
 
  loadAgent(): void {
    this.agentService.findByUserId(this.userId).subscribe({
      next: (res) => {
        this.agent = res;
        this.storage.saveData(KEYS.AGENT, res);
        this.cdr.markForCheck();
        this.afterAgentLoaded();
      },
      error: (err) => console.log(err)
    });
  }
 
  /** Once we have the agent entity (with its real id + hub), load hub stats */
  private afterAgentLoaded(): void {
    if (!this.agent?.id) return;
    this.loadHubParcels(this.agent.id);
 
    if (this.user?.hubId) {
      this.loadHubRiders(this.user.hubId);
    }
  }
 
  loadHubParcels(agentId: number): void {
    this.parcelsLoading = true;
 
    this.agentService.getHubParcels(agentId).subscribe({
      next: (res) => {
        const parcels = res || [];
 
        this.totalParcels   = parcels.length;
        this.pendingParcels = parcels.filter(p => p.status === 'PENDING').length;
        this.inTransit      = parcels.filter(p => p.status === 'IN_TRANSIT' || p.status === 'AT_HUB').length;
        this.outForDelivery = parcels.filter(p => p.status === 'OUT_FOR_DELIVERY').length;
 
        const today = new Date().toDateString();
        this.deliveredToday = parcels.filter(p =>
          p.status === 'DELIVERED' &&
          new Date(p.updatedAt).toDateString() === today
        ).length;
 
        this.recentParcels = [...parcels]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 6);
 
        this.parcelsLoading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.parcelsLoading = false; }
    });
  }
 
  loadHubRiders(hubId: number): void {
    this.zoneService.getRidersForPoliceStation(hubId).subscribe({
      next: (res) => { this.totalRiders = res?.length ?? 0; this.cdr.markForCheck(); },
      error: () => {}
    });
  }
 
  badgeClass(status: ParcelStatus): string {
    return this.statusMeta[status]?.badge ?? 'bg-secondary';
  }
 
  badgeLabel(status: ParcelStatus): string {
    return this.statusMeta[status]?.label ?? status;
  }
 
  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }
 
  logout(): void {
    this.auth.logout();
    this.storage.removeData(KEYS.AGENT);
  }





  

}
