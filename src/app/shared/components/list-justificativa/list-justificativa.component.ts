import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations'
import { ActivatedRoute, Params, Router } from '@angular/router';
@Component({
    selector: 'app-list-justificativa',
    templateUrl: './list-justificativa.component.html',
    styleUrls: ['./list-justificativa.component.scss'],
    animations: [
        trigger("grow", [
            transition(":enter", [
                // :enter is alias to 'void => *'
                style({ height: "0", overflow: "hidden", opacity: 0 }),
                animate(300, style({ height: "*", opacity: 1 }))
            ]),
            transition(":leave", [
                // :leave is alias to '* => void'
                animate(500, style({ height: 0, overflow: "hidden", opacity: 0 }))
            ])
        ])
    ],
    standalone: false
})
export class ListJustificativaComponent implements OnInit {
  @Input()item;
  @Input()versaoEsperada;
  showButtons:boolean = false;
  constructor(
    private router: Router,
    ) { }

  ngOnInit() {}
  edit(){

    this.router.navigate([`/tabs/central-req/edit-justificativa/${this.item.id}`]);
  }
  displayButtons(){
    this.showButtons = !this.showButtons;
  }
}
