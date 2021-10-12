import {Component, OnInit} from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { UserAction } from 'src/app/redux/app.actions';
import { ToolsService } from 'src/app/services/tools.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit {
  
  dataUser: any = {};

  constructor(
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
    private Router: Router
  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() { }

  async logout(){
    let accion = new UserAction( this.dataUser, 'drop');
    this._store.dispatch( accion );
    await this._tools.ProcessTime( { title: "Cerrando sesion ..." } );
    this.Router.navigate(['/portada/publihazclick']);
    setTimeout(()=>{
      location.reload();
    },3000)
  }
}
