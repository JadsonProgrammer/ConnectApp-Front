import { Routes } from '@angular/router';
import { LandingHomeComponent } from 'app/modules/landing/home/home.component';

export const homeRoutes: Routes = [
    {
        path     : '',
        component: LandingHomeComponent,
    },
] as Routes;
