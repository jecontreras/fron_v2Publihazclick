import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';

@Component({
  selector: 'app-marcas-anunciantes',
  templateUrl: './marcas-anunciantes.component.html',
  styleUrls: ['./marcas-anunciantes.component.scss']
})
export class MarcasAnunciantesComponent implements OnInit {

  query:any = {
    where: {
      autocreo: false,
      type: "marcas",
      estado: "activo"
    },
    sort: "createdAt ASC",
    page: 0,
    limit: 10
  };
  config:any = {
    vista: "marcas"
  };
  dataUser:any = {};

  constructor(
    private _store: Store<STORAGES>
  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });

  }

  ngOnInit() {
  }

}