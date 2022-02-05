import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { blub, fadeOut } from 'src/shared/Adnimation/template.animations';
import { DeleteModalComponent } from 'src/shared/components/Modals/delete-modal/delete-modal.component';
import { RequestModalDto } from 'src/shared/Domain/Dto/_Modal/request-modal-dto';
import { DeleteOperationType, NotificationType } from 'src/shared/Domain/Enums/global-enums';
import { User } from 'src/shared/Domain/Models/_User/user';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
  animations: [fadeOut, blub]
})
export class UserTableComponent implements OnInit,OnDestroy {
  //#region Private field
  private subscriptions: Subscription[] = [];
  //#endregion

  //#region Public field
  currentRow = -1;
  dataSource = new MatTableDataSource<User>();
  isHover:boolean=false;

  displayedColumns: string[] = ['index', 'id', 'name', 'username', 'email','delete'];


  isLoading$!: Observable<boolean>;
  rowIndex!: number;
  //#endregion

  //#region Input & OutPut & Other
  //#endregion
  constructor(private _coreService:FacadService ,private dialog: MatDialog) { 
    this.isLoading$=this._coreService.user.isLoading$;
  }


  ngOnInit(): void {
    this.getData();
  }

  getData(){
    const sb=this._coreService.user.user$.subscribe(users=>{
      this.dataSource.data=users;
    });
    this.subscriptions.push(sb);
  }
  deleteUser(user:User){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;

    const delete_data: RequestModalDto<number> = new RequestModalDto<number>();
    delete_data.delete_field_name = user.fullName;
    delete_data.delete_resource = DeleteOperationType.User;

    dialogConfig.data = delete_data
    dialogConfig.direction = "rtl";
    const dialogRef = this.dialog.open(DeleteModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result) {
        const sb=this._coreService.user.deleteUser(user.id).subscribe(result=>{
          if(result?.isSuccess){
            const actionText=this._coreService.errorHandler.getErrorText(result.resultAction);
            this._coreService.notification.showNotiffication(NotificationType.Success,actionText);
          }else{
    
          }
        });
        this.subscriptions.push(sb);
      }
    });

  }
  clickTest(){
    
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb=>sb.unsubscribe());
  }
}
