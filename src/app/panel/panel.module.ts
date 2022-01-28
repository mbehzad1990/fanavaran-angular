import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelRoutingModule } from './panel-routing.module';
import { PanelComponent } from './panel.component';
import { ErrorPageComponent } from './_theme/error-page/error-page.component';
import { SideNavComponent } from './_theme/side-nav/side-nav.component';
import { ToolbarComponent } from './_theme/toolbar/toolbar.component';
import { SharedModule } from 'src/shared/shared.module';


@NgModule({
  declarations: [
    PanelComponent,
    ErrorPageComponent,
    SideNavComponent,
    ToolbarComponent
  ],
  imports: [
    CommonModule,
    PanelRoutingModule,
    SharedModule
  ]
})
export class PanelModule { }
