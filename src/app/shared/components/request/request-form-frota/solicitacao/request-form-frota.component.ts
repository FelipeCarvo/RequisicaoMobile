
import { Component, OnInit,Output ,Input,EventEmitter,ViewChild,ElementRef} from '@angular/core';
import {LoockupstService} from '@services/lookups/lookups.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators ,UntypedFormControl} from '@angular/forms';
import {translateAnimation} from '@services/animation/custom-animation';
import { Injectable } from '@angular/core';
import {FilterRequestFields} from '@services/utils/interfaces/request.interface';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-request-form-frota',
  templateUrl: './request-form-frota.component.html',
  styleUrls: ['./request-form-frota.component.scss'],
  animations: [translateAnimation()]
})
export class RequestFormFrotaComponent implements OnInit {
  @Input() controlName: any;
  @Input() getFormForStore: any;
  @Input() validReqId: boolean;
  @Output() UpdateForm: EventEmitter<any> = new EventEmitter();
  @Output() sendReq: EventEmitter<any> = new EventEmitter();
  @Output() setFormForStore: EventEmitter<any> = new EventEmitter();
  @Input() dateSolicit: any;
  @Input() dateInicial: any;

  rota='';
  mostrarLeitorQrCode =false;
  digitacaoColaborador = true;
  nomeColaborador = '';
  sendLoading: boolean = false;

  public reqForm: UntypedFormGroup;
  private loadForm: boolean = false
  listItemFilter:FilterRequestFields ={
    filteredOptionsEmpresasInsumos:null,
    filteredOptionsOfDescontoMaterial:null,
    filteredOptionsUsuarios:null
  };

  load = false;
  constructor(
    route: ActivatedRoute,
    private loockupstService: LoockupstService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.rota = route.snapshot.params.rota;
    this.initForm();
  }
  get hasValidForm(){
    return !!this.reqForm.valid;
  }
  get empreendimentoIdValue(){
    return this.reqForm.get('empreendimentoId').value;
  }
  get hasValueEmpreendimento(): boolean{
    return !!this.reqForm.get('empreendimentoId').value;
  }
  get colaboradorIdValue(){
    return this.reqForm.get('colaboradorCod').value;
  }
  get hasValueColaborador(): boolean{
    return !!this.reqForm.get('colaboradorCod').value;
  }
  get _dataSolicitacao(){
    return this.reqForm.get('dataSolicitacao').value;
  }
  get _dataInicio(){
    return this.reqForm.get('dataInicio').value;
  }
  async ngOnInit() {
    this.validReqId;
    let parametroapp = JSON.parse(localStorage.getItem('parametroapp'));
    for (let index = 0; index < parametroapp.length; index++) {
      const element = parametroapp[index]["leituraColaboradorQrCod"];
      if (element===1) {
        this.mostrarLeitorQrCode = true;
      }
    }
    await this.setValform();
  }
  get getForm(){
    return this.reqForm.getRawValue();
  }
  initForm(){
    this.reqForm = this.formBuilder.group({
      empreendimentoId:  new UntypedFormControl({value:null,disabled:false}, [Validators.required]),
      colaboradorCod: new UntypedFormControl({ value: null,disabled: false}, [Validators.required]),
      empresaId: new UntypedFormControl({ value: null,disabled: false}),
      dataInicio: [this.dateInicial],
    });
    this.loadForm = true;
  }

  async setValform(){
    await this.reqForm.patchValue(this.getFormForStore);
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
  async sendForm(){
    this.sendLoading = true;
    await this.sendReq.emit(this.getForm);
    this.sendLoading = false;
  }

  buscarColaboradorScan(id: string){
    //const id = 'B2178BCE-1569-4D05-87C4-28647A7D0D34';
    const enumName = 'colaboradorCod';
    const params = {
      pesquisa:  '',
      valorSelecionado: id,
      tipoPessoa: 'Funcionário',
      somenteFiliaisDoSelecionado:false
    };

    this.loockupstService.getLookUpOb(params,enumName)
        .subscribe(async (res: any) => {
          if (res.length>0){
            const element = res[0];
            // set setValueColaboradorCod(id) {
            //   this.reqForm.setValue({colaboradorCod: id});
            // }
            this.reqForm.value.colaboradorCod =  element.id;
            this.nomeColaborador = element.descricao;
            console.log(this.reqForm.value.colaboradorCod);
            this.reqForm.controls['colaboradorCod'].setValue(element.id);
          }
          else {
            // this.reqForm.value.colaboradorCod = null;
            alert('Colaborador não localizado');
          }
        },
        async (error) =>{
          console.log(error);
        }
      );
  }

  habiliDigitacaoNome(){
    this.digitacaoColaborador = true;
  }

}
