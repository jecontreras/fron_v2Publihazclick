import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrls: ['./amigos.component.scss']
})
export class AmigosComponent implements OnInit {
  
  dataUser:any = {};
  viewsVista:string = 'misamigos';
  config:any = {
    query: {},
    vista: 'misamigos'
  };
  config2:any = {
    query: {},
    vista: 'agregaramigos'
  };

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


  openVenta( opt:string ){
    this.viewsVista = opt;
  }

}
