import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicoRoutingModule } from './publico-routing.module';
import { PublicacionviewsComponent } from './component/publicacionviews/publicacionviews.component';
import { FormsModule } from '@angular/forms';
import { MarkeplaceComponent } from './component/markeplace/markeplace.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { ProductosViewComponent } from './component/producto-view/producto-view.component';
import { ProductosComponent } from './component/productos/productos.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ProgressComponent } from './component/progress/progress.component';
import { PublicidadComponent } from './component/publicidad/publicidad.component';
import { ToolsModule } from '../tools/tools.module';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
  declarations: [
    PublicacionviewsComponent,
    MarkeplaceComponent,
    ProductosViewComponent,
    ProductosComponent,
    ProgressComponent,
    PublicidadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PublicoRoutingModule,
    NgImageSliderModule,
    InfiniteScrollModule,
    ToolsModule,
    NgxCurrencyModule,
  ]
})
export class PublicoModule { }
