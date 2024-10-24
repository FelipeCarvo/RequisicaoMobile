import { Component, OnInit ,Output,EventEmitter  } from '@angular/core';
import {LoginService} from '@services/login/login.service';
import { ToastController } from '@ionic/angular';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-config-cp',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  public configForm: UntypedFormGroup;
  public loadSendData:Boolean;
  @Output() updateCp: EventEmitter<any> = new EventEmitter<void>();
  constructor(
    private formBuilder: UntypedFormBuilder,
    private loginService:LoginService,
    private toastController:ToastController,
  ) {
    this.initForm()
   }

  ngOnInit() {}
  private initForm(): void {
    this.configForm = this.formBuilder.group({
      configParams: [null, [Validators.required, Validators.minLength(1)]],
    });
  }
  sendParams(){
    this.loadSendData = true;
    const {configParams} = this.configForm.getRawValue();
    this.loginService.getConfig(configParams).subscribe(async(res)=>{
      this.loadSendData = false;
      const toast = await this.toastController.create({
        message: 'Configuração encontrada',
        duration: 2000
      });
      toast.present();
      setTimeout(()=>{
        this.updateCp.emit();
      },300)
    },
    async(error)=>{
      this.loadSendData = false;
      let msg = "Configuração não encontrada"
      const toast = await this.toastController.create({
        message: msg,
        duration: 2000
      });
      toast.present();
      console.log(error)
    })
  }
}
