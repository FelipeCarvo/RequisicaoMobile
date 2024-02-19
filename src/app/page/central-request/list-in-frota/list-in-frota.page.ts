import { Component, OnInit, EventEmitter,Output, Input,ViewChild, ElementRef } from '@angular/core';
import { NavController, ToastController, LoadingController, Platform } from '@ionic/angular';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import {translateAnimation} from '@services/animation/custom-animation';
import {RequestService} from '@services/request/request.service';
import {ActivatedRoute,Router} from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators ,UntypedFormControl,ReactiveFormsModule,FormGroup} from '@angular/forms';
import jsQR from 'jsqr';

@Component({
  selector: 'app-list-insumos-frota',
  templateUrl: './list-in-frota.page.html',
  styleUrls: ['./list-in-frota.page.scss'],
  animations: [translateAnimation()]
})
export class ListInsumosFrotaPage implements OnInit {
  @Input() getFormForStore: any;
  @Output() UpdateForm: EventEmitter<any> = new EventEmitter();
  @Output() sendReq: EventEmitter<any> = new EventEmitter();

  empreendimentoId: string = null;
  produtoId: [];
  requisicaoId: string = null;
  defaultSelectedRadio = '';
  selectedRadioGroup: any;
  selectedRadioItem: any;
  load = false;
  rota = '';
  requisicao: any;
  requisicaoCod: '';
  requisicaoStatus: '';
  qtdListInsumos = 0;
  listInsumos: Array<any>;
  listInsumosFiltro: Array<any>;
  public reqForm: UntypedFormGroup;

  constructor(
    private requestService: RequestService,
    private store: Store,
    public navCtrl: NavController,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: UntypedFormBuilder
  ) {
    const {empreendimentoId}= this.store.selectSnapshot(ReqState.getReq);
    this.empreendimentoId = empreendimentoId;
    this.rota = route.snapshot.queryParams.rota;
    this.ngOnInit();
  }
  get itensTermoValue(){
    return this.reqForm.get('itensTermo').value;
  }
  get hasValueitensTermo(): boolean{
    return !!this.reqForm.get('itensTermo').value;
  }

  get quantidadeValue(){
    return this.reqForm.get('quantidade').value;
  }
  public get hasValuequantidade(): boolean{
    return !!this.reqForm.get('quantidade').value;
  }

  buscaInsumoQrCode(idInsumo: string) {
    let blnEncontrado = false;
    const lista = [];
    // console.log(code.data.toUpperCase().trim())
    for (let index = 0; index < this.listInsumos.length; index++) {
      const element = this.listInsumos[index];
      // console.log(element.equipamentoCod.toUpperCase().trim())
      if (element.equipamentoCod.toUpperCase().trim() === idInsumo.toUpperCase().trim()) {
        // console.log('localizado')
        blnEncontrado = true;
        this.selectedRadioGroup = element.id;
        this.produtoId = element.id;
        lista.push(element);
        this.listInsumos = lista;
        continue;
      }
    }

    if (blnEncontrado) {
      alert('Item localizado');

    } else {
      alert('Item não localizado');
    }

  }


  get validReqId() {
    return this.store.selectSnapshot(ReqState.validReqId);
  }

  async ngOnInit() {
    console.log('ngOnInit')
    this.getInsumos();
      this.reqForm = this.formBuilder.group({
        quantidade:  0,//new UntypedFormControl({value:0,disabled:false}, [Validators.required]),
        item: new UntypedFormControl({ value: null,disabled: false}, [Validators.required]),
      });

      await this.setValform();
  }
  async setValform(){
    await this.reqForm.patchValue(this.getFormForStore);
    const formVal = this.getForm;
    console.log(formVal);
    console.log(this.getFormForStore);
    const obj1 = this.removeFields(formVal);
    const obj2 = this.removeFields(this.getFormForStore);
    this.UpdateForm.emit(JSON.stringify(obj1) !== JSON.stringify(obj2));
  }
  removeFields(obj){
    const res = Object.assign({}, obj);
    const filterVal =Object.keys(res).filter(e => res[e] == null || (e === 'requisicaoId' || e === 'id'));
    filterVal.forEach(e =>{
      res[e] = e;
      delete res[e];
    });
  }

