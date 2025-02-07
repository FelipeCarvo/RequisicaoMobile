import { Component, OnInit,OnDestroy  } from '@angular/core';
import { NavController } from '@ionic/angular';
import {FiltroItensTermo, RequestService} from '@services/request/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import {translateAnimation} from '@services/animation/custom-animation';
import {LoadingService} from '@services/loading/loading-service';
import {Subject } from 'rxjs';
import { ToastController , ModalController} from '@ionic/angular';
import { UntypedFormGroup} from '@angular/forms';
import {FilterRequestFields} from '@services/utils/interfaces/request.interface';
import { formatISO } from 'date-fns';
@Component({
    selector: 'app-entrega-frota',
    templateUrl: './entrega-frota.page.html',
    styleUrls: ['./entrega-frota.page.scss'],
    animations: [translateAnimation()],
    standalone: false
})
export class EntregaRequestPage implements OnInit,OnDestroy {
  requisicaoId: string;
  itemId: string;
  reqItem: any = {};
  load = false;
  loadButton = false;
  rota = '';
  error = false;
  qtdSolicitada = 0;
  empreendimentoId = '';
  public unsubscribe$ = new Subject();
  listItemFilter: FilterRequestFields ={
    filteredOptionsEquipamento:null
  };
  public reqForm: UntypedFormGroup;
  constructor(
    public navCtrl: NavController,
    private rquestService: RequestService,
    private router: Router,
    activatedRoute: ActivatedRoute,
    public loading: LoadingService,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    ) {
     this.requisicaoId = activatedRoute.snapshot.params.termoResponsabilidadeId;
     this.itemId = activatedRoute.snapshot.params.termoResponsabilidadeItemId;
     this.rota = activatedRoute.snapshot.queryParams.rota;
     this.empreendimentoId = activatedRoute.snapshot.queryParams.empreendimentoId;
     }

  ngOnInit() {

  }

  setResult(ev) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

  get quantidadeValue(){
    return this.reqForm.get('quantidade').value;
  }
  public get hasValuequantidade(): boolean{
    return !!this.reqForm.get('quantidade').value;
  }

