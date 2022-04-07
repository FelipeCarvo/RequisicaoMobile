import { Component, OnInit,Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {UpdateRequestStatus} from '@services/send-status/send-status.service';
import { FormBuilder, FormGroup, Validators ,FormControl} from '@angular/forms';
import { ToastController } from '@ionic/angular';
import {translateAnimation,rotateAnimation} from '@services/animation/custom-animation'
import { Store } from '@ngxs/store';
import {ResetStateReq} from '@core/store/actions/req.actions'
import { ResetStateInsumos } from '@core/store/actions/insumos.actions';
import { ActivatedRoute, Params, Router } from '@angular/router';
@Component({
  selector: 'app-modal-finish-req',
  templateUrl: './modal-finish-req.component.html',
  styleUrls: ['./modal-finish-req.component.scss'],
  animations: [translateAnimation()]
})
export class ModalFinishReqComponent implements OnInit {
  @Input() id: string;
  @Input() versaoEsperada:number
  hasFinish = false;
  public formStatus: FormGroup;
  sendLoading: boolean = false;
  optionsSelect = [
    {name:'Reprovada',id:1,url:'/Reprovar'},
    {name:"Não Concluída",id:2,url:'/{id}/NaoConcluida/{versaoEsperada}'},
    {name:"Em Aprovação",id:3,url:'/{id}/EmAprovacao/{versaoEsperada}'},
    {name:'Aprovada para Cotação',id:4,url:'/{id}/AprovarParaCotacao/{versaoEsperada}'},
    {name:'Aprovada para O.F',id:5,url:'/{id}/AprovarParaOF/{versaoEsperada}'},
    {name:'Aprovada para O.F de Tranferência',id:6,url:'/{id}/AprovarParaOFTransferencia/{versaoEsperada}'},
    {name:'Aprovada para B.T',id:7,url:'/{id}/AprovarParaBT/{versaoEsperada}'},
    {name:'Cancelada',id:8,url:'/{id}/Cancelar/{versaoEsperada}'}
  ]
  constructor(
    public modalController: ModalController,
    private updateRequestStatus: UpdateRequestStatus,
    private formBuilder: FormBuilder,
    private toastController:ToastController,
    private store:Store,
    private router:Router
  ){
    this.formStatus = this.formBuilder.group({
      satusId:  new FormControl(null, [Validators.required]),
    });
  }
  get validForm(){
    return this.formStatus.valid;
  }
  get formValue(){
    return this.formStatus.getRawValue();
  }
  ngOnInit() {}
  public dismiss(): void {
    this.modalController.dismiss({
      dismissed: true
    });
  }
  resetReq(){
    this.store.dispatch(new ResetStateInsumos());
    this.store.dispatch(new ResetStateReq());
    this.dismiss()
  }
  async openErrorToast(error: any){
    const toast = await this.toastController.create({
      message: error,
      duration: 4000
    });
    toast.present();
  }
  async submit():Promise<void>{
    this.sendLoading = true;
    const {satusId} = this.formValue;
    let {url} = this.optionsSelect.filter(el=> el.id === satusId)[0];
    let body = {}
    if(satusId != 1 && (url.includes('{id}')||url.includes('{versaoEsperada}'))){
      console.log(this.versaoEsperada)
      url = url.replace('{id}',this.id).replace('{versaoEsperada}',this.versaoEsperada.toString())
    }else if(satusId ===1){
      body = {id:this.id,versaoEsperada:this.versaoEsperada,}
    }
    this.updateRequestStatus.sendReq(url,body).then(async(res) =>{
    this.sendLoading = false;
    this.hasFinish = !this.hasFinish;
    this.resetReq();
    this.router.navigate(['/tabs/home']);
    await this.openErrorToast('Requisição finalizada com sucesso')
    },async(err) =>{
      this.sendLoading = false;
      await this.openErrorToast(err.Mensagem)
    });
    //this.hasFinish = !this.hasFinish
  }
}
