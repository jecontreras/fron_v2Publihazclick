import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { PuntosResumenService } from 'src/app/servicesComponents/puntos-resumen.service';
import { UserAction } from 'src/app/redux/app.actions';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnInit {
  
  @ViewChild('menus',{ static: false } ) private menus: any;
  @ViewChild('ulis',{ static: false } ) private ullis: any;
  disabledMenu:boolean = false;
  puntosGanados:number = 0;
  donaciones:number = 0;
  dataUser:any = {};
  formatoMoneda:any = {};
  disabled:boolean = false;

  constructor(
    private _puntosResumen: PuntosResumenService,
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
  ) { 
    this._store.subscribe((store: any) => {
      console.log(store);
      store = store.name;
      if( !store ) return false;
      //if( !store.dataDemo ) store.dataDemo = {};
      this.dataUser = ( _.clone( store.user ) ) || {};
      this.puntosGanados = !store.dataDemo ? 0 : store.dataDemo.coins || 0;
      this.donaciones = !store.dataDemo ? 0 : store.dataDemo.donacion || 0;
    });
  }

  ngOnInit() {
    this.formatoMoneda = this._tools.formatoMoneda;
    if( this.dataUser.id ) this.getMisPuntos();
  }

  activarMenu(){
    this.disabledMenu = !this.disabledMenu;
    if( this.disabledMenu ) {
      this.menus.nativeElement.style.display = "flex";
      this.ullis.nativeElement.style.textAlign="end";
      this.ullis.nativeElement.style.width="100%";
    }
    else this.menus.nativeElement.style.display = "none";
  }

  getMisPuntos(){
    if( this.disabled ) return false;
    this.disabled = true;
    this._puntosResumen.get( { where: { user: this.dataUser.id, state: "valido" } } ).subscribe( ( res:any )=>{
      res = res.data[0];
      this.disabled = false;
      if ( !res ) return this.dataUser.cantidadPuntos = { valorTotal: 0 };
      else {
        this.dataUser.cantidadPuntos = res;
        let accion:any = new UserAction( this.dataUser, 'post');
        this._store.dispatch( accion );
      }
    },( error:any )=> { this._tools.presentToast("Error de servidor"); this.disabled = false; } );
  }

  getRefres(){
    location.reload();
  }

}
