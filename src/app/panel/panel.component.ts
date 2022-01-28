import { Direction } from '@angular/cdk/bidi';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

  isExpanded: boolean = true;
  titleComponenet: string | any = "";
  direction: Direction = 'rtl';
  condition!: Observable<boolean>;
  Reinitprop: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

  
  public changeLang(en: boolean) {
    // this.Reinit();
  }
}
