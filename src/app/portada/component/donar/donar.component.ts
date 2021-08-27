import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { PublicacionService } from 'src/app/servicesComponents/publicacion.service';

@Component({
  selector: 'app-donar',
  templateUrl: './donar.component.html',
  styleUrls: ['./donar.component.scss']
})
export class DonarComponent implements OnInit {

  public query:any = { where:{ 
    estado: ['activo', 'consumido'],
    autocreo: false,
    type: ['img', 'url', 'publicacion']
   }, 
   sort: "createdAt DESC",
   limit: 30,
   page: 0
  };
  config:any = {
    vista: "publicacion"
  };
  dataUser:any = {};

 
   constructor(
     public _publicacion: PublicacionService,
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
