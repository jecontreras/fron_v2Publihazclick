import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolsService } from 'src/app/services/tools.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';

@Component({
  selector: 'app-auth-reset-password',
  templateUrl: './auth-reset-password.component.html',
  styleUrls: ['./auth-reset-password.component.scss']
})
export class AuthResetPasswordComponent implements OnInit {

  data:any = {};
  disabled:boolean = false;

  constructor(
    private _user: UsuariosService,
    private _tools: ToolsService,
    private _router: Router
  ) { }

  ngOnInit() {
  }

  cambiosPass(){
    if( this.disabled ) return false;
    this.disabled = true;
    this._user.olvidoPass( this.data ).subscribe(( res:any )=>{
      this._tools.tooast( { title: "Actaulizada la Contraseña por Favor revisar correo electronico" } );
      this.disabled = false;
      this.data = {};
      this._router.navigate(['/auth/login']);
    }, (error) => { console.log( error ); this._tools.tooast({ title:"Error "+ error.error.data ,icon: "error" }); this.disabled = false; } )
  }

}
