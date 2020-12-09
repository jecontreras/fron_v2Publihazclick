import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolAdminPublicComponent } from './tool-admin-public/tool-admin-public.component';
import { ToolsPublicacionComponent } from './tools-publicacion/tools-publicacion.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../theme/shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ToolAdminPublicComponent,
    ToolsPublicacionComponent,
    ComentariosComponent
  ],
  exports: [
    ToolAdminPublicComponent,
    ToolsPublicacionComponent,
    ComentariosComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    InfiniteScrollModule,
    AngularEditorModule,
    NgxCurrencyModule,
    NgxDropzoneModule,
  ]
})
export class ToolsModule { }
