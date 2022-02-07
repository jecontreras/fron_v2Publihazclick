import { Component, OnInit, ViewChild } from '@angular/core';
import { NotasService } from 'src/app/servicesComponents/notas.service';
import { PaquetesService } from 'src/app/servicesComponents/paquetes.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { ToolsService } from 'src/app/services/tools.service';
import { NgImageSliderComponent } from 'ng-image-slider';
import { PublicacionService } from 'src/app/servicesComponents/publicacion.service';
import * as _ from 'lodash';
import { PuntosResumenService } from 'src/app/servicesComponents/puntos-resumen.service';
import { UserAction } from 'src/app/redux/app.actions';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss']
})
export class AlertasComponent implements OnInit {

  listAlertas:any = [];
  dataUser:any = [];
  
  @ViewChild('nav', { static: true }) ds: NgImageSliderComponent;
  sliderWidth: Number = 1204;
  sliderImageWidth: Number = 618;
  sliderImageWidth2: Number = 300;
  sliderImageHeight: Number = 44;
  sliderImageHeight2: Number = 55;
  sliderArrowShow: Boolean = true;
  sliderInfinite: Boolean = true;
  sliderImagePopup: Boolean = true;
  sliderAutoSlide: Number = 1;
  sliderSlideImage: Number = 1;
  sliderAnimationSpeed: any = 3.2;
  sliderAnimationSpeed2:any = 4.9;
  imageObject: any = [];
  imageObject2: any = [];

  puntosGanados:number = 0;
  donaciones:number = 0;
  disabled:boolean = false;
  formatoMoneda:any = {};

