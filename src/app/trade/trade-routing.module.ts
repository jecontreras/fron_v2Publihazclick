import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortalComponent } from './component/portal/portal.component';
import { DetailCryptocurrencyComponent } from './component/detail-cryptocurrency/detail-cryptocurrency.component';

const routes: Routes = [
  {
    path: "",
    component: PortalComponent
  },
  {
    path: "portal",
    component: PortalComponent
  },
  {
    path: "detailcryptocurrency",
    component: DetailCryptocurrencyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradeRoutingModule { }
