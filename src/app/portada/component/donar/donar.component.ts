import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { UserAction } from 'src/app/redux/app.actions';
import { ToolsService } from 'src/app/services/tools.service';
import { ActividadService } from 'src/app/servicesComponents/actividad.service';
import { PublicacionService } from 'src/app/servicesComponents/publicacion.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';

@Component({
  selector: 'app-donar',
  templateUrl: './donar.component.html',
  styleUrls: ['./donar.component.scss']
})
export class DonarComponent implements OnInit {

  dataUser: any = {};

  public query2: any = {
    where: {
      estado: ['activo', 'consumido'],
      autocreo: false,
      type: ['url']
    },
    sort: "createdAt DESC",
    limit: 30,
    page: 0
  };
  config2: any = {
    vista: "donar"
  };

  data: any = {
    indicativo: "57",
    rol: "user",
    pais: "Colombia"
  };
  disabled: boolean = false;

  constructor(
    public _actividad: ActividadService,
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
    private _user: UsuariosService,
    public _publicacion: PublicacionService,
    private _router: Router
  ) {
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if (!store) return false;
      this.dataUser = store.user || {};
    });
  }

  async ngOnInit() {

  }


}
