import { Component,OnInit,ViewChild, ElementRef} from '@angular/core';
import { Router} from '@angular/router';
import { Injectable } from '@angular/core';
import { ToastController, LoadingController, Platform } from '@ionic/angular';
import {RequestService} from '@services/request/request.service';
import {translateAnimation,rotateAnimation} from '@services/animation/custom-animation';
import * as moment from 'moment';
import { Store } from '@ngxs/store';
import {ReqState} from '@core/store/state/req.state';
import {ResetStateReq} from '@core/store/actions/req.actions';
import { ResetStateInsumos } from '@core/store/actions/insumos.actions';
import { BarcodeScanner, SupportedFormat}  from '@capacitor-community/barcode-scanner';
import jsQR from 'jsqr';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [translateAnimation(),rotateAnimation()]
})
export class homePage {

  @ViewChild('video', { static: false })
  video!: ElementRef;
  @ViewChild('canvas', { static: false })
  canvas!: ElementRef;
  @ViewChild('fileinput', { static: false })
  fileinput!: ElementRef;

  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResult = null;

  listReq: Array<any> = [];
  load = false;
  showFIlters: Boolean = false;
  statusRequisicao: Number = 2;
  empreendimentoDescricao:any = '';
  dataInicial = new Date(Date.now()  - 10 * 24 * 60 * 60 * 1000);
  dataFinal = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private plt: Platform,
    private router:Router,
    private rquestService:RequestService,
    private store:Store,

   ) {
   }
   ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;
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
    // Required for Safari
    this.videoElement.setAttribute('playsinline', true);

    // this.loading = await this.loadingCtrl.create({});
    // await this.loading.present();

    this.videoElement.play();
    requestAnimationFrame(this.scan.bind(this));
  }
  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      this.scanActive = true;
      // if (this.loading) {
      //   await this.loading.dismiss();
      //   //this.loading = null;
      //   this.scanActive = true;
      // }

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
        console.log(code);
        // this.scanResult = code.data;
        this.showQrToast();
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

  reset() {
    this.scanResult = null;
  }

  stopScan() {
    this.scanActive = false;
  }
   get validReqId(){
    return this.store.selectSnapshot(ReqState.validReqId);
  }
  ionViewDidEnter(){
    console.log('ionViewDidEnter');
    this.getReq();
  }
  ionViewWillEnter(){
    console.log('ionViewWillEnter');

  }
  ngOnInit() {
    console.log('ngOnInit');
    // this.getReq()
  }

  newRequest(){
    if(this.validReqId){
      this.store.dispatch(new ResetStateInsumos());
      this.store.dispatch(new ResetStateReq());
    }
    this.router.navigate(['tabs/central-req/nova-req']);

  }
  newRequestFrota(){
    if(this.validReqId){
      this.store.dispatch(new ResetStateInsumos());
      this.store.dispatch(new ResetStateReq());
    }
    this.router.navigate(['tabs/central-req/nova-req']);

  }
  newRequestFrotaBt(){
    if(this.validReqId){
      this.store.dispatch(new ResetStateInsumos());
      this.store.dispatch(new ResetStateReq());
    }
    this.router.navigate(['tabs/central-req/nova-req-frota']);
  }
  viewAllRequest(){
    this.router.navigate(['tabs/all-request']);
  }
  setParams(params){
    this.showFIlters = false;
    const {dataFim ,dataInicio , status,empreendimento} = params;
    this.dataInicial = dataInicio;
    this.dataFinal = dataFim;
    this.statusRequisicao = status;
    this.empreendimentoDescricao = empreendimento;
    // if(!!empreendimento){
    //   this.empreendimentoDescricao = empreendimento.replace(/[^0-9]/g,'');
    // }else{
    //   this.empreendimentoDescricao = '';
    // }
    setTimeout(() =>{
      this.getReq();
    },250)

  }
  convertNumber(element){
    if(!this.empreendimentoDescricao){
      return
    }
    return parseInt(element.replace(/[^0-9]/g,''))
  }
  getReq(){
    this.load = false;
    let hour = {
      hour: 24,
      minute: 0,
      second: 0,
      millisecond: 0,
    }

    const params = {
      dataInicial: moment(this.dataInicial).format(),
      dataFinal: moment(this.dataFinal).set(hour).format(),
      retificada: "Todos",
      vistada: "Todos",
      situacao: "Todas",
      comTodosOsItensCancelados:true,
      statusRequisicao:this.statusRequisicao,
      filtrarComprador: false,
      exportadoConstruCompras: "Todos"

    }

    this.rquestService.getReq(params).subscribe((res:any) =>{

      setTimeout(()=>{
        this.load = true;
        this.dataInicial = new Date(this.dataInicial);
        this.dataFinal = new Date(this.dataFinal);
        let datea = moment(this.dataInicial)
        let dateb = moment(this.dataFinal)
        let dif:any = dateb.diff(datea,'days')

        let msg = `Requisições adicionadas nos ultimos ${dif} dias`
        if(!!this.empreendimentoDescricao){
          this.listReq = res.filter(el => el.empreendimento === this.convertNumber(this.empreendimentoDescricao));​
        }else{
          this.listReq = res;​
        }
      },200)
    },async(error)=>{
      console.log(error)
      this.load = true;
    })
  }
}
