import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('proyectos/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('proyectos',query, 'post');
  }
  update(query:any){
    return this._model.querys('proyectos/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('proyectos/'+query.id, query, 'delete');
  }
}