import { Component, OnInit,OnDestroy,ElementRef,ViewChild ,AfterViewInit, HostListener } from '@angular/core';
import { NavController, IonModal,InfiniteScrollCustomEvent } from '@ionic/angular';
import {FiltroItensTermo, RequestService} from '@services/request/request.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {translateAnimation} from '@services/animation/custom-animation';
import {LoadingService} from '@services/loading/loading-service';
import {Subject } from 'rxjs';
import { ToastController , ModalController} from '@ionic/angular';
import { UntypedFormGroup } from '@angular/forms';
import {FilterRequestFields} from '@services/utils/interfaces/request.interface';
import SignaturePad from 'signature_pad';
import * as moment from 'moment';

@Component({
  selector: 'app-detail-request',
  templateUrl: './detail-frota.page.html',
  styleUrls: ['./detail-frota.page.scss'],
  animations: [translateAnimation()]
})
export class DetailRequestPage implements OnInit,OnDestroy {
  @ViewChild('canvas', { static: true }) signaturePadElement;
  @ViewChild(IonModal) modal: IonModal;

  // setResult(ev) {
  //   this.roleMessage = `Dismissed with role: ${ev.detail.role}`;
  // }

  signaturePad: any;
  canvasWidth: number;
  canvasHeight: number;
  requisicaoId: string;
  empreendimentoId: string;
  reqItem: any = {};
  colaboradorNome ='';

  textoValidacao = '';
  listStatus: any =[];
  load = false;
  loadButton = false;
  rota = '';
  error = false;
  selectedRadioGroup: any;
  selectedRadioItem: any;
  statusId= 0;
  requisicao: any;
  requisicaoCod: '';
  baixaCodigo: '';
  requisicaoStatus: '';
  requisicaoStatusCod = 0;

  //#region Tratamento de tela
    isModalOpenValidacao =false;
    isFinalizaSolicitacao = true;
    isAlteraProduto = false;
    isIncluiProduto = false;
    prontaEntregavel = false;
    isAlteraStatus = false;
    mostrarLeitorQrCode = false;
  //#endregion

  public unsubscribe$ = new Subject();
  listItemFilter: FilterRequestFields ={
    filteredOptionsEquipamento:null
  };
  public reqForm: UntypedFormGroup;
  constructor(
    private elementRef: ElementRef,
    public navCtrl: NavController,
    private rquestService: RequestService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public loading: LoadingService,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    ) {
     this.requisicaoId = activatedRoute.snapshot.params.requisicaoId;
     this.empreendimentoId = activatedRoute.snapshot.params.empreendimentoId;
     this.rota = activatedRoute.snapshot.queryParams.rota;
  }


  ngOnInit() {
    this.getReq();
    let parametroapp = JSON.parse(localStorage.getItem('parametroapp'));
    for (let index = 0; index < parametroapp.length; index++) {
      const element = parametroapp[index]["leituraColaboradorQrCod"];
      if (element===1) {
        this.mostrarLeitorQrCode = true;
      }
    }

  }

  setOpen(isOpen: boolean) {
    this.isModalOpenValidacao = isOpen;
  }
  onIonInfinite(ev) {
    //this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
      this.init();
  }

