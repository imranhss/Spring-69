import { Routes } from '@angular/router';
import { Home } from './components/shared/layout/home/home';
import { Country } from './components/feature/address/country/country';
import { Division } from './components/feature/address/division/division';
import { District } from './components/feature/address/district/district';
import { Policestation } from './components/feature/address/policestation/policestation';
import { LocationSearchcomponent } from './components/feature/address/location-searchcomponent/location-searchcomponent';
import { AddCustomer } from './components/feature/customer/add-customer/add-customer';
import { AddAgent } from './components/feature/agents/add-agent/add-agent';
import { AgentList } from './components/feature/agents/agent-list/agent-list';
import { AddRider } from './components/feature/riders/add-rider/add-rider';
import { Riderlist } from './components/feature/riders/riderlist/riderlist';
import { Login } from './components/auth/login/login';
import { RoleRedirect } from './components/auth/role-redirect/role-redirect';
import { Customerdashboard } from './components/feature/customer/customerdashboard/customerdashboard';
import { Agentdashboard } from './components/feature/agents/agentdashboard/agentdashboard';
import { Riderdashboard } from './components/feature/riders/riderdashboard/riderdashboard';
import { ForgotPassword } from './components/auth/forgot-password/forgot-password';
import { ResetPassword } from './components/auth/reset-password/reset-password';
import { VeryfyEmail } from './components/auth/veryfy-email/veryfy-email';
import { Component } from '@angular/core';
import { BlankLayout } from './components/shared/layout/blank-layout/blank-layout';
import { MainLayout } from './components/shared/layout/main-layout/main-layout';
import { HubParcel } from './components/feature/agents/hub-parcel/hub-parcel';
import { AgentParcelRequestComponent } from './components/feature/agents/agent-parcel-request/agent-parcel-request';
import { BookingReceiptComponent } from './components/feature/print/booking-receipt-component/booking-receipt-component';

export const routes: Routes = [


    {
        path: '',
        component: BlankLayout,
        children: [
            { path: '', component: Home },
            { path: 'addcustomer', component: AddCustomer },
            { path: 'addagent', component: AddAgent },
            { path: 'addrider', component: AddRider },
            { path: 'login', component: Login },
            { path: 'forgot-password', component: ForgotPassword },
            { path: 'reset-password', component: ResetPassword },
            { path: 'verify-email', component: VeryfyEmail },
        ]



    },



    {
        path: '',
        component: MainLayout,
        children: [

            { path: 'country', component: Country },
            { path: 'division', component: Division },
            { path: 'district', component: District },
            { path: 'police', component: Policestation },
            { path: 'hub', component: LocationSearchcomponent },

            { path: 'agentList', component: AgentList },

            { path: 'riderlist', component: Riderlist },

            { path: 'dashboard', component: RoleRedirect },
            { path: 'customer', component: Customerdashboard },
            { path: 'agent', component: Agentdashboard },
            { path: 'rider', component: Riderdashboard },
            { path: 'hubparcel', component: HubParcel },
            { path: 'agentbook', component: AgentParcelRequestComponent },
            { path: 'print', component: BookingReceiptComponent },
        ]



    },

    { path: '**', redirectTo: '' }









];
