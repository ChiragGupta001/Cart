import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { Router } from '@angular/router';
import { AccountServiceService } from '../services/account-service.service';
import { LoginComponent } from '../login/login.component';
import { AppComponent } from '../app.component';
import * as FileSaver from 'file-saver';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-show-data',
  templateUrl: './show-data.component.html',
  styleUrls: ['./show-data.component.css'],
  providers: [UserServiceService, AccountServiceService,LoginComponent,AppComponent]
})

export class ShowDataComponent {
  products: any[] = [];
  totalPage: number = 0;
  role: any;
  // userId:number=1;
  excel:any;
  pageNumber: number = 1;
  pageSize: number = 10;
  sortOrder: string = "id";
  sortDirection: string = "descending";
  issort: boolean = false;
  searchTerm: string = "";
  title = 'datatables';
  value: string = "";
  result: any;
  loader: boolean = true;

  constructor(
    private user: UserServiceService,
    private router: Router,
    private account: AccountServiceService,
    private messageService:MessageService) { }

  ngOnInit() {
    const token = this.account.getToken();
    this.role = this.account.getClaim(token, 'role');
    console.log(this.role);
    this.data(this.pageSize, this.pageNumber, this.sortOrder, this.sortDirection, this.searchTerm);
  }

  

  data(pageSize: number, pageNumber: number, sortOrder: string, sortDirection: string, searchTerm: string) {
    this.user.getData(this.pageSize, this.pageNumber, this.sortOrder, this.sortDirection, this.searchTerm).subscribe((res: any) => {
      // this.result = res['result'];
      this.products = res['products'];
      this.totalPage = res['totalPage'];
      this.loader = false;
    });
  }

  PagesizeData(input: number) {
    this.pageSize = input;
    this.pageNumber = 1;
    this.data(this.pageSize, this.pageNumber, this.sortOrder, this.sortDirection, this.searchTerm);
  }

  DetailItem(item: any) {
    this.router.navigate(['detail', item.id]);
  }

  EditItem(item: any) {
    this.router.navigate(['edit', item.id]);
  }

  DeleteItem(item: any) {
    this.router.navigate(['delete', item.id]);
  }

  previous() {
    if (this.pageNumber > 1) {
      this.pageNumber = this.pageNumber - 1;
      this.data(this.pageSize, this.pageNumber, this.sortOrder, this.sortDirection, this.searchTerm);
    }
  }

  next() {
    if (this.pageNumber < this.totalPage) {
      this.pageNumber = this.pageNumber + 1;
      this.data(this.pageSize, this.pageNumber, this.sortOrder, this.sortDirection, this.searchTerm);
    }
  }

  search(input: string) {
    this.searchTerm = input;
    this.data(this.pageSize, this.pageNumber, this.sortOrder, this.sortDirection, this.searchTerm);
  }

  sort(input: boolean, orderInput: string) {
    if (input == false) {
      this.sortDirection = "desending";
    } else {
      this.sortDirection = "assending";
    }
    this.sortOrder = orderInput;
    this.data(this.pageSize, this.pageNumber, this.sortOrder, this.sortDirection, this.searchTerm);
  }

  downloadFile(){
    this.user.downloadExcel().subscribe((res:any)=>
    {
      console.log(res);
      FileSaver.saveAs(res,'products.xlsx')
    })
  }

  Extractfile(){
    this.router.navigate(['exportFile']);
  }
}