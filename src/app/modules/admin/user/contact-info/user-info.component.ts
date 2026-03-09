import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';


@Component({
    selector       : 'app-user-info',
    templateUrl    : './user-info.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [MatButtonModule, MatIconModule, NgIf, NgFor],
})
export class UserInfoComponent
{
    @Input() user: any;
    @Input() drawer: MatDrawer;

    /**
     * Constructor
     */
    constructor()
    {
    }
}
