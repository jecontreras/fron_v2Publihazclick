import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('notas/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('notas',query, 'post');
  }
  update(query:any){
    return this._model.querys('notas/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('notas/'+query.id, query, 'delete');
  }
}