import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  @Input() config: any;
  dataUser: any = {};
  lista: any = [];
  querys: any = {
    where: {},
    sort: "createdAt DESC",
    limit: 10,
    page: 0
  };
  progreses: boolean = true;
  disabled: boolean = false;

  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  public datoBusqueda:string = '';

  constructor(
    private _user: UsuariosService,
    private _store: Store<STORAGES>,
    private Tools: ToolsService
  ) {
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if (!store) return false;
      this.dataUser = store.user || {};
      this.querys.where.user = this.dataUser.id;
    });
  }

  ngOnInit() {
    this.getRow();
  }

  buscador(){
    this.notscrolly = true 
    this.notEmptyPost = true;
    this.lista = [];
    this.datoBusqueda = this.datoBusqueda.trim();
    if( this.datoBusqueda !='' ){
      this.querys.where.or = [
        {
          name: {
            contains: this.datoBusqueda|| ''
          }
        },
        {
          lastname: {
            contains: this.datoBusqueda|| ''
          }
        }
      ];
    }
    this.getRow();
  }

  onScroll(){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.querys.page++;
       this.getRow();
     }
   }

  getRow() {
    if( this.config.vista == 'agregaramigos' ) { 
      //delete this.querys.where.user; 
      this._user.buscarAmigos( this.querys ).subscribe((res: any) => {
        this.lista = _.unionBy( this.lista || [], res.data, 'id' );
        this.progreses = false;
      },( error:any )=> this.progreses = false );
    }
    else{
      this._user.getAmigos( this.querys ).subscribe((res: any) => {
        this.lista = _.unionBy( this.lista || [], res.data, 'id' );
        this.progreses = false;
      },( error:any )=> this.progreses = false );
    }
  }

  agregar( item:any ){
    let data:any = {
      emisor: this.dataUser.id,
      reseptor: item.id
    };
    item.estados = 0;
    if( this.disabled ) return false;
    this.disabled = true;
    this._user.createAmigos( data ).subscribe(( res:any )=>{
      this.Tools.tooast( { title: 'Solicitd enviada' } );
      this.disabled = false;
    },( error:any )=> { this.Tools.tooast( { title: "Error en el servidor", icon: 'error' } ); this.disabled = false; });
  }

  cancelar( item:any ){
    let data: any = {
      id: item.id,
      estado: 2
    };
    this._user.deleteAmigos( data ).subscribe( ( res:any )=>{
      this.Tools.tooast( { title: "Solicitud cancelada" } );
      this.lista = this.lista.filter(( row:any )=> row.id !== item.id );
    },( error:any )=> { this.Tools.tooast( { title: 'Error al cancelar Solicitud', icon: 'error' } ); });
  }

  eliminar( item:any ){
    let data: any = {
      id: item.id,
      estado: 3
    };
    this._user.putAmigos( data ).subscribe( ( res:any )=>{
      this.Tools.tooast( { title: "Solicitud cancelada" } );
      this.lista = this.lista.filter(( row:any )=> row.id !== item.id );
    },( error:any )=> { this.Tools.tooast( { title: 'Error al cancelar Solicitud', icon: 'error' } ); });
  }

}
