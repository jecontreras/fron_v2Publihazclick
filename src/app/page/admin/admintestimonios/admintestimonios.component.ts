import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { TestimoniosService } from 'src/app/servicesComponents/testimonios.service';

@Component({
  selector: 'app-admintestimonios',
  templateUrl: './admintestimonios.component.html',
  styleUrls: ['./admintestimonios.component.scss']
})
export class AdmintestimoniosComponent implements OnInit {

  data:any = {};
  dataUser:any = {};
  formatoMoneda:any = {};
  disabled:boolean = false;
  file: any = {
    foto1: []
  };

  disableFile:boolean = false;

  lisTestimonios:any = [];
  query:any = {
    where:{
      estado: 0
    },
    limit: 100,
    sort: "createdAt ASC"
  };

  constructor(
    private _user: UsuariosService,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
    private _archivo: ArchivosService,
    private _testimonios: TestimoniosService
  ) { 
    this._store.subscribe((store: any) => {
      console.log(store);
      store = store.name;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() {
    this.getTestimonio();
    this.dataDefault();
  }

  dataDefault(){
    this.data = {
      username: "usp" + this._tools.codigo(),
      email: this._tools.codigo() + "@gmail.com",
      lastname: this._tools.codigo(),
      ciudad: "Cucuta"
    }
  }

  getTestimonio(){
    this._testimonios.get( this.query ).subscribe(( res:any )=>{
      this.lisTestimonios = res.data;
    });
  }

  buscarUsuario(){
    if( !this.data.username ) return false;
    this._user.get( 
      {
        where:{
          or: [
            {
              username: {
                contains: this.data.username || ''
              }
            },
            {
              email: {
                contains: this.data.username || ''
              }
            },
          ]
        }
      }
    ).subscribe(( res:any )=>{
      res = res.data[0];
      if( res ) { this.data = res; this._tools.tooast( { title: "Usuario buscado", icon:"succes" } ); }
      else this._tools.tooast( { title: "Usuario no encontrado", icon:"error" } );
    });
  }

  async datafiles(ev: any) {
    //console.log( ev, this.file );
    this.file.foto1 = [];
    try {
      this.file.foto1 = ev.target.files;
      this.data.imgdefault = await this._archivo.getBase64(this.file.foto1[0]);
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
        this.file.foto1= [];
        resolve( true );
      }, error => { this._tools.tooast({ title: "Subido Error", icon: "error" }); resolve( false ) })
    });
  }

  async submit(){
    this.disabled = true;
    let result:any;
    if( !this.data.foto ) { this.disabled = false; return this._tools.tooast({ title: "Error Foto de testimonio no subida", icon: "error" });}
    if( !this.data.id ) {
      result = await this.crearUsuario();
      if( !result ) { this.disabled = false; return this._tools.tooast({ title: "Error Completar datos", icon: "error" }); }
    }
    if( !this.data.id || !this.data.foto ) { this.disabled = false; return this._tools.tooast({ title: "Error Completar datos", icon: "error" }); }
    let data:any = {
      usuario: this.data.id,
      descripcion: this.data.descripcion,
      foto: this.data.foto,
      fecha: this.data.fecha
    };
    this._testimonios.create( data ).subscribe(( res:any )=>{
      this._tools.tooast({ title: "Guardado exitoso" });
      this.data = {};
      this.disabled = false;
    }, error => { this._tools.tooast({ title: "Error", icon: "error" }); this.disabled = false;} )
  }

  dropTestimonio( item:any ){
    this.disabled = true;
    let data:any = {
      id: item.id,
      estado: 1
    };
    if( !data.id ) { this.disabled = false; return this._tools.tooast({ title: "Error Completar datos", icon: "error" });}
    this._testimonios.update( data ).subscribe( ( res:any ) => {
      this._tools.tooast({ title: "Borrado exitoso" });
      this.disabled = false;
      this.lisTestimonios = this.lisTestimonios.filter(( row:any )=> row.id !== item.id );
    }, error => { this._tools.tooast({ title: "Error al borrar", icon: "error" }); this.disabled = false; } )
  }

  async crearUsuario(){
    return new Promise( resolve =>{
      let data = {
        username: "User Visita " + this.data.username,
        email: this.data.email,
        celular: "123456",
        password: "123456",
        confirpassword: "123456",
        cabeza: "5cf9556198a1087221cd93ff",
        name: this.data.email,
        registroInc: false,
        pais: 'colombia',
        ...this.data
      };
      this._user.create( data ).subscribe((res: any) => {
        this.disabled = false;
        this.data.id = res.data.id;
        this._tools.tooast( { title: "Usuario Creado", icon:"succes" } );
        resolve( true );
      }, ( error:any )=> { this._tools.tooast( { title: "Error al crear", icon:"error" } ); resolve( false );});
    });
  }


}
