import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit,OnDestroy {

  //#region Public field
  class_name: string = '';
  //#endregion

  //#region Private field
  //#endregion

  //#region Input & Output
  @Input() isLoading$!: Observable<boolean>;
  //#endregion
  constructor(private spinner: NgxSpinnerService) { }
  ngOnDestroy(): void {
    this.spinner.hide();
  }

  ngOnInit(): void {
    this.spinner.show();
  }

}
