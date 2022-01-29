import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { UserAction } from 'src/app/redux/app.actions';
import { PAIS } from 'src/app/JSON/paises';
import { DEPARTAMENTO } from 'src/app/JSON/departamentos';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  
  data:any = {};
  dataUser:any = {};
  btnDisabled:boolean = false;
  id:any;
  listpais:any = PAIS;
  listdepartamento:any = DEPARTAMENTO;
  listciudades:any = [];

  file: any = {
    foto1: []
  };

  disableFile:boolean = false;

  constructor(
    private _store: Store<STORAGES>,
    private _user: UsuariosService,
    private _tools: ToolsService,
    private _archivo: ArchivosService
  ) { 
    this._store.subscribe((store: any) => {
      console.log(store);
      store = store.name;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() {
    this.data = _.clone( this.dataUser );
    this.data.foto2 = this.data.foto;
    this.blurdepartamento();
  }

  async datafiles(ev: any) {
    //console.log( ev, this.file );
    this.file.foto1 = [];
    try {
      this.file.foto1 = ev.target.files;
      if (this.file.foto1[0]) {
        this.data.foto2 = await this._archivo.getBase64(this.file.foto1[0]);
        setTimeout(()=> this.submitFile(), 5000 );
      }
    } catch (error) { }
  }

  async submitFile() {
    if( !this.file.foto1[0] ) return false;
    this.disableFile = true;
    this.procesoSubidaImagen(this.file.foto1[0]);
    this.disableFile = false;
  }

  procesoSubidaImagen(file: any) {
    return new Promise(resolve => {
      let form: any = new FormData();
      form.append('file', file);
      this._tools.ProcessTime({});
      this._archivo.create(form).subscribe((res: any) => {
        console.log(form);
        this._tools.tooast({ title: "subido exitoso" });
        this.data.foto = res.files;
        this.submit();
        this.file.foto1= [];
        resolve( true );
      }, error => { this._tools.tooast({ title: "Subido Error", icon: "error" }); resolve( false ) })
    });
  }

  blurdepartamento(){
    let filtro:any = this.listdepartamento.find( ( row:any )=> row.departamento == this.data.departamento );
    if( !filtro ) return false;
    this.listciudades = filtro.ciudades;
  }

  submit(){ 
    console.log( this.data );
    this.update();
  }

  update(){
    if( this.data.password ) return this.cambioPassword();
    this.data = _.omit( this.data, ['rol', 'password', 'confirpassword', 'cabeza','comentarios','publicaciones','referidos','rol','updatedAt','createdAt','miNivel','miPaquete','cantidadPuntos']);
    this._user.update(this.data).subscribe((res:any)=>{
      console.log(res);
      this.data = res;
      this.data.foto2 = res.data.foto;
      let accion = new UserAction( res, 'put');
      this._store.dispatch(accion);
      this._tools.tooast({ title:"Perfil Actualizado correctamente" });
    },(error)=> this._tools.tooast( { title:"Error al Actualizar el Usuario", icon:"error" } ) );
  }

  cambioPassword(){
    let data:any = {
      id: this.data.id,
      password: this.data.password,
      confirpassword: this.data.confirpassword
    };
    if( data.password !== data.confirpassword ) return this._tools.tooast( { title:"Error las contraseñas no son iguales", icon:"error" } );
    this._user.cambioPass(data).subscribe((res:any)=>{
      console.log(res);
      this._tools.tooast( { title:"Contraseña actualizada" } );
    },(error)=> this._tools.tooast( { title:error.data ||  "Error de servidor", icon:"error" }));
  }

}
