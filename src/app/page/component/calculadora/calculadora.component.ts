import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';
import { NivelService } from 'src/app/servicesComponents/nivel.service';
export interface CalculadorData {
  categoria?: string,
  referidos?: number,
  recompActivacionInvitados?: number,
  gananciasDiariasClick?: number,
  cantidadMiniAnunciosNumeroInvitados?: string,
  gananciasMensualMinianuncios?: number,
  valorPagarClickReferidos?: number,
  recomPensaDiariaInvitado?: number,
  recomPensaMes?: number,
  totalGananciasMensualesInvitado?: number,
  totalMes?: number
};

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.scss']
})
export class CalculadoraComponent implements OnInit {
  cantidadReferidos: any = 1;
  nivel = '';
  listCategoria:any = [];
  data:CalculadorData = {};
  constructor(
    public _model: NivelService,
    public _tools: ToolsService
  ) { }

  ngOnInit() {
    // console.log(this.data)
    this._model.get({ where:{ }, sort: "referidos ASC", limit: 100 } ).subscribe(
      (response: any) => {
        //console.log(response);
        this.listCategoria = response.data;
        this.calcular();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  async calcular() {
    console.log(this.cantidadReferidos, this.listCategoria);
    if (this.cantidadReferidos === null) { this.cantidadReferidos = 0; return;}
    this.listCategoria = _.orderBy(this.listCategoria, ['referidos', 'asc']);
    for(let row of this.listCategoria){
      console.log( row.referidos<=this.cantidadReferidos,row.referidos )
      if( row.referidos <= this.cantidadReferidos){
        // console.log(row);
        let gruporeferidos = this.calcularMinianunciosInvitados(row);
        this.data = {
          categoria: row.title,
          recompActivacionInvitados: ( row.recompActivacionInvitados * 5 ) * this.cantidadReferidos,
          gananciasDiariasClick: (( row.cantidadminianuncios * 100 ) * row.cantidadminianunciosdiarios)+(134*5*30),
          cantidadMiniAnunciosNumeroInvitados: gruporeferidos + ` Actividades a $ ${ row.coinclickreferido } Total al Mes $ ${ this._tools.monedaChange( 3, 2, (( gruporeferidos * row.coinclickreferido ) * 30) || 0) }`,
          gananciasMensualMinianuncios: ((row.coinclickreferido * 5) * 30) * this.cantidadReferidos,
          valorPagarClickReferidos: row.coinclickreferido,
          recomPensaDiariaInvitado: row.coinclickreferido * 5,
          recomPensaMes: (((row.coinclickreferido * 5) *this.cantidadReferidos) * 30),
          totalGananciasMensualesInvitado: 0,
          totalMes: 0
        };
        this.data.totalGananciasMensualesInvitado = (this.data.recompActivacionInvitados + 
          this.data.gananciasMensualMinianuncios) + this.data.recomPensaMes ;

        this.data.totalMes = this.data.totalGananciasMensualesInvitado + this.data.gananciasDiariasClick;
      }
    }
  }
  calcularMinianunciosInvitados(row){
    let grupo = 0;
    let count = 0;
    for(var i = 0; i < this.cantidadReferidos; i++){
      // console.log(i);
      count++;
      if(count === row.countminireg){
        grupo++;
        count=0;
      }
    }
    return grupo;
  }
}
