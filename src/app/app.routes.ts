import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InfoComponent } from './pages/info/info.component';
import { NavigateComponent } from './navigate/navigate.component';
import { TreeComponent } from './pages/tree/tree.component';

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
            {
                path: 'trees', component: TreeComponent
            },
        ]
    },
    {
        path: '**', redirectTo: '/dashboard', pathMatch: 'full'
    }
];
