import { Component, OnInit, Input } from '@angular/core';
import { ComentariosPubService } from 'src/app/servicesComponents/comentarios-pub.service';
import { ToolsService } from 'src/app/services/tools.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss']
})
export class ComentariosComponent implements OnInit {
  
  ListaComentario:any = [];
  counts:number = 0;
  @Input() data: any;
  query:any = {};
  dataForm:any = {};
  dataUser:any = {};

  constructor(
    private _comentarios: ComentariosPubService,
    private _tools: ToolsService,
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
    this.query = {
      where:{
        // user: this.data.user.id,
        publicacion: this.data.id
      },
      limit: 5
    };
    this.getComentario();
  }

  getComentario(){
    this._comentarios.get( this.query ).subscribe(( res:any )=>{
      this.counts = res.count;
      this.ListaComentario.push(... res.data );
    });
  }

  pushComentario(){
    this.dataForm.publicacion = this.data.id;
    this.dataForm.user = this.dataUser.id;
    this._comentarios.create(this.dataForm).subscribe(( res:any )=>{
      this._tools.tooast( { title: "Comentastes"});
      this.ListaComentario.push( {
        user: this.dataUser,
        comentarios: {
          content: this.dataForm.texto
        },
        createdAt: res.createdAt
      });
      this.dataForm.texto = "";
      console.log( this.ListaComentario );
    },(error)=> this._tools.tooast({ title:"Tenemos problemas de servidor" }));
  }

  checkdelete( item:any){

  }

  deletepublicacion( item:any ){

  }

}
