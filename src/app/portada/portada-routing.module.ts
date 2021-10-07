import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComunidadComponent } from './component/comunidad/comunidad.component';
import { DonarComponent } from './component/donar/donar.component';
import { IndexComponent } from './component/index/index.component';
import { MarcasComponent } from './component/marcas/marcas.component';
import { PautasComponent } from './component/pautas/pautas.component';
import { PublihazclickComponent } from './component/publihazclick/publihazclick.component';
import { TestimoniosComponent } from './component/testimonios/testimonios.component';

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
  },
  {
    path: "comunidad",
    component: ComunidadComponent
  },
  {
    path: "testimonio",
    component: TestimoniosComponent
  },
  {
    path: "marcas",
    component: MarcasComponent
  },
  {
    path: "publihazclick",
    component: PublihazclickComponent
  },
  {
    path: "pautas",
    component: PautasComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortadaRoutingModule { }
