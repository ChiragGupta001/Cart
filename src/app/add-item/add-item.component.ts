import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserServiceService} from '../services/user-service.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit{
  constructor(
    private fb: FormBuilder,
    private user: UserServiceService,
    private router: Router,
    private messageService: MessageService){}

   updateForm!:FormData;
   url!:string;
   isurl:boolean=false;

   addNewItem = this.fb.group({
    Name: ['', [Validators.required]],
    Image: [File, [Validators.required]],
    Description: ['', [Validators.required]],
    Category: ['', [Validators.required]],
    Quantity: ['', [Validators.required]],
    Price:['', [Validators.required]]
  })

  ngOnInit(){ }

  handleFileInput(event:any) {
    const formData: FormData = new FormData();
    formData.append("Image", event.target.files[0], event.target.files[0].name );
    this.updateForm = formData;
    var data = event.target.files[0]
    var render = new FileReader();
    render.onload = (event:any)=>  {
      this.url = event.target.result;
      this.isurl = true;
    }
    render.readAsDataURL(data);
  }  

  get ItemName(){
    return this.addNewItem.controls['Name'];
  }
  get itemImage(){
    return this.addNewItem.controls['Image'];
  }
  get itemDesc(){
    return this.addNewItem.controls['Description'];
  }
  get itemCategory(){
    return this.addNewItem.controls['Category'];
  }
  get itemQuantity(){
    return this.addNewItem.controls['Quantity'];
  }
  get itemPrice(){
    return this.addNewItem.controls['Price'];
  }
  
  AddItem(value:any){
    this.updateForm.append("Name",value.Name);
    this.updateForm.append("Description",value.Description);
    this.updateForm.append("Category",value.Category);
    this.updateForm.append("Quantity",value.Quantity);
    this.updateForm.append("Price",value.Price);
    console.log(this.updateForm);
    this.user.addData(this.updateForm).subscribe((res)=> {
      setTimeout(() => {
        this.messageService.add({ severity: 'success', summary: 'Added Successfully', detail: 'Item is added successfully' });
      }, 400);
        this.router.navigate(['showData'])
      },
      (error) => {
        setTimeout(() => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
        }, 300);
        this.router.navigate(['showData'])
      }
    );
  }

  goBack(){
    this.router.navigate(['showData'])
  }
}
