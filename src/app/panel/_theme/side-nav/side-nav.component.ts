import { Component, Input, OnInit } from '@angular/core';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  //#region private
  //#endregion

  //#region public
  user_name!:string|undefined;
  user_username!:string;
  //#endregion

  //#region Input & OutPut & Other
  //#endregion
  constructor(private _coreService:FacadService) { }
  @Input() isOpen!: boolean;
  ngOnInit(): void {
    const userDetail=this._coreService.auth.getUserDetail();
    this.user_name=userDetail?.name;
    
  }

}
