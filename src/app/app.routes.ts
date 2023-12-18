import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InfoComponent } from './pages/info/info.component';
import { NavigateComponent } from './navigate/navigate.component';

export const routes: Routes = [
    {
        path: '', component: NavigateComponent,
        children: [
            {
                path: 'dashboard', component: DashboardComponent
            },
            {
                path: 'info', component: InfoComponent
            },
        ]
    },
    {
        path: '**', redirectTo: '/dashboard', pathMatch: 'full'
    }
];
