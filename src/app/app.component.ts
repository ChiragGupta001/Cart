import { Component, OnInit } from '@angular/core';
import { AccountServiceService } from './services/account-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from './services/user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AccountServiceService]
})
export class AppComponent implements OnInit {
  constructor(
    private account: AccountServiceService,
    private router: Router,
    private userservice: UserServiceService,
  ) { }

  ngOnInit() {
    this.account.loger.subscribe(res => {
      this.loger = res
    });
    this.account.Profile.subscribe(res => {
      this.Profile = res;
    });

    this.logged = this.account.isLoggedIn();

    if (this.logged) {
      this.account.loger.next(true);
      this.account.GetProfile().subscribe((res) => {
        this.user = res;
        this.account.Profile.next(this.user['profilePic']);
      });
      this.router.navigate(['showData']);
    }
    else {
      this.router.navigate(['login']);
    }
  }

  public logged: any;
  public log: any;
  loger!: boolean;
  Profile!: string;
  Id!: any;
  user: any;

  logOut() {
    this.account.logOut();
    this.router.navigate(['login']);
  }

  EditUser() {
    this.router.navigate(['editProfile']);
  }
}