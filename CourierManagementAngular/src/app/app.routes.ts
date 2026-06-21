import { Routes } from '@angular/router';
import { Home } from './components/shared/layout/home/home';
import { Country } from './components/feature/address/country/country';
import { Division } from './components/feature/address/division/division';
import { District } from './components/feature/address/district/district';
import { Policestation } from './components/feature/address/policestation/policestation';
import { LocationSearchcomponent } from './components/feature/address/location-searchcomponent/location-searchcomponent';
import { AddCustomer } from './components/feature/customer/add-customer/add-customer';

export const routes: Routes = [


    {path: '', component: Home},
    {path: 'country', component: Country},
    {path: 'division', component: Division},
    {path: 'district', component: District},
    {path: 'police', component: Policestation},
    {path: 'hub', component: LocationSearchcomponent},
    {path: 'addcustomer', component: AddCustomer},


];
