import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../Services/Notification.service';
import { Notification } from '../Modéles/Notification';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  isDropdownVisible = false;
  notification : Notification[] = []
  constructor(
    private router: Router,
    private notificationService : NotificationService,
  ) {

  }
  ngOnInit(): void {
    this.loadNotifications();

  }
    logout(){
      localStorage.removeItem("token")
      localStorage.removeItem("acessToken")
      this.router.navigate(['/login']);
    }
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
      console.log(this.isDropdownVisible)
    }
    loadNotifications() {
      this.notificationService.getNotificationsOfDay().subscribe({
        next: (res) => {
         this.notification = res

        },
      });
    }
    MakeNotificationToViews(id:any) {
      this.notificationService.MakeNotificationViewd(id).subscribe({
        next: (res:any) => {
          console.log("dhjdjdj")
          this.router.navigateByUrl("/dashboad/tasks");
          this.isDropdownVisible=false;
          this.loadNotifications()
        },
      });
    }


    
}
