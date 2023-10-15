import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { PasswordValidator } from '../shared/password.validator';
import { AccountServiceService } from '../services/account-service.service';
import { MessageService } from 'primeng/api';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [AccountServiceService]
})

export class SignUpComponent implements OnInit {

  @ViewChild('cropper', { static: true }) cropper!: ElementRef;
  signUpForm: FormData = new FormData();
  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  image: any = '';
  showCropper = false;
  dynamicHeight: number = 10;
  dynamicWidth: number = 10;
  ngOnInit(): void { }

  get userName() {
    return this.SignupForm.controls["UserName"];
  }

  get email() {
    return this.SignupForm.controls["Email"];
  }

  get profile() {
    return this.SignupForm.controls["ProfilePic"];
  }

  get password() {
    return this.SignupForm.controls["Password"];
  }

  get phoneNo() {
    return this.SignupForm.controls["PhoneNumber"];
  }

  constructor(
    private fb: FormBuilder,
    private account: AccountServiceService,
    private router: Router,
    private messageService: MessageService) { }

  SignupForm = this.fb.group({
    UserName: ['', [Validators.required]],
    Email: ['', [Validators.required, Validators.email]],
    ProfilePic: [File],
    Password: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{4,}$")]],
    ConfirmPassword: [''],
    PhoneNumber: ['', [Validators.required]]
  }, { validator: PasswordValidator })

  ngAfterViewInit() {
    // Access the canvas element and set its width and height dynamically
    const canvas: HTMLCanvasElement = this.cropper.nativeElement.getElementsByTagName('canvas')[0];
    canvas.width = this.dynamicWidth;
    canvas.height = this.dynamicHeight;
  }

  gologin() {
    this.router.navigate(['login'])
  }

  signUp(value: any) {
    
    this.signUpForm.append("UserName", value.UserName);
    this.signUpForm.append("Email", value.Email);
    this.signUpForm.append("Password", value.Password);
    this.signUpForm.append("ConfirmPassword", value.ConfirmPassword);
    this.signUpForm.append("PhoneNumber", value.PhoneNumber);

    this.account.createUser(this.signUpForm).subscribe((res) => {
      try {
        this.router.navigate(['login'])
        setTimeout(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "User Created Successfully" });
        }, 300);
        alert("User Successfully created")
      } catch (error) {
        console.error("Error:", error);
        setTimeout(() => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Something Went wrong" });
        }, 300);
      }
    },
      (error) => {
        if (error.status === 409) {
          setTimeout(() => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "User Already Exist" });
          }, 300);
          return;
        }
        setTimeout(() => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Something went Wrong" });
        }, 300);
        return;
      })
  }

  onFileChange(event: any): void {
    this.imgChangeEvt = event;
  }

  cropImg(e: ImageCroppedEvent) {
    this.cropImgPreview = e.objectUrl;
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        const dataUrl = e.target.result as string;
        const byteString = atob(dataUrl.split(',')[1]);
        const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
          uintArray[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], { type: mimeString });
        this.signUpForm.delete('ProfilePic');
        const uniqueId = Math.random() * 1000;
        this.signUpForm.append('ProfilePic', blob, `${uniqueId}file.jpg`);
      }
    };
    this.image = e.blob;
    reader.readAsDataURL(this.image);
  }

  imgLoad() {
    // display cropper tool
  }

  initCropper() {
    // init cropper
  }

  imgFailed() {
    // error msg
  }

}