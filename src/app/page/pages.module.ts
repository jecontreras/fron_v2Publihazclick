import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages/pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './component/home/home.component';
import { TableroComponent } from './component/tablero/tablero.component';
import { TareasComponent } from './component/tareas/tareas.component';
import { ReferidosComponent } from './component/referidos/referidos.component';
import { LiderComponent } from './component/lider/lider.component';
import { MisPublicacionComponent } from './component/mis-publicacion/mis-publicacion.component';
import { RetirosComponent } from './component/retiros/retiros.component';
import { BancosComponent } from './component/bancos/bancos.component';
import { PaqueteComponent } from './component/paquete/paquete.component';
import { PerfilComponent } from './component/perfil/perfil.component';
import { CategoriaComponent } from './component/categoria/categoria.component';
import { ServicioClienteComponent } from './component/servicio-cliente/servicio-cliente.component';
import { SharedModule } from '../theme/shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TareaMiniComponent } from './component/tarea-mini/tarea-mini.component';
import { TareaMegaComponent } from './component/tarea-mega/tarea-mega.component';
import { ViewPerfilComponent } from './component/view-perfil/view-perfil.component';
import { BannerComponent } from './component/banner/banner.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormpublicacionComponent } from './form/formpublicacion/formpublicacion.component';
import { FormbannerComponent } from './form/formbanner/formbanner.component';
import { FormretirosComponent } from './form/formretiros/formretiros.component';
import { FormbancosComponent } from './form/formbancos/formbancos.component';
import { NgxCurrencyModule } from "ngx-currency";
import { AdminMarketplaceComponent } from './component/admin-marketplace/admin-marketplace.component';
import { FormadminMarketplaceComponent } from './form/formadmin-marketplace/formadmin-marketplace.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgApexchartsModule } from "ng-apexcharts";
import { ToolsModule } from '../tools/tools.module';
import { AmigosComponent } from './component/amigos/amigos.component';
import { TestimoniodshComponent } from './component/testimoniodsh/testimoniodsh.component';
import { ChatComponent } from './component/chat/chat.component';
import { MarcasAnunciantesComponent } from './admin/marcas-anunciantes/marcas-anunciantes.component';
import { FormmarcasAnunciantesComponent } from './admin/formmarcas-anunciantes/formmarcas-anunciantes.component';
import { ActivacionPaqueteComponent } from './admin/activacion-paquete/activacion-paquete.component';
import { AdminusuarioComponent } from './admin/adminusuario/adminusuario.component';
import { AdmintestimoniosComponent } from './admin/admintestimonios/admintestimonios.component';
import { AdminPuntosComponent } from './admin/admin-puntos/admin-puntos.component';
import { ProyectosDonacionesComponent } from './component/proyectos-donaciones/proyectos-donaciones.component';
import { AdminretirosComponent } from './admin/adminretiros/adminretiros.component';
import { AdminactividadComponent } from './admin/adminactividad/adminactividad.component';

@NgModule({
  declarations: [ 
    PagesComponent, 
    HomeComponent, 
    TableroComponent, 
    TareasComponent, 
    ReferidosComponent, 
    LiderComponent, 
    MisPublicacionComponent, 
    RetirosComponent, 
    BancosComponent, 
    PaqueteComponent, 
    PerfilComponent, 
    CategoriaComponent, 
    ServicioClienteComponent, 
    TareaMiniComponent, 
    TareaMegaComponent, 
    ViewPerfilComponent, 
    BannerComponent, 
    FormpublicacionComponent, FormbannerComponent, FormretirosComponent, FormbancosComponent, AdminMarketplaceComponent, FormadminMarketplaceComponent, AmigosComponent, TestimoniodshComponent, ChatComponent, MarcasAnunciantesComponent, FormmarcasAnunciantesComponent, ActivacionPaqueteComponent, AdminusuarioComponent, AdmintestimoniosComponent, AdminPuntosComponent, ProyectosDonacionesComponent, AdminretirosComponent, AdminactividadComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    InfiniteScrollModule,
    AngularEditorModule,
    NgxCurrencyModule,
    NgxDropzoneModule,
    NgApexchartsModule,
    ToolsModule
  ],
  bootstrap: [ PagesComponent ]
})
export class PagesModule { }
