import { Component, OnInit } from '@angular/core';
import { INDICATIVO } from 'src/app/JSON/indicativo';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolsService } from 'src/app/services/tools.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { UserAction } from 'src/app/redux/app.actions';
import * as _ from 'lodash';

@Component({
  selector: 'app-auth-signup',
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss']
})
export class AuthSignupComponent implements OnInit {
  
  dataUser:any = {};
  listIndicativo:any = INDICATIVO;
  data:any = {
    indicativo: "57",
    rol: "user",
    pais: "Colombia"
  };
  disabled:boolean = false;
  cabeza:any;
  liderInfo:any = {};
  disabledusername:boolean = true;
  disabledemail:boolean = true;

  constructor(
    private _authSrvice: AuthService,
    private _store: Store<STORAGES>,
    private _user: UsuariosService,
    private _tools: ToolsService,
    private activate: ActivatedRoute,
    private _router: Router
  ) { 
    if (this._authSrvice.isLoggedIn()) {
      this._router.navigate(['/dashboard/home']);
    }
  }

  ngOnInit() {
    this.cabeza = (this.activate.snapshot.paramMap.get('username'));
    console.log(this.cabeza)
    this.validandoCabeza();
  }

  Texts(){
    try {
      this.data.username = this.data.username.replace(/ /g, '');
      this.data.username = _.toLower( this.data.username );
    } catch (error) {
      this.data.username = this.data.username;
    }
    //console.log("*********hp", this.data.username );
  }

  validadEmail() {
    this.disabledemail = true;
     if (this.data.email) {
       const
         filtro: any = this.data.email.split('@', '2')
         ;
        console.log(filtro);
       if ( filtro[1] == 'gmail.com' || filtro[1] == 'gmail.es'|| filtro[1] == 'hotmail.com'|| filtro[1] == 'outlook.com'|| filtro[1] == 'outlook.es') {
         this.disabledemail = true;
       }else this.disabledemail = false;
     }
  }

  validadUsername() {

    this.disabledusername = true;
    if (this.data.username) {
      // console.log(this.data.username.replace(/ /g, ""));
      this.data.username = this.data.username.replace(/ /g, '');
      this.data.username = this.data.username.replace(/[^a-zA-Z ]/g, "");
      this._user.get({ where: { username: this.data.username }})
        .subscribe(
          (res: any) => {
            res = res.data[0];
            // console.log(res);
            if (res) {
              this.disabledusername = false;
            }
          }
        )
        ;
    }
  }

  validandoCabeza(){
    this._user.get( { where: { username: this.cabeza }}).subscribe( ( res:any )=>{
      res = res.data[0];
      if( !res ) { this._tools.tooast( { title: "Error lider no encontrado", icon:"error" } ); this._router.navigate(["/portada/publihazclick"]); return false; }
      else { this.liderInfo = res; this.data.cabeza = res.id; }
    },(error)=> { this._tools.tooast( { title: "Error de servidor", icon:"error" } ); this._router.navigate(["/portada/publihazclick"]); } );
  }

  submit(){
    let validador:boolean = this.validador();
    if( !validador ) return false;
    this.disabled = true;
    this.data.name = this.data.username;
    this._user.create( this.data ).subscribe(( res:any )=>{
      this.disabled = false;
      if( res.status != 200 ) return this._tools.tooast( { title: "error "+ res.data, icon:"error" } );
      else { this._tools.tooast( { title: "Felicitaciones te has registrado" } ); this.ProcesoStorages( res ); }
    },( error:any )=>{
      console.log(error);
      this.disabled = false;
      this._tools.tooast( { title: "Error de servidor", icon:"error" } );
    });
  }

  ProcesoStorages( res:any ){
    let accion:any = new UserAction(res.data, 'post');
    this._store.dispatch(accion);
    this._router.navigate(['/dashboard/home']);
  }

  validador(){
    if( !this.data.cabeza ) { this._tools.tooast({ title:"Lo sentimos necesitas que un lider comparta el link para que te puedas registrar",icon: "warning" }); return false; }
    if( !this.data.username ) { this._tools.tooast({ title:"Ingresar su username",icon: "warning" }); return false; }
    if( !this.data.email ) { this._tools.tooast({ title:"Ingresar su Email",icon: "warning" }); return false; }
    if( !this.data.indicativo ) { this._tools.tooast({ title:"Ingresar su indicativo de tu pais",icon: "warning" }); return false; }
    if( !this.data.celular ) { this._tools.tooast({ title:"Ingresar su celular o whatsapp",icon: "warning" }); return false; }
    if( !this.data.password ) { this._tools.tooast({ title:"Ingresar su Contreseña",icon: "warning" }); return false; }
    if( !this.data.confirpassword ) { this._tools.tooast({ title:"Ingresar Confirmar contraseña",icon: "warning" }); return false; }
    if( this.data.password != this.data.confirpassword ) { this._tools.tooast({ title:"Error las constraseñas no son iguales",icon: "warning" }); return false; }
    if( !this.disabledemail || !this.disabledusername ) { this._tools.tooast({ title:"Error Por Favor mirar que errores tiene el formulario",icon: "warning" }); return false; }
    return true;
  }

}
