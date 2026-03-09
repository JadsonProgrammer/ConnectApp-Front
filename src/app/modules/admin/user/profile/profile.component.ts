import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { UserProfile } from '../user.model';
import { UserService } from '../user.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
    ],
})
export class ProfileComponent implements OnInit, OnDestroy {
    private _fb = inject(FormBuilder);
    private _userService = inject(UserService);
    private _snackBar = inject(MatSnackBar);
    private _cdr = inject(ChangeDetectorRef);
    private _unsubscribeAll = new Subject<void>();
    @Input() drawer: MatDrawer;

    profile: UserProfile | null = null;

    form = this._fb.group({
        Name: ['', Validators.required],

        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
    });

    ngOnInit(): void {
        this._userService.profile$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((profile) => {
                if (!profile) return;

                this.profile = profile;
                this.form.patchValue({
                    Name: profile.name,
                    email: profile.email,
                    username: profile.accountName,
                });

                this._cdr.markForCheck();
            });
    }

    save(): void {
        if (this.form.invalid || !this.profile) return;

        this._userService
            .updateUser(this.profile.id, this.form.value)
            .subscribe({
                next: () => {
                    this._snackBar.open('Perfil atualizado!', 'OK', {
                        duration: 3000,
                    });
                },
            });
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

//     imports: [
//         MatSidenavModule,
//         NgIf,
//         NewComponent,
//         ProfileComponent,
//         MatButtonModule,
//         MatIconModule,
//         MatMenuModule,
//         MatFormFieldModule,
//         MatInputModule,
//         FormsModule,
//         NgFor,
//         NgClass,
//         RouterLink,
//         RouterOutlet,
//     ],
// })
// export class ProfileComponent implements OnInit, OnDestroy {
//     @Input() drawer: MatDrawer;
//     profile: UserProfile | null = null;
//     private _unsubscribeAll: Subject<any> = new Subject<any>();
//     private _userService = inject(UserService);
//     private _changeDetectorRef = inject(ChangeDetectorRef);

//     ngOnInit(): void {
//         this._userService.profile$
//             .pipe(takeUntil(this._unsubscribeAll))
//             .subscribe((profile: UserProfile) => {
//                 this.profile = profile;
//                 this._changeDetectorRef.markForCheck();
//             });
//     }
//     ngOnDestroy(): void {
//         this._unsubscribeAll.next(null);
//         this._unsubscribeAll.complete();
//     }
// }
