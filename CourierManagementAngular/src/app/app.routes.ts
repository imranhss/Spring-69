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

export const routes: Routes = [


    {path: '', component: Home},
    {path: 'country', component: Country},
    {path: 'division', component: Division},
    {path: 'district', component: District},
    {path: 'police', component: Policestation},
    {path: 'hub', component: LocationSearchcomponent},
    {path: 'addcustomer', component: AddCustomer},
    {path: 'addagent', component: AddAgent},
    {path: 'agentList', component: AgentList},
    {path: 'addrider', component: AddRider},
    {path: 'riderlist', component: Riderlist},
    {path: 'login', component: Login},
    {path: 'dashboard', component: RoleRedirect},
    {path: 'customer', component: Customerdashboard},
    {path: 'agent', component: Agentdashboard},
    {path: 'rider', component: Riderdashboard},



    {path: 'forgot-password', component: ForgotPassword},
    {path: 'reset-password', component: ResetPassword},
    {path: 'verify-email', component: VeryfyEmail},


];
