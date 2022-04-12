import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import {RequestService} from '@services/request/request.service';
import {LoadingService} from '@services/loading/loading-service';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-consulta-estoque',
  templateUrl: './consulta-estoque.page.html',
  styleUrls: ['./consulta-estoque.page.scss'],
})
export class ConsultaEstoquePage implements OnInit {
  idInsumo: string;
  insumoEstoque: any;
  public formEstoque: FormGroup;
  public groupRadio = [
    {name:'Central de Estoque',value:true,param:'CentralDeEstoque'},
    {name:'Demais Empreendimentos',value:false,param:'DemaisEmpreendimentos'}
  ]
  constructor(
    public navCtrl:NavController,
    private requestService:RequestService,
    public loading: LoadingService,
    private route:ActivatedRoute,
    private formBuilder: FormBuilder,
    private store:Store,
    private router:Router,
    private toastController:ToastController,
    ) { }
  public get requisicaoId(){
    return this.store.selectSnapshot(ReqState.getReqId);
  }
  public get disabledButton(){
    return this.formEstoque.controls['centralEstoque'].value == 0;
  }
  public get opcaoConsulta(){
    return this.formEstoque.controls['centralEstoque'].value
  }
  private initForm(): void {
    this.formEstoque = this.formBuilder.group({
      quantidadeRequisitada:  ['', [Validators.required]],
      quantidadeReservada:  ['', [Validators.required]],
      saldoEstoque:  ['', [Validators.required]],
      unidade:  ['', [Validators.required]],
      centralEstoque: ['CentralDeEstoque', [Validators.required]],
    });
  }
  ngOnInit() {
   
    const {id} = this.route.snapshot.params;
    this.initForm();
    this.idInsumo = id;
    this.getEstoque()
  }
  public dismiss(): void {
    this.navCtrl.back();
  }

  getEstoque(){
   
    this.loading.present();
    const params = {
      requisicaoId: this.requisicaoId,
      opcaoConsulta: this.opcaoConsulta
    }
    this.requestService.getEstoque(params).subscribe((res:any) =>{
     this.insumoEstoque = res.find(e => e.itemId === this.idInsumo);
     this.formEstoque.controls['quantidadeRequisitada'].setValue(this.insumoEstoque.quantidadeRequisitada);
     this.formEstoque.controls['quantidadeReservada'].setValue(this.insumoEstoque.quantidadeReservada);
     this.formEstoque.controls['saldoEstoque'].setValue(this.insumoEstoque.saldoEstoque);
     this.formEstoque.controls['unidade'].setValue(this.insumoEstoque.unidade);

     this.loading.dismiss();
    })
  }
  consultEstoque(){
    const params = {
      itemId:  this.idInsumo,
      opcaoConsulta: this.opcaoConsulta,
      filtrarComplemento: true
    }
    this.router.navigate(['tabs/central-req/list-insumos',params]);

  }

}
