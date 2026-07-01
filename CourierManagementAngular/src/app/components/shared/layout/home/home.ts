import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParcelService } from '../../../../services/parcel.service';
import { PARCEL_STATUS_META, ParcelResponse, ParcelStatus } from '../../../../models/parcel.model';


interface TrackStop {
  city: string;
  time: string;
  note: string;
  state: 'done' | 'active' | 'wait';
}

interface TrackCourier {
  name: string;
  initials: string;
  rating: string;
  zone: string;
}

interface TrackDisplay {
  status: ParcelStatus;
  stops: TrackStop[];
  courier: TrackCourier;
}

interface ServiceConfig {
  icon: string;
  label: string;
  /** Real backend ServiceType this chip maps to (backend has no ECONOMY tier) */
  apiServiceType: string;
}



@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  encapsulation: ViewEncapsulation.None   // 👈 add this
})
export class Home {




 readonly statusMeta = PARCEL_STATUS_META;
 
  // ── Tracking ────────────────────────────────────────────────
  trackInput = '';
  isTracking = false;
  trackError = false;
  trackResult: TrackDisplay | null = null;
  resultId = '';
 
  private readonly trackSteps: ParcelStatus[] = [
    'PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'
  ];
 
  constructor(private parcelService: ParcelService, private cdr: ChangeDetectorRef) { }
 
  doTrack(): void {
    const code = this.trackInput.trim();
    if (!code) return;
 
    this.isTracking = true;
    this.trackError = false;
    this.trackResult = null;
 
    this.parcelService.track(code).subscribe({
      next: (res) => {
        this.isTracking = false;
        this.resultId = res.trackingCode;
        this.trackResult = this.buildTrackDisplay(res);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isTracking = false;
        this.trackError = true;
      }
    });
  }
 
  fillTrack(code: string): void {
    this.trackInput = code;
    this.doTrack();
  }
 
  onTrackKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.doTrack();
    }
  }
 
  private buildTrackDisplay(res: ParcelResponse): TrackDisplay {
    const isTerminalFailure = res.status === 'CANCELLED' || res.status === 'RETURNED';
    const currentIndex = this.trackSteps.indexOf(res.status as ParcelStatus);
 
    const stops: TrackStop[] = this.trackSteps.map((step, i) => {
      let state: 'done' | 'active' | 'wait' = 'wait';
 
      if (isTerminalFailure) {
        state = 'wait';
      } else if (currentIndex === -1) {
        state = 'wait';
      } else if (i < currentIndex) {
        state = 'done';
      } else if (i === currentIndex) {
        state = 'active';
      }
 
      const historyEntry = res.history?.find(h => h.status === step);
 
      return {
        city: historyEntry?.location || res.destinationPoliceStation || '',
        time: historyEntry?.timestamp ? this.formatDate(historyEntry.timestamp) : '',
        note: historyEntry?.note || this.statusMeta[step]?.label || step,
        state
      };
    });
 
    if (isTerminalFailure) {
      const lastEntry = res.history?.[res.history.length - 1];
      stops.push({
        city: lastEntry?.location || '',
        time: lastEntry?.timestamp ? this.formatDate(lastEntry.timestamp) : '',
        note: lastEntry?.note || this.statusMeta[res.status]?.label || res.status,
        state: 'active'
      });
    }
 
    const courier: TrackCourier = {
      name: res.riderName || 'Not assigned yet',
      initials: this.getInitials(res.riderName),
      rating: '—',
      zone: res.destinationPoliceStation || res.destinationDistrict || ''
    };
 
    return { status: res.status, stops, courier };
  }
 
  private getInitials(name?: string | null): string {
    if (!name) return '?';
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
 
  private formatDate(value: string | Date): string {
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString('en-GB', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  }
 
  getStatusBadgeClass(status: ParcelStatus): string {
    switch (status) {
      case 'DELIVERED':
        return 'badge-delivered';
      case 'CANCELLED':
      case 'RETURNED':
        return 'badge-failed';
      default:
        return 'badge-transit';
    }
  }
 
  getStatusLabel(status: ParcelStatus): string {
    return this.statusMeta[status]?.label ?? status;
  }
 
  isLastStop(stops: TrackStop[], i: number): boolean {
    return i === stops.length - 1;
  }
 
  getVertClass(stops: TrackStop[], i: number): string {
    const current = stops[i];
    const next = stops[i + 1];
    if (current.state === 'done' && next?.state === 'done') return 'tl-vert done';
    if (current.state === 'done' && next?.state === 'active') return 'tl-vert partial';
    return 'tl-vert wait';
  }
 
  getNoteColor(state: 'done' | 'active' | 'wait'): string {
    switch (state) {
      case 'done': return '#22C55E';
      case 'active': return '#F59E0B';
      default: return '#94A3B8';
    }
  }
 
  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
 
  // ══════════════════════════════════════════════════════════════
  // ── Price Calculator — now calls the REAL backend pricing API ──
  // ══════════════════════════════════════════════════════════════
 
  selectedService = 'STANDARD';
  weight = 0;
  zone = '';
  hasCod = false;
  codAmount = 0;
  weightError = false;
  showPriceResult = false;
  showCodAmount = false;
  calculating = false;
  priceError = false;
 
  pbServiceTag = '';
  pbTotal = '0';
  pbBase = '৳ 0';
  pbZone = '৳ 0';
  pbCod = '৳ 0';
  pbService = '';
  pbFinal = '৳ 0';
 
  /**
   * Backend ServiceType enum is: STANDARD | EXPRESS | SAME_DAY | OVERNIGHT
   * (no ECONOMY tier server-side), so the Economy chip maps to STANDARD
   * pricing while keeping its own label/icon in the UI.
   */
  readonly SERVICE_CONFIG: Record<string, ServiceConfig> = {
    ECONOMY:   { icon: '💰', label: 'ECONOMY',   apiServiceType: 'STANDARD'  },
    STANDARD:  { icon: '📦', label: 'STANDARD',  apiServiceType: 'STANDARD'  },
    EXPRESS:   { icon: '⚡', label: 'EXPRESS',   apiServiceType: 'EXPRESS'   },
    OVERNIGHT: { icon: '🌙', label: 'OVERNIGHT', apiServiceType: 'OVERNIGHT' },
  };
 
  /**
   * Zone surcharge is added on top of the backend's base charge —
   * the backend pricing API only knows weight/service/COD, not zone,
   * so this distance-based fee stays client-side for the public estimate.
   */
  readonly ZONE_SURCHARGE: Record<string, number> = {
    '': 0, DHAKA: 0, NEARBY: 30, NATIONAL: 60, REMOTE: 100
  };
 
  selectService(type: string): void {
    this.selectedService = type;
  }
 
  toggleCod(): void {
    this.showCodAmount = this.hasCod;
    if (!this.hasCod) this.codAmount = 0;
  }
 
  calcPrice(): void {
    if (!this.weight || this.weight <= 0) {
      this.weightError = true;
      setTimeout(() => (this.weightError = false), 1500);
      return;
    }
 
    const cfg = this.SERVICE_CONFIG[this.selectedService];
    const codAmt = this.hasCod ? (this.codAmount || 0) : 0;
    const zoneFee = this.ZONE_SURCHARGE[this.zone] ?? 0;
 
    this.calculating = true;
    this.priceError = false;
    this.showPriceResult = false;
 
    this.parcelService.calculateCharge(this.weight, cfg.apiServiceType, codAmt).subscribe({
      next: (baseCharge) => {
        const total = baseCharge + zoneFee;
 
        this.pbServiceTag = `${cfg.icon} ${cfg.label}`;
        this.pbTotal       = Math.round(total).toLocaleString();
        this.pbBase        = `৳ ${Math.round(baseCharge)}`;
        this.pbZone        = `৳ ${zoneFee}`;
        this.pbCod         = codAmt > 0 ? `Included in base charge` : `৳ 0`;
        this.pbService     = cfg.label;
        this.pbFinal        = `৳ ${Math.round(total).toLocaleString()}`;
 
        this.calculating = false;
        this.showPriceResult = true;
        this.cdr.markForCheck();
      },
      error: () => {
        this.calculating = false;
        this.priceError = true;
        this.cdr.markForCheck();
      }
    });
  }


}
