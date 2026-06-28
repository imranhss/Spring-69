export interface PoliceStationResponseDTO {
  id: number;
  name: string;
  nameBn: string;
  postalCode: string;
  active: boolean;
  districtId: number;
  districtName: string;
  divisionId: number;
  divisionName: string;
  countryId: number;
  countryName: string;
}

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

export interface RiderResponseDTO {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  vehicleType: string;
  vehicleNumber: string;
  nidNumber: string;
  rating: number;
  totalDeliveries: number;
  totalEarnings: number;
  active: boolean;
  image: string;
  userId: number;
  zones: ZoneSummary[];
}