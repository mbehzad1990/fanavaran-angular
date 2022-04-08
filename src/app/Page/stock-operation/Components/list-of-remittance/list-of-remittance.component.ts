import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'jalali-moment';
import { Observable, Subscription } from 'rxjs';
import { blub, fadeOut } from 'src/shared/Adnimation/template.animations';
import { DeleteModalComponent } from 'src/shared/components/Modals/delete-modal/delete-modal.component';
import { RequestModalDto } from 'src/shared/Domain/Dto/_Modal/request-modal-dto';
import { EditRemittanceDto } from 'src/shared/Domain/Dto/_Operation/edit-remittance-dto';
import { ActionType, DeleteOperationType, NotificationType, serachRemittanceController, StockOperationType } from 'src/shared/Domain/Enums/global-enums';
import { ReportOperationVm } from 'src/shared/Domain/ViewModels/_Operation/report-operation-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';
import { RemittanceDetailsModalComponent } from './remittance-details-modal/remittance-details-modal.component';

@Component({
  selector: 'app-list-of-remittance',
  templateUrl: './list-of-remittance.component.html',
  styleUrls: ['./list-of-remittance.component.scss'],
  animations: [fadeOut, blub,
    trigger('rowAnimation', [
      transition('* => *', [
        // this hides everything right away
        query(':enter', style({ opacity: 0 })),

        // starts to animate things with a stagger in between
        // query(':enter', stagger('100ms', [
        //   animate('1s', style({ opacity: 1 }))
        // ]))
        query(':enter', animate('1s', style({ opacity: 1 }))

        )
      ])
    ]),
    trigger("listAnimation", [
      transition("* => *", [
        // each time the binding value changes
        // query(
        //   ":leave",
        //   [stagger(100, [animate("0.5s", style({ opacity: 0 }))])],
        //   { optional: true }
        // ),
        query(
          ":enter",
          [
            style({ opacity: 0 }),
            stagger(100, [animate("0.5s", style({ opacity: 1 }))])
          ],
          { optional: true }
        )
      ])
    ]),
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0)', opacity: 1, 'overflow-x': 'hidden' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]
    ),
    trigger('slideIn', [
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition('* => void', [
        style({ height: '*' }),
        animate(250, style({ height: 0 }))
      ]),
      transition('void => *', [
        style({ height: '0' }),
        animate(250, style({ height: '*' }))
      ])
    ])
  ],
})
export class ListOfRemittanceComponent implements OnInit, OnDestroy {
  //#region Private field
  private subscriptions: Subscription[] = [];
  editrow = false;
  private numberChars = new RegExp("[^0-9]", "g")
  //#endregion

  //#region Public field
  nameFilter = new FormControl();


  txtfilter = new FormControl();
  currentRow = -1;
  //dataSource = new MatTableDataSource<ReportOperationVm>();
  // dataSource!: MatTableDataSource<ReportOperationVm>;
  dataSource = new MatTableDataSource<ReportOperationVm>();
  tempdata: ReportOperationVm[] = [];
  displayedColumns: string[] = ['index', 'id', 'personName', 'stockName', 'remittenceType', 'date','refId', 'desc', 'menu'];

  isLoading$!: Observable<boolean>;

  toggleFilters = true;
  filtersModel = [];
  resultsLength = 0;

  searchControl!: serachRemittanceController;
  search_control = serachRemittanceController;
  searchFiled: string = '';
  isSearchButonShow: boolean = false;
  searchType: string = 'all';
  //#endregion

  //#region Input & OutPut & Other

  //#endregion
  constructor(private _coreService: FacadService, private dialog: MatDialog, private rout: Router) {
    this.isLoading$ = this._coreService.Operation.isLoading$;
  }


  ngOnInit(): void {
    this.getData();
    this.contollSearchControl(this.searchType);
  }

  getData() {
    const sb = this._coreService.Operation.ListOfOperation().subscribe(result => {
      if (result?.isSuccess) {
        this.dataLoad();
      }else{
        this.dataSource.data = [];
      }
    });
    this.subscriptions.push(sb);
  }
  dataLoad() {
    const sb = this._coreService.Operation.operationlist$.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();


  }
  resetDataSource(flag: boolean) {

  }
  searchColumns() {
    console.log(this.filtersModel);
    //Call API with filters
  }
  getOperationType(type: StockOperationType): string {
    switch (type) {
      case StockOperationType.Buy:
        return 'خرید';
      case StockOperationType.Sell:
        return 'فروش';
      case StockOperationType.ReBuy:
        return 'برگشت خرید';

      case StockOperationType.ReSell:
        return 'برگشت فروش';

      case StockOperationType.Damage:
        return 'ضایعات';
    }
  }
  radioChange($event: MatRadioChange) {
    console.log($event.source.name, $event.value);
    this.contollSearchControl($event.value);
  }
  contollSearchControl(value: string) {
    this.isSearchButonShow = true;
    switch (value) {
      case 'id':
      case 'bachNumber':
      case 'personName':
      case 'stockName':
      case 'all':
        this.searchControl = serachRemittanceController.isTextBoxShow;

        break;
      case 'remittenceType':
        this.searchControl = serachRemittanceController.isDropDownShow;

        break;
      case 'date':
        this.searchControl = serachRemittanceController.isDateBoxShow;
        break;
      default:
        this.searchControl = serachRemittanceController.isTextBoxShow;
        break;
    }
  }
  getShamsi(strDate: Date): string {

    const m = moment(strDate, 'jYYYY/jM/jD');
    return moment(m.format('jYYYY/jM/jD')).format("jYYYY/jMM/jDD");
  }
  getDetails(item: ReportOperationVm) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const modal_data = new RequestModalDto<number>();
    modal_data.action = ActionType.ShowDetails;
    modal_data.data = item.id;

    dialogConfig.data = modal_data;

    const dialogRef = this.dialog.open(RemittanceDetailsModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // this.treeControl.expand(node);
    });
  }
  delete(item: ReportOperationVm) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;

    const delete_data: RequestModalDto<number> = new RequestModalDto<number>();
    delete_data.delete_field_name = 'حواله ' + item.id;
    delete_data.delete_resource = DeleteOperationType.Operation;

    dialogConfig.data = delete_data
    dialogConfig.direction = "rtl";
    const dialogRef = this.dialog.open(DeleteModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result) {
        const sb = this._coreService.Operation.delete(item.id).subscribe(result => {
          debugger
          if (result?.isSuccess) {
            this.getData();
          } else {
            this._coreService.notification.showNotiffication(NotificationType.Error, this._coreService.errorHandler.getErrorText(result?.resultAction!));
          }
        })
        this.subscriptions.push(sb);
      }
    });

  }
  edit(item: ReportOperationVm) {
    this.rout.navigate(['/remittance/remittance-edit'], { state: {data:item} });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
