import { ChangeDetectorRef, Component } from '@angular/core';
import { ZoneService } from '../../../../services/zone.service';
import { StorageService } from '../../../../services/storage.service';
import { LoginResponse } from '../../../../models/auth.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hub-riders-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './hub-riders-component.html',
  styleUrl: './hub-riders-component.css',
})
export class HubRidersComponent {


  riders: any[] = [];
  loading = true;
  errorMessage: string | null = null;
  searchTerm = '';

  hubId!: number;
  hubName = '';
  showActive = false;     // toggle: all vs active-only

  imageBase = 'http://localhost:8085/images/rider/';

  constructor(
    private zoneService: ZoneService,
    private storage: StorageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // hubId comes straight from the encrypted login session
    const user: LoginResponse | null = this.storage.getUser();
    this.hubId   = user?.hubId   ?? 0;
    this.hubName = user?.hubName ?? 'Your Hub';

    if (!this.hubId) {
      this.errorMessage = 'Hub ID not found. Please log out and log in again.';
      this.loading = false;
      return;
    }

    this.loadRiders();
  }

  loadRiders(): void {
    this.loading = true;
    this.errorMessage = null;

    const call$ = this.showActive
      ? this.zoneService.getActiveRidersForPoliceStation(this.hubId)
      : this.zoneService.getRidersForPoliceStation(this.hubId);

    call$.subscribe({
      next: (res) => {
        this.riders = res || [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Could not load riders. Please try again.';
        this.loading = false;
      }
    });
  }

  onToggleActive(): void {
    this.loadRiders();
  }

  get filteredRiders(): any[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.riders;
    return this.riders.filter(r =>
      r.name?.toLowerCase().includes(term) ||
      r.phone?.toLowerCase().includes(term) ||
      r.vehicleType?.toLowerCase().includes(term) ||
      r.vehicleNumber?.toLowerCase().includes(term)
    );
  }

  onImageError(rider: any): void {
    rider._imgError = true;
  }


}
