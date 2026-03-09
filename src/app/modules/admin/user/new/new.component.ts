import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { User, UserContact } from '../user.model';
import { MatDrawer } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-new',
    templateUrl: './new.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatButtonModule, MatIconModule, NgIf, NgFor],
})
export class NewComponent implements OnInit, OnDestroy {
    @Input() drawer: MatDrawer;
    users: UserContact[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _userService: UserService) {}

    ngOnInit(): void {
        this._userService.users$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((users: UserContact[]) => {
                this.users = users;
            });
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    usertrackByFn(index: number, item: any): any {
        return item.id || index;
    }
}