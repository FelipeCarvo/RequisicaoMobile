import {Directive ,HostListener} from '@angular/core';
@Directive({
    selector: '[appMousePosition]',
    standalone: false
})
export class MosuePositionDirective {
  @HostListener('mousemove', ['$event']) onMouseMove(event) {
    const root = document.documentElement;
    let x:any = event.clientX / innerWidth;
    let y:any = `-${event.clientY / 1.3}px`;
    root.style.setProperty('--mouse-position-y', y);
  }
}