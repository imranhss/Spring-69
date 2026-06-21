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