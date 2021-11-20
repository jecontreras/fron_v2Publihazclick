import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ProyectosService } from 'src/app/servicesComponents/proyectos.service';

@Component({
  selector: 'app-proyectos-donaciones',
  templateUrl: './proyectos-donaciones.component.html',
  styleUrls: ['./proyectos-donaciones.component.scss']
})
export class ProyectosDonacionesComponent implements OnInit {

  data:any = {};
  dataUser:any = {};
  disabled:boolean = false;
  
  constructor(
    private _store: Store<STORAGES>,
    private _proyectos: ProyectosService,
    private _tools: ToolsService
  ) {
    this._store.subscribe((store: any) => {
      console.log(store);
      store = store.name;
      this.dataUser = store.user || {};
    });
   }

  ngOnInit() {
    this.data.user = this.dataUser.username;
    this.data.usuario = this.dataUser.id;
  }

  async createDonacion(){
    if( this.disabled ) return false;
    this.disabled = true;
    let validor:any = await this.validadores();
    if( !validor ) { this.disabled = false;  return false;}
    
    this._proyectos.create( this.data ).subscribe(( res:any )=>{
      this._tools.tooast( { title: "Proyecto Creado" } );
      this.disabled = false;
    } ,( errro:any )=> { this._tools.tooast( { title: "Error al crear el proyecto", icon:"error" } ); this.disabled = false; });

  }

  validadores(){
    if( !this.data.nombreRepresentante ) { this._tools.tooast( { title: "Error falta Nombre de representante o persona a cargo ", icon: "error"}); return false; }
    if( !this.data.ciudadDonacion ) { this._tools.tooast( { title: "Error falta Ciudad donde quisiera que se hiciera la entrega de la donacion ", icon: "error"}); return false; }
    if( !this.data.direccionDonacion ) { this._tools.tooast( { title: "Error dirección de entrega donacion ", icon: "error"}); return false; }
    if( !this.data.numeroRepresentante ) { this._tools.tooast( { title: "Error falta Número llamadas de representante o pesona a cargo ", icon: "error"}); return false; }
    if( !this.data.usuario ) { this._tools.tooast( { title: "Error falta Usuario ", icon: "error"}); return false; }
    if( !this.data.descripcion ) { this._tools.tooast( { title: "Error falta Descripcion ", icon: "error"}); return false; }
    return true;
  }

}
