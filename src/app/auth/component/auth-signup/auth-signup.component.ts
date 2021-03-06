import { Component, OnInit } from '@angular/core';
import { INDICATIVO } from 'src/app/JSON/indicativo';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolsService } from 'src/app/services/tools.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { UserAction } from 'src/app/redux/app.actions';

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
    this.validandoCabeza();
  }

  validandoCabeza(){
    this._user.get( { where: { username: this.cabeza }}).subscribe( ( res:any )=>{
      res = res.data[0];
      if( !res ) { this._tools.tooast( { title: "Error lider no encontrado", icon:"error" } ); this._router.navigate(["/portada/index"]); return false; }
      else { this.liderInfo = res; this.data.cabeza = res.id; }
    },(error)=> { this._tools.tooast( { title: "Error de servidor", icon:"error" } ); this._router.navigate(["/portada/index"]); } );
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
    return true;
  }

}
