

export interface Agent {

  id?: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
  designation: string;
  hubId: number | null;
  image?: string;
  active?: boolean;

}

export interface AgentResponseModel {

  // Agent ID
  id: number;

  // From User
  userId: number;
  name: string;
  email: string;
  phone: string;
  role: string;

  // Agent profile
  designation: string;
  image: string;
  active: boolean;

  // Hub details
  hubId: number;
  hubName: string;
  postalCode: string;

  districtId: number;
  districtName: string;

  divisionId: number;
  divisionName: string;

  countryName: string;
}