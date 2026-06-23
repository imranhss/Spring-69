export interface CustomerModel {


    // User fields (auth account)
    id?: number;
    name: string;
    email: string;
    phone: string;
    password: string;

    // Customer profile fields
    address: string;
    fullAddress?: string;  
    gender: string;
    dob: string;
    image?: string;

    // policeStation where customer lives (optional)
    policeStationId: number;

    countryName?: string;
    policeStationName?: string;
    districtName?: string;
    divisionName?: string;





}