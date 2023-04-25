import { Injectable } from '@angular/core';
import { ServiciosService } from 'src/app/services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class MarketsService {
  urlTrade:string = "";
  constructor(
    private _model: ServiciosService
  ) { }

  getMarkets(query:any){
    return this._model.trade('http://localhost:1331/motion/markets',query, 'post');
  }
  getMarketsDetails( query ){
    return this._model.trade('http://localhost:1331/motion/details',query, 'post');
  }
  getMarketsHistory( query ){
    return this._model.trade('http://localhost:1331/motion/history',query, 'post');
  }


}
