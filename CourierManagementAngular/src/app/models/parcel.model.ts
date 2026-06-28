// ── Enums ─────────────────────────────────────────────────────────────────────

export type ParcelType    = 'DOCUMENT' | 'PRODUCT' | 'FRAGILE' | 'HEAVY' | 'PERISHABLE';
export type ServiceType   = 'STANDARD' | 'EXPRESS' | 'SAME_DAY' | 'OVERNIGHT';
export type Priority      = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type PaymentMethod = 'CASH' | 'BKASH' | 'COD' | 'NAGAD' | 'SSLCOMMERZ' | 'PREPAID';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type ParcelStatus  =
  | 'PENDING'
  | 'PICKED_UP'  
  | 'IN_TRANSIT'  
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

 
// ── Tracking history entry ─────────────────────────────────────────────────────
 
export interface HistoryEntry {
  id: number;
  status: string;
  note: string;
  location: string;
  timestamp: string;
  performedBy: string;
  riderId: number;
}
 
// ── Full parcel response (mirrors ParcelResponseDTO) ──────────────────────────
 
export interface ParcelResponse {
  id: number;
  trackingCode: string;
 
  // Sender
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  originPoliceStation: string;
  originDistrict: string;
  originDivision: string;
 
  // Receiver
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  destinationPoliceStation: string;
  destinationDistrict: string;
  destinationDivision: string;
 
  // Parcel details
  parcelType: ParcelType;
  weight: number;
  description: string;
  specialInstructions: string;
 
  // Service & pricing
  serviceType: ServiceType;
  priority: Priority;
  deliveryCharge: number;
  codAmount: number | null;
 
  // Payment
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
 
  // Status
  status: ParcelStatus;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
 
  // Linked entities
  customerId: number;
  customerName: string;
  customerPhone: string;
 
  riderId: number;
  riderName: string;
  riderPhone: string;
 
  agentId: number;
  agentName: string;
  agentHubName: string;
 
  // History
  history: HistoryEntry[];
}
 
// ── Status update request (mirrors StatusUpdateRequestDTO) ────────────────────
 
export interface StatusUpdateRequest {
  status: ParcelStatus;
  note?: string;
  location?: string;
  riderId?: number | null;       // assign rider when OUT_FOR_DELIVERY
  nextHubPoliceStationId?: number | null; // target hub when IN_TRANSIT
}
 
// ── UI badge config helper ────────────────────────────────────────────────────
 
export const PARCEL_STATUS_META: Record<ParcelStatus, { label: string; badge: string }> = {
  PENDING:           { label: 'Pending',           badge: 'bg-secondary'   }, 
  PICKED_UP:         { label: 'Picked Up',          badge: 'bg-primary'    },
  IN_TRANSIT:        { label: 'In Transit',         badge: 'bg-primary'    },
  OUT_FOR_DELIVERY:  { label: 'Out for Delivery',   badge: 'bg-info text-dark' },
  DELIVERED:         { label: 'Delivered',          badge: 'bg-success'    },
  RETURNED:          { label: 'Returned',           badge: 'bg-dark'       },
  CANCELLED:         { label: 'Cancelled',          badge: 'bg-danger'     },
};