  constructor(
    private _nota: NotasService,
    private _store: Store<STORAGES>,
    private _paquete: PaquetesService,
    private _tools: ToolsService,
    private _publicacion: PublicacionService,
    private _puntosResumen: PuntosResumenService
  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      this.dataUser = ( _.clone( store.user ) ) || {};
      try {
        if( this.dataUser.cantidadPuntos ) {
          if( this.puntosGanados != this.dataUser.cantidadPuntos.valorTotal ) this._tools.tooast({ title: "Felicitaciónes Ganando Dinero... " + ( _tools.monedaChange( 3, 2, this.dataUser.cantidadPuntos.valorTotal - this.puntosGanados) ) });
          this.puntosGanados = this.dataUser.cantidadPuntos.valorTotal || 0;
          this.donaciones = this.dataUser.cantidadPuntos.donacion || 0;
        }
      } catch (error) { }
    });


    if( (window.innerWidth >= 1000) ) this.sliderImageWidth = 700;
    if( (window.innerWidth <= 1000) ) this.sliderImageWidth = 700;
    if( (window.innerWidth <= 770) ) this.sliderImageWidth = 460;
    if( (window.innerWidth <= 520) ) this.sliderImageWidth = 420;
    if( (window.innerWidth <= 450) ) this.sliderImageWidth = 370;
    if( (window.innerWidth <= 420) ) this.sliderImageWidth = 300;

  }

  ngOnInit() {
    this.formatoMoneda = this._tools.formatoMoneda;
    this.listaBanner();
    this.getNotas();
    this.getBanner();
    setInterval(()=> this.getMisPuntos() ,4000 );
  }

  getBanner(){
    this._publicacion.get( { where:{ type:"banner", estado:"activo" }, sort: "clicks ASC" }).subscribe((res:any)=>{
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

  getMisPuntos(){
    if( Object.keys(this.dataUser).length == 0 ) return false;
    if( this.disabled ) return false;
    this.disabled = true;
    this._puntosResumen.get( { where: { user: this.dataUser.id, state: "valido" } } ).subscribe( ( res:any )=>{
      res = res.data[0];
      this.disabled = false;
      if ( !res ) return this.dataUser.cantidadPuntos = { valorTotal: 0 };
      else {
        this.dataUser.cantidadPuntos = res;
        let accion:any = new UserAction( this.dataUser, 'post');
        this._store.dispatch( accion );
      }
    },( error:any )=> { this._tools.presentToast("Error de servidor"); this.disabled = false; } );
  }

  async updateBanner( data:any ){
    for(let row of data) await this.putBanner( row );
  }

  putBanner( data ){
    return new Promise( resolve => {
      let query:any = { id: data.id, clicks: data.clicks+1 };
      this._publicacion.update( query ).subscribe(( res:any )=>resolve(res),(error)=>resolve(false));
    });
  }

  getNotas(){
    this._nota.get( { where: { user: this.dataUser.id, estado:"novisto", tipo:"notificaciones" }}).subscribe(( res:any )=>{
      let formatiado:any = [];
      for( let row of res.data){
        if( row.titulo == 'Paquete Activo Vigente' ) {
          // console.log("entre", this.dataUser );
          /*try {
            if( Object.keys( this.dataUser.miPaquete ).length > 0 ) {
              if( this.dataUser.miPaquete.diasFaltantes == 0 ) formatiado.push( row );
            }
            else formatiado.push( row ); 
          } catch (error) {
            formatiado.push( row ); 
          }*/
        }
        else formatiado.push( row );
      }
      try {
        if( Object.keys( this.dataUser.miPaquete ).length > 0 ) {
          if( this.dataUser.miPaquete.cantidaddepublicidad != 0 && this.dataUser.miPaquete.cantidaddepublicidad != undefined) 
          formatiado.push( 
            {
              titulo: "Primero debes consumir tus publicaciones",
              descripcion: "En estos momento no puedes hacer ninguna actividad hasta que consumas tus publicaciones cantidad faltantes "+ this.dataUser.miPaquete.cantidaddepublicidad || 0,
              id: this._tools.codigo()
            }
          );
        }
      } catch (error) { }
      // console.log( formatiado );
      this.listAlertas = formatiado;
      // console.log( this.listAlertas );
    });
  }

  async activarPaquete( item ){ 
    if( !item.datosepayco ) return false;
    let nota = await this.validarNota( item );
    //console.log("***", nota);
    if( !nota ) return false;
    let activarse = await this.activarse( item.datosepayco );
    if( !activarse ) this._tools.tooast( { title: "Error en el proceso volverlo intentarlo"});
    else { 
      this._tools.tooast({ title: "Proceso exitos en la activacion de tu paquete" });
      let data = {
        id: item.id,
        estado: "visto"
      };
      this.cambiarState( data);
      setTimeout(()=> location.reload(),2000);
      this.eliminar( item );
    }
  }

  validarNota( item:any ){
    return new Promise( resolve =>{
      this._nota.get( { where :{ id: item.id, estado:"novisto" }}).subscribe(( res:any )=>{
        res = res.data[0];
        if( !res ) return resolve( false );
        else return resolve( res );
      },error => resolve( false ));
    });
  }

  private activarse( data:any ){
    return new Promise( resolve =>{
      this._paquete.comprandoPaquete(data).subscribe(( res:any )=>{
        //console.log( res);
        resolve(true);
      },error => resolve( false ));
    });
  }

  private cambiarState( data:any ){
    return new Promise( resolve => this._nota.update( data ).subscribe(( res:any )=>resolve(true),resolve(false)) );
  }

  eliminar( item:any ){
    this.listAlertas = this.listAlertas.filter( ( row:any )=> row.id !== item.id );
    let data = {
      id: item.id,
      estado: "visto"
    };
    this.cambiarState( data );
  }

  listaBanner() {
    var count = 0;
    for (let i = 0; i < 18; i++) {
      count++;
      this.imageObject.push({
        image: `./assets/banner/${count}.jpeg`,
        thumbImage: `./assets/banner/${count}.jpeg`,
        //alt: 'https://lamejorfabricadeca.wixsite.com/misitio-1',
        id: i,
      });
    }
    //console.log(this.imageObject)
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

  imageOnClick2(ev:any){
    console.log("hey", ev, this.imageObject2);
    let url: string = this.imageObject2[ev].alt || `https://lamejorfabricadeca.wixsite.com/misitio-1`;
    window.open(url);
  }

}
