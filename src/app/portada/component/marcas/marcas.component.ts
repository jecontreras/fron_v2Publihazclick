import { Component, OnInit, ViewChild } from '@angular/core';
import { NgImageSliderComponent } from 'ng-image-slider';
import { ToolsService } from 'src/app/services/tools.service';
import { PublicacionService } from 'src/app/servicesComponents/publicacion.service';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.scss']
})
export class MarcasComponent implements OnInit {
  
  imageObject:any = [];
  listGaleria:any = [];

  @ViewChild('nav', {static: true}) ds: NgImageSliderComponent;
  sliderWidth: Number = 1119;
  sliderImageWidth: Number = 358;
  sliderImageHeight: Number = 238;
  sliderArrowShow: Boolean = true;
  sliderInfinite: Boolean = true;
  sliderImagePopup: Boolean = false;
  sliderAutoSlide: Number = 1;
  sliderSlideImage: Number = 1;
  sliderAnimationSpeed: any = 1;

  constructor(
    private _tools: ToolsService,
    private _publicacion: PublicacionService
  ) { }

  ngOnInit() {
    this.getRow();
  }

  getRow(){
    this._publicacion.get( { where: {
      autocreo: false,
      type: "marcas",
      estado: "activo"
    },
    sort: "createdAt ASC", limit: 100 } ).subscribe( ( res:any ) =>{
      res = res.data;
      for( let row of res ) this.imageObject.push(
        {
          image: row.imgdefault,
          thumbImage: row.imgdefault,
          alt: row.content,
          check: true,
          id: 1,
          ids: 1,
          title: row.title
        }
      );
    });
  }


  imageOnClick(obj:any) {
    return obj;
    // let data =  this.listProductos.find( (row:any )=> row.id == this.imageObject[obj].id);
    // if( !data ) return false;
    // this.viewProducto( data );
  }

  arrowOnClick(event) {
      // console.log('arrow click event', event);
  }

  lightboxArrowClick(event) {
      // console.log('popup arrow click', event);
  }

  prevImageClick() {
      this.ds.prev();
  }

  nextImageClick() {
      this.ds.next();
  }

}
