export interface PoliceStationModel {
  id?: number;
  name: string;
  nameBn: string;
  postalCode: string;
  active: boolean;

  district: {
    id: number;    
  };
}