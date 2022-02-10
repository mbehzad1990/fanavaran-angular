import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NotificationType } from 'src/shared/Domain/Enums/global-enums';
import { Unit } from 'src/shared/Domain/Models/_Unit/unit';
import { RegisterGoodVm } from 'src/shared/Domain/ViewModels/_Good/register-good-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-add-group-good',
  templateUrl: './add-group-good.component.html',
  styleUrls: ['./add-group-good.component.scss']
})
export class AddGroupGoodComponent implements OnInit,OnDestroy {
  //#region Private
  private subscriptions: Subscription[] = [];

  //#endregion

  //#region Public
  hidePassword = true;
  pageForm!: FormGroup;
  isFinishOperation!: boolean;
  isLoading$!: Observable<boolean>;
  
  isLoading = false;
  isOpen = false;
  
  isSetManualId: boolean = false;
  units: Unit[] = [];
  unit_selected!:Unit;

  listOfGood:RegisterGoodVm[]=[];
  dataSource = new MatTableDataSource<RegisterGoodVm>(this.listOfGood);
  displayedColumns: string[] = ['index', 'name', 'latinName', 'unitName','desc', 'delete'];
  //#endregion

  //#region Input & Output & Others
  //#endregion
  constructor(private _coreService:FacadService, private fb: FormBuilder,private router:Router) { 
    this.isLoading$=this._coreService.good.isLoading$;
  }

  ngOnInit(): void {
  }
  errorHandling(control: string, error: string) {
    return this._coreService.errorHandler.conrollerErrorHandler(
      control,
      error,
      this.pageForm
    );
  }
  openChanged(event: boolean) {
    this.isOpen = event;
    this.isLoading = event;
    if (event) {
      this.units = [];
      this.pageForm.get('unit')?.reset();
      this.getUnit();
    }
  }
  getUnit() {
    const sb = this._coreService.unit.items$.subscribe(obs => {
      this.units = obs;
      this.isLoading = false;
    })

    this.subscriptions.push(sb);
  }
  formElementInit() {
      this.pageForm = this.fb.group({
        name: ['', Validators.required],
        unit: ['', Validators.required],
        latinName: [''],
        manualId: [''],
        description: ['']
      });
  }
  deletItemFromList(deleteItem:RegisterGoodVm){
    const data = this.dataSource.data;
    const index: number = data.indexOf(deleteItem);
    if (index !== -1) {
      data.splice(index, 1);
      this.dataSource.data = data;
    }   
  }
  getItem(_item:RegisterGoodVm){
    let isExist=false;
    this.listOfGood.forEach(item=>{
      if(item.name==_item.name){
        isExist=true;
      }
    })
    if(!isExist){
      this.listOfGood.push(_item);
      this.dataSource.data= this.listOfGood;
    }else{
      this._coreService.notification.showNotiffication(NotificationType.Warning,'نام کالا تکراری است');
    }
  }
  getUnitName(unitId:number):string{
    let unitName='';
    const sb=this._coreService.unit.items$.subscribe(unit=>{
      unit.forEach(item=>{
        if(item.id==unitId){
          unitName=item.name;
        }
      })
    })
    this.subscriptions.push(sb);
    return unitName;
  }
  addGoods(){
    let goodList:RegisterGoodVm[]=[];
    this.dataSource.data.forEach(item=>{
      const model=new RegisterGoodVm();
      model.unitId=item.unitId;
      model.name=item.name;
      model.manualId=item.manualId;
      debugger
      if( item.latinName=="" || item.latinName==null){
        model.latinName='';

      }else{
        model.latinName=item.latinName;
      }
      if( item.description=="" || item.description==null){
        model.description='';

      }else{
        model.description=item.description;
      }
      goodList.push(model);
    })
    debugger
    const sb=this._coreService.good.addlist(goodList).subscribe(result => {
      if (result?.isSuccess) {
        this._coreService.notification.showNotiffication(
          NotificationType.Success,
          this._coreService.errorHandler.getErrorText(result?.resultAction)
        );
        this.router.navigate(['/good']);
      } else {
        this._coreService.notification.showNotiffication(
          NotificationType.Error,
          this._coreService.errorHandler.getErrorText(result?.resultAction!)
        );
      }
    });
    this.subscriptions.push(sb);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb=>sb.unsubscribe());
  }
}
