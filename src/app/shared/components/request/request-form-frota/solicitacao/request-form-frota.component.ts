
import { Component, OnInit,Output ,Input,EventEmitter,ViewChild,ElementRef} from '@angular/core';
import {LoockupstService} from '@services/lookups/lookups.service';
import {  ToastController } from '@ionic/angular';
import { UntypedFormBuilder, UntypedFormGroup, Validators ,UntypedFormControl} from '@angular/forms';
import {translateAnimation} from '@services/animation/custom-animation';
import { Injectable } from '@angular/core';
import {FilterRequestFields} from '@services/utils/interfaces/request.interface';
import { ActivatedRoute } from '@angular/router';
import jsQR from 'jsqr';

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
  @ViewChild('video', { static: false })
  video!: ElementRef;
  @ViewChild('canvas', { static: false })
  canvas!: ElementRef;
  @ViewChild('fileinput', { static: false })
  fileinput!: ElementRef;
  @Input() controlName: any;
  @Input() getFormForStore: any;
  @Input() validReqId: boolean;
  @Output() UpdateForm: EventEmitter<any> = new EventEmitter();
  @Output() sendReq: EventEmitter<any> = new EventEmitter();
  @Output() setFormForStore: EventEmitter<any> = new EventEmitter();
  @Input() dateSolicit: any;
  @Input() dateInicial: any;

  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResult = null;

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
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
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

  ngAfterViewInit() {
    if(this.mostrarLeitorQrCode) {
      this.canvasElement = this.canvas.nativeElement;
      this.canvasContext = this.canvasElement.getContext('2d');
      this.videoElement = this.video.nativeElement;
    }
  }
  handleFile(files: FileList) {
    const file = files.item(0);
    var img = new Image();
    img.onload = () => {
      this.canvasContext.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        console.log(code)
        //this.scanResult = code.data;
        this.showQrToast();
      }
    };
    // img.src = URL.createObjectURL(file);
  }
  captureImage() {
    this.fileinput.nativeElement.click();
  }
  async startScan() {
    // Not working on iOS standalone mode!
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });

    this.videoElement.srcObject = stream;
    //Required for Safari
    this.videoElement.setAttribute('playsinline', true);

    // this.loading = await this.loadingCtrl.create({});
    // await this.loading.present();

    this.videoElement.play();
    requestAnimationFrame(this.scan.bind(this));
  }
  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      this.scanActive = true;
      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        this.scanActive = false;
        //console.log(code);
        //this.scanResult = code.data;
        //this.showQrToast();
        this.buscarColaboradorScan(code.data);
        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }
      } else {
        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }
      }
    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }
  // Helper functions
  async showQrToast() {
    const toast = await this.toastCtrl.create({
      message: `Open ${this.scanResult}?`,
      position: 'top',
      buttons: [
        {
          text: 'Open',
          handler: () => {
            //window.open(this.scanResult, '_system', 'location=yes');
          }
        }
      ]
    });
    toast.present();
  }
  buscarColaboradorScan(id){
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
  // reset() {
  //   this.scanResult = null;
  // }

  stopScan() {
    this.videoElement.setAttribute('playsinline', false);
    this.scanActive = false;
    requestAnimationFrame(this.scan.bind(this));
    // this.reset();
  }
}
