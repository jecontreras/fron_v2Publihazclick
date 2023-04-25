import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TradeComponent } from './component/trade/trade.component';

const routes: Routes = [
  {
    path: "trade",
    component: TradeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class TradeRoutingModule { }
