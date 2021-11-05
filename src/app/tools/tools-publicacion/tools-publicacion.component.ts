import { Component, OnInit, Input } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import { PublicacionService } from 'src/app/servicesComponents/publicacion.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
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
  dataUser:any = {};
  disabledPublic:boolean = false;

  constructor(
    public _tools: ToolsService,
    private _Publicacion: PublicacionService,
    private _store: Store<STORAGES>
  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
      try {
        if( Object.keys( this.dataUser ).length >0 ){
          if( this.dataUser.miPaquete ){
            if( this.dataUser.miPaquete.cantidaddepublicidad >0 ) this.disabledPublic = false;
            else this.disabledPublic = true;
          }else{
            this.disabledPublic = true;
          }
        }
      } catch (error) {}
    });
  }

  ngOnInit() {
    console.log( this.config );
    this.getRow();
  }

  getRow(){
    this.progreses = true;
    this._modelo.get(this.query).subscribe((res:any)=> this.procesoGet( res ), (error)=> { this.progreses = false; this._tools.tooast( { title: "Error de servidor", icon: "error" } )} );
  }
  
  openPublic( item ){
    if( !this.disabledPublic && this.dataUser.id ) return this._tools.tooast( { title: "En estos momento no puedes hacer ninguna actividad hasta que consumas tus publicaciones a crear", icon: "error" } );
    let url:string = item.content;
    if( this.config.vista == "tareas" || this.config.vista == "publicidad"  ) { 
      if( item.estado == "activo" && this.config.vista == "tareas"){
        this.tarea.completado++;
        this.tarea.restante--;
        console.log( this.tarea );
      }
      item.estado = "realizado"; url = URL+`/publicacionviews/${ item.id }`;
    }

    if( this.config.vista == 'donar') { url = URL+`/publicacionviews/${ item.id }`; }
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
      else this.tarea.completado++;
      if(!row.publicacion) return {
        fotoUser: row.user.foto,
        userPubli: row.user.id,
        userName: row.user.username,
        ...row
      };
      else return {
        titulo: row.publicacion.titulo,
        megusta: row.publicacion.megusta,
        nomegusta: row.publicacion.nomegusta,
        idPublicacion: row.publicacion.id,
        descripcion: row.publicacion.descripcion,
        type: row.publicacion.type,
        content: row.publicacion.content,
        imgdefault: row.publicacion.imgdefault,
        fotoUser: row.publicacion.user.foto,
        userName: row.publicacion.user.username,
        userPubli: row.publicacion.user.id,
        ... row
      }
    });
    this.listRow = _.unionBy(this.listRow || [], res.data, 'id');
    this.count = res.count;
        
    if (res.data.length === 0 ) {
      this.notEmptyPost =  false;
    }
    this.notscrolly = true;
    let data:any = {};
    for( let row of this.listRow ){
      data = row;
      if( row.publicacion ) data = row.publicacion;
      this.getLikesUser( data );
    }
    let interval = setInterval(()=>{
      if( this.config.vista === 'tareas' ) if( this.listRow.length == 0) { this.refActivadades(); clearInterval( interval ) }
    }, 6000 );
  }

  getLikesUser( row:any ){
    return new Promise( resolve =>{
      this._Publicacion.getMegusta( { where: { publicacion: row.id, user: this.query.user } } ).subscribe(( res:any )=>{
        res = res.data[0];
        if( !res ) return resolve( false );
        else {
          if( res.tipo == 'megusta' ) row.check = true;
          else row.check2 = true;
        }
        resolve( res );
      });
    })
  }

  refActivadades(){
    this.btnDisabled = true;
    this._modelo.generarActividad({ user: this.query.where.user }).subscribe((res:any)=> { console.log(res); this.btnDisabled = false; this.getRow();  }, ()=> this.btnDisabled = false );
  }

  async procesoLikes( item:any, opt ){
    let clon:any = {};
    if( item.publicacion ) { clon = _.clone( item ); item = item.publicacion;}
    console.log( item );
    if( this.btnDisabled ) return false;
    this.btnDisabled = true;
    let users:any = item.user.id;
    if( Object.keys( this.dataUser ).length > 0 ) users = this.dataUser.id;
    let data:any = { id: item.id, publicacion: item.id, user: users };
    let result:any = await this.getPublicacion( { where: { id: item.id } } );
    console.log( result );
    if( !result ) return false;
    if( opt == 'like' ) { 
      if( item.check ) result.megusta = result.megusta-1;
      if( item.check2 ) { data.nomegusta--; item.nomegusta--; result.nomegusta = result.nomegusta-1;}
      item.check = true;
      item.check2 = false;
      data.megusta = ( result.megusta || 0 ) + 1;
      data.tipo = "megusta";
      data.puntos = data.megusta;
      item.megusta = data.megusta;
    }
    else {
      if( item.check ) { data.megusta--; item.megusta--; result.megusta = result.megusta-1; }
      if( item.check2 ) result.nomegusta = result.nomegusta-1;
      item.check2 = true;
      item.check = false;
      data.nomegusta = ( result.nomegusta || 0 ) + 1;
      data.tipo = "nomegusta";
      data.puntos = data.nomegusta;
      item.nomegusta = data.nomegusta;
    }
    if( !data.megusta ) data.megusta = 0;
    if( !data.nomegusta ) data.nomegusta = 0;
    
    await this.nextlikes( data );
    this.btnDisabled = false;
    if( clon.publicacion ) {
      clon.check = item.check;
      clon.check2 = item.check2;
      clon.megusta = item.megusta;
      clon.nomegusta = item.nomegusta;
      item = clon;
    }
  }

  async getPublicacion( data ){
    return new Promise( resolve =>{
      this._Publicacion.get( data ).subscribe(( res:any )=> {
        res = res.data[0];
        if( !res ) return resolve( false );
        resolve( res );
      },()=>resolve( false ))
    });
  }

  async nextlikes( data:any ){
    return new Promise( resolve =>{
      this._Publicacion.updateMegusta( data ).subscribe(( res:any )=>{
        resolve( true );
      },( )=> { this._tools.tooast( "Tenemos problemas ..."); resolve( false ); });
    });
  }

}
