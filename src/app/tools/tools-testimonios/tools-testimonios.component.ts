import { Component, OnInit } from '@angular/core';
import { TestimoniosService } from 'src/app/servicesComponents/testimonios.service';
import { environment } from 'src/environments/environment';

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
    limit: 15
  };
  dataUser:any = {};

  constructor(
    private _testimonios: TestimoniosService
  ) { 
  }

  ngOnInit(): void {
    this.getRow();
  }

  getRow(){
    this._testimonios.get( this.query ).subscribe(( res:any )=>{
      this.listRow = res.data;
    });
  }

}
