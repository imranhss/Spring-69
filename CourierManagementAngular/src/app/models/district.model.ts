export interface DistrictModel{

    id?:number;
    name:string;
    nameBn:string;
    districtCode:string;
    active:boolean;

    division:{
        id:number;
        name?: string
    }
}