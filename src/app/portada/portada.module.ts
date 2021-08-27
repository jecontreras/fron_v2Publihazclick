import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './component/index/index.component';
import { PortadaRoutingModule } from './portada-routing.module';
import { DonarComponent } from './component/donar/donar.component';
import { ToolsModule } from '../tools/tools.module';



@NgModule({
  declarations: [
    IndexComponent,
    DonarComponent
  ],
  imports: [
    ToolsModule,
    CommonModule,
    PortadaRoutingModule,
  ]
})
export class PortadaModule { }
