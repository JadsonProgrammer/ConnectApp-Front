import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserAuthService } from 'app/core/user-auth/user-auth.service';
import { UserService } from 'app/modules/admin/user/user.service';
import { environment } from 'environments/environment';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userAuthService = inject(UserAuthService);
    private _userService = inject(UserService);

    set Token(token: string) {
        localStorage.setItem('Token', token);
    }

    get Token(): string {
        return localStorage.getItem('Token') ?? '';
    }

    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    signIn(credentials: {
        accessKey: string;
        password: string;
    }): Observable<any> {
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient
            .post(`${environment.apiUrl}auth/sign-in`, credentials)
            .pipe(
                switchMap((response: any) => {
                    this.Token = response.data.token;

                    this._authenticated = true;

                    this._userAuthService.user = {
                        id: response.data.id,
                        name: response.data.name,
                        email: response.data.email,
                        avatar: response.data.avatar,
                        status: response.data.status,
                        accountName: response.data.accountName,
                        accountId: response.data.accountId,
                    };
                    return of(response);
                }),
            );
    }

    signInUsingToken(): Observable<any> {
        console.log(this.Token);
        return this._httpClient
            .post(
                `${environment.apiUrl}auth/validate-token`,
                JSON.stringify(this.Token),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            .pipe(
                catchError(() => of(false)),
                switchMap((response: any) => {
                    console.log(this.Token);

                    const data = response.data;
                    if (!data) {
                        return of(false);
                    }
                    console.log(this.Token);
                    this.Token = data.token;

                    // Set the authenticated flag to true
                    this._authenticated = true;
                    this._userAuthService.user = {
                        id: data.id,
                        name: data.name,
                        email: data.email,
                        avatar: data.avatar,
                        accountId: data.accountId,
                        accountName: data.accountName,
                        status: data.status,
                    };

                    this._userAuthService.user = data;
                    debugger;

                    this._userService.setProfile(data);

                    return of(true);
                }),
            );
    }

    signOut(): Observable<any> {
        localStorage.removeItem('token');
        this._authenticated = false;

        return of(true);
    }

    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    check(): Observable<boolean> {
        if (this._authenticated) {
            return of(true);
        }

        if (!this.Token) {
            return of(false);
        }

        if (AuthUtils.isTokenExpired(this.Token)) {
            return of(false);
        }

        return this.signInUsingToken();
    }
}
