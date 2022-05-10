import { Component, OnInit } from '@angular/core';
import {LoginService} from '@services/login/login.service';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-config-cp',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  public configForm: FormGroup;
  public loadSendData:Boolean;
  constructor(
    private formBuilder: FormBuilder,
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
    this.loginService.getConfig(configParams).subscribe(res=>{
      this.loadSendData = false;
    },
    async(error)=>{
      this.loadSendData = false;
      const toast = await this.toastController.create({
        message: error,
        duration: 2000
      });
      toast.present();
      console.log(error)
    })
  }
}
