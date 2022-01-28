import { Direction } from '@angular/cdk/bidi';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
 //#region private field
  //#endregion

  //#region public field
  direction: Direction = 'rtl';
  isCon!: boolean;
  condition!: Observable<boolean>;
  isOpen: boolean = true;
  weekdaysss!: string;
  //#endregion

  //#region Input & OutPut & Other
  @Output() isExpand = new EventEmitter<boolean>();
  @Output() enlang = new EventEmitter<boolean>();
  @Input() inputSideNav!: MatSidenav;

  @ViewChild('inputSideNav', { static: true, read: MatSidenav })
  sidenav!: MatSidenav;
  //#endregion
  constructor(private _coreService: FacadService) {}

  ngOnInit(): void {
    var d = new Date();

    this.weekdaysss = this._coreService.persianCalender.PersianCalendar(d);
  }
  changeLangage(lang: string) {}
  changeNavSize(): void {
    this.isOpen = !this.isOpen;
    this.isExpand.emit(this.isOpen);
  }
  logout() {
    this._coreService.auth.logOut();
  }
}
