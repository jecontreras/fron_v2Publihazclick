import { Component, OnInit } from '@angular/core';
import { NivelService } from 'src/app/servicesComponents/nivel.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent implements OnInit {

  cantidadReferidos: any = 0;
  nivel = '';
  listCategoria:any = [];
  query:any = {
    where:{},
    limit: 100,
    sort: "referidos ASC"
  };
  constructor(
    public _nivel: NivelService
  ) { }

  ngOnInit() {
    // console.log(this.data)
    this._nivel.get( this.query ).subscribe(
      (response: any) => {
        this.listCategoria = response.data;
        for(let row of this.listCategoria){
          row.recompActivacionInvitados=(row.recompActivacionInvitados*5);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
