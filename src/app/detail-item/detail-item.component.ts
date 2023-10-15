import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-detail-item',
  templateUrl: './detail-item.component.html',
  styleUrls: ['./detail-item.component.css']
})
export class DetailItemComponent {
  
  public item:any;

  constructor(
    private router: ActivatedRoute,
    private navRouter: Router, 
    private user: UserServiceService ){}

  ngOnInit(){
    let id = this.router.snapshot.paramMap.get('id');
    this.user.getById(id).subscribe(res=>{
      this.item = res;
    });
  }

  goBack(){
    this.navRouter.navigate(['showData']);
  }

}
