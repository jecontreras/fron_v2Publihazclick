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



@NgModule({
  declarations: [
    IndexComponent,
    DonarComponent,
    ComunidadComponent,
    TestimoniosComponent,
    MenusComponent
  ],
  imports: [
    ToolsModule,
    CommonModule,
    PortadaRoutingModule,
    NgxCurrencyModule,
    NgxDropzoneModule,
    FormsModule
  ]
})
export class PortadaModule { }
