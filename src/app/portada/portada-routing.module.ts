import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonarComponent } from './component/donar/donar.component';
import { IndexComponent } from './component/index/index.component';

const routes: Routes = [
  {
    path: "",
    component: IndexComponent
  },
  {
    path: "index",
    component: IndexComponent
  },
  {
    path: "donar",
    component: DonarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortadaRoutingModule { }
