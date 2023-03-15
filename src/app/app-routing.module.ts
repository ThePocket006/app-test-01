import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppStarterComponent } from './app-starter/app-starter.component';
import { DataResolver } from './app-starter/data.resolver';

const routes: Routes = [
  {path: '', component: AppStarterComponent, resolve: {data: DataResolver}},
  {path: 'app', redirectTo:''},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
