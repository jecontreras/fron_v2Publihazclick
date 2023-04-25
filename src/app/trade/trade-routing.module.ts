import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortalComponent } from './component/portal/portal.component';

const routes: Routes = [
  {
    path: "",
    component: PortalComponent
  },
  {
    path: "portal",
    component: PortalComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradeRoutingModule { }
