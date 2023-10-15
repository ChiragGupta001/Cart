import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent {
  public item: any;
  public updatedData!: FormGroup;
  public check: boolean = false;
  id!: any;
  url!: string;

  get ItemName() {
    return this.updatedData.controls['Name'];
  }
  get itemImage() {
    return this.updatedData.controls['Image'];
  }
  get itemDesc() {
    return this.updatedData.controls['Description'];
  }
  get itemCategory() {
    return this.updatedData.controls['Category'];
  }
  get itemQuantity() {
    return this.updatedData.controls['Quantity'];
  }
  get itemPrice() {
    return this.updatedData.controls['Price'];
  }

  constructor(
    private router: ActivatedRoute,
    private navRouter: Router,
    private user: UserServiceService,
    private fb: FormBuilder,
    private messageService: MessageService) { }

  updateForm: FormData = new FormData();

  ngOnInit() {
    this.id = this.router.snapshot.paramMap.get('id');
    this.user.getById(this.id).subscribe(res => {
      this.item = res;
      this.url = this.item.image;
      this.updatedData = this.fb.group({
        Id: [this.item.id],
        Name: [this.item.name, [Validators.required]],
        Image: [this.item.image, [Validators.required]],
        Description: [this.item.description, [Validators.required]],
        Category: [this.item.category, [Validators.required]],
        Quantity: [this.item.quantity, [Validators.required]],
        Price: [this.item.price, [Validators.required]]
      })
      // console.log(res);
    });
  }

  handleFileInput(event: any) {
    const formData: FormData = new FormData();
    if (event.target.files[0]) {
      formData.append("Image", event.target.files[0], event.target.files[0].name);
      // console.log(formData.append("Image", event.target.files[0], event.target.files[0].name))
      this.updateForm = formData;
    }
    var data = event.target.files[0]
    var render = new FileReader();
    render.onload = (event: any) => {
      this.url = event.target.result;
    }
    render.readAsDataURL(data);
  }


  EditItem(value: any) {
    this.updateForm.append("Id", this.id);
    this.updateForm.append("Name", value.Name);
    this.updateForm.append("Description", value.Description);
    this.updateForm.append("Category", value.Category);
    this.updateForm.append("Quantity", value.Quantity);
    this.updateForm.append("Price", value.Price);
    this.user.updateItem(this.updateForm)
      .subscribe(
        (res) => {
          this.navRouter.navigate(['showData']);
          setTimeout(() => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product Update Succesfully'});
          }, 300);
        },
        (error) => {
          this.navRouter.navigate(['**']);
        }
      );
  }

  goBack() {
    this.navRouter.navigate(['showData']);
  }
}
