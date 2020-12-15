import { Component, OnInit } from '@angular/core';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { ToolsService } from 'src/app/services/tools.service';
import { PuntosService } from 'src/app/servicesComponents/puntos.service';
import { PuntosResumenService } from 'src/app/servicesComponents/puntos-resumen.service';
import { UserAction } from 'src/app/redux/app.actions';
import * as _ from 'lodash';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { UserNivelService } from 'src/app/servicesComponents/user-nivel.service';

@Component({
  selector: 'app-nav-search',
  templateUrl: './nav-search.component.html',
  styleUrls: ['./nav-search.component.scss']
})
export class NavSearchComponent implements OnInit {
  
  formatoMoneda:any = {};
  dataUser:any = {};
  diasFaltantes:number = 0;
  puntosGanados:number = 0;
  donaciones:number = 0;
  disabled:boolean = false;

  constructor(
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
    private _puntosResumen: PuntosResumenService,
    private _userNivel: UserNivelService
  ) { 
    this._store.subscribe((store: any) => {
      console.log(store);
      store = store.name;
      this.dataUser = ( _.clone( store.user ) ) || {};
      try {
        if( this.dataUser.miPaquete ) {
          if( this.dataUser.miPaquete.diasFaltantes ) this.diasFaltantes = this.dataUser.miPaquete.diasFaltantes;
          else  this.diasFaltantes = 0;
        }else  this.diasFaltantes = 0;
        if( this.dataUser.cantidadPuntos ) {
          // this.puntosGanados = this.dataUser.cantidadPuntos.valorTotal || 0;
          // this.donaciones = this.dataUser.cantidadPuntos.donacion || 0;
        }
      } catch (error) { }
    });
  }

  ngOnInit() { 
    this.formatoMoneda = this._tools.formatoMoneda;
  }

  getMiPaquete(){
    if( this.disabled ) return false;
    this.disabled = true;
    this._userNivel.getMiNivel( { user: this.dataUser.id }).subscribe(( res:any )=>{
      this._tools.tooast( { title: "Completado" });
      this.disabled = false;
      try {
        this.dataUser.miNivel = res.resultado.miNivel;
        let accion:any = new UserAction( this.dataUser, 'post');
        this._store.dispatch( accion );
      } catch (error) { }
    },()=> { this._tools.tooast( { title: "Error", icon: "error" } ); this.disabled = false; } );

    
  }

}
