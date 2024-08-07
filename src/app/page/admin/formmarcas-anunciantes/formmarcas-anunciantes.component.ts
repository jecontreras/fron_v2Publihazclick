import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { PublicacionService } from 'src/app/servicesComponents/publicacion.service';
import { UserPaqueteService } from 'src/app/servicesComponents/user-paquete.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-formmarcas-anunciantes',
  templateUrl: './formmarcas-anunciantes.component.html',
  styleUrls: ['./formmarcas-anunciantes.component.scss']
})
export class FormmarcasAnunciantesComponent implements OnInit {
  
  editorConfig: any;
  data: any = {};
  file: any = {
    foto1: []
  };
  btnDisabled: boolean = false;
  titulo: string = "Creacion";
  dataUser: any = {};
  id: string;
  disableFile:boolean = false;

  constructor(
    private _archivo: ArchivosService,
    private _publicacion: PublicacionService,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
    private activate: ActivatedRoute,
    private Router: Router,
    private _userPaquete: UserPaqueteService
  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if (!store) return false;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() {
    this.id = (this.activate.snapshot.paramMap.get('id'));
    //console.log(this.id);
    if (this.id) { this.titulo = "Editar"; this.getPublicacion() }
  }

  getPublicacion() {
    this._publicacion.get({ where: { id: this.id } }).subscribe((res: any) => {
      res = res.data[0];
      this.procesoEdit(res);
    }, error => { this._tools.tooast({ title: "Error de servidor", icon: "error" }); })
  }

  procesoEdit(res: any) {
    //console.log(res);
    this.data = res;
  }

  async datafiles(ev: any) {
    //console.log( ev, this.file );
    try {
      this.file.foto1 = ev.target.files;
      if (this.file.foto1[0]) {
        if (this.data.type == "url") this.data.imgdefault = await this._archivo.getBase64(this.file.foto1[0]);
        else {
          this.data.imgdefault = await this._archivo.getBase64(this.file.foto1[0]);
        }
      }
    } catch (error) { }
  }

  async submitFile() {
    if( !this.file.foto1[0] ) return false;
    this.disableFile = true;
    if (this.data.type == "url") await this.procesoSubidaImagen(this.file.foto1[0], 'imgdefault');
    else await this.procesoSubidaImagen( this.file.foto1[0], 'content');
    this.disableFile = false;
  }

  procesoSubidaImagen(file: any, opt: string) {
    return new Promise(resolve => {
      let form: any = new FormData();
      form.append('file', file);
      this._tools.ProcessTime({});
      this._archivo.create(form).subscribe((res: any) => {
        //console.log(res);
        this._tools.tooast({ title: "subido exitoso" });
        if (opt == 'imgdefault') this.data.imgdefault = res.files;
        if (opt == 'content') { this.data.imgdefault = res.files; }
        if (this.id) this.editar();
        this.file.foto1= [];
        resolve( true );
      }, error => { this._tools.tooast({ title: "Subido Error", icon: "error" }); resolve( false ) })
    });
  }

  async submit() {
    this.data.type = 'marcas';
    let validando = this.validador();
    if( !validando ) return false;
    this.disableFile = true;
    if (this.data.id) this.editar();
    else this.guardar();
  }

  validador(){
    if( !this.data.content ) { this._tools.tooast( { title: "Error falta Url o Imagen ", icon: "error"}); return false; }
    if( !this.data.imgdefault ) { this._tools.tooast( { title: "Error falta Imagen ", icon: "error"}); return false; }
    if( !this.data.title ) { this._tools.tooast( { title: "Error falta el titulo ", icon: "error"}); return false; }
    return true;
  }

  guardar() {
    this.data.user = this.dataUser.id;
    this.data.autocreo = false;
    this._publicacion.create(this.data).subscribe((res: any) => {
      this._tools.tooast({ title: "Marcas Creada" });
      this.disableFile = false;
      this.Router.navigate( [ 'dashboard/marcasAnunciantes' ]);
    }, (error: any) => { this._tools.tooast({ title: "Error de servidor", icon: 'error' }); this.disableFile = false; })
  }

  editar() {
    let data:any = _.omitBy(this.data, _.isNull);
    data = _.omit(this.data, [ 'user', 'viewlive', 'where' ])
    this._publicacion.update( data ).subscribe((res: any) => {
      this._tools.tooast({ title: "Marcas Actualizada" });
      this.disableFile = false;
    }, (error: any) => { this._tools.tooast({ title: "Error de servidor", icon: 'error' }); this.disableFile = false; })
  }

}