  ionViewWillEnter(){
    this.loadButton = false;
    this.getReq();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }
  goToNovosItensTermos(){
    console.log(this.requisicaoId);
    console.log(this.itemId);
    this.router.navigate([`tabs/list-in-frota/${this.requisicaoId}/${this.itemId}`]);
  }
  public dismiss(): void {
    this.navCtrl.back();
  }
  getReq(){
    if(this.rota === 'req' || this.rota === 'dev') {
      const filtro = new FiltroItensTermo();
      filtro.termoResponsabilidadeId = this.requisicaoId;
      filtro.filtrarComSaldoDevolver = this.rota === 'dev';
      this.rquestService.getItensTermosEmpr(filtro).subscribe((res: any) =>{
        this.load = true;
        this.reqItem.itens = res;
        if(this.itemId !== 'all'){
          var newArray = [];
          for (let index = 0; index < this.reqItem.itens.length; index++) {
            const element = this.reqItem.itens[index];
            if(this.itemId === element.termoResponsabilidadeItemId){
              newArray.push(this.reqItem.itens[index]);
              this.qtdSolicitada = this.reqItem.itens[index].quantidade
            }
          }
          this.reqItem.itens = newArray;
        }
        this.error = false;
      },async (error) =>{
        this.load = true;
        this.error = true;
        const toast = await this.toastController.create({
          message: error.Mensagem,
          duration: 2000
        });
        toast.present();
      });
    } else if(this.rota === 'epi') {
      this.rquestService.getItensEpiEmpr(this.requisicaoId).subscribe((res: any) =>{
        this.load = true;
        this.reqItem.itens = res;
        console.log(res)
        if(this.itemId !== 'all'){
          var newArray = [];
          for (let index = 0; index < this.reqItem.itens.length; index++) {
            const element = this.reqItem.itens[index];
            if(this.itemId === element.itembaixaId){
              newArray.push(this.reqItem.itens[index]);
            }
          }
          this.reqItem.itens = newArray;
          console.log(this.reqItem.itens)
        }
        this.error = false;
      },async (error) =>{
        this.load = true;
        this.error = true;
        const toast = await this.toastController.create({
          message: error.Mensagem,
          duration: 2000
        });
        toast.present();
      });
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
  confirm() {
    if(this.itemId !== 'all'){
      if(this.rota === 'req') {
        const params ={
          termoResponsabilidadeItemId: this.itemId,
          quantidadeEntregue: this.qtdSolicitada,
          dataEntrega: formatISO(new Date())
        };
        this.loadButton = true;
        this.loading.present();
        this.rquestService.postConfirmarEntregaItemTermo(params)
        .subscribe((res: any) =>{
          this.loading.dismiss();
          this.loadButton = false;
          this.showMsg('Entrega de Item confirmada');
            this.navCtrl.back();
        },async (error) =>{
          this.showMsg(error);
          this.loading.dismiss();
          this.loadButton = false;
        });
      } else if(this.rota === 'dev') {
        let lote =0;
        this.rquestService.getNumeroLoteDevolucao().subscribe((res: any) =>{
          lote = res[0].numeroLote;
          const params ={
            termoResponsabilidadeId: this.requisicaoId,
            quantidadeBaixa: (document.getElementById('quantidade')   as HTMLIonInputElement).value,
            dataBaixa: formatISO(new Date()),
            equipamentoCodigo: this.reqItem.itens[0].equipamentoCod,
            loteDeBaixa: lote
          };
          this.loadButton = true;
          this.loading.present();
          this.rquestService.postConfirmarDevolucaoItemTermo(params)
          .subscribe((res: any) =>{
            this.loading.dismiss();
            this.loadButton = false;
            this.showMsg('Devolução de Item confirmada');
            this.navCtrl.back();
          },async (error) =>{
            this.showMsg(error);
            this.loading.dismiss();
            this.loadButton = false;
          });

        },async (error) =>{
          const toast = await this.toastController.create({
            message: error.Mensagem,
            duration: 2000
          });
          return;
        });
      } else if(this.rota === 'epi'){
        const params ={
          termoResponsabilidadeItemId: this.itemId,
          quantidadeEntregue: this.qtdSolicitada,
          dataEntrega: formatISO(new Date())
        };
        this.loadButton = true;
        this.loading.present();
        this.rquestService.postConfirmarEntregaItemTermo(params)
        .subscribe((res: any) =>{
          this.loading.dismiss();
          this.loadButton = false;
          this.showMsg('Entrega de Item confirmada');
            this.navCtrl.back();
        },async (error) =>{
          this.showMsg(error);
          this.loading.dismiss();
          this.loadButton = false;
        });
      }
      return this.modalCtrl.dismiss(this.requisicaoId, 'confirm');
    } else {
      const params ={
        termoResponsabilidadeItemId: this.requisicaoId,
        quantidadeEntregue: this.reqItem.itens[0].quantidade,
        dataEntrega: formatISO(new Date())
      };
      this.loadButton = true;
      this.loading.present();
      this.rquestService.postConfirmarEntregaTotalTermo(params)
      .subscribe((res: any) =>{
        this.loading.dismiss();
        this.loadButton = false;
        //window.location.reload();
        this.showMsg('Entrega total realizada');
        this.confirmEntrega();
      },async (error) =>{
        this.showMsg(error);
        this.loading.dismiss();
        this.loadButton = false;
      });
      return this.modalCtrl.dismiss(this.requisicaoId, 'confirm');
    }
    //postConfirmarEntregaTotalTermo
  }
  confirmEntrega() {
    this.loadButton = true;
    this.loading.present();

    this.router.navigate([`/tabs/detail-request-frota/${this.requisicaoId}/${this.empreendimentoId}`],
    {queryParams: {rota:this.rota}});
    this.loading.dismiss();
    this.loadButton = false;
  }
  async showMsg(msg){
    const toast = await this.toastController.create(
      {
        message: msg,
        duration: 8000
      }
    );
    toast.present();
  }
}
