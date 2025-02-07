import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import {RequestService} from '@services/request/request.service';
import {LoadingService} from '@services/loading/loading-service';
import {ActivatedRoute} from '@angular/router';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
    selector: 'app-centeal-estoque',
    templateUrl: './centeal-estoque.page.html',
    styleUrls: ['./centeal-estoque.page.scss'],
    standalone: false
})
export class CentealEstoquePage implements OnInit {
  
  constructor(
    public navCtrl:NavController,
    private requestService:RequestService,
    public loading: LoadingService,
    private route:ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private store:Store,
    private toastController:ToastController,
  ) { }
  public get requisicaoId(){
    return this.store.selectSnapshot(ReqState.getReqId);
  }
  ngOnInit() {
    
  }
}
