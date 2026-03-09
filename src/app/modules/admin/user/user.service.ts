import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User, UserContact, UserProfile } from 'app/modules/admin/user/user.model';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { ApiResponse } from './api-response.model';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
    [x: string]: any;
    private http = inject(HttpClient);
    private _users: BehaviorSubject<User[]> = new BehaviorSubject(null);
    private _user: BehaviorSubject<User> = new BehaviorSubject(null);
    private _userProfile: BehaviorSubject<UserProfile> = new BehaviorSubject(
        null,
    );
    private _userContact: BehaviorSubject<UserContact> = new BehaviorSubject(
        null,
    );
    private _userContacts: BehaviorSubject<UserContact[]> = new BehaviorSubject(
        null,
    );

    constructor(private _httpClient: HttpClient) {}

    get user$(): Observable<User> {
        return this._user.asObservable();
    }
    get users$(): Observable<User[]> {
        return this._users.asObservable();
    }
    setProfile(value: any): void {
        this._userProfile.next(value);
    }
    get contact$(): Observable<UserContact> {
        return this._userContact.asObservable();
    }
    get contacts$(): Observable<UserContact[]> {
        return this._userContacts.asObservable();
    }
    get profile$(): Observable<UserProfile> {
        return this._userProfile.asObservable();
    }
    getUsers(): Observable<User[]> {
        return this._httpClient
            .get<ApiResponse<User[]>>(`${environment.apiUrl}users`)
            .pipe(map((response) => response.data));
    }

    // getUserById(id: string): Observable<User> {
    //     return this._httpClient.get<User>(`${environment.apiUrl}users/${id}`);
    // }

    getContact(id: string): Observable<UserContact> {
        return this._httpClient
            .get<ApiResponse<UserContact>>(`${environment.apiUrl}users/${id}`)
            .pipe(
                map((response) => response.data),
                tap((contact) => this._userContact.next(contact)),
            );
    }
    getContacts(): Observable<UserContact[]> {
        return this._httpClient
            .get<ApiResponse<UserContact[]>>(`${environment.apiUrl}users`)
            .pipe(
                map((response) => response.data),
                tap((contacts) => this._userContacts.next(contacts)),
            );
    }
    getProfile(): Observable<UserProfile> {
        const token = localStorage.getItem('accessToken') ?? '';

        return this._httpClient
            .post<
                ApiResponse<UserProfile>
            >(`${environment.apiUrl}auth/validate-token`, JSON.stringify(token), { headers: { 'Content-Type': 'application/json' } })
            .pipe(
                map((response) => response.data),
                tap((profile) => this._userProfile.next(profile)),
            );
        // }
        // getProfile(): Observable<UserProfile> {
        //     return this._httpClient
        //         .get<ApiResponse<UserProfile>>(`${environment.apiUrl}profile`)
        //         .pipe(
        //             map((response) => response.data),
        //             tap((profile) => this._userProfile.next(profile)),
        //         );
    }

    getUserById(id: string): Observable<any> {
        return this._httpClient
            .get<any>(`${environment.apiUrl}users/${id}`)
            .pipe(
                map((response) => {
                    const user = response.data;
                    this._user.next(user);
                    return user;
                }),
                switchMap((user) => {
                    if (!user) {
                        return throwError(
                            'Could not found user with id of ' + id + '!',
                        );
                    }
                    return of(user);
                }),
            );
    }
    // updateUser(id: string, user: User): Observable<User> {
    //     return this.users$.pipe(
    //         take(1),
    //         switchMap((users: User[]) =>
    //             this._httpClient
    //                 .patch<
    //                     ApiResponse<User>
    //                 >(`${environment.apiUrl}users/${id}`, { id, user })
    //                 .pipe(
    //                     map((response) => response.data),
    //                     map((updatedUser) => {
    //                         const index = users.findIndex(
    //                             (item) => item.id === id,
    //                         );
    //                         if (index !== -1) {
    //                             users[index] = updatedUser;
    //                             this._users.next(users);
    //                         }
    //                         return updatedUser;
    //                     }),
    //                     switchMap((updatedUser) =>
    //                         this.user$.pipe(
    //                             take(1),
    //                             tap((currentUser) => {
    //                                 if (currentUser && currentUser.id === id) {
    //                                     this._user.next(updatedUser);
    //                                 }
    //                             }),
    //                             map(() => updatedUser),
    //                         ),
    //                     ),
    //                 ),
    //         ),
    //     );
    // }

    resetUser(): void {
        this._user.next(null);
    }

    updateUser(id: string, user: Partial<User>): Observable<User> {
        return this._httpClient
            .patch<ApiResponse<User>>(`${environment.apiUrl}users/${id}`, user)
            .pipe(
                map((response) => response.data),
                tap((updatedUser) => {
                    this._user.next(updatedUser);

                    const users = this._users.value;
                    if (users) {
                        const index = users.findIndex((u) => u.id === id);
                        if (index !== -1) {
                            users[index] = updatedUser;
                            this._users.next([...users]);
                        }
                    }
                }),
            );
    }
}

