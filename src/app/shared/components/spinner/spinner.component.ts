import { Component, Input, OnInit } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';
@Component({
    selector: 'app-spinner',
    template: `<ng-container >
    <div class="spinner"[@hideShowAnimator]="showSpinner">
      <ion-spinner ></ion-spinner>
    </div>
  </ng-container>`,
    styleUrls: ['./spinner.component.scss'],
    animations: [
        trigger('hideShowAnimator', [
            state('true', style({ opacity: 1 })),
            state('false', style({ opacity: 0 })),
            transition('false <=> true', animate(250))
        ])
    ],
    standalone: false
})
export class SpinnerComponent implements OnInit {
  @Input() color = 'ion-color-primary';

  @Input() height = '100%';
  @Input() width: '100%';
  @Input() showSpinner: boolean;
  constructor() {}

  ngOnInit() {}
}
