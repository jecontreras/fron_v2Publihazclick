import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ActividadService } from 'src/app/servicesComponents/actividad.service';
import { PaquetesService } from 'src/app/servicesComponents/paquetes.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';

@Component({
  selector: 'app-adminactividad',
  templateUrl: './adminactividad.component.html',
  styleUrls: ['./adminactividad.component.scss']
})
export class AdminactividadComponent implements OnInit {

  data:any = {
    tipoActividad: "tarea-diaria"
  };
  listPaquetes:any = [];
  dataUser:any = {};
  listTipo:any = [
    {
      id: "tarea-diaria",
      title: "Tarea Diaria",
      valor: 134
    },
    {
      id: "tarea-extra",
      title: "Tarea Mini anuncios",
      valor: 100
    },
    {
      id: "tarea-referidos",
      title: "Tarea Mega Anuncios",
      valor: 2000
    },
  ];

  constructor(
    private _user: UsuariosService,
    private _paquetes: PaquetesService,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
    private _actividad: ActividadService
  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() {
    this.selecciono();
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
      this.data = res || {};
      //this.data.valor = 100;
      this._tools.tooast( { title: "Usuario buscado", icon:"succes" } );
    });
  }

  selecciono(){
    console.log( this.data.tipoActividad)
    let filtro:any = this.listTipo.find( ( item:any )=> item.id == this.data.tipoActividad );
    if( !filtro ) return false;
    this.data.valor = filtro.valor;
  }

  generador(){
    this._actividad.generarMiniActividad( this.data ).subscribe( ( res:any )=>{
      this._tools.tooast( { title: "Generador completado" } );
    },( error:any )=> { 
      this._tools.tooast( { title: "Error en la Generacion de puntos", icon:"error" } );
    } );
  }


}
