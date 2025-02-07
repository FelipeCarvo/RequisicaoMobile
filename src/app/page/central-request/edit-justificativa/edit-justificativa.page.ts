import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {RequestService} from '@services/request/request.service';
import {LoadingService} from '@services/loading/loading-service';
import {ActivatedRoute} from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
    selector: 'app-edit-justificativa',
    templateUrl: './edit-justificativa.page.html',
    styleUrls: ['./edit-justificativa.page.scss'],
    standalone: false
})
export class EditJustificativaPage implements OnInit {
  public formJus: UntypedFormGroup;
  justificativaId: string;
  versaoEsperada:Number
  justificativa: any;
  constructor(
    public navCtrl:NavController,
    private requestService:RequestService,
    public loading: LoadingService,
    private route:ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private store:Store,
    private toastController:ToastController,
    private router:Router
  ) { }
  public get requisicaoId(){
    return this.store.selectSnapshot(ReqState.getReqId);
  }
  public get getVersaoEsperada(){
    return this.store.selectSnapshot(ReqState.getVersaoEsperada);
  }
  ngOnInit() {
    this.initForm();
    const {justificativaId} = this.route.snapshot.params;
    this.justificativaId = justificativaId;
    this.getJustifcativa()
  }
  private initForm(): void {
    this.formJus = this.formBuilder.group({
      justificativa:  ['', [Validators.required]],
    });
  }
  public dismiss(): void {

    this.router.navigate(['tabs/central-req/nova-req',{number:3}]);
    // this.navCtrl.back();
  }
  getJustifcativa(){
    this.loading.present();
    this.requestService.getJustifcativaDetail(this.justificativaId).subscribe((res:any) =>{
      this.justificativa = res;
      this.formJus.controls['justificativa'].setValue(res.justificativa);

      this.loading.dismiss();
    })
  }
  sendJus(){
    const {value} = this.formJus.controls['justificativa']
    const params ={
      id: this.requisicaoId,
      justificativaId:this.justificativaId,
      justificativa: value,
      versaoEsperada: this.getVersaoEsperada
    }
    this.requestService.editJustifcativa(params).subscribe(async(res) =>{
      const toast = await this.toastController.create({
        message: 'Justificativa Editada com sucesso',
        duration: 2000
      });
      toast.present();
     this.dismiss();
    },async(error) =>{
      console.log(error)
      const toast = await this.toastController.create({
        message: error.Mensagem,
        duration: 2000
      });
      toast.present();
    })
  }
}
