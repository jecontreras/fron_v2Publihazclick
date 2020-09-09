import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { UserNivelService } from 'src/app/servicesComponents/user-nivel.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicacionService } from 'src/app/servicesComponents/publicacion.service';

@Component({
  selector: 'app-view-perfil',
  templateUrl: './view-perfil.component.html',
  styleUrls: ['./view-perfil.component.scss']
})
export class ViewPerfilComponent implements OnInit {

  public data: any = { cabeza: {} };
  public url: string = environment.urlFront;
  public dataUser: any = {};
  public progress: boolean = true;
  id:string;
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

  constructor(
    private _user: UsuariosService,
    private _userNivel: UserNivelService,
    private _store: Store<STORAGES>,
    private activate: ActivatedRoute,
    private Router: Router,
    public _publicacion: PublicacionService,

  ) {
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if (!store) return false;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() {
    this.id = (this.activate.snapshot.paramMap.get('id'));
    this.progress = true;
    if( this.id ) this.getCabeza();
    else this.Router.navigate( [ "/portada/index" ] );
  }

  getCabeza() {
    this.query.where.user = this.id;
    this._user.get({ where: { id: this.id } })
      .subscribe((res: any) => {
        res = res.data[0];
        if (!res) return false;
        this.data.cabeza = res;
        this.progress = false;
        this.getnivel(res);
      },( error:any )=> this.progress = false );
  }
  getnivel(obj: any) {
    this._userNivel.get({ where: { user: obj.id, nivel: { '!=': null } }, sort: "createdAt DESC" })
      .subscribe((response: any) => {
        response = response.data[0];
        if (!response) return false;
        this.data.cabeza.nivel = response.nivel.title;
      }
      );
  }

}