  init() {
    const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
    console.log(this.elementRef.nativeElement)
    canvas.height = 200;
    if (this.signaturePad) {
      this.signaturePad.clear(); // Clear the pad on init
    }
  }
  public ngAfterViewInit(): void {
    //alert(this.requisicaoStatusCod)
    // this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
    // this.signaturePad.clear();
    // this.signaturePad.penColor = 'rgb(56,128,255)';
  }
  save(): void {
    const img = this.signaturePad.toDataURL();
    console.log(img);
    console.log(img.substring(22));
  }
  isCanvasBlank(): boolean {
    if (this.signaturePad) {
      return this.signaturePad.isEmpty() ? true : false;
    }
  }
  clear() {
    this.signaturePad.clear();
  }
  undo() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop(); // remove the last dot or line
      this.signaturePad.fromData(data);
    }
  }
  radioGroupChange(event) {
    this.selectedRadioGroup = event.detail;
    this.statusId = event.detail;
    console.log(this.statusId)
  }
  atualizaQuantiddadeEntregue(event){
    for (const index in this.reqItem.itens){
      var element = this.reqItem.itens[index]
      if(element.termoResponsabilidadeItemId === event.srcElement.item){
        element.saldoQuantidadeEntregar = event.detail.value
      }
    }
  }
  radioFocus() {
  }
  radioSelect(event) {
    this.selectedRadioItem = event.detail;

  }
  radioBlur() {
  }
  confirmAlterarQuantida(item,termoResponsabilidadeItemId) {
    const myDiv = document.getElementById(termoResponsabilidadeItemId) as HTMLInputElement;
    this.loadButton = true;
    this.loading.present();
    const params ={
      termoResponsabilidadeItemId: item.termoResponsabilidadeItemId,
      quantidade:myDiv.value
    };
    this.rquestService.postAlterQtdtemReq(params)
    .subscribe((res: any) =>{
      this.loading.dismiss();
      this.loadButton = false;
      window.location.reload();
      this.showMsg('Quantidade alterada');
    },async (error) =>{
      console.log(error)
      this.showMsg(error);
      this.loading.dismiss();
      this.loadButton = false;
    });
    return this.modalCtrl.dismiss(this.requisicaoId, 'confirm');

  }
  ionViewWillEnter(){
    this.loadButton = false;
    this.getReq();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }
  goToNovosItensTermos(){
    if (this.rota === 'epi') {
      this.router.navigate([`tabs/add-insumo-baixa/${this.requisicaoId}/${this.empreendimentoId}`], { queryParams: { rota: this.rota } });
    }
    else {
      this.router.navigate([`tabs/list-in-frota/${this.requisicaoId}/${this.empreendimentoId}`], { queryParams: { rota: this.rota } });
    }
  }
  public dismiss(): void {
    this.navCtrl.back();
  }
  getReq(){
    if (this.rota !== 'epi'){
      const filtro = new FiltroItensTermo();
      filtro.termoResponsabilidadeId = this.requisicaoId;
      filtro.filtrarComSaldoDevolver = this.rota === 'dev';
      this.rquestService.getItensTermosEmpr(filtro).subscribe((res: any) =>{
        this.load = true;
        this.reqItem.itens = res;
        this.isFinalizaSolicitacao = !(this.reqItem.itens.length>0);
        this.getDados();
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
    } else {
      this.rquestService.getItensEpiEmpr(this.requisicaoId).subscribe((res: any) =>{
        this.load = true;
        this.reqItem.itens = res;
        this.isFinalizaSolicitacao = !(this.reqItem.itens.length>0);
        this.getDadosEpi();
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
  getDados(){
    const dados = this.getParams();
    this.rquestService.getTermosEmpr(dados.params).subscribe((res: Array<any>) =>{
      this.requisicao= res[0];
      this.requisicaoCod = this.requisicao.termoResponsabilidadeCod;
      this.requisicaoStatus = this.requisicao.documentoStatusDescricao;
      this.colaboradorNome = this.requisicao.colaboradorNome;
      this.requisicaoStatusCod = this.requisicao.documentoStatus;
      this.prontaEntregavel = this.requisicao.documentoStatus===1 || this.requisicao.documentoStatus ===2;
       if(this.requisicaoStatusCod === 0){
        this.isFinalizaSolicitacao = false;
        this.isAlteraStatus = true;
        this.isAlteraProduto = true;
        this.isIncluiProduto=true;
        this.listStatus =[
          { id:0, descricao:'Não concluido' },
          { id:1, descricao:'Solicitado' },
          // { id:2, descricao:'Solicitação confirmada' },
          { id:3, descricao:'Cancelado' },
          //{ id:4, descricao:'Reprovado' },
        ];
       } else if(this.requisicaoStatusCod === 1){
        this.isFinalizaSolicitacao = false;
        this.isAlteraStatus = true;
        this.listStatus =[
          { id:0, descricao:'Não concluido' },
          //{ id:1, descricao:'Solicitado' },
          // { id:2, descricao:'Solicitação confirmada' },
          { id:3, descricao:'Cancelado' },
          //{ id:4, descricao:'Reprovado' },
        ];
       } else if(this.requisicaoStatusCod === 1){
        this.isFinalizaSolicitacao = false;
        this.isAlteraStatus = true;
        this.isAlteraProduto = false;
        this.isIncluiProduto=false;
        this.listStatus =[
          { id:0, descricao:'Não concluido' },
          { id:1, descricao:'Solicitado' },
          // { id:2, descricao:'Solicitação confirmada' },
          { id:3, descricao:'Cancelado' },
          //{ id:4, descricao:'Reprovado' },
        ];
       } else if(this.requisicaoStatusCod === 1){
        this.isFinalizaSolicitacao = false;
        this.isAlteraStatus = true;
        this.listStatus =[
          { id:0, descricao:'Não concluido' },
          //{ id:1, descricao:'Solicitado' },
          // { id:2, descricao:'Solicitação confirmada' },
          { id:3, descricao:'Cancelado' },
          //{ id:4, descricao:'Reprovado' },
        ];
       } else if(this.requisicaoStatusCod === 2){
          if(this.requisicao.statusDevolucaoCod===1) {
            this.prontaEntregavel = false;
          } else {
            this.isFinalizaSolicitacao = false;
            this.isAlteraStatus = true;
            this.listStatus =[
              { id:0, descricao:'Não concluido' },
              //{ id:1, descricao:'Solicitado' },
              // { id:2, descricao:'Solicitação confirmada' },
              { id:3, descricao:'Cancelado' },
              { id:4, descricao:'Reprovado' },
            ];
          }
        }

      if(this.prontaEntregavel){
        document.getElementById('signature-pad').style.display ='block';
        const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
        canvas.height = 200;
        if (this.signaturePad) {
          this.signaturePad.clear(); // Clear the pad on init
        }
        this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
        this.signaturePad.clear();
        this.signaturePad.penColor = 'rgb(56,128,255)';
        this.isCanvasBlank();

      } else {
        document.getElementById('signature-pad').style.display ='none';
      }
      this.load = true;
    });
  }
  getDadosEpi(){
    const dados = this.getParamsEpiDados();
    this.rquestService.getTermosEmprEpi(dados.params).subscribe((res: Array<any>) =>{
      this.requisicao= res[0];
      this.baixaCodigo = this.requisicao.baixaCodigo;
      this.requisicaoStatus = this.requisicao.baixaStatusDescricao;
      this.requisicaoStatusCod = this.requisicao.baixaStatusCodigo;
      this.colaboradorNome='';
      this.colaboradorNome = this.requisicao.colaboradorNome === null?'':this.requisicao.colaboradorNome;
      if(this.rota === 'epi'){
        if(this.requisicaoStatusCod === 0){
          this.isIncluiProduto=true;
          this.isAlteraProduto = true;
          this.isAlteraStatus = true;
          this.listStatus = [
            // {id:0, descricao:'Reservado' },
            {id:1, descricao:'Pendente' }
            // {id:2, descricao:'Baixado' }
          ];
        } else if(this.requisicaoStatusCod === 1){
          this.prontaEntregavel = true;
          this.isAlteraStatus = true;
          this.listStatus = [
            {id:0, descricao:'Reservado' },
            //{id:1, descricao:'Pendente' }
            //{id:2, descricao:'Baixado' }
          ];
        } else{
          this.isIncluiProduto=false;
          this.isAlteraProduto = false;
          this.prontaEntregavel = false;
          this.isAlteraStatus = false;
        }
      }
      this.prontaEntregavel = this.requisicaoStatusCod === 1;
      if(this.prontaEntregavel){
        document.getElementById('signature-pad').style.display ='block';
        const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
        canvas.height = 200;
        if (this.signaturePad) {
          this.signaturePad.clear(); // Clear the pad on init
        }
        this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
        this.signaturePad.clear();
        this.signaturePad.penColor = 'rgb(56,128,255)';
        this.isCanvasBlank();
      } else {
        document.getElementById('signature-pad').style.display ='none';
      }
      this.load = true;
    });
  }
  getParams(){
    const params = {
      empreendimentoId:null,
      colaboradorId:null,
      statusId: null,
      dataInicio: null,
      dataFim: null,
      termoResponsabilidadeId:this.requisicaoId
    };
    return {params};
  }
  getParamsEpiDados(){
    const params = {
      empreendimentoId:this.empreendimentoId,
      baixaEstoqueId:this.requisicaoId
    };
    return {params};
  }
  editReq(){
    this.loadButton = true;
    this.loading.present();
    this.rquestService.getCurrentReq(this.requisicaoId).subscribe((res: any) =>{
      // this.router.navigate(['/tabs/central-req/nova-req'], {queryParams: {rota:this.rota}});
      this.router.navigate(['/tabs/home-estoque']);
      this.loading.dismiss();
      this.loadButton = false;
    },async (error) =>{
      this.loading.dismiss();
      this.loadButton = false;
    });
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
  confirm(item) {
    this.loadButton = true;
    this.loading.present();
    if(this.rota === 'req'){
      const params ={
        termoResponsabilidadeItemId: item.termoResponsabilidadeItemId
      };
      this.rquestService.postExcluirItemTermo(params)
      .subscribe((res: any) =>{
        this.loading.dismiss();
        this.loadButton = false;
        this.showMsg('Solicitação alterada com sucesso');
        window.location.reload();
      },async (error) =>{
        this.showMsg(error);
        this.loading.dismiss();
        this.loadButton = false;
      });
      return this.modalCtrl.dismiss(this.requisicaoId, 'confirm');
} else if (this.rota === 'epi') {
      const params ={
        itembaixaId: item.itembaixaId
      };
      this.rquestService.postExcluirItemEpi(params)
      .subscribe((res: any) =>{
        this.loading.dismiss();
        this.loadButton = false;
        window.location.reload();
      },async (error) =>{
        this.showMsg(error);
        this.loading.dismiss();
        this.loadButton = false;
      });
      return this.modalCtrl.dismiss(this.requisicaoId, 'confirm');
    }
  }
  formatDate(date){
    if (date !== null){
      let _data =   moment(date).format('YYYY-MM-DD');
      let _hora =   moment(date).format('HH:mm:ss');
      return `${_data}T${_hora}.000Z`;
    }
    return date;
  }
  confirmStatus() {
    this.loadButton = true;
    const params ={
      termoResponsabilidadeId: this.requisicaoId,
      statusNovo: this.statusId['value']
    };
    this.loading.present();
    if (this.rota==='dev'){
      let lote =0;
      this.rquestService.getNumeroLoteDevolucao().subscribe((res: any) =>{
      lote = res[0].numeroLote;
      for (let index = 0; index < this.reqItem.itens.length; index++) {
        const element = this.reqItem.itens[index];
        const paramsDev ={
          termoResponsabilidadeId: this.requisicaoId,
          quantidadeBaixa: element.saldoQuantidadeEntregar,
          dataBaixa: this.formatDate(new Date()),
          equipamentoCodigo: element.equipamentoCod,
          loteDeBaixa: lote
          };
          this.rquestService.postConfirmarDevolucaoTermo(paramsDev)
          .subscribe((res: any) =>{
          },async (error) =>{
            this.showMsg(error);
          });
        }
        this.router.navigate(['/tabs/home-estoque']);
        this.loading.dismiss();
        this.loadButton = false;
      },async (error) =>{
        const toast = await this.toastController.create({
          message: error.Mensagem,
          duration: 2000
        });
        return;
      });
    } else if(this.rota === 'req') {
      if (this.mostrarLeitorQrCode ===true && params.statusNovo === 1){
        params.statusNovo = 2;
      }
      this.rquestService.postAlterarStatusTermo(params)
      .subscribe((res: any) =>{
        this.loadButton = false;
        this.loading.dismiss();
        this.router.navigate(['/tabs/home-estoque']);
        return this.modalCtrl.dismiss(this.requisicaoId, 'confirm');
      },async (error) =>{
        this.showMsg(error);
        this.loading.dismiss();
        this.loadButton = false;

      });
    } else if (this.rota === 'epi') {
      const params ={
        baixaId: this.requisicaoId,
        statusNovo: this.statusId['value']
      };

      this.rquestService.postAlterarStatusTermoEpi(params)
      .subscribe((res: any) =>{
        this.loading.dismiss();
        this.loadButton = false;
        this.router.navigate([`tabs/central-req/nova-req-frota/${this.rota}`]);
        this.loading.dismiss();
        this.loadButton = false;
        this.showMsg('Solicitação realizada com sucesso');
        return this.modalCtrl.dismiss(this.requisicaoId, 'confirm');
      },async (error) =>{
        this.showMsg(error);
        this.loading.dismiss();
        this.loadButton = false;
      });
    }
  }
  goToEntregarTodos(){
    if (this.rota === 'epi') {
      const params ={
        baixaId: this.requisicaoId,
        statusNovo: 2
      };
      this.rquestService.postAlterarStatusTermoEpi(params)
      .subscribe((res: any) =>{
        this.loading.dismiss();
        this.loadButton = false;
        // this.router.navigate([`tabs/central-req/nova-req-frota/${this.rota}`]);
        this.router.navigate(['/tabs/home-estoque']);
        this.loading.dismiss();
        this.loadButton = false;
        this.showMsg('Solicitação realizada com sucesso');
        return this.modalCtrl.dismiss(this.requisicaoId, 'confirm');
      },async (error) =>{
        this.showMsg(error);
        this.loading.dismiss();
        this.loadButton = false;
      });
    } else if (this.rota === 'req') {
      const params ={
        termoResponsabilidadeId: this.requisicaoId,
        dataEntrega: this.formatDate(new Date())
      };
      this.rquestService.postConfirmarEntregaTotalTermo(params)
      .subscribe((res: any) =>{
        this.loadButton = false;
        this.loading.dismiss();
        this.router.navigate(['/tabs/home-estoque']);
        return this.modalCtrl.dismiss(this.requisicaoId, 'confirm');
      },async (error) =>{
        this.showMsg(error);
        this.loading.dismiss();
        this.loadButton = false;

      });
    } else if(this.rota==='dev'){
      let lote =0;
      this.rquestService.getNumeroLoteDevolucao().subscribe((res: any) =>{
      lote = res[0].numeroLote;
      if(this.confirmaDevolucao(lote)){
          this.router.navigate([`tabs/central-req/nova-req-frota/${this.rota}`]);
          this.loading.dismiss();
          this.loadButton = false;
          return this.modalCtrl.dismiss(this.requisicaoId, 'confirm');
      } else {
        window.location.reload();
        return this.modalCtrl.dismiss(this.requisicaoId, 'confirm');
      }
      },async (error) =>{
        const toast = await this.toastController.create({
          message: error.Mensagem,
          duration: 2000
        });
        return;
      });
    }
  }
  confirmaDevolucao (lote){
    let retorno =true;
    for (let index = 0; index < this.reqItem.itens.length; index++) {
      const element = this.reqItem.itens[index];
      if(element.saldoQuantidadeEntregar === '' ||element.saldoQuantidadeEntregar ===0){
        continue;
      }
      const paramsDev ={
        termoResponsabilidadeId: this.requisicaoId,
        quantidadeBaixa: element.saldoQuantidadeEntregar,
        dataBaixa: this.formatDate(new Date()),
        equipamentoCodigo: element.equipamentoCod,
        loteDeBaixa: lote
        };
        this.rquestService.postConfirmarDevolucaoTermo(paramsDev)
        .subscribe((res: any) =>{
          this.router.navigate(['/tabs/home-estoque']);
        },async (error) =>{
          this.showMsg(error);
          retorno=false;
        });
      }
    return retorno;
  }
  confirmEntrega(item) {
    this.loadButton = true;
    this.loading.present();
    if (this.rota === 'req' || this.rota === 'dev') {
      this.router.navigate([`/tabs/entrega-req-frota/${item.termoResponsabilidadeId}/${item.termoResponsabilidadeItemId}`]
          ,{queryParams: {rota:this.rota,empreendimentoId: this.empreendimentoId }});
    } else if (this.rota === 'epi'){
      this.router.navigate([`/tabs/entrega-req-frota/${this.requisicaoId}/${item.itembaixaId}`]
          ,{queryParams: {rota:this.rota, empreendimentoId: this.empreendimentoId }});
    }
    this.loading.dismiss();
    this.loadButton = false;
  }
  async showMsg(msg){
    const toast = await this.toastController.create(
      {
        message: msg,
        duration: 4000
      }
    );
    toast.present();
  }
}
