import { Component, OnInit } from '@angular/core';
import { USER } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { PublicacionService } from 'src/app/servicesComponents/publicacion.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
@Component({
  selector: 'app-publicidad',
  templateUrl: './publicidad.component.html',
  styleUrls: ['./publicidad.component.scss']
})
export class PublicidadComponent implements OnInit {

  breakpoint: number;
  disabled:boolean = false;
  public query:any = { 
    where:{ 
      type: ['img', 'url', 'publicacion'],
      estado: 'activo',
      autocreo: false
    }, 
    sort: "clicks DESC",
    limit: 20,
    page: 0
   };

   dataUser:any = {};
   config:any = {
    vista: "publicidad"
  };
  
  constructor(
    public _publicidad: PublicacionService,
    private _user: UsuariosService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    setInterval( ()=>{ this.breakpoint = ( window.innerWidth <= 600 ) ? 1 : 6; if( this.breakpoint == 1 ) this.disabled = false; else this.disabled = true; }, 1000 );
    this.validadorUser();
  }

  validadorUser(){
    this._user.validaorIp( { where: { } } ).subscribe(( res:any )=>{
      console.log( "***", res );
      if( res.status == 200 ) this._user.ProcesoStorages( res.data );
      else {
        this._user.create( this.armandoData( res.data ) ).subscribe(( res:any )=>{
          console.log( res );
          if( res.status == 200 ){
            this._user.ProcesoStorages( res.data );
          }else this._tools.tooast( { title: "Error en las acciones", icon:'error'});
        });
      }
    });
  } 
  
  armandoData( ip ): object{
    let data:USER = {
      "cabeza": "5cedda91520be0ef68567182",
      "indicativo": "57",
      "rol": "user",
      "username": ip,
      "name": "Usuario "+ ip,
      "email": "ip@email.com",
      "celular": 213,
      "password": ip,
      "confirpassword": ip,
      "pais": "12365",
      "ipUser": ip
    };
    return data;
  }
}
