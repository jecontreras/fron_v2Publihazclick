import { Component, OnInit, ViewChild } from '@angular/core';
import { NotasService } from 'src/app/servicesComponents/notas.service';
import { PaquetesService } from 'src/app/servicesComponents/paquetes.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { resolve } from 'url';
import { ToolsService } from 'src/app/services/tools.service';
import { NgImageSliderComponent } from 'ng-image-slider';
import { PublicacionService } from 'src/app/servicesComponents/publicacion.service';

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
  sliderAnimationSpeed: any = 2.4;
  imageObject: any = [];
  imageObject2: any = [];

  constructor(
    private _nota: NotasService,
    private _store: Store<STORAGES>,
    private _paquete: PaquetesService,
    private _tools: ToolsService,
    private _publicacion: PublicacionService
  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });


    if( (window.innerWidth >= 1000) ) this.sliderImageWidth = 700;
    if( (window.innerWidth <= 1000) ) this.sliderImageWidth = 700;
    if( (window.innerWidth <= 770) ) this.sliderImageWidth = 460;
    if( (window.innerWidth <= 520) ) this.sliderImageWidth = 420;
    if( (window.innerWidth <= 450) ) this.sliderImageWidth = 370;
    if( (window.innerWidth <= 420) ) this.sliderImageWidth = 300;

  }

  ngOnInit() {
    this.listaBanner();
    this.getNotas();
    this.getBanner();
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
          if( Object.keys( this.dataUser.miPaquete ).length > 0 ) {
            if( this.dataUser.miPaquete.diasFaltantes == 0 ) formatiado.push( row );
          }
          else formatiado.push( row );
        }
        else formatiado.push( row );
      }
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

}
