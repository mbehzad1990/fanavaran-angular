import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { AddEditUnitModalComponent } from 'src/shared/components/Modals/_Unit/add-edit-unit-modal/add-edit-unit-modal.component';
import { RequestModalDto } from 'src/shared/Domain/Dto/_Modal/request-modal-dto';
import { ActionType } from 'src/shared/Domain/Enums/global-enums';
import { Unit } from 'src/shared/Domain/Models/_Unit/unit';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss']
})
export class UnitListComponent implements OnInit ,OnDestroy {
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
    
    const modal_data=new RequestModalDto<Unit>(); 
    modal_data.action=ActionType.Add;
    dialogConfig.data=modal_data;

    const dialogRef = this.dialog.open(AddEditUnitModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb=>sb.unsubscribe());
  }
}
