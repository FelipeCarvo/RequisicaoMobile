import { trigger, state, style, transition, animate } from '@angular/animations'

export function opacityAnimation() {
    return  trigger('hideShowAnimator', [
        state('true', style({ opacity: 1})),
        state('false', style({ opacity: 0})),
        transition('false <=> true', animate(750))
    ])
}