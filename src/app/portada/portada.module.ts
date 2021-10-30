import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './component/index/index.component';
import { PortadaRoutingModule } from './portada-routing.module';
import { DonarComponent } from './component/donar/donar.component';
import { ToolsModule } from '../tools/tools.module';
import { ComunidadComponent } from './component/comunidad/comunidad.component';
import { TestimoniosComponent } from './component/testimonios/testimonios.component';
import { MenusComponent } from './component/menus/menus.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule } from '@angular/forms';
import { MarcasComponent } from './component/marcas/marcas.component';
import { PublihazclickComponent } from './component/publihazclick/publihazclick.component';
import { PautasComponent } from './component/pautas/pautas.component';
import { NgImageSliderModule } from 'ng-image-slider';



@NgModule({
  declarations: [
    IndexComponent,
    DonarComponent,
    ComunidadComponent,
    TestimoniosComponent,
    MenusComponent,
    MarcasComponent,
    PublihazclickComponent,
    PautasComponent
  ],
  imports: [
    ToolsModule,
    CommonModule,
    PortadaRoutingModule,
    NgxCurrencyModule,
    NgxDropzoneModule,
    NgImageSliderModule,
    FormsModule
  ]
})
export class PortadaModule { }
