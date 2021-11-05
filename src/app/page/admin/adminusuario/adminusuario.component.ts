import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { UserNivelService } from 'src/app/servicesComponents/user-nivel.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import * as _ from 'lodash';
import { UserAction } from 'src/app/redux/app.actions';

@Component({
  selector: 'app-adminusuario',
  templateUrl: './adminusuario.component.html',
  styleUrls: ['./adminusuario.component.scss']
})
export class AdminusuarioComponent implements OnInit {
  
  tablet:any = {
    dataHeader: ["Opciones","Foto","Username","Clave","Fecha del Paquete","Celular","Nivel"],
    dataRow: [],
    count: 0
  };
  query:any = {
    where:{ },
    page: 0
  };
  vista:string = "home";
  data:any = {};
  progreses:boolean = false;
  public count: number = 0;
  
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  
  dataUser:any = {};
  seartxt:string;

  constructor(
    private _user: UsuariosService,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
    private _userNivel: UserNivelService,
  ) { }

  ngOnInit() {
    this.getRow();
  }
  desavilitar( item ){

  }

  onScroll(){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.query.page++;
       this.getRow();
     }
  }
   
  getRow(){
    this.progreses = true;
    this._user.get( this.query ).subscribe( async ( res:any ) =>{
      for( let row of res.data ) {
        let result:any = await this.getDetalles( row );
        if( !result ) continue; if( !result.nivel ) continue;
        row.fechadelpack = result.fechadelpack;
        row.nivel = result.nivel.nivel.title;
      }
      this.tablet.dataRow = _.unionBy( this.tablet.dataRow || [], res.data, 'id');
      this.tablet.count = res.count;
      this.progreses = false;
      // console.log( res );
    },( error:any )=> { this._tools.tooast("Error de servidor"); this.progreses = false; });
  }

  getDetalles( item:any ){
    return new Promise( resolve =>{
      this._userNivel.getDetalles( { user: item.id } ).subscribe(( res:any )=>{
        // console.log( res );
        resolve( res );
      },( error:any )=> { console.error( error ); resolve( false ); });
    });
  }

  update( item ){
    if( item ) return this.cambioPassword( item );
    this.data = _.omit( item, ['rol', 'password', 'confirpassword', 'cabeza','comentarios','publicaciones','referidos','rol','updatedAt','createdAt','miNivel','miPaquete','cantidadPuntos']);
    this._user.update( item ).subscribe((res:any)=>{
      console.log(res);
      this._tools.tooast( { title: "Perfil Actualizado correctamente", icon:"succes" } );
    },(error)=> this._tools.tooast( { title:"Error al Actualizar el Usuario", icon:"error" } ) );
  }

  cambioPassword( item ){
    let data:any = {
      id: item.id,
      password: item.password,
      confirpassword: item.password
    };
    if( data.password !== data.confirpassword ) return this._tools.tooast( { title:"Error las contraseñas no son iguales", icon:"error" } );
    this._user.cambioPass( data ).subscribe((res:any)=>{
      console.log(res);
      this._tools.tooast( { title: "Contraseña actualizada", icon:"succes" } );
    },(error)=> this._tools.tooast( { title:error.data ||  "Error de servidor", icon:"error" }));
  }

  buscar(  ){
    this.query = {
      where:{ 

      },
      page: 0
    };
    if( this.seartxt != ''){
      this.query.where.or = [
        {
          username: {
            contains: this.seartxt || ''
          }
        },
        {
          email: {
            contains: this.seartxt || ''
          }
        }
      ];
    }
    this.tablet.dataRow = [];
    this.tablet.count = 0;
    this.getRow();
  }

}
