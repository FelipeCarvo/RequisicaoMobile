import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss'],
})
export class StepOneComponent implements OnInit {
  @Input() insumoEstoque;
  @Input() opcaoConsulta:String;
  @Output() consultEstoque: EventEmitter<any> = new EventEmitter<void>();
  @Output() updateEstoque: EventEmitter<any> = new EventEmitter<void>();
  hasLoad:Boolean = false;
  public groupRadio = [
    {name:'Central de Estoque',value:true,param:'CentralDeEstoque'},
    {name:'Demais Empreendimentos',value:false,param:'DemaisEmpreendimentos'}
  ]
  public formEstoque: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
  ) { }
  public get disabledButton(){
    return this.formEstoque.controls['saldoEstoque'].value == 0;
  }
  public get quantidadeReservada(){
    return this.formEstoque.controls['quantidadeReservada'].value;
  }
  public get quantidadeRequisitada(){
    return this.formEstoque.controls['quantidadeRequisitada'].value;
  }
  ngOnInit() {
    this.initForm();
  }
  private initForm(): void {
    let {quantidadeRequisitada,quantidadeReservada,saldoEstoque,unidade} = this.insumoEstoque
    this.formEstoque = this.formBuilder.group({
      quantidadeRequisitada:  [quantidadeRequisitada, [Validators.required]],
      quantidadeReservada:  [quantidadeReservada, [Validators.required]],
      saldoEstoque:  [saldoEstoque, [Validators.required]],
      unidade:  [unidade, [Validators.required]],
      centralEstoque: [this.opcaoConsulta, [Validators.required]],
    });
    
  }
  consult(){
    this.hasLoad = false;
    this.consultEstoque.emit();
    setTimeout(() =>{
      this.hasLoad = false;
    },200)
  }

}
