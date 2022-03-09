import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.scss'],
})
export class DocumentModalComponent implements OnInit {
  file:any;
  @Input() archives: Array<any>
  constructor() { }

  ngOnInit() {}
  changeListener($event) : void {
    this.file = $event.target.files[0];
  }

}
