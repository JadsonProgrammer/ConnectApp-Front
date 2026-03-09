import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { UserComponent } from 'app/modules/admin/user/user.component';
import { UsersDetailsComponent } from './details/users-details.component';
import { ListComponent } from './list/users-list.component';
import { inject } from '@angular/core';
import { UserService } from './user.service';
import { catchError, throwError } from 'rxjs';
import { EmptyComponent } from './empty/empty.component';

const conversationResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const userService = inject(UserService);
    const router = inject(Router);

    return userService.getUserById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);

            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            router.navigateByUrl(parentUrl);

            return throwError(error);
        }),
    );
};
debugger;
export const userRoutes: Routes = [
    {
        path: '',
        
        component: UserComponent,
        resolve: {
            users: () => inject(UserService).getUsers(),
            contacts: () => inject(UserService).getContacts(),
            profile: () => inject(UserService).getProfile(),
            
        },

        children: [
            {
                path: '',
                component: ListComponent,
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: EmptyComponent,
                    },
                    {
                        path: ':id',
                        component: UsersDetailsComponent,
                        resolve: {
                            conversation: conversationResolver,
                        },
                    },
                ],
            },
        ],
    },
];