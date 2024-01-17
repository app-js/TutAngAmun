import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InfoComponent } from './pages/info/info.component';
import { NavigateComponent } from './navigate/navigate.component';
import { TreeComponent } from './pages/tree/tree.component';
import { FormTemplateTutComponent } from './pages/forms/form-template-tut/form-template-tut.component';
import { FormReactiveTutComponent } from './pages/forms/form-reactive-tut/form-reactive-tut.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';

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
            {
                path: 'formT', component: FormTemplateTutComponent
            },
            {
                path: 'formR', component: FormReactiveTutComponent
            },
            {
                path: '**',
                component: NotfoundComponent
            }
        ]
    },
    {
        path: '**', component: NotfoundComponent
    }
];
