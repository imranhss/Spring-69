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
import { BookParcelComponent } from './components/feature/customer/book-parcel-component/book-parcel-component';
import { MyParcelsComponent } from './components/feature/customer/my-parcels-component/my-parcels-component';
import { AdminDashboard } from './components/auth/admin-dashboard/admin-dashboard';
import { HubRidersComponent } from './components/feature/agents/hub-riders-component/hub-riders-component';
import { authGuard, roleGuard } from './guards/auth-guard';
import { AgentProfileComponent } from './components/feature/agents/agent-profile-component/agent-profile-component';
import { TrackOnBehalfComponent } from './components/feature/customer/track-on-behalf-component/track-on-behalf-component';
import { CustomerProfileComponent } from './components/feature/customer/customer-profile-component/customer-profile-component';

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

            { path: 'country', component: Country, canActivate: [authGuard, roleGuard(['ADMIN'])] },
            { path: 'division', component: Division , canActivate: [authGuard, roleGuard(['ADMIN'])]},
            { path: 'district', component: District , canActivate: [authGuard, roleGuard(['ADMIN'])]},
            { path: 'police', component: Policestation , canActivate: [authGuard, roleGuard(['ADMIN'])]},

            { path: 'hub', component: LocationSearchcomponent , canActivate: [authGuard, roleGuard(['ADMIN','AGENT'])]},

            { path: 'agentList', component: AgentList , canActivate: [authGuard, roleGuard(['ADMIN'])]},

            { path: 'riderlist', component: Riderlist , canActivate: [authGuard, roleGuard(['ADMIN'])]},

            { path: 'dashboard', component: RoleRedirect , canActivate: [authGuard]},

            { path: 'customer', component: Customerdashboard , canActivate: [authGuard, roleGuard(['CUSTOMER'])]},
            { path: 'customertrack', component: TrackOnBehalfComponent , canActivate: [authGuard, roleGuard(['CUSTOMER'])]},
            { path: 'customerprofile', component: CustomerProfileComponent , canActivate: [authGuard, roleGuard(['CUSTOMER'])]},
            { path: 'agent', component: Agentdashboard , canActivate: [authGuard, roleGuard(['AGENT'])]},

            { path: 'rider', component: Riderdashboard , canActivate: [authGuard, roleGuard(['RIDER'])]},
            { path: 'admin', component: AdminDashboard , canActivate: [authGuard, roleGuard(['ADMIN'])]},

            { path: 'hubparcel', component: HubParcel , canActivate: [authGuard, roleGuard(['AGENT'])]},
            { path: 'agentbook', component: AgentParcelRequestComponent , canActivate: [authGuard, roleGuard(['ADMIN','AGENT'])]},

            { path: 'print', component: BookingReceiptComponent , canActivate: [authGuard]},
            { path: 'customerbook', component: BookParcelComponent , canActivate: [authGuard, roleGuard(['ADMIN','CUSTOMER'])]},
            { path: 'myparcel', component: MyParcelsComponent , canActivate: [authGuard, roleGuard(['ADMIN','CUSTOMER'])]},

            { path: 'addriderbyagent', component: AddRider , canActivate: [authGuard, roleGuard(['AGENT'])]},
            { path: 'addriderbyadmin', component: AddRider , canActivate: [authGuard, roleGuard(['ADMIN'])]},

             { path: 'addagentbyAdmin', component: AddAgent , canActivate: [authGuard, roleGuard(['ADMIN'])]},
             { path: 'addcustomerbyAdmin', component: AddCustomer , canActivate: [authGuard, roleGuard(['ADMIN'])]},
             { path: 'riderListAgent', component: HubRidersComponent , canActivate: [authGuard, roleGuard(['AGENT'])]},
             { path: 'agentprofile', component: AgentProfileComponent , canActivate: [authGuard, roleGuard(['AGENT'])]},
        ]



    },

    { path: '**', redirectTo: '' }




];
