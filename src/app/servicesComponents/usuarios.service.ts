import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { STORAGES } from '../interfaces/sotarage';
import { UserAction } from '../redux/app.actions';
import { ServiciosService } from '../services/servicios.service';

declare const window:any;
declare const FB:any;

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private _model: ServiciosService,
    private _store: Store<STORAGES>
  ) { }

  get(query:any){
    return this._model.querys('user/querys',query, 'post');
  }

  getInfo(query:any){
    return this._model.querys('user/infoUser',query, 'post');
  }

  darPuntos(query:any){
    return this._model.querys('user/guardarPunto',query, 'post');
  }
  
  getNivel(query:any){
    return this._model.querys('user/nivelUser',query, 'post');
  }

  cambioPass(query:any){
    return this._model.querys('user/cambioPass',query, 'post');
  }

  login(query:any){
    return this._model.querys('user/login',query, 'post');
  }

  create(query:any){
    return this._model.querys('user/register',query, 'post');
  }

  update(query:any){
    return this._model.querys('user/'+query.id, query, 'put');
  }
  
  delete(query:any){
    return this._model.querys('user/'+query.id, query, 'delete');
  }

  validaorIp(query:any){
    return this._model.querys('user/validandoip',query, 'post');
  }

  buscarAmigos(query:any){
    return this._model.querys('user/buscarAmigos',query, 'post');
  }

  getAmigos(query:any){
    return this._model.querys('user/getAmigos',query, 'post');
  }

  createAmigos(query:any){
    return this._model.querys('useramigos',query, 'post');
  }

  olvidoPass( query:any ){
    return this._model.querys('user/olvidopass',query, 'post');
  }

  putAmigos(query:any){
    return this._model.querys('useramigos/'+query.id, query, 'put');
  }

  deleteAmigos(query:any){
    return this._model.querys('useramigos/'+query.id, query, 'delete');
  }

  ProcesoStorages( res:any ){
    let accion:any = new UserAction(res, 'post');
    this._store.dispatch(accion);
  }

  procesoFacebook(){
    FB.getLoginStatus(function(response) {
      console.log( response );
      if( !response ) this.loginFacebook();
      if( response.status != "connected" ) this.loginFacebook();
      //this.checkLoginState();
    });
  }

  checkLoginState() {
    FB.getLoginStatus(function(response) {
      console.log( response );
    });
  }

  loginFacebook(){
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '821007851765715',
        cookie     : true,
        xfbml      : true,
        version    : 'v7.0'
      });
        
      FB.AppEvents.logPageView();   
        
    };
  
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }
}
