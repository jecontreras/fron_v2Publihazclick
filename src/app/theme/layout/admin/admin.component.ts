import { Component, NgZone, OnInit } from '@angular/core';
import { NextConfig } from '../../../app-config';
import { Location } from '@angular/common';
import { PuntosResumenService } from 'src/app/servicesComponents/puntos-resumen.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { UserAction } from 'src/app/redux/app.actions';
import { ToolsService } from 'src/app/services/tools.service';
import { UserNivelService } from 'src/app/servicesComponents/user-nivel.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public nextConfig: any;
  public navCollapsed: boolean;
  public navCollapsedMob: boolean;
  public windowWidth: number;

  formatoMoneda:any = {};
  puntosGanados:number = 0;
  donaciones:number = 0;
  disabled:boolean = false;
  dataUser:any = [];
  diasFaltantes:number = 0;

  constructor(private zone: NgZone, private location: Location, 
    private _puntosResumen: PuntosResumenService, 
    private _store: Store<STORAGES>, 
    private _tools: ToolsService,
    private _userNivel: UserNivelService
  ) {
    this.nextConfig = NextConfig.config;
    let currentURL = this.location.path();
    const baseHerf = this.location['_baseHref'];
    if (baseHerf) {
      currentURL = baseHerf + this.location.path();
    }

    this.windowWidth = window.innerWidth;

    if (currentURL === baseHerf + '/layout/collapse-menu'
      || currentURL === baseHerf + '/layout/box'
      || (this.windowWidth >= 992 && this.windowWidth <= 1024)) {
      this.nextConfig.collapseMenu = true;
    }

    this.navCollapsed = (this.windowWidth >= 992) ? this.nextConfig.collapseMenu : false;
    this.navCollapsedMob = false;

    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      this.dataUser = ( _.clone( store.user ) ) || {};
      try {
        if( this.dataUser.miPaquete ) {
          if( this.dataUser.miPaquete.diasFaltantes ) this.diasFaltantes =  this.dataUser.miPaquete.diasFaltantes < - 0 ? 0 : this.dataUser.miPaquete.diasFaltantes;
          else  this.diasFaltantes = 0;
        }else  this.diasFaltantes = 0;
        if( this.dataUser.cantidadPuntos ) {
          this.puntosGanados = this.dataUser.cantidadPuntos.valorTotal || 0;
          this.donaciones = this.dataUser.cantidadPuntos.donacion || 0;
        }
      } catch (error) { }
    });

  }

  ngOnInit() {
    this.formatoMoneda = this._tools.formatoMoneda;
    if (this.windowWidth < 992) {
      this.nextConfig.layout = 'vertical';
      setTimeout(() => {
        document.querySelector('.pcoded-navbar').classList.add('menupos-static');
        (document.querySelector('#nav-ps-next') as HTMLElement).style.maxHeight = '100%'; // 100% amit
      }, 500);
    }
  }

  navMobClick() {
    if (this.windowWidth < 992) {
      if (this.navCollapsedMob && !(document.querySelector('app-navigation.pcoded-navbar').classList.contains('mob-open'))) {
        this.navCollapsedMob = !this.navCollapsedMob;
        setTimeout(() => {
          this.navCollapsedMob = !this.navCollapsedMob;
        }, 100);
      } else {
        this.navCollapsedMob = !this.navCollapsedMob;
      }
    }
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

  getMiPaquete(){
    if( this.disabled ) return false;
    this.disabled = true;
    this._userNivel.getMiNivel( { user: this.dataUser.id }).subscribe(( res:any )=>{
      res = res[0];
      this._tools.tooast( { title: "Completado" });
      this.disabled = false;
      try {
        this.dataUser.miNivel = res.miNivel;
        let accion:any = new UserAction( this.dataUser, 'post');
        this._store.dispatch( accion );
      } catch (error) {  }
    },()=> { this._tools.tooast( { title: "Error", icon: "error" } ); this.disabled = false; } );
  }

}
