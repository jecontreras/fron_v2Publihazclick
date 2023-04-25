import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradeRoutingModule } from './trade-routing.module';
import { NgImageSliderModule } from 'ng-image-slider';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ToolsModule } from '../tools/tools.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { FormsModule } from '@angular/forms';
import { PortalComponent } from './component/portal/portal.component';
import { CardModule } from '../theme/shared/components';



@NgModule({
  declarations: [
    PortalComponent
  ],
  imports: [
    CommonModule,
    TradeRoutingModule,
    FormsModule,
    NgImageSliderModule,
    InfiniteScrollModule,
    ToolsModule,
    NgxCurrencyModule,
    CommonModule,
    CardModule
  ]
})
export class TradeModule { }
