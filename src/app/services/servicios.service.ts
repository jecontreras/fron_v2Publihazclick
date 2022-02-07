import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { USER } from '../interfaces/sotarage';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { BuscadorAction, UserAction } from '../redux/app.actions';
import { ToolsService } from './tools.service';
import { catchError } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';

declare var io: any;
const headers = new HttpHeaders({
  'X-Api-Key': ""
});

const URL = environment.url;
const URLFILE = environment.URLFILE;

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  public sock: any;
  public disable_reconect: boolean = false;
  public interval:any;
  public dataUser:any = {};
  private handleError: any;
  private datafecha:any = {};

  constructor(
    private http: HttpClient,
    private _store: Store<USER>,
    private Router: Router,
    private _tools: ToolsService
  ) { 
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
      this.datafecha = store.buscador || {};
    });
    this.conectionSocket();
    this.createsocket("emitir", {mensaje:"inicial"}); 
    setTimeout(()=>this.privateDataUser(), 5000 );
  }

  initFecha(){
    if( !this.datafecha.create ) return this.createInitFecha();
    if( this.datafecha.create != moment().format("DD/MM/YYYY") ) this.seguridad();
    else this.updateInitFecha();
    
  }

  createInitFecha(){
    let accion = new BuscadorAction( { init: true, create: moment().format("DD/MM/YYYY") }, 'post' );
    this._store.dispatch( accion );
  }

  updateInitFecha(){
    let accion = new BuscadorAction( { init: true, create: moment().format("DD/MM/YYYY") }, 'put' );
    this._store.dispatch( accion );
  }
  
  seguridad(){
    let accion = new UserAction( this.dataUser,'delete' )
    this._store.dispatch(accion);
    localStorage.removeItem('user');
    this._tools.presentToast("Tu sesión ha expirado")
    this.Router.navigate(['/login']);
    setTimeout(function(){ location.reload(); }, 3000);
  }

  privateDataUser(){
    if(Object.keys(this.dataUser).length >0 ){
      this.initFecha();
      let idUser = this.dataUser.id;
      //if( !environment.production ) idUser = "61e61c9b586ce6001674f0cb";
      let data1:any = {};
      this.querys('user/querys',{
        where:{
          id: idUser
          //id: "619e49fbb564a8001695b9f3"
          //id: "619c1c3c530b960016737fd0"
        }
      }, 'post').subscribe(async (res:any)=>{
        res = res.data[0];
        data1 = res || {};
        if(!res) {
          let accion = new UserAction(this.dataUser,'delete')
          this._store.dispatch(accion);
          localStorage.removeItem('user');
          this._tools.presentToast("Tu sesión ha expirado")
          this.Router.navigate(['/login']);
          setTimeout(function(){ location.reload(); }, 3000);
        }else{
          this.dataUser = data1;
          await this.getMiPaquete();
          this.createVista();
          let accion = new UserAction( data1,'post')
          this._store.dispatch(accion);
        }

        let andador = setTimeout( () =>{
          if( data1.registroInc ) clearTimeout( andador );
          this.querys('user/' + data1.id, { registroInc: true }, 'put').subscribe( ( res:any ) =>{
            data1 = res;
          } );
        }, 3000 );
      });
    }
  }

  async getMiPaquete(){
    return new Promise(async (promesa) => {
      this.querys('usernivel/lodearMiNivel',{ user: this.dataUser.id },'post').subscribe(( res:any )=>{
        try {
          this.dataUser.miNivel = res.resultado.miNivel;
          promesa( true );
        } catch (error) { promesa( false );}
      },()=> { this._tools.tooast( { title: "Error", icon: "error" } ); promesa( false );} );
    });
  }

  createVista(){
    this.querys( 'estadisticas', {
      user: this.dataUser.id,
    }, 'post' ).subscribe( ( res:any )=>{ });
  }

  private ejecutarQuery(url: string, data, METODO){
    return this.http[METODO]( url, data );
  }

  querys(query:string, datas:any, METODO:string){
    let data = datas;
    if(!datas.where) datas.where = {};
    data.skip = datas.page ? datas.page : 0;
    data.limit = datas.limit ? datas.limit : 10;
    query = URL+`/${query}`;
    delete data.where.app;
    return this.ejecutarQuery(query, data, METODO);
  }

  querys2(query:string, datas:any, METODO:string){
    let data = datas;
    if(!datas.where) datas.where = {};
    data.skip = datas.page ? datas.page : 0;
    data.limit = datas.limit ? datas.limit : 10;
    query = URLFILE+`/${query}`;
    delete data.where.app;
    return this.ejecutarQuery(query, data, METODO);
  }

  async createsocket(modelo: string, query: any) {
      return new Promise(async (promesa) => {
        query.modelo = modelo;
        try {
          await this.sock.post(URL + '/socket/emitir', query, (rta) => {
            // console.log(rta, modelo);
            promesa(rta)
          });
        } catch (error) {
          promesa("exitoso");
        }
      })

  }
  init_process_socket() {
    let
      init: any = 0
    ;
    this.interval = setInterval(() => {
      init += 1;
      if (init === 3) {
        init = 0;
        if(this.disable_reconect) {
          this.conectionSocket();
        }
      }
    }, 1000);
  }
  stopConter(interval: any) {
    clearInterval(interval);
  }
  /* Primera la conexion de configuracion del socket */
  conectionSocket() {
    try {
      if (io) {
        io.sails.autoConnect = false;
        this.sock = io.sails.connect(URL);
        this.scoket_global();
      }
    } catch (error) {
    }
  }
  scoket_global() {
    /* determinar  la conexion del socket con el back  */
    this.sock.on('connect',() => {
      console.log('conectado');
      this.disable_reconect = false;
      this.stopConter(this.interval);
    });
    /* Reconectar si se cae la conexion del socket */
    this.sock.on('disconnect', () =>{
      console.log('desconectado');
      this.disable_reconect = true;
      this.init_process_socket()
    });
  }
  query(modelo: string, query: any) {
    if (!query) {
      query = {};
    }
    if (!query.where) {
      query = {
        where: query
      }
        ;
    }
    const ruta = _.split(modelo, '/', 2);
    if (ruta[1]) {
      modelo = modelo;
    } else {
      modelo = modelo + '/query';
    }

    query.app = this.adsSecuryty();
    return this.http.post(URL + modelo, query).pipe(
      catchError(this.handleError)
    );
  }
  private adsSecuryty() {
    return 'publihazclickrootadmin';
  }
}
