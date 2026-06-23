/**
 * Mirrors RiderResponseDTO.ZoneSummary (backend).
 * Also used as the shape for RiderRequestDTO.zones, since the backend
 * request DTO reuses RiderResponseDTO.ZoneSummary directly.
 */
export interface ZoneSummary {
  policeStationId: number;
  name: string;
  postalCode: string;
  districtId: number;
  districtName: string;
  divisionId: number;
  divisionName: string;
  divisionNameBn: string;
  countryId: number;
  countryName: string;
}

/** Mirrors RiderRequestDTO (backend) — used for create/update payloads. */
export interface RiderRequestModel {
  name: string;
  email: string;
  phone: string;
  password: string;
  vehicleType: string;
  vehicleNumber: string;
  nidNumber: string;
  zones: ZoneSummary[];
}

/** Mirrors RiderResponseDTO (backend) — used for API responses. */
export interface RiderResponseModel {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  vehicleType: string;
  vehicleNumber: string;
  nidNumber: string;
  rating: number | null;
  totalDeliveries: number;
  totalEarnings: number;
  active: boolean;
  image: string;
  userId: number;
  zones: ZoneSummary[];

  /** UI-only flag — set to true when the profile image fails to load. */
  _imageError?: boolean;
}