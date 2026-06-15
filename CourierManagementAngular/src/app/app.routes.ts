import { Routes } from '@angular/router';
import { Home } from './components/shared/layout/home/home';
import { Country } from './components/feature/address/country/country';

export const routes: Routes = [


    {path: '', component: Home},
    {path: 'country', component: Country}
];
