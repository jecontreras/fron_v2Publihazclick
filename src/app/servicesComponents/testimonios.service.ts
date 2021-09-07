import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class TestimoniosService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('testimonios/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('testimonios',query, 'post');
  }
  update(query:any){
    return this._model.querys('testimonios/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('testimonios/'+query.id, query, 'delete');
  }
}