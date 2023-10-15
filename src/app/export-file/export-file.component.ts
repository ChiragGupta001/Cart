import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { MessageService } from 'primeng/api';
import { error } from 'jquery';

@Component({
  selector: 'app-export-file',
  templateUrl: './export-file.component.html',
  styleUrls: ['./export-file.component.css']
})
export class ExportFileComponent {

  formData :FormData = new FormData();
  constructor(private fb:FormBuilder,private router:Router,private user:UserServiceService,private messageService:MessageService){}

  ExportFile = this.fb.group({
    file:[File],
  })

  ExportSheet(){
    this.user.ExportFromExcel(this.formData).subscribe((res)=>
    {
      this.router.navigate(['showData']);
      setTimeout(() => {
        this.messageService.add({ severity: 'success', summary: 'Added Successfully', detail: 'Item added successfully' });
      }, 400);
    },
    (error)=>{
      this.router.navigate(['showData'])
      setTimeout(()=>
      this.messageService.add({severity:'error',summary:'Something Went wrong',detail:'Error during fileUpload'}));
    });
  }

  onChangeFile(event:any){
    this.formData.append('file',event.target.files[0],event.target.files[0].name);
    console.log(event);
    console.log(event.table.files[0].name);
  }

  goBack(){
    this.router.navigate(['showData']);
  }

}
