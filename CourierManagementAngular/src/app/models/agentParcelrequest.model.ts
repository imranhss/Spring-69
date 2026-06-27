export interface AgentParcelRequest {
  agentId: number;

  // Sender (walk-in customer)
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  originPoliceStationId?: number | null; // optional — defaults to agent's own hub

  // Receiver
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  destinationPoliceStationId: number;

  // Parcel
  parcelType: string;
  weight: number;
  description: string;
  specialInstructions: string;

  // Service
  serviceType: string;
  priority: string;

  // Payment
  paymentMethod: string;
  codAmount: number;
}