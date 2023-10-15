import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { AppRoutingModule, routingComponent } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AddItemComponent } from './add-item/add-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { DeleteComponent } from './delete/delete.component';
import { ErrorComponent } from './error/error.component';
import { DetailItemComponent } from './detail-item/detail-item.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserServiceService } from './services/user-service.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ExportFileComponent } from './export-file/export-file.component';
// import { FileUploadModule } from 'primeng/fileupload';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    routingComponent,
    AddItemComponent,
    EditItemComponent,
    DeleteComponent,
    ErrorComponent,
    DetailItemComponent,
    EditProfileComponent,
    ExportFileComponent,
    // FileUploadModule
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    TableModule,
    ButtonModule,
    BrowserAnimationsModule,
    CardModule,
    ToastModule,
    RippleModule,
    DialogModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    ImageCropperModule
  ],
  providers: [MessageService,ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
