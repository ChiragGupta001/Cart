import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserServiceService} from '../services/user-service.service';
import { ConfirmationService, MessageService, ConfirmEventType, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css'],
})
export class DeleteComponent {
  public item:any;
  constructor(private primengConfig:PrimeNGConfig ,private router: ActivatedRoute, private user: UserServiceService, private navRouter: Router, private messageService: MessageService, private confirmationService: ConfirmationService){}
  ngOnInit(){
    this.primengConfig.ripple=true;
    let id = this.router.snapshot.paramMap.get('id');
    this.user.getById(id).subscribe(res=>{
      this.item = res;
      console.log(res);
    });
  }

  confirm(id : any){
    this.confirmationService.confirm({
      message:'Do you want to delete this recorde ?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: ()=>this.user.deleteItem(id).subscribe(()=>{
        setTimeout(() => {
                  this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Product Deleted' });
                }, 300);this.navRouter.navigate(['showData']);
      }),
      reject: ()=>{
        setTimeout(() => {
          this.messageService.add({ severity: 'error', summary: 'Something Went Wrong', detail: 'Product is not deleted'});
        }, 300);
     
      this.navRouter.navigate(['showData']);
      }
    })
  }

  goBack(){
    this.navRouter.navigate(['showData']);
  }
}
