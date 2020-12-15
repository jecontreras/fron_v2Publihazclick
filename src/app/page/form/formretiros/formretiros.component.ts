import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from 'src/app/services/tools.service';
import { BancosService } from 'src/app/servicesComponents/bancos.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { RetirosService } from 'src/app/servicesComponents/retiros.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { PuntosResumenService } from 'src/app/servicesComponents/puntos-resumen.service';
import { UserNivelService } from 'src/app/servicesComponents/user-nivel.service';
import { UserAction } from 'src/app/redux/app.actions';

@Component({
  selector: 'app-formretiros',
  templateUrl: './formretiros.component.html',
  styleUrls: ['./formretiros.component.scss']
})
export class FormretirosComponent implements OnInit {
  
  data:any = {
    slug: moment().format("DD/MM/YYYY")
  };
  id:any;
  listBancos:any = [];
  formatoMoneda:any = {};
  dataUser:any = {};
  disableFile:boolean = false;
  disabled:boolean = false;
  progreses:boolean = false;

  constructor(
    private activate: ActivatedRoute,
    private _tools: ToolsService,
    private _bancos: BancosService,
    private _store: Store<STORAGES>,
    private _retiros: RetirosService,
    private _puntosResumen: PuntosResumenService,
    private Router: Router,
    private _UserNivel: UserNivelService
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
    this.id = (this.activate.snapshot.paramMap.get('id'));
    if( this.id ) this.getRetiros();
    else { this.data.titulo = moment().format("DD-MM-YYYY HH:MM:SS"); this.data.estado = "pendiente"; this.data.codigo = this.codigo(); this.getPuntosRetirar(); this.getPuntosUser();}
    this.getBancos();
  }

  getRetiros(){
    this.progreses = true;
    this._retiros.get( { where: { id: this.id },limit: 1 }).subscribe(( res:any )=>{
      res = res.data[0];
      this.progreses = false;
      if( !res )  return this.Router.navigate( ["dashboard/retiros"] );
      if( res.tipoBanco ) if( res.tipoBanco.id ) res.tipoBanco = res.tipoBanco.id;
      this.data = res;
    },error => { this.progreses = false; this.Router.navigate( ["dashboard/retiros"] )} );
  }

  getPuntosUser(){
    this._puntosResumen.get( { where: { user: this.dataUser.id, state: "valido" }, limit: 1 } ).subscribe(( res:any )=>{
      res = res.data[0];
      // console.log( "**", res );
      if( res ) this.data.cantidadDisponible = res.valorTotal;
      else this.data.cantidadDisponible = 0;
    });
  }

  getPuntosRetirar(){
    this._UserNivel.get( { where: { user: this.dataUser.id }, sort: "createdAt DESC", limit: 1 } ).subscribe(( res:any )=>{
      res = res.data[0];
      // console.log( res );
      if ( !res ) this.data.cantidad = 0;
      else this.data.cantidad = res.nivel.minretiro;
    });
  }

  getBancos(){
    this.progreses = true;
    this._bancos.get( { where: { estado: "activo", user: this.dataUser.id }, limit: 100 } ).subscribe(( res:any )=> {
      res = res.data;
      this.listBancos = res;
      this.progreses = false;
    },() => this.progreses = false );
  }

  codigo(){
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

  submit(){
    this.disableFile = true;
    if( this.id ) this.editar();
    else this.guardar();
  }

  guardar() {
    let valid:boolean = this.valirdar();
    if( !valid ) return false;
    this.data.user = this.dataUser.id;
    this.data.autocreo = false;
    this._retiros.create(this.data).subscribe((res: any) => {
      this._tools.tooast({ title: "Retiro Creada ..." });
      this.disableFile = false;
      this.getMisPuntos();
      setTimeout(()=> this.Router.navigate( [ 'dashboard/retiros' ]) , 3000);
    }, (error: any) => { 
      // console.log( error )
      if( error.error.data ) this._tools.tooast({ title: error.error.data, icon: 'error' }); 
      else this._tools.tooast({ title: "Error de servidor", icon: 'error' }); 
      this.disableFile = false; 
    })
  }

  valirdar(){
    if( !this.data.tipoBanco ) { this._tools.tooast( { title: "!Error por favor seleccionar un banco", icon: "error" } ); return false; }
    if( !this.data.cantidad ) { this._tools.tooast( { title: "!Error por favor seleccionar un banco", icon: "error" } ); return false; }
    return true;
  }

  getMisPuntos(){
    if( this.disabled ) return false;
    this.disabled = true;
    this._puntosResumen.get( { where: { user: this.dataUser.id, state: "valido" } } ).subscribe( ( res:any )=>{
      res = res.data[0];
      this.disabled = false;
      if ( !res ) return this.dataUser.cantidadPuntos = { valorTotal: 0, donacion: 0 };
      else {
        let dataUser:any = _.clone( this.dataUser );
        dataUser.cantidadPuntos = res;
        let accion:any = new UserAction( dataUser, 'post');
        this._store.dispatch( accion );
      }
    },( error:any )=> { this._tools.presentToast("Error de servidor"); this.disabled = false; } );
  }

  editar() {
    let data:any = _.omitBy(this.data, _.isNull);
    data = _.omit(this.data, [ 'user', 'viewlive', 'where' ])
    this._retiros.update( data ).subscribe((res: any) => {
      this._tools.tooast({ title: "Retiro Actualizada" });
      this.disableFile = false;
    }, (error: any) => { this._tools.tooast({ title: "Error de servidor", icon: 'error' }); this.disableFile = false; })
  }

}
