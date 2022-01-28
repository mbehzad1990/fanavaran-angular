import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationType } from 'src/shared/Domain/Enums/global-enums';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toaster: ToastrService) {}

  showNotiffication(notifType: NotificationType,notifMessage:string) {
    switch (notifType) {
      case NotificationType.Success:
        this.successNotif(notifMessage);
        break;
      case NotificationType.Error:
        this.errorNotif(notifMessage);
        break;
      case NotificationType.Warning:
        this.warningNotif(notifMessage);
        break;
    }
  }

 private successNotif(notifMessage:string){
    this.toaster.success(notifMessage,'پیام سیستم');
  }
  private errorNotif(notifMessage:string){
    this.toaster.error(notifMessage,'پیام سیستم');
  }
  private warningNotif(notifMessage:string){
    this.toaster.warning(notifMessage,'پیام سیستم');
  }
}
