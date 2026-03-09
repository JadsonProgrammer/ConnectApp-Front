import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Navigation } from 'app/core/navigation/navigation.types';
import { environment } from 'environments/environment';
import { Observable, of, ReplaySubject, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class NavigationService
{
    private _httpClient = inject(HttpClient);
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
//     get(): Observable<Navigation>
//     {
//         return this._httpClient.get<Navigation>('users').pipe(
//             tap((navigation) =>
//             {
//                 this._navigation.next(navigation);
//             }),
//         );
//     }
// }
// get(): Observable<Navigation>
// {
//     return this._httpClient
//         .get<Navigation>(environment.apiUrl + 'navigation')
//         .pipe(
//             tap((navigation) =>
//             {
//                 this._navigation.next(navigation);
//             }),
//         );
// }
// }

get(): Observable<Navigation>
{
    const navigation: Navigation = {
        default: [
            {
                id: 'home',
                title: 'Home',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/home',
            },
            {
                id: 'user',
                title: 'Usuários',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: '/user',
            }
        ],
        compact: [],
        futuristic: [],
        horizontal: [],
    };

    this._navigation.next(navigation);
    return of(navigation);
}}