import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-empty',
    templateUrl: './empty.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatIconModule],
})
export class EmptyComponent 
{
    /**
     * Constructor
     */
    constructor() {}
}

