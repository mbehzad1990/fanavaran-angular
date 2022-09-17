import { Direction } from '@angular/cdk/bidi';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit,OnDestroy {

  isExpanded: boolean = true;
  titleComponenet: string | any = "";
  direction: Direction = 'rtl';
  condition!: Observable<boolean>;
  Reinitprop: boolean = true;
  private subscriptions: Subscription[] = [];

  constructor(private _coreService:FacadService) {
    this._coreService.appConfig.loadConfig();
   }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb=>sb.unsubscribe());
  }

  ngOnInit(): void {
  }

  
  public changeLang(en: boolean) {
    // this.Reinit();
  }
}
