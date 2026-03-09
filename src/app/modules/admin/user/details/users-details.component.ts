import {
    DatePipe,
    NgClass,
    NgFor,
    NgIf,
    NgTemplateOutlet,
} from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { UserChat } from '../user.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UserInfoComponent } from '../contact-info/user-info.component';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-users-details',
    templateUrl: './users-details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
    NgIf,
    MatSidenavModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatMenuModule,
    NgFor,
    NgClass,
    NgTemplateOutlet,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    DatePipe
],
})
export class UsersDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('messageInput') messageInput: ElementRef;
    chat: UserChat;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _userService: UserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _ngZone: NgZone,
    ) {}

    @HostListener('input')
    @HostListener('ngModelChange')
    public _resizeMessageInput(): void {
        this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                this.messageInput.nativeElement.style.height = 'auto';
                this._changeDetectorRef.detectChanges();
                this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;
                this._changeDetectorRef.detectChanges();
            });
        });
    }
    ngOnInit(): void {
        this._userService.getUserById(this.chat.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: UserChat) => {
                this.chat = chat;
                this._changeDetectorRef.markForCheck();
            });
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                } else {
                    this.drawerMode = 'over';
                }
                this._changeDetectorRef.markForCheck();
            });
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    openContactInfo(): void {
        this.drawerOpened = true;
        this._changeDetectorRef.markForCheck();
    }
    resetChat(): void {
        this._userService.resetChat();
        this.drawerOpened = false;
        this._changeDetectorRef.markForCheck();
    }
    toggleMuteNotifications(): void {
        this.chat.muted = !this.chat.muted;
        this._userService.updateChat(this.chat.id, this.chat).subscribe();
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
