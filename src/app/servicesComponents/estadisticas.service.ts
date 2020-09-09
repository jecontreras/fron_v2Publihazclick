import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  constructor(
    private _model: ServiciosService
  ) { }

  tablero(query:any){
    return this._model.querys('estadisticas/tablero',query, 'post');
  }
}