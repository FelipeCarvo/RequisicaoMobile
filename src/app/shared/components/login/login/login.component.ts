import { Component ,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {LoginService} from '@services/login/login.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login-cp',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public loadSendData = false;
  public typePassword = "password";
  constructor(
    private formBuilder: FormBuilder,
    private router:Router,
    private loginService:LoginService,
    private toastController:ToastController,
  ) {
    this.initForm()
  }
  ngOnInit(){

  }
  private initForm(): void {
    this.loginForm = this.formBuilder.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(1)]]
    });
  }
  revealPassword(){
    if(this.typePassword == "password"){
      this.typePassword = "text";
    }else{
      this.typePassword = "password";
    }
  }
  login(){
    this.loadSendData = !this.loadSendData;
    const payload = this.loginForm.getRawValue();
    this.loginService.login(payload).subscribe(res=>{
      this.loadSendData = !this.loadSendData;
      this.router.navigate(['/tabs/home']);
    },
    async(error)=>{
      this.loadSendData = !this.loadSendData;
      console.log(error);
      const toast = await this.toastController.create({
        message: error.error_description,
        duration: 2000
      });
      toast.present();
      console.log(error)
    })
    //this.router.navigate(['/tabs/home']);
  }

}
