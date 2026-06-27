// ── Enums ─────────────────────────────────────────────────────────────────────

export type ParcelType    = 'DOCUMENT' | 'PACKAGE' | 'FRAGILE' | 'PERISHABLE' | 'OTHER';
export type ServiceType   = 'STANDARD' | 'EXPRESS' | 'SAME_DAY' | 'OVERNIGHT';
export type Priority      = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type PaymentMethod = 'CASH' | 'ONLINE' | 'COD';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type ParcelStatus  =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'AT_HUB'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED_DELIVERY'
  | 'RETURNED'
  | 'CANCELLED';

// ── Tracking history entry ─────────────────────────────────────────────────────

export interface HistoryEntry {
  id: number;
  status: string;
  note: string;
  location: string;
  timestamp: string;
  performedBy: string;
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
}

// ── UI badge config helper ────────────────────────────────────────────────────

export const PARCEL_STATUS_META: Record<ParcelStatus, { label: string; badge: string }> = {
  PENDING:           { label: 'Pending',           badge: 'bg-secondary'   },
  CONFIRMED:         { label: 'Confirmed',          badge: 'bg-info text-dark' },
  PICKED_UP:         { label: 'Picked Up',          badge: 'bg-primary'    },
  IN_TRANSIT:        { label: 'In Transit',         badge: 'bg-primary'    },
  AT_HUB:            { label: 'At Hub',             badge: 'bg-warning text-dark' },
  OUT_FOR_DELIVERY:  { label: 'Out for Delivery',   badge: 'bg-info text-dark' },
  DELIVERED:         { label: 'Delivered',          badge: 'bg-success'    },
  FAILED_DELIVERY:   { label: 'Failed Delivery',    badge: 'bg-danger'     },
  RETURNED:          { label: 'Returned',           badge: 'bg-dark'       },
  CANCELLED:         { label: 'Cancelled',          badge: 'bg-danger'     },
};
