import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { UserAction } from 'src/app/redux/app.actions';
import { ToolsService } from 'src/app/services/tools.service';
import { ActividadService } from 'src/app/servicesComponents/actividad.service';
import { PublicacionService } from 'src/app/servicesComponents/publicacion.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';

@Component({
  selector: 'app-donar',
  templateUrl: './donar.component.html',
  styleUrls: ['./donar.component.scss']
})
export class DonarComponent implements OnInit {

  public query:any = { 
    where:{ 
     prioridad: "tarea-diaria",
     user: {},
     create: true
    }, 
    sort: "createdAt DESC",
    limit: 5,
    page: 0
   };
   dataUser:any = {};
   config:any = {
    vista: "tareas"
  };

  public query2:any = { where:{ 
    estado: ['activo', 'consumido'],
    autocreo: false,
    type: ['img', 'url', 'publicacion']
   }, 
   sort: "createdAt DESC",
   limit: 30,
   page: 0
  };
  config2:any = {
    vista: "publicacion"
  };

  data: any = {
    indicativo: "57",
    rol: "user",
    pais: "Colombia"
  };
  disabled: boolean = false;

  constructor(
    public _actividad: ActividadService,
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
    private _user: UsuariosService,
    public _publicacion: PublicacionService,
    private _router: Router
  ) {
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if (!store) return false;
      this.dataUser = store.user || {};
      this.query.where.user = this.dataUser.id;
    });
  }

  async ngOnInit() {
    if ( !this.dataUser.id ) {
      let codigo = this._tools.codigo();
      this.data = {
        username: "User Visita "+ codigo,
        email: codigo+"@gmail.com",
        celular: "123456",
        password: "123456",
        confirpassword: "123456",
        cabeza: "5cf9556198a1087221cd93ff",
        name: codigo+"@gmail.com",
        registroInc: false,
        ...this.data
      };
      let alert:any = await this._tools.confirm({ title: "Quieres Registrarte", detalle: "Estas como visitante si deseas registrarte podras recibir ganancias y donar a fundaciones!!"});
      console.log(alert)
      if( !alert.value ) this.createDefaultUser();
      else {
        let email:any = await this._tools.alertInput( { title: "Email", input: "text"});
        this.data.email = email;
        this.data.username = email;
        this.data.name = email;
        this.data.registroInc = true;
        let pass:any = await this._tools.alertInput( { title: "Contraseña", input: "password"});
        this.data.password = pass;
        this.data.confirpassword = pass;
        this.createDefaultUser();
      }
    }
  }

  

  createDefaultUser() {
    if( this.disabled ) return false;
    this.disabled = true;
    this._user.create(this.data).subscribe((res: any) => {
      this.disabled = false;
      if (res.status != 200) return this._tools.tooast({ title: "error " + res.data, icon: "error" });
      else { this._tools.tooast({ title: "Felicitaciones Entraste como usuario de pruebas" }); this.ProcesoStorages(res); }
    }, (error: any) => {
      console.log(error);
      this.disabled = false;
      this._tools.tooast({ title: "Error de servidor", icon: "error" });
    });
  }

  ProcesoStorages( res:any ){
    let accion:any = new UserAction(res.data, 'post');
    this._store.dispatch(accion);
    location.reload();
  }


}
