import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RequestModalDto } from 'src/shared/Domain/Dto/_Modal/request-modal-dto';
import { DeleteOperationType } from 'src/shared/Domain/Enums/global-enums';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent<T> implements OnInit , OnDestroy {

  private unsubscribe: Subscription[] = [];
  objectName: string = "";
  title: string = "";

  OperationType!: DeleteOperationType;
  Data: any;
  constructor(public dialogRef: MatDialogRef<DeleteModalComponent<T>>, private facadService: FacadService, @Inject(MAT_DIALOG_DATA) public data: RequestModalDto<T>) { }

  ngOnInit(): void {
    this.title = this.getTitleModal(this.data.delete_resource);
    this.objectName = this.data.delete_field_name;
  }
  getTitleModal(OperationType: DeleteOperationType): string {

    switch (OperationType) {
      case (DeleteOperationType.User):
        return "در صورت تمایل کاربر حذف می گردد.";
      case (DeleteOperationType.Stock):
        return "در صورت تمایل انبار حذف می گردد";
      case DeleteOperationType.Unit:
        return 'در صورت تمایل واحد اندازه گیری حذف می شود';
      case DeleteOperationType.Good:
        return 'در صورت تمایل کالا حذف می شود';
      case DeleteOperationType.Operation:
          return 'در صورت تمایل سند حذف می شود';
      // case (DeleteOperationType.Device):
      //   return "در صورت تایید دستگاه حذف می گردد.";
      // case DeleteOperationType.TargetSoftWare:
      //   return "در صورت تایید نرم افزار مقصد حذف می گردد.";
      // case DeleteOperationType.Part:
      //   return 'در صورت تایید بخش حذف می شود.';
    }
  }
  YesClick() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => { sb.unsubscribe() });
  }

}
