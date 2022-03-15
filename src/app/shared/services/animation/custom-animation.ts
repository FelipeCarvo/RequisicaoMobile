import { trigger, state, style, transition, animate } from '@angular/animations'

export function translateAnimation() {
    return trigger('hideShowAnimator', [
        transition(':enter', [
            style({transform: 'translateY(100%)', opacity: 0}),
            animate('300ms', style({transform: 'translateY(0)', opacity: 1}))
        ]),
        transition(':leave', [
        style({transform: 'translateY(0)', opacity: 1}),
        animate('200ms', style({transform: 'translateY(100%)', opacity: 0}))
        ])
    ])
}
export function rotateAnimation(){
    return trigger('rotatedState', [
        state('false', style({ transform: 'rotate(0)' })),
        state('true', style({ transform: 'rotate(-180deg)' })),
        transition('true => false', animate('200ms ease-out')),
        transition('false => true', animate('300ms ease-in'))
    ]);
}
export function opacityAnimation() {
    return  trigger('hideShowAnimator', [
        state('true', style({ opacity: 1})),
        state('false', style({ opacity: 0})),
        transition('true => false', animate('200ms ease-out')),
        transition('false => true', animate('300ms ease-in'))
    ])
}