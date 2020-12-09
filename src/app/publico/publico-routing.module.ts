import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicacionviewsComponent } from './component/publicacionviews/publicacionviews.component';
import { MarkeplaceComponent } from './component/markeplace/markeplace.component';
import { ProductosComponent } from './component/productos/productos.component';
import { ProductosViewComponent } from './component/producto-view/producto-view.component';
import { PublicidadComponent } from './component/publicidad/publicidad.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: "",
        component: PublicacionviewsComponent
      },
      {
        path: "markeplace",
        component: MarkeplaceComponent
      },
      {
        path: "productos",
        component: ProductosComponent
      },
      {
        path: "productosView/:id",
        component: ProductosViewComponent
      },
      {
        path: "publicidad",
        component: PublicidadComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicoRoutingModule { }
