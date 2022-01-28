import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FacadService } from 'src/shared/Service/_Core/facad.service';
import { AddUserModalComponent } from '../add-user-modal/add-user-modal.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
 //#region Private field
 private subscriptions: Subscription[] = [];
 //#endregion

 //#region Public field
 //#endregion

 //#region Input & OutPut & Other
 //#endregion
  constructor(private dialog: MatDialog, public _coreService: FacadService) { }

  ngOnInit(): void {
  }

  addUser(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(AddUserModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // this.treeControl.expand(node);
    });
  }
}
