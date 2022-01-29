import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import { RetirosService } from 'src/app/servicesComponents/retiros.service';
import * as _ from 'lodash';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { TestimoniosService } from 'src/app/servicesComponents/testimonios.service';

@Component({
  selector: 'app-adminretiros',
  templateUrl: './adminretiros.component.html',
  styleUrls: ['./adminretiros.component.scss']
})
export class AdminretirosComponent implements OnInit {

  tablet:any = {
    dataHeader: ["Opciones", "Usuario","Estado","Cantidad","Cedula","Celular","Banco",'Tipo Cuenta','Numero Cuenta','Descripcion','Evidencia','Creado'],
    dataRow: [],
    count: 0
  };
  query:any = {
    where:{ },
    sort: "createdAt DESC",
    page: 0
  };
  vista:string = "home";
  data:any = {};
  progreses:boolean = false;
  public count: number = 0;
  
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  
  dataUser:any = {};
  seartxt:string;
  formatoMoneda:any = {};
  file: any = {
    foto1: []
  };
  disableFile:boolean = false;

  constructor(
    private _tools: ToolsService,
    private _retiros: RetirosService,
    private _archivo: ArchivosService,
    private _testimonios: TestimoniosService
  ) { }

  ngOnInit() {
    this.formatoMoneda = this._tools.formatoMoneda;
    this.getRow();
  }

  onScroll(){
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.query.page++;
       this.getRow();
     }
  }
   
  getRow(){
    this.progreses = true;
    this._retiros.get( this.query ).subscribe( async ( res:any ) =>{

      this.tablet.dataRow = _.unionBy( this.tablet.dataRow || [], res.data, 'id');
      this.tablet.count = res.count;
      this.progreses = false;
      this.notscrolly = true;
      // console.log( res );
    },( error:any )=> { this._tools.tooast("Error de servidor"); this.progreses = false; });
  }

  buscar(){

  }

  async datafiles(ev: any) {
    //console.log( ev, this.file );
    this.file.foto1 = [];
    try {
      this.file.foto1 = ev.target.files;
    } catch (error) { }
  }

  async submitFile( item:any ) {
    this.data = item || {};
    if( !this.file.foto1[0] ) return false;
    this.disableFile = true;
    await this.procesoSubidaImagen(this.file.foto1[0]);
    this.update( false );
    item.foto = this.data.foto;
    this.disableFile = false;
    this.creacionTestimonio( item );
  }

  procesoSubidaImagen(file: any) {
    return new Promise(resolve => {
      let form: any = new FormData();
      form.append('file', file);
      this._tools.ProcessTime({});
      this._archivo.create(form).subscribe((res: any) => {
        console.log(form);
        this._tools.tooast({ title: "subido exitoso" });
        this.data.foto = res.files;
        this.file.foto1= [];
        resolve( true );
      }, error => { this._tools.tooast({ title: "Subido Error", icon: "error" }); resolve( false ) })
    });
  }

  update( item:any ){
    if( item ) this.data = item;
    if( !this.data.id ) return false;
    this._retiros.update( { id: this.data.id, foto: this.data.foto, estado: this.data.estado, cantidad: this.data.cantidad } ).subscribe(( res:any )=>{
      this._tools.tooast({ title: "Actualizado exitoso" });
    });
  }

  creacionTestimonio( item:any ){
    let data:any = {
      usuario: item.user.id,
      descripcion: item.descripcion || "Mi primer retiro gracias publihazclik",
      foto: item.foto,
      fecha: item.createdAt
    };
    this._testimonios.create( data ).subscribe(( res:any )=>{
      this._tools.tooast({ title: "Guardado exitoso" });
      this.data = {};
    }, error => { this._tools.tooast({ title: "Error", icon: "error" }); } )
  }

  openFoto( url:string ){
    window.open( url );
  }


}
