import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgImageSliderComponent } from 'ng-image-slider';
import { STORAGES, USER } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ActividadService } from 'src/app/servicesComponents/actividad.service';
import { PublicacionService } from 'src/app/servicesComponents/publicacion.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
@Component({
  selector: 'app-publicidad',
  templateUrl: './publicidad.component.html',
  styleUrls: ['./publicidad.component.scss']
})
export class PublicidadComponent implements OnInit {

  breakpoint: number;
  disabled:boolean = true;
  public query:any = { 
    where:{ 
      prioridad: "tarea-diaria",
      user: {},
      create: true
    }, 
    sort: "createdAt DESC",
    limit: 5,
    page: 0
   };

   public query2:any = { 
    where:{ 
      // prioridad: "tarea-diaria",
      // create: true
    }, 
    sort: "createdAt DESC",
    limit: 10,
    page: 0
   };

   dataUser:any = {};
   config:any = {
    vista: "publicidad"
  };

  config2:any = {
    vista: "publicidad"
  };

  dineros:any = {
    miDinero: 0,
    miDonacion: 0
  };

  @ViewChild('nav', { static: true }) ds: NgImageSliderComponent;
  sliderWidth: Number = 100;
  sliderImageWidth: Number = 300;
  sliderImageWidth2: Number = 300;
  sliderImageHeight: Number = 900;
  sliderImageHeight2: Number = 55;
  sliderArrowShow: Boolean = true;
  sliderInfinite: Boolean = true;
  sliderImagePopup: Boolean = false;
  sliderAutoSlide: Number = 1;
  sliderSlideImage: Number = 1;
  sliderAnimationSpeed: any = 2.4;
  imageObject: any = [];
  imageObject2: any = [];

  formatoMoneda:any = {};
  
  constructor(
    public _publicidad: PublicacionService,
    private _user: UsuariosService,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
    public _Actividad: ActividadService,
  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
      this.query.where.user = this.dataUser.id;
      try {
        this.dineros.miDinero = this.dataUser.cantidadPuntos.valorTotal || 0;
        this.dineros.miDonacion = this.dataUser.cantidadPuntos.donacion || 0;
        console.log( this.dineros );
      } catch (error) { }
    });

    if( (window.innerWidth >= 1000) ) this.sliderImageWidth2 = 700;
    if( (window.innerWidth <= 1000) ) this.sliderImageWidth2 = 700;
    if( (window.innerWidth <= 770) ) this.sliderImageWidth2 = 460;
    if( (window.innerWidth <= 520) ) this.sliderImageWidth2 = 420;
    if( (window.innerWidth <= 450) ) this.sliderImageWidth2 = 370;
    if( (window.innerWidth <= 420) ) this.sliderImageWidth2 = 300;

  }

  async ngOnInit() {
    this.formatoMoneda = this._tools.formatoMoneda;
    this.getBanner();
    this.imageObject.push(
      {
        image: "https://www.oohlatam.com/wp-content/uploads/2019/12/C%C3%B3mo-le-ir%C3%A1-a-la-Publicidad-Exterior-en-el-2020.jpg",
        thumbImage: "https://www.oohlatam.com/wp-content/uploads/2019/12/C%C3%B3mo-le-ir%C3%A1-a-la-Publicidad-Exterior-en-el-2020.jpg",
        alt: "https://www.google.com.co",
        id: 1,
      },
      {
        image: "https://www.oohlatam.com/wp-content/uploads/2019/12/C%C3%B3mo-le-ir%C3%A1-a-la-Publicidad-Exterior-en-el-2020.jpg",
        thumbImage: "https://www.oohlatam.com/wp-content/uploads/2019/12/C%C3%B3mo-le-ir%C3%A1-a-la-Publicidad-Exterior-en-el-2020.jpg",
        alt: "https://www.google.com.co",
        id: 2,
      },
    );
    setInterval( ()=>{ this.breakpoint = ( window.innerWidth <= 600 ) ? 1 : 6; if( this.breakpoint == 1 ) this.disabled = false; else this.disabled = true; }, 1000 );
    let resultado:any = await this.validadorUser();
    if( resultado ){ if( Object.keys( this.dataUser ).length > 0) this._Actividad.generarActividad({ user: this.dataUser.id }).subscribe((res:any)=> console.log(res)); }
    let result:any = await this._tools.confirm( { title: "Ayuda con un click y dona a fundaciones", confir:"Aceptar"} );
  }

  async validadorUser(){
    return new Promise( resolve =>{
      this._user.validaorIp( { where: { } } ).subscribe(( res:any )=>{
        console.log( "***", res );
        if( res.status == 200 ) { this._user.ProcesoStorages( res.data ); resolve( true ); }
        else {
          this._user.create( this.armandoData( res.data ) ).subscribe(( res:any )=>{
            console.log( res );
            if( res.status == 200 ){
              this._user.ProcesoStorages( res.data );
              resolve( true );
            }else { this._tools.tooast( { title: "Error en las acciones", icon:'error'}); resolve( false ); }
          },( error:any )=> resolve( false ) );
        }
      },( error:any )=> resolve( false ) );
    });
  } 
  
  armandoData( ip ): object{
    let data:USER = {
      "cabeza": "5cedda91520be0ef68567182",
      "indicativo": "57",
      "rol": "user",
      "username": ip,
      "name": "Usuario "+ ip,
      "email": ip + "@email.com",
      "celular": 213,
      "password": ip,
      "confirpassword": ip,
      "pais": "12365",
      "ipUser": ip
    };
    return data;
  }

  getBanner(){
    this._publicidad.get( { where:{ type:"banner", estado:"activo" }, sort: "clicks ASC" }).subscribe((res:any)=>{
      res = res.data;
      let count:number = 0;
      for( let row of res ){
        count++;
        this.imageObject2.push(
          {
            image: row.imgdefault,
            thumbImage: row.imgdefault,
            alt: row.content,
            id: count,
          }
        );
      }
      this.updateBanner( res );
    });
  }

  async updateBanner( data:any ){
    for(let row of data) await this.putBanner( row );
  }

  putBanner( data ){
    return new Promise( resolve => {
      let query:any = { id: data.id, clicks: data.clicks+1 };
      this._publicidad.update( query ).subscribe(( res:any )=>resolve(res),(error)=>resolve(false));
    });
  }


  openaVenta() {
    let url: string = `https://lamejorfabricadeca.wixsite.com/misitio-1`;
    window.open(url);
  }

  arrowOnClick(event) {
    //console.log('arrow click event', event);
  }

  lightboxArrowClick(event) {
    //console.log('popup arrow click', event);
  }

  prevImageClick() {
    this.ds.prev();
  }

  nextImageClick() {
    this.ds.next();
  }

  imageOnClick(ev:any){
    // console.log("hey");
    this.openaVenta();
  }
  
}
