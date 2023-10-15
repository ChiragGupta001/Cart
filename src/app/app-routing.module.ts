import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import { ShowDataComponent} from './show-data/show-data.component';
import { AuthGuard } from './authService/auth.guard';
import {SignUpComponent} from './sign-up/sign-up.component';
import {AddItemComponent} from './add-item/add-item.component';
import {EditItemComponent} from './edit-item/edit-item.component';
import { DeleteComponent } from './delete/delete.component';
import { ErrorComponent } from './error/error.component';
import { DetailItemComponent } from './detail-item/detail-item.component';
import { AppComponent } from './app.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ExportFileComponent } from './export-file/export-file.component';

const routes: Routes = [
  {path: "app",component:AppComponent},
  {path: "login", component:LoginComponent},
  {path: "signup", component:SignUpComponent},
  {path: "editProfile", component:EditProfileComponent},
  {path: "showData", component:ShowDataComponent, canActivate:[AuthGuard]},
  {path: "showData/addItem", component:AddItemComponent, canActivate:[AuthGuard]},
  {path: "edit/:id", component:EditItemComponent, canActivate:[AuthGuard]},
  {path: "delete/:id", component:DeleteComponent, canActivate:[AuthGuard]},
  {path: "detail/:id", component:DetailItemComponent, canActivate:[AuthGuard]},
  {path: "exportFile", component:ExportFileComponent,canActivate:[AuthGuard]},
  {path: "**", component:ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
export const routingComponent = [LoginComponent, ShowDataComponent, SignUpComponent, EditItemComponent, DeleteComponent, ErrorComponent]