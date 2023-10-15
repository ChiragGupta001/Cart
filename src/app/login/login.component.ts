import { Component, OnInit } from '@angular/core';
import { FormBuilder, PatternValidator, Validators} from '@angular/forms';
import {AccountServiceService} from '../services/account-service.service';
import { Router } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[AppComponent]
})

export class LoginComponent implements OnInit {

  user:any; 

  get email(){
    return this.loginForm.controls["email"];
  }

  get password(){
    return this.loginForm.controls["password"];
  }

  constructor(
    private fb: FormBuilder, 
    private account: AccountServiceService, 
    private router: Router,
    private messageService:MessageService ){}

  ngOnInit(): void {}

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })
  
  checkUser(value:any){
    this.account.postLoginData(value).subscribe(
      (res) => {
        try {
          localStorage.setItem("token", res.token);
          if(localStorage.getItem("token")=="undefined"){
            localStorage.clear();
            setTimeout(() => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "User Don't Exist" });
            }, 300);
            return;
          }
          if(localStorage.getItem("token")){
          this.account.loger.next(true);
          this.account.GetProfile().subscribe((res)=>{
            this.user = res;
            this.account.Profile.next(this.user['profilePic']);
          })
          setTimeout(() => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: "Login Successfully" });
          }, 300);
          this.router.navigate(['app']);
        }} catch (error) {
          console.error("Error parsing JSON response:", error);
        }
      },
      (error) => {
        console.error("Error during login:", error);
      }
    );
  }

  goSignup(){
    this.router.navigate(['signup']);
  }
  
}