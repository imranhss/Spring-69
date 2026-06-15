import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';


interface Stop {
  city: string;
  time: string;
  note: string;
  state: 'done' | 'active' | 'wait';
}
 
interface Courier {
  name: string;
  initials: string;
  rating: string;
  zone: string;
}
 
interface Parcel {
  status: 'transit' | 'delivered' | 'failed';
  recipient: string;
  weight: string;
  courier: Courier;
  stops: Stop[];
}
 
interface ServiceConfig {
  base: number;
  perKg: number;
  multiplier: number;
  icon: string;
  label: string;
}




@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  encapsulation: ViewEncapsulation.None   // 👈 add this
})
export class Home {

// ── Tracking ──────────────────────────────────────────────
  trackInput = '';
  isTracking = false;
  trackResult: Parcel | null = null;
  trackError = false;
  resultId = '';

  readonly DEMO_PARCELS: Record<string, Parcel> = {
    'SR-20843': {
      status: 'transit',
      recipient: 'Karim Uddin',
      weight: '5.1 kg',
      courier: { name: 'Mamun Rahman', initials: 'MR', rating: '4.9', zone: 'Dhaka Zone' },
      stops: [
        { city: 'Sylhet Hub',          time: 'Dispatched 10:15 AM', note: '✓ Departed',          state: 'done'   },
        { city: 'Narsingdi Checkpoint', time: 'Arrived 2:42 PM',    note: '✓ Cleared',            state: 'done'   },
        { city: 'Gazipur Sorting',      time: 'ETA 4:15 PM',        note: '⟳ En route…',          state: 'active' },
        { city: 'Dhaka — Mirpur 10',    time: 'ETA 5:30 PM',        note: 'Awaiting delivery',    state: 'wait'   },
      ]
    },
    'SR-20847': {
      status: 'delivered',
      recipient: 'Nusrat Jahan',
      weight: '2.4 kg',
      courier: { name: 'Rifat Hossain', initials: 'RH', rating: '4.7', zone: 'Chittagong Zone' },
      stops: [
        { city: 'Dhaka Hub',                  time: 'Dispatched 8:00 AM', note: '✓ Departed',   state: 'done' },
        { city: 'Cumilla Checkpoint',          time: '10:30 AM',           note: '✓ Cleared',    state: 'done' },
        { city: 'Chittagong Sorting',          time: '1:00 PM',            note: '✓ Processed',  state: 'done' },
        { city: 'Delivered — Nasirabad, Ctg', time: '3:20 PM Today',      note: '✅ Delivered',  state: 'done' },
      ]
    },
    'SR-20831': {
      status: 'failed',
      recipient: 'Tahmina Akter',
      weight: '1.6 kg',
      courier: { name: 'Rakib Alam', initials: 'RA', rating: '4.5', zone: 'Barisal Zone' },
      stops: [
        { city: 'Dhaka Hub',         time: 'Dispatched 9:00 AM',  note: '✓ Departed',               state: 'done'   },
        { city: 'Faridpur Checkpoint', time: '12:00 PM',           note: '✓ Cleared',                state: 'done'   },
        { city: 'Barisal Sadar',     time: '3:15 PM',             note: '❌ Recipient unreachable',  state: 'active' },
        { city: 'Return to Hub',     time: 'Scheduled tomorrow',  note: 'Will retry',               state: 'wait'   },
      ]
    }
  };

  fillTrack(id: string): void {
    this.trackInput = id;
    this.doTrack();
  }

  doTrack(): void {
    const val = this.trackInput.trim().toUpperCase();
    this.trackResult = null;
    this.trackError = false;

    if (!val) return;

    this.isTracking = true;

    setTimeout(() => {
      this.isTracking = false;
      const parcel = this.DEMO_PARCELS[val];
      if (!parcel) {
        this.trackError = true;
        return;
      }
      this.resultId = val;
      this.trackResult = parcel;
    }, 800);
  }

  onTrackKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.doTrack();
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      transit:   'badge-transit',
      delivered: 'badge-delivered',
      failed:    'badge-failed',
    };
    return 'badge-sm ' + (map[status] ?? 'badge-transit');
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { transit: 'In Transit', delivered: 'Delivered', failed: 'Failed' };
    return map[status] ?? 'Unknown';
  }

  getNoteColor(state: string): string {
    if (state === 'active') return 'var(--amber)';
    if (state === 'done')   return 'var(--green)';
    return 'var(--slate-light)';
  }

  getVertClass(stops: Stop[], index: number): string {
    if (index >= stops.length - 1) return '';
    const next = stops[index + 1];
    const curr = stops[index];
    if (next.state === 'wait') return 'tl-vert partial';
    return 'tl-vert ' + curr.state;
  }

  isLastStop(stops: Stop[], index: number): boolean {
    return index === stops.length - 1;
  }

  // ── Price Calculator ───────────────────────────────────────
  selectedService = 'STANDARD';
  weight = 0;
  zone = '';
  hasCod = false;
  codAmount = 0;
  weightError = false;
  showPriceResult = false;
  showCodAmount = false;

  pbServiceTag = '';
  pbTotal = '0';
  pbBase = '৳ 0';
  pbZone = '৳ 0';
  pbCod = '৳ 0';
  pbService = '×1.0 + 5% VAT';
  pbFinal = '৳ 0';

  readonly SERVICE_CONFIG: Record<string, ServiceConfig> = {
    ECONOMY:   { base: 60,  perKg: 15, multiplier: 0.9, icon: '💰', label: 'ECONOMY'   },
    STANDARD:  { base: 80,  perKg: 20, multiplier: 1.0, icon: '📦', label: 'STANDARD'  },
    EXPRESS:   { base: 150, perKg: 30, multiplier: 1.4, icon: '⚡', label: 'EXPRESS'   },
    OVERNIGHT: { base: 120, perKg: 25, multiplier: 1.2, icon: '🌙', label: 'OVERNIGHT' },
  };

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

    const cfg       = this.SERVICE_CONFIG[this.selectedService];
    const codAmt    = this.hasCod ? (this.codAmount || 0) : 0;
    const baseCharge = cfg.base + (this.weight * cfg.perKg);
    const zoneFee   = this.ZONE_SURCHARGE[this.zone] ?? 0;
    const codFee    = codAmt * 0.01;
    const subtotal  = (baseCharge + zoneFee) * cfg.multiplier;
    const vat       = subtotal * 0.05;
    const total     = subtotal + codFee + vat;

    this.pbServiceTag = `${cfg.icon} ${cfg.label}`;
    this.pbTotal      = Math.round(total).toLocaleString();
    this.pbBase       = `৳ ${Math.round(baseCharge)}`;
    this.pbZone       = `৳ ${zoneFee}`;
    this.pbCod        = `৳ ${Math.round(codFee)}`;
    this.pbService    = `×${cfg.multiplier.toFixed(1)} + 5% VAT`;
    this.pbFinal      = `৳ ${Math.round(total).toLocaleString()}`;

    this.showPriceResult = true;
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
