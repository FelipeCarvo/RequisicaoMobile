import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {
  file:any;
  constructor() { }

  ngOnInit() {}
  changeListener($event) : void {
    this.file = $event.target.files[0];
  }

}
