import { ChangeDetectorRef, Component } from '@angular/core';
import { LoginResponse } from '../../../../models/auth.model';
import { RiderResponseModel } from '../../../../models/rider.model';
import { KEYS, StorageService } from '../../../../services/storage.service';
import { AuthService } from '../../../../services/auth.service';
import { RiderService } from '../../../../services/rider.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { PARCEL_STATUS_META, ParcelResponse, ParcelStatus } from '../../../../models/parcel.model';
import { ParcelService } from '../../../../services/parcel.service';

@Component({
  selector: 'app-riderdashboard',
  imports: [CommonModule],
  templateUrl: './riderdashboard.html',
  styleUrl: './riderdashboard.css',
})
export class Riderdashboard {

 user: LoginResponse | null = null;
  userId!: number;
  rider: RiderResponseModel | null = null;
  imageUrl = environment.imgUrl + 'rider/';

  // ── Stats ──────────────────────────────────────────────────────
  stats = { total: 0, delivered: 0, inTransit: 0, pending: 0 };

  // ── Parcels ────────────────────────────────────────────────────
  allParcels: ParcelResponse[] = [];
  recentParcels: ParcelResponse[] = [];
  loadingParcels = false;

  readonly statusMeta = PARCEL_STATUS_META;

  constructor(
    private storage: StorageService,
    private auth: AuthService,
    private riderService: RiderService,
    private parcelService: ParcelService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.user = this.storage.getUser();
    if (this.user?.userId) {
      this.userId = this.user.userId;
    }
    this.loadRider();
  }

  loadRider(): void {
    this.riderService.findByUserId(this.userId).subscribe({
      next: res => {
        this.rider = res;
        this.storage.saveData(KEYS.RIDER, res);
        this.cdr.markForCheck();

        // Load parcels only after rider ID is confirmed
        if (this.rider?.id) {
          this.loadParcels(this.rider.id);
        }
      },
      error: err => console.error(err),
    });
  }

  loadParcels(riderId: number): void {
    this.loadingParcels = true;
    this.parcelService.getByRider(riderId).subscribe({
      next: res => {
        this.allParcels = res || [];
        this.stats = {
          total:     this.allParcels.length,
          delivered: this.allParcels.filter(p => p.status === 'DELIVERED').length,
          inTransit: this.allParcels.filter(p => p.status === 'IN_TRANSIT' || p.status === 'PICKED_UP').length,
          pending:   this.allParcels.filter(p => p.status === 'PENDING').length,
        };
        this.recentParcels = [...this.allParcels]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 6);
        this.loadingParcels = false;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error(err);
        this.loadingParcels = false;
      },
    });
  }

  badgeClass(status: ParcelStatus): string {
    return this.statusMeta[status]?.badge ?? 'bg-secondary';
  }

  badgeLabel(status: ParcelStatus): string {
    return this.statusMeta[status]?.label ?? status;
  }

  logout(): void {
    this.auth.logout();
    this.storage.removeData(KEYS.RIDER);
  }


}
