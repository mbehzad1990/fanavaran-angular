import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { AddEditGoodModalComponent } from 'src/shared/components/Modals/_Good/add-edit-good-modal/add-edit-good-modal.component';
import { RequestModalDto } from 'src/shared/Domain/Dto/_Modal/request-modal-dto';
import { ActionType } from 'src/shared/Domain/Enums/global-enums';
import { GoodDetailsVm } from 'src/shared/Domain/ViewModels/_Good/good-details-vm';

@Component({
  selector: 'app-good-list',
  templateUrl: './good-list.component.html',
  styleUrls: ['./good-list.component.scss']
})
export class GoodListComponent implements OnInit ,OnDestroy {
  //#region Private field
  private subscriptions: Subscription[] = [];
  //#endregion
 
  //#region Public field
  currentRow = -1;
  isHover:boolean=false;
 
 
  isLoading$!: Observable<boolean>;
  rowIndex!: number;
  //#endregion
 
  //#region Input & OutPut & Other
  //#endregion
  
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }
  add(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    
    const modal_data=new RequestModalDto<GoodDetailsVm>(); 
    modal_data.action=ActionType.Add;
    dialogConfig.data=modal_data;

    const dialogRef = this.dialog.open(AddEditGoodModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb=>sb.unsubscribe());
  }
}
