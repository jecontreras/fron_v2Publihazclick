import { Component, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { NgImageSliderComponent } from 'ng-image-slider';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { DataDemoAction } from 'src/app/redux/app.actions';
import { ToolsService } from 'src/app/services/tools.service';
import { ActividadService } from 'src/app/servicesComponents/actividad.service';
import { PublicacionService } from 'src/app/servicesComponents/publicacion.service';
import { PuntosService } from 'src/app/servicesComponents/puntos.service';

@Component({
  selector: 'app-publicacionviews',
  templateUrl: './publicacionviews.component.html',
  styleUrls: ['./publicacionviews.component.scss']
})
export class PublicacionviewsComponent implements OnInit {

  data: any = {};

  // id de la actividad
  id: string;
  // compartir params
  ids: string;
  // bloquear ocultar banner
  disabled: boolean = true;
  // tamaño pantalla
  breakpoint: number;
  // url de la publicidad
  url: any;
  // disableActividadrealizada
  disablerealizado: boolean = false;

  // slider
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

  colores = [];
  public siguiente: any = {
    spanis: "",
    titulo: ""
  };
  dataUser: any = {};

  disabledCont: boolean = false;
  dataDemo:any = {

  };
  constructor(
    public _publicidad: PublicacionService,
    private _actividad: ActividadService,
    private activate: ActivatedRoute,
    public Tools: ToolsService,
    private _puntos: PuntosService,
    private _store: Store<STORAGES>
  ) {

    if ((window.innerWidth >= 1000)) this.sliderImageWidth2 = 700;
    if ((window.innerWidth <= 1000)) this.sliderImageWidth2 = 700;
    if ((window.innerWidth <= 770)) this.sliderImageWidth2 = 460;
    if ((window.innerWidth <= 520)) this.sliderImageWidth2 = 420;
    if ((window.innerWidth <= 450)) this.sliderImageWidth2 = 370;
    if ((window.innerWidth <= 420)) this.sliderImageWidth2 = 300;

    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if (!store) return false;
      this.dataUser = store.user || {};
      this.dataDemo = store.dataDemo || { coins: 0, donacion: 0 };
    });

  }

  ngOnInit() {
    this.id = (this.activate.snapshot.paramMap.get('id'));
    this.ids = (this.activate.snapshot.paramMap.get('ids'));
    if (this.ids) { }
    else if (this.id) this.getActividad();
    this.getBanner();
    this.getBannerLayout();
    setInterval(() => { this.breakpoint = (window.innerWidth <= 600) ? 1 : 6; if (this.breakpoint == 1) this.disabled = false; else this.disabled = true; }, 1000);
  }

  getActividad() {
    this._actividad.get({ where: { id: this.id } }).subscribe((res: any) => {
      res = res.data[0];
      this.data = res || {};
      if( res.prioridad == "tarea-diaria" || res.prioridad == "tarea-referidos" ) this.Tools.contadorActividad( 60 );
      else this.Tools.contadorActividad( 10 );
      this.arraydecolor();
      setInterval(() => {
        if (this.Tools.intervalosContador == 0) this.disablerealizado = true;
        console.log(this.disablerealizado);
      }, 2000);
      if (!this.data.id) return this.armandoData();
      try {
        if (this.data.publicacion.type == 'url') this.url = this.Tools.seguridadIfrane(this.data.publicacion.content);
        console.log(this.url)
      } catch (error) { }
      console.log(this.data);
    }, (error: any) => { this.Tools.tooast({ title: "Error al cargar la actividad" }); setTimeout(() => { location.reload(); }, 3000) });
  }

  armandoData() {
    this._publicidad.get({ where: { id: this.id }, limit: 1 }).subscribe((res: any) => {
      res = res.data[0];
      this.data = {
        "createdAt": "2021-10-30T08:32:28.795Z",
        "updatedAt": "2021-10-30T08:32:28.795Z",
        "id": "617d031ce69d3a0016627973",
        "regalo": false, "codigo": "DJQLX7LMDRWBWWJ",
        "prioridad": "tarea-diaria",
        "estado": "activo",
        "url": "",
        "state": 0, "create": "30/10/2021",
        "valor": 134,
        "user": {}, 
        "publicacion": res
      };
      try {
        if (this.data.publicacion.type == 'url') this.url = this.Tools.seguridadIfrane(this.data.publicacion.content);
        console.log(this.url)
      } catch (error) { }
    });
  }

  resolved(obj: any) {
    if (obj.id) this.PagarActividad();
    else { this.Tools.tooast({ title: "Error Al Seleccionar Color", icon: "error" }); this.arraydecolor(); }
  }

  PagarActividad() {
    this.disabledCont = true;
    if( !this.dataUser.id ) return this.PagarDemo();
    this._puntos.generarPuntos({
      codigo: this.Tools.codigo(),
      valor: this.data.valor,
      prioridad: this.data.prioridad,
      user: this.dataUser,
      actividad: this.data.id,
      publicacion: this.data.publicacion.id
    }).subscribe((res: any) => {
      this.Tools.tooast({ title: "Punto Generado" });
      this.disabledCont = false;
      this.cerrarVentana();
      this.disablerealizado = true;
    }, (error: any) => { console.log(error); this.Tools.tooast({ title: error.error, icon: "error" }); this.disabledCont = false; if (error.error) this.disablerealizado = true; });
  }


  PagarDemo(){
    let data:any = {
      coins: this.dataDemo.coins + 124,
      donacion: this.dataDemo.donacion + 10
    };
    let accion = new DataDemoAction( data, 'post');
    this._store.dispatch( accion );
    this.Tools.tooast({ title: "Punto Generado" });
    this.disabledCont = false;
    this.cerrarVentana();
  }








  arraydecolor() {
    this.colores = [
      {
        titulo: 'orange',
        spanis: 'amarrilo',
        posicion: 1
      },
      {
        titulo: 'red',
        spanis: 'rojo',
        posicion: 2
      },
      {
        titulo: 'blue',
        spanis: 'azul',
        posicion: 3
      },
      {
        titulo: 'green',
        spanis: 'verde',
        posicion: 4
      }
    ]
      ;
    var
      rand = this.colores[Math.floor(Math.random() * this.colores.length)],
      posicion = _.random(0, 3)
      ;
    var m = _.orderBy(this.colores, ['posicion', 'age']);
    // console.log(posicion, m);
    if (rand) {
      var
        idx = _.findIndex(this.colores, ['titulo', rand.titulo])
        ;
      if (idx > -1) {
        // console.log(this.colores[idx]);
        this.colores[idx].id = true;
        this.colores[idx].posicion = posicion;
        this.siguiente = {
          spanis: this.colores[idx].spanis,
          titulo: this.colores[idx].titulo
        };
      }

    }
  }

  getBannerLayout() {
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
  }

  getBanner() {
    this._publicidad.get({ where: { type: "banner", estado: "activo" }, sort: "clicks ASC" }).subscribe((res: any) => {
      res = res.data;
      let count: number = 0;
      for (let row of res) {
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

  imageOnClick(ev: any) {
    // console.log("hey");
    this.openaVenta();
  }

  cerrarVentana() {
    setTimeout(() => window.close(), 2000);
  }

}
