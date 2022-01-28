import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from 'src/app/panel/_theme/error-page/error-page.component';
import { AddGroupGoodComponent } from './Components/add-group-good/add-group-good.component';
import { GoodListComponent } from './Components/good-list/good-list.component';

const routes: Routes = [
  { path: '', component: GoodListComponent },
  { path: 'good', component: GoodListComponent},
  { path: 'add-good-groups', component: AddGroupGoodComponent },
  { path: '**', component: ErrorPageComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodRoutingModule { }
