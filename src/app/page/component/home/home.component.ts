import { Component, OnInit } from '@angular/core';
import { ApexChartService } from 'src/app/theme/shared/components/chart/apex-chart/apex-chart.service';
import { ChartDB } from 'src/app/fack-db/chart-data';
import { PublicacionService } from 'src/app/servicesComponents/publicacion.service';
import { ActividadService } from 'src/app/servicesComponents/actividad.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { ToolsService } from 'src/app/services/tools.service';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  public chartDB: any;
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
  filtro:string;
  disabledBtn:boolean = false;
  fotos:any;
  content:any;

  constructor(
    public apexEvent: ApexChartService,
    public _publicacion: PublicacionService,
    private _Actividad: ActividadService,
    private _store: Store<STORAGES>,
    private _archivo: ArchivosService,
    private _tools: ToolsService,
  ) { 
    this.chartDB = ChartDB;
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if (!store) return false;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() {
    //if( Object.keys( this.dataUser ).length > 0) this._Actividad.generarActividad({ user: this.dataUser.id }).subscribe((res:any)=> console.log(res));
  }

  async crearComentario(){
    if( this.disabledBtn ) return false;
    let result = await this.procesoSubidaImagen();
    let data:any = {
      title: "Publicacion",
      descripcion: this.filtro,
      type: "publicacion",
      content: this.fotos,
      tipolink: "otro",
      user: this.dataUser.id,
      autocreo: false
    };
    this.disabledBtn = true;
    this._publicacion.create( data ).subscribe( ( res:any )=>{
      console.log( res );
      this.filtro = "";
      this.disabledBtn = false;
    },( )=> { this.disabledBtn = false; });
  }

  async datafiles(ev: any) {
    //console.log( ev, this.file );
    this.fotos = [];
    try {
      this.fotos = ev.target.files;
    } catch (error) { }
  }

  procesoSubidaImagen() {
    let file = this.fotos[0];
    return new Promise(resolve => {
      let form: any = new FormData();
      form.append('file', file);
      this._tools.ProcessTime({ title: "subiendo imagen",html: "..." });
      this._archivo.create(form).subscribe((res: any) => {
        //console.log(form);
        // this._tools.tooast({ title: "subido exitoso" });
        this.fotos = res.files;
        this.content = "";
        resolve( true );
      }, error => { this._tools.tooast({ title: "Subido Error", icon: "error" }); resolve( false ) })
    });
  }

}
