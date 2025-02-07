import { Component, OnInit, EventEmitter,Output, Input, ViewChild } from '@angular/core';
import { IonRadioGroup, NavController, ToastController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import {translateAnimation} from '@services/animation/custom-animation';
import {RequestService} from '@services/request/request.service';
import {ActivatedRoute,Router} from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators ,UntypedFormControl } from '@angular/forms';
import { InputSearchComponent } from '@components/input-search/input-search.component';
import { of, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { LoadingService } from '@services/loading/loading-service';

@Component({
    selector: 'app-add-insumo-baixa',
    templateUrl: './add-insumo-baixa.page.html',
    styleUrls: ['./add-insumo-baixa.page.scss'],
    animations: [translateAnimation()],
    standalone: false
})
export class AddInsumoBaixaPage implements OnInit {
  @Input() getFormForStore: any;
  @Output() updateForm: EventEmitter<any> = new EventEmitter();
  @Output() sendReq: EventEmitter<any> = new EventEmitter();
  @ViewChild('insumoLookup') insumoLookup: InputSearchComponent;
  @ViewChild('radioGroup') radioGroup: IonRadioGroup;

  empreendimentoId: string = null;
  produtoId: [];
  requisicaoId: string = null;
  defaultSelectedRadio = '';
  selectedRadioGroup: any;
  load = false;
  rota = '';
  requisicao: any;
  requisicaoCod: '';
  requisicaoStatus: '';
  qtdListInsumos = 0;
  listInsumos: Observable<any>;
  public reqForm: UntypedFormGroup;
  pesquisaInsumo: any;
  error = false;

  constructor(
    private requestService: RequestService,
    private store: Store,
    public navCtrl: NavController,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router,
    public loading: LoadingService,
    private formBuilder: UntypedFormBuilder
  ) {
    const {empreendimentoId}= this.store.selectSnapshot(ReqState.getReq);
    this.empreendimentoId = empreendimentoId;
    this.rota = route.snapshot.queryParams.rota;
    this.defineListaInsumos([]);
    this.ngOnInit();
  }

  get quantidadeValue(){
    return this.reqForm.get('quantidade').value;
  }
  public get hasValuequantidade(): boolean{
    return !!this.reqForm.get('quantidade').value;
  }
  get insumo() {
    return this.reqForm.get('insumo').value;
  }

  async buscaInsumoQrCode(codigoInsumo: string) {
    await this.insumoLookup.defineValorPorId(codigoInsumo);
    this.buscarEstoque();
  }


  get validReqId() {
    return this.store.selectSnapshot(ReqState.validReqId);
  }

  async ngOnInit() {
    console.log('ngOnInit');
    this.reqForm = this.formBuilder.group({
      quantidade: 0,//new UntypedFormControl({value:0,disabled:false}, [Validators.required]),
      insumo: new UntypedFormControl({ value: null, disabled: false }, [Validators.required])
    });

    this.getDadosBaixa();
    await this.setValform();
  }

  async setValform(){
    this.reqForm.patchValue(this.getFormForStore);
    const formVal = this.getForm;
    console.log(formVal);
    console.log(this.getFormForStore);
    const obj1 = this.removeFields(formVal);
    const obj2 = this.removeFields(this.getFormForStore);
    this.updateForm.emit(JSON.stringify(obj1) !== JSON.stringify(obj2));
  }

  removeFields(obj){
    const res = Object.assign({}, obj);
    const filterVal =Object.keys(res).filter(e => res[e] == null || (e === 'requisicaoId' || e === 'id'));
    filterVal.forEach(e =>{
      res[e] = e;
      delete res[e];
    });
  }

  buscarEstoque(){
    if (!this.insumo) {
      this.showMsg('Selecione um insumo!');
      return;
    }
    this.requestService.consultaEstoqueItemEpi(this.pesquisaInsumo.empreendimentoId, this.insumo).subscribe((res: Array<any>) => {
      this.load = true;
      this.defineListaInsumos(res);
    });
  }

  getDadosBaixa(){
    const {params} = this.getParams(this.route.snapshot);
    this.pesquisaInsumo = params;
    console.log(params);
    const dados = this.getParamsBaixaDados();
    this.requestService.getTermosEmprEpi(dados.params).subscribe((res: Array<any>) =>{
      this.requisicao= res[0];
      this.requisicaoCod = this.requisicao.baixaCodigo;
      this.requisicaoStatus = this.requisicao.baixaStatusDescricao;
      this.load = true;
    });
  }

  getParamsBaixaDados(){
    const params = {
      empreendimentoId:this.empreendimentoId,
      baixaEstoqueId:this.requisicaoId
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

  async buscaItemSelecionado() {
    return this.listInsumos.pipe(
      map(lista => lista.find(obj => obj.itemRi === this.radioGroup.value)),
      first()
    ).toPromise();
  }

  async sendPostItem(){

    if (!this.insumo) {
      this.showMsg('Selecione um insumo!');
      return;
    }
    const itemSelecionado = await this.buscaItemSelecionado();
    if (!itemSelecionado) {
      this.showMsg('Selecione um item com estoque!');
      return;
    }

    this.load = true;
    const form = this.route.snapshot;
    const params = {
      baixaId: form.params.requisicaoId,
      quantidadeItemBaixa: this.quantidadeValue,
      itemBaixaData: new Date(),
      itemCodigo: itemSelecionado.itemCodigo,
      riBaixaCodigo: itemSelecionado.riBaixaCodigo
    };

    this.loading.present();


    this.requestService.postInsertItemReqEpi(params).subscribe(
      guid => { console.log('Inseriu item ' + guid); },
      async error => {
        this.loading.dismiss();
        const msg = error.Mensagem ? error.Mensagem : error;
        console.log(error);
        this.load = false;
        await this.showMsg(msg);
      },
      () => {
        this.load = false;
        this.loading.dismiss();
        this.dismiss();
        /*
        this.router.navigate([`tabs/detail-request-frota/${form.params.requisicaoId}/${form.params.empreendimentoId}`],
          { queryParams: { rota: 'epi' } });
          */
      }
    );
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

  get getForm(){
    return this.reqForm.getRawValue();
  }

  getEnumName(): string {
    return 'insumoId';
  }

  radioGroupChange(event) {
    console.log(event.detail);
    this.selectedRadioGroup = event.detail;
    this.produtoId = event.detail;
  }

  insumoSelecionado(insumo) {
    if (!insumo) {
      this.defineListaInsumos([]);
    }
  }

  defineListaInsumos(lista) {
    if (!lista) {
      lista = [];
    }
    this.listInsumos = of(lista);
    this.qtdListInsumos = lista.length;
    if (lista.length === 1) {
      this.radioGroup.value = lista[0].itemRi;
    }
  }
}
