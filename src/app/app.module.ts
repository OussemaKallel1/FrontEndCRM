import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenusidebarComponent } from './menusidebar/menusidebar.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { GestionClientsComponent } from './Contacts/gestion-clients.component';
import { AddClientDialogComponent } from './add-client-dialog/add-client-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ProspectsComponent } from './prospects/prospects.component';
import { AddProspectDialogComponent } from './add-prospect-dialog/add-prospect-dialog.component';

import { MatSelectModule } from '@angular/material/select';
import { NgToastModule } from 'ng-angular-popup';
import { GestionTaskComponent } from './Tasks/gestion-task/gestion-task.component';
import { authGuard } from './token/auth.guard';
import { TokenInterceptorService } from './token/token-interceptor.service';
import { DashbordComponent } from './dashbord/dashbord.component';
import { AddTaskDialogComponent } from './Tasks/add-task-dialog/add-task-dialog.component';
import { StatisticComponent } from './statistic/statistic.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { CalendrierComponent } from './calendrier/calendrier.component';
import { DayService, MonthAgendaService, MonthService, RecurrenceEditorModule, ScheduleModule, WeekService, WorkWeekService } from '@syncfusion/ej2-angular-schedule';
import { PermissionComponent } from './permission/permission.component';
import { AddPermissionDialogComponent } from './add-permission-dialog/add-permission-dialog.component';
import { GestionRolesComponent } from './role/gestion-roles/gestion-roles.component';
import { AddRoleDialogComponent } from './role/add-role-dialog/add-role-dialog.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrModule } from 'ngx-toastr';




@NgModule({
  declarations: [
    AppComponent,
    AuthentificationComponent,
    MenusidebarComponent,
    NavBarComponent,
    FooterComponent,
    GestionClientsComponent,
    AddClientDialogComponent,
    ProspectsComponent,
    AddProspectDialogComponent,
    GestionTaskComponent,
    DashbordComponent,
    AddTaskDialogComponent,
    StatisticComponent,
    CalendrierComponent,
    PermissionComponent,
    AddPermissionDialogComponent,
    GestionRolesComponent,
    AddRoleDialogComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatSelectModule,
    NgToastModule,
    GoogleChartsModule,RecurrenceEditorModule,ScheduleModule,FullCalendarModule,
    MatTabsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: true


    }),



  ],
  
  providers: [authGuard,{
    provide: HTTP_INTERCEPTORS,
    useClass :TokenInterceptorService,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

