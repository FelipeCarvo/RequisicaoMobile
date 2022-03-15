import { trigger, state, style, transition, animate } from '@angular/animations'

export function opacityAnimation() {
    return  trigger('hideShowAnimator', [
        state('true', style({ opacity: 1})),
        state('false', style({ opacity: 0})),
        transition('false <=> true', animate(250))
    ])
}
export function rotateAnimation(){
    return trigger('rotatedState', [
        state('false', style({ transform: 'rotate(0)' })),
        state('true', style({ transform: 'rotate(-180deg)' })),
        transition('true => false', animate('400ms ease-out')),
        transition('false => true', animate('400ms ease-in'))
    ]);
}