import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { PuntosResumenService } from 'src/app/servicesComponents/puntos-resumen.service';
import { PuntosService } from 'src/app/servicesComponents/puntos.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';

@Component({
  selector: 'app-admin-puntos',
  templateUrl: './admin-puntos.component.html',
  styleUrls: ['./admin-puntos.component.scss']
})
export class AdminPuntosComponent implements OnInit {
  
  data:any = {};
  listPaquetes:any = [];
  dataUser:any = {};
  formatoMoneda:any = {};
  disabled:boolean = false;

  constructor(
    private _user: UsuariosService,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
    private _puntos: PuntosService,
    private _puntosResumen: PuntosResumenService
  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() {
    this.formatoMoneda = this._tools.formatoMoneda;
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
      this.data = res;
      this._tools.tooast( { title: "Usuario buscado", icon:"succes" } );
      this.getMisPuntos();
    });
  }

  getMisPuntos(){
    if( this.disabled ) return false;
    this.disabled = true;
    this._puntosResumen.get( { where: { user: this.data.id, state: "valido" } } ).subscribe( ( res:any )=>{
      res = res.data[0];
      this.disabled = false;
      if ( !res ) return this.data.cantidadPuntos = 0;
      else {
        this.data.cantidadPuntos = res.valorTotal;
      }
    },( error:any )=> { this._tools.presentToast("Error de servidor"); this.disabled = false; } );
  }

  asignacion(){
    let data:any = {
      codigo: this._tools.codigo(),
      valor: this.data.puntos,
      user: this.data.id,
      actividad: "61790b94f19ded1a908d507a",
      prioridad: "tarea-referidos",
      create: "manual"
    };
    this._puntos.generarPuntosManual( data ).subscribe( ( res:any )=>{
      this._tools.tooast( { title: "Puntos asignados", icon:"succes" } );
      this.data = {};
    },( error:any )=> this._tools.tooast( { title: "Error en la asignacion puntos", icon:"error" } ));
  }

}