  getInsumos(){
    const {params} = this.getParams(this.route.snapshot);
    console.log(params)
    if(this.rota === 'req'){
      this.requestService.consultaEstoqueItemEquipamento(params).subscribe((res: Array<any>) =>{
        this.load = true;
        this.listInsumos= res;
        console.log(res)
        this.qtdListInsumos = res.length;
        this.getDados();
      });
    } else {
      this.requestService.consultaEstoqueItemEpi(params.empreendimentoId).subscribe((res: Array<any>) =>{
        this.load = true;
        this.listInsumos= res;

        this.qtdListInsumos = res.length;
        this.getDadosEpi();
      });
    }
  }
  getDados(){
    const dados = this.getParamsReq();
    this.requestService.getTermosEmpr(dados.params).subscribe((res: Array<any>) =>{
      this.requisicao= res[0];
      this.requisicaoCod = this.requisicao.termoResponsabilidadeCod;
      this.requisicaoStatus = this.requisicao.documentoStatusDescricao;
      this.load = true;
    });
  }
  getDadosEpi(){
    const dados = this.getParamsEpiDados();
    this.requestService.getTermosEmprEpi(dados.params).subscribe((res: Array<any>) =>{
      this.requisicao= res[0];
      this.requisicaoCod = this.requisicao.baixaCodigo;
      this.requisicaoStatus = this.requisicao.baixaStatusDescricao;
      this.load = true;
    });
  }
  getParamsEpiDados(){
    const params = {
      empreendimentoId:this.empreendimentoId,
      baixaEstoqueId:this.requisicaoId
    };
    return {params};
  }
  getParamsReq(){
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


  getParams(form){
    const type = 'POST';
    this.requisicaoId=form.params.requisicaoId;
    const params = {
      empreendimentoId:form.params.empreendimentoId,
      termoResponsabilidadeId:form.params.requisicaoId,
      pesquisa: null,
      valorSelecionado: ''
    };
    return {params,type};
  }
  dismiss(){
    this.navCtrl.back();
  }
  async sendPostItem(){
    const form = this.route.snapshot;
     if(this.rota === 'req'){
      const params = {
        termoResponsabilidadeId:form.params.requisicaoId,
        quantidade: this.quantidadeValue,
        equipamentoId: this.produtoId['value']
      }

      let msg: string;
      this.requestService.postInsertItemReq(params)
      .subscribe(async (res: any) => {
        const requisicaoId = res.requisicaoId;
          msg = `Item adicionado com sucesso`;
          this.getInsumos();
          this.reqForm = this.formBuilder.group({
            quantidade:  0,//new UntypedFormControl({value:0,disabled:false}, [Validators.required]),
            item: new UntypedFormControl({ value: null,disabled: false}, [Validators.required]),
          });
        this.router.navigate([`tabs/detail-request-frota/${form.params.requisicaoId}/${form.params.empreendimentoId}`],
                        {queryParams: {rota:'req'}});
      },
        async (error) =>{
          msg = error.Mensagem? error.Mensagem : error;
          console.log(error);
          await this.showMsg(msg);
        }
      );
    } else if (this.rota === 'epi') {
       let riBaixaCodigo=0;
        for(const index in this.listInsumos){
          const element = this.listInsumos[index];
          if(element.itemCodigo === this.produtoId['value']){
            riBaixaCodigo=element.riBaixaCodigo
            break;
          }

        }
        const params = {
          baixaId:form.params.requisicaoId,
          quantidadeItemBaixa: this.quantidadeValue,
          itemBaixaData: new Date(),
          itemCodigo:this.produtoId['value'],
          riBaixaCodigo:riBaixaCodigo
        };


        let msg: string;
        this.requestService.postInsertItemReqEpi(params)
        .subscribe(async (res: any) => {
          msg = `Item adicionado com sucesso`;
          this.getInsumos();
          this.reqForm = this.formBuilder.group({
            quantidade:  0,//new UntypedFormControl({value:0,disabled:false}, [Validators.required]),
            item: new UntypedFormControl({ value: null,disabled: false}, [Validators.required]),
          });
          this.router.navigate([`tabs/detail-request-frota/${form.params.requisicaoId}/${form.params.empreendimentoId}`],
                          {queryParams: {rota:'req'}});
        },
          async (error) =>{
            msg = error.Mensagem? error.Mensagem : error;
            console.log(error);
            await this.showMsg(msg);
          }
        );
    }
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

  async sendForm(){
    // this.sendLoading = true;
    await this.sendReq.emit(this.getForm);
    // this.sendLoading = false;
  }
  get getForm(){
    return this.reqForm.getRawValue();
  }

  radioGroupChange(event) {
    console.log(event.detail)
    this.selectedRadioGroup = event.detail;
    this.produtoId = event.detail;
  }

  radioFocus() {
  }
  radioSelect(event) {
    this.selectedRadioItem = event.detail;
  }
  radioBlur() {
  }

}
