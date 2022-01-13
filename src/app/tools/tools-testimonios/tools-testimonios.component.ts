import { Component, OnInit } from '@angular/core';
import { TestimoniosService } from 'src/app/servicesComponents/testimonios.service';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';

@Component({
  selector: 'app-tools-testimonios',
  templateUrl: './tools-testimonios.component.html',
  styleUrls: ['./tools-testimonios.component.scss']
})
export class ToolsTestimoniosComponent implements OnInit {

  listRow:any = [];
  urlRegistro:string = `${ environment.urlFront }/registro/`;
  query:any = {
    where:{
      estado: 0
    },
    page: 0,
    sort: 'fecha DESC',
    limit: 15
  };
  dataUser:any = {};
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;

  constructor(
    private _testimonios: TestimoniosService
  ) { 
  }

  ngOnInit(): void {
    this.getRow();
  }

  onScroll(){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.query.page++;
       this.getRow();
     }
  }

  getRow(){
    this._testimonios.get( this.query ).subscribe(( res:any )=>{
      this.listRow = _.unionBy( this.listRow || [], res.data, 'id');
    });
  }

  openFoto( url:string ){
    window.open(url);
  }

}
