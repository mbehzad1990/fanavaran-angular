import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { DeleteModalComponent } from 'src/shared/components/Modals/delete-modal/delete-modal.component';
import { AddEditGoodModalComponent } from 'src/shared/components/Modals/_Good/add-edit-good-modal/add-edit-good-modal.component';
import { RequestModalDto } from 'src/shared/Domain/Dto/_Modal/request-modal-dto';
import { ActionType, DeleteOperationType, NotificationType } from 'src/shared/Domain/Enums/global-enums';
import { DeleteGoodVm } from 'src/shared/Domain/ViewModels/_Good/delete-good-vm';
import { GoodDetailsVm } from 'src/shared/Domain/ViewModels/_Good/good-details-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-good-table',
  templateUrl: './good-table.component.html',
  styleUrls: ['./good-table.component.scss']
})
export class GoodTableComponent implements OnInit, OnDestroy {
  //#region Private field
  private subscriptions: Subscription[] = [];
  //#endregion

  //#region Public field
  currentRow = -1;
  dataSource = new MatTableDataSource<GoodDetailsVm>();
  isHover: boolean = false;

  displayedColumns: string[] = ['index', 'id', 'manualId', 'name', 'latinName', 'unitName', 'unitId', 'desc', 'menu'];


  isLoading$!: Observable<boolean>;
  rowIndex!: number;
  //#endregion

  //#region Input & OutPut & Other
  //#endregion
  constructor(private _coreService: FacadService, private dialog: MatDialog) {
    this.isLoading$ = this._coreService.stock.isLoading$;
  }
  ngOnInit(): void {
    this.getData();
  }

  delete(row: GoodDetailsVm) {
    var deletModel = new DeleteGoodVm();
    deletModel.goodId = row.id;
    deletModel.manualId = row.manualId;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;

    const delete_data: RequestModalDto<number> = new RequestModalDto<number>();
    delete_data.delete_field_name = row.name;
    delete_data.delete_resource = DeleteOperationType.Good;

    dialogConfig.data = delete_data
    dialogConfig.direction = "rtl";
    const dialogRef = this.dialog.open(DeleteModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result) {
        const sb = this._coreService.good.delete(deletModel).subscribe(result => {
          if (result?.isSuccess) {
            const actionText = this._coreService.errorHandler.getErrorText(result.resultAction);
            this._coreService.notification.showNotiffication(NotificationType.Success, actionText);
          } else {
            const actionText = this._coreService.errorHandler.getErrorText(result!.resultAction);
            this._coreService.notification.showNotiffication(NotificationType.Warning, actionText);
          }
        });
        this.subscriptions.push(sb);
      }
    });
  }
  edit(row: GoodDetailsVm) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const modal_data = new RequestModalDto<GoodDetailsVm>();
    modal_data.action = ActionType.Update;
    modal_data.data = row;

    dialogConfig.data = modal_data;

    const dialogRef = this.dialog.open(AddEditGoodModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // this.treeControl.expand(node);
    });
  }

  getData() {
    const sb = this._coreService.good.items$.subscribe(data => {
      this.dataSource.data = data;
    });
  }



  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }


}
