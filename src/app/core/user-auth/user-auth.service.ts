import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserAuth } from 'app/core/user-auth/user-auth.types';
import { map, Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserAuthService {
    private _httpClient = inject(HttpClient);

    private _user = new ReplaySubject<any>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: UserAuth) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<UserAuth> {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current signed-in user data
     */
    get(): Observable<UserAuth> {
        return this._httpClient.get<UserAuth>('users').pipe(
            tap((user) => {
                this._user.next(user);
            }),
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: UserAuth): Observable<any> {
        return this._httpClient.patch<UserAuth>('user', { user }).pipe(
            map((response) => {
                this._user.next(response);
            }),
        );
    }
}
