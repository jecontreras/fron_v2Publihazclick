import { Component, OnInit, Input } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
const URL = environment.urlFront;

@Component({
  selector: 'app-tools-publicacion',
  templateUrl: './tools-publicacion.component.html',
  styleUrls: ['./tools-publicacion.component.scss']
})
export class ToolsPublicacionComponent implements OnInit {
  
  public listRow: any = [];
  public count: number = 0;
  
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  @Input() _modelo: any;
  @Input() query: any;
  @Input() config: any;

  tarea:any = {
    completado: 0,
    restante: 0
  };

  progreses:boolean = false;
  btnDisabled:boolean = false;

  constructor(
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    console.log( this.config );
    this.getRow();
  }

  getRow(){
    this.progreses = true;
    this._modelo.get(this.query).subscribe((res:any)=> this.procesoGet( res ), (error)=> { this.progreses = false; this._tools.tooast( { title: "Error de servidor", icon: "error" } )} );
  }
  
  openPublic( item ){
    let url:string = item.content;
    if( this.config.vista == "tareas" ) { 
      if( item.estado == "activo"){
        this.tarea.completado++;
        this.tarea.restante--;
        console.log( this.tarea );
      }
      item.estado = "realizado"; url = URL+`/publicacionviews/${ item.id }`;
    }
    //console.log( url );
    window.open( url );
  }

  onScroll(){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.query.page++;
       this.getRow();
     }
   }

  procesoGet( res:any ){
    this.progreses = false;
    res.data = _.map( res.data, row =>{
      if(row.estado == "activo") this.tarea.restante++;
      else this.tarea.faltante++;
      if(!row.publicacion) return {
        fotoUser: row.user.foto,
        userName: row.user.username,
        ...row
      };
      else return {
        titulo: row.publicacion.titulo,
        idPublicacion: row.publicacion.id,
        descripcion: row.publicacion.descripcion,
        type: row.publicacion.type,
        content: row.publicacion.content,
        imgdefault: row.publicacion.imgdefault,
        fotoUser: row.publicacion.user.foto,
        userName: row.publicacion.user.username,
        ... row
      }
    });
    this.listRow = _.unionBy(this.listRow || [], res.data, 'id');
    this.count = res.count;
        
    if (res.data.length === 0 ) {
      this.notEmptyPost =  false;
    }
    this.notscrolly = true;
  }

  refActivadades(){
    this.btnDisabled = true;
    this._modelo.generarActividad({ user: this.query.where.user }).subscribe((res:any)=> { console.log(res); this.btnDisabled = false; this.getRow();  }, ()=> this.btnDisabled = false );
  }

  async procesoLikes( item:any, opt ){
    if( this.btnDisabled ) return false;
    this.btnDisabled = true;
    let data:any = { id: item.id, publicacion: item.id, user: item.user.id };
    let result:any = await this.getPublicacion( { where: { id: item.id } } );
    if( !result ) return false;
    if( opt == 'like' ) { 
      item.check = true;
      item.check2 = false;
      data.megusta = ( result.megusta || 0 ) + 1;
      data.tipo = "megusta";
      data.puntos = data.megusta;
      item.megusta = data.megusta;
    }
    else {
      item.check2 = true;
      item.check = false;
      data.nomegusta = ( result.nomegusta || 0 ) + 1;
      data.tipo = "nomegusta";
      data.puntos = data.nomegusta;
      item.nomegusta = data.nomegusta;
    }
    await this.nextlikes( data );
    this.btnDisabled = false;
  }

  async getPublicacion( data ){
    return new Promise( resolve =>{
      this._modelo.get( data ).subscribe(( res:any )=> {
        res = res.data[0];
        if( !res ) return resolve( false );
        resolve( res );
      },()=>resolve( false ))
    });
  }

  async nextlikes( data:any ){
    return new Promise( resolve =>{
      this._modelo.updateMegusta( data ).subscribe(( res:any )=>{
        resolve( true );
      },( )=> { this._tools.tooast( "Tenemos problemas ..."); resolve( false ); });
    });
  }

}
