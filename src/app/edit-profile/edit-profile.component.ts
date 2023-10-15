import { Component, ElementRef, ViewChild } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AccountServiceService } from '../services/account-service.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {

  @ViewChild('cropper', { static: true }) cropper!: ElementRef;
  editForm: FormData = new FormData();
  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  image: any = '';
  showCropper = false;
  dynamicHeight: number = 10;
  dynamicWidth: number = 10;
  Id:any=this.account.getClaim(this.account.getToken(),'id');
  user:any

  constructor(private fb: FormBuilder,private account:AccountServiceService,private router:Router, private messageService:MessageService){
  }

  EditProfilePic = this.fb.group({
    Profile:[File],
    Id:[this.Id]
  })



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
        this.editForm.delete('Profile');
        const uniqueId = Math.random() * 1000;
        this.editForm.append('Profile', blob, `file${uniqueId}.jpg`);
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

  EditProfile(){
    this.editForm.append('Id',this.Id);
    this.account.EditUserProfile(this.editForm).subscribe((res)=>{
      this.account.GetProfile().subscribe(res=>{
        this.user = res;
        this.account.Profile.next(this.user['profilePic']);
      })
      this.router.navigate(['app']);
      setTimeout(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile Update Succesfully'});
      }, 300);
    },
    (error)=>{
      this.router.navigate(['showData']);
          setTimeout(() => {
            this.messageService.add({ severity: 'Error', summary: 'Error', detail: 'Something went wrong'});
          }, 300);
    }
    )
  }

  goBack(){
    this.router.navigate(['showData']);
  }
}
