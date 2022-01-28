import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from 'src/app/panel/_theme/error-page/error-page.component';
import { StockListComponent } from './Components/stock-list/stock-list.component';

const routes: Routes = [
  { path: '', component: StockListComponent },
  { path: '**', component: ErrorPageComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
