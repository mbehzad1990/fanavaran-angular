import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/shared/Project_Config/auth.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./Page/auth/auth.module').then(m => m.AuthModule) },
  { path: '', loadChildren: () => import('./Page/panel/panel.module').then(m => m.PanelModule) ,canActivate:[AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
