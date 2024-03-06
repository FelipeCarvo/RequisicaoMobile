import { Component, OnInit,Output ,Input,EventEmitter, ViewChild} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators ,UntypedFormControl, FormGroup} from '@angular/forms';
import {translateAnimation} from '@services/animation/custom-animation';
import { Injectable } from '@angular/core';
import {FilterRequestFields} from '@services/utils/interfaces/request.interface';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { InputSearchComponent } from '@components/input-search/input-search.component';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-pesq-form-frota',
  templateUrl: './request-form-frota-pesq.component.html',
  styleUrls: ['./request-form-frota-pesq.component.scss'],
  animations: [translateAnimation()]
})
export class RequestFormFrotaPesqComponent implements OnInit {
  @Input() controlName: any;
  @Input() getFormForStore: any;
  @Input() validReqId: boolean;
  @Output() UpdateForm: EventEmitter<any> = new EventEmitter();
  @Output() sendReq: EventEmitter<any> = new EventEmitter();
  @Output() setFormForStore: EventEmitter<any> = new EventEmitter();
  @Input() dataInicial:any;
  @Input() dataFim:any;
  @ViewChild('colabPesquisa') colabPesquisa: InputSearchComponent;
  @ViewChild('equipPesquisa') equipPesquisa: InputSearchComponent;
  listReq: Array<any> = [];
  sendLoading = false;
  mostrarLeitorQrCode =false;
  digitacaoColaborador = true;
  nomeColaborador = '';
  currentDay = new Date().toISOString();
  currentyear = new Date().toISOString();
  codStatusPadrao = 0;
  strStatusPadrao = 'Não concluido';
  idstatus = 0;
  rota = '';
  public reqForm: UntypedFormGroup;
  listItemFilter: FilterRequestFields ={
    filteredOptionsEmpresasInsumos:null,
    filteredOptionsOfDescontoMaterial:null,
    filteredOptionsUsuarios:null
  };
  listStatus: any =
  [
    { id:0, descricao:'Não concluido' },
    { id:1, descricao:'Solicitado' },
    { id:2, descricao:'Solicitação confirmada' },
    { id:3, descricao:'Cancelado' },
    { id:4, descricao:'Reprovado' },
  ];
  load = false;
  public pesquisaEquipamento = {
    pesquisa: '',
    valorSelecionado: null
  };
  public pesquisaColaborador = {
    pesquisa: '',
    valorSelecionado: null
  };
  popover: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    public router: Router,
    private route: ActivatedRoute,
  ) {
    this.rota = route.snapshot.params.rota;
    if(this.rota === 'epi'){
      this.listStatus = [
        {id:0, descricao:'Reservado' },
        {id:1, descricao:'Pendente' },
        {id:2, descricao:'Baixado' }
      ];
     } else if(this.rota === 'dev') {
        this.idstatus = 2;
     } else if(this.rota === 'req') {
      this.listStatus = [
        { id:0, descricao:'Não concluido' },
        { id:1, descricao:'Solicitado' },
        { id:3, descricao:'Cancelado' },
        { id:4, descricao:'Reprovado' },
      ];
     }
    this.initForm();
  }
  //#region  parametros
    get hasValidForm(){
      return !!this.reqForm.valid;
    }
    get empreendimentoIdValue(){
      return this.reqForm.get('empreendimentoId').value;
    }
    get hasValueEmpreendimento(): boolean{
      return !!this.reqForm.get('empreendimentoId').value;
    }
    get statusIdValue(){
      return this.reqForm.get('statusId').value;
    }
    get _dataInicio(){
      return this.reqForm.get('dataInicio').value;
    }
    get hasValueDataInicico(): boolean{
      return !!this.reqForm.get('dataInicial').value;
    }
    get _dataFinal(){
      return this.reqForm.get('dataFinal').value;
    }
    get hasValueDataFinal(): boolean{
      return !!this.reqForm.get('dataFim').value;
    }
    get hasValueStatus(): boolean{
      return !!this.reqForm.get('statusId').value;
    }
    get colaboradorCodValue() {
      return this.reqForm.get('colaboradorCod').value;
    }
    get hascolaboradorCodValue(): boolean{
      return !!this.reqForm.get('colaboradorCod').value;
    }
  //#endregion
  handleChange(ev){
    this.idstatus = ev.target.value;
  }
  ionViewWillEnter(){
    this.reqForm.reset();
 }
  reset() {
    this.reqForm.markAllAsTouched();
  }

  async buscarEquipamentoScan(id: string){
    await this.equipPesquisa.defineValorPorPesquisa(id);
  }

  async buscarColaboradorScan(id: string){
    await this.colabPesquisa.defineValorPorId(id);
  }

  habiliDigitacaoNome(){
    this.digitacaoColaborador = true;
  }
  async  ngOnInit() {
    let parametroapp = JSON.parse(localStorage.getItem('parametroapp'));
    for (let index = 0; index < parametroapp.length; index++) {
      const element = parametroapp[index]["leituraColaboradorQrCod"];
      if (element===1) {
        this.mostrarLeitorQrCode = true;
        this.digitacaoColaborador = false;
      }
    }
    this.dataInicial = null;
  }
  get getForm(){
    return this.reqForm.getRawValue();
  }
  formatDate(date){
    return  moment(date).format('YYYY-MM-DD');
  }
  initForm(){
    this.reqForm = this.formBuilder.group({
      empreendimentoId:  new UntypedFormControl({value:null,disabled:false  }, [Validators.required]),
      statusId: [this.idstatus],
      dataInicio: [this.dataInicial],
      dataFinal: [this.dataFim],
      colaboradorCod:new UntypedFormControl({value:null,disabled:false}),
      equipamentoId: new UntypedFormControl({value:null,disabled:false}),
    });
  }
  async setValform(){
    // await this.reqForm.patchValue(this.getFormForStore);
    const formVal = this.getForm;
    const obj1 = this.removeFields(formVal);
    const obj2 = this.removeFields(this.getFormForStore);
    this.UpdateForm.emit(JSON.stringify(obj1) !== JSON.stringify(obj2));
  }
  getFormField(field){
    return this.reqForm.get(field).value;
  }
  removeFields(obj){
    const res = Object.assign({}, obj);
    const filterVal =Object.keys(res).filter(e => res[e] == null || (e === 'requisicaoId' || e === 'id'));
    filterVal.forEach(e =>{
      res[e] = e;
      delete res[e];
    });
  }
  sendForm(){
    this.sendLoading = true;
    this.sendReq.emit(this.getForm);
    this.sendLoading = false;
  }
  doRefresh() {
    console.log(this.listReq);
    // this.cdr.detectChanges();
  }

}

