import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { User, UserProfile } from 'app/modules/admin/user/user.model';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../user.service';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { ProfileComponent } from '../profile/profile.component';
import { NewComponent } from '../new/new.component';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatSidenavModule,
        NgIf,
        NewComponent,
        ProfileComponent,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        NgFor,
        NgClass,
        RouterLink,
        RouterOutlet,
    ],
})
export class ListComponent implements OnInit, OnDestroy {
    usersComponent: User[];
    drawerComponent: 'app-profile' | 'app-new';
    drawerOpened: boolean = false;
    filteredUsers: any[];
    userProfile: UserProfile;
    selectedUser: User;
    @Input() drawer: MatDrawer;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this._userService
            .getUsers()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((users: User[]) => {
                this.usersComponent = this.filteredUsers = users;
                this._changeDetectorRef.markForCheck();
            });
        this._userService
            .getProfile()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((profile: UserProfile) => {
                this.userProfile = profile;
                this._changeDetectorRef.markForCheck();
            });
        // this._userService.getUserser$()
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((user: User) => {
        //         this.selectedUser = user;
        //         this._changeDetectorRef.markForCheck();
        //     });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        this._userService.resetUser();
    }

    filterChats(query: string): void {
        if (!query) {
            this.filteredUsers = this.usersComponent;
            return;
        }
        this.filteredUsers = this.usersComponent.filter((user) =>
            user.name.toLowerCase().includes(query.toLowerCase()),
        );
    }
    openNewChat(): void {
        this.drawerComponent = 'app-new';
        this.drawerOpened = true;
        this._changeDetectorRef.markForCheck();
    }
    openProfile(): void {
        this.drawerComponent = 'app-profile';
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
