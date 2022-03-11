import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-no-image-icon',
  templateUrl: './no-image-icon.component.html',
  styleUrls: ['./no-image-icon.component.scss'],
})
export class NoImageIconComponent implements OnInit {
  @Input() typeFile:String;

  constructor() { }

  ngOnInit() {

  }


}
