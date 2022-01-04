import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { PaquetesService } from 'src/app/servicesComponents/paquetes.service';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { UserPaqueteService } from 'src/app/servicesComponents/user-paquete.service';

@Component({
  selector: 'app-activacion-paquete',
  templateUrl: './activacion-paquete.component.html',
  styleUrls: ['./activacion-paquete.component.scss']
})
export class ActivacionPaqueteComponent implements OnInit {
  
  data:any = {};
  listPaquetes:any = [];
  dataUser:any = {};
  seartxt:string;

  progreses:boolean = false;
  public count: number = 0;
  
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;

  tablet:any = {
    dataHeader: ["Opciones","Username","Cantidad Publicidad","Retiro","Fecha del Paquete","Celular","Titulo Paquete"],
    dataRow: [],
    count: 0
  };
  query:any = {
    where:{ },
    page: 0
  };

  constructor(
    private _user: UsuariosService,
    private _paquetes: PaquetesService,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
    private _userPaquete: UserPaqueteService
  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() {
    this.getPaquetes();
    this.getRow();
  }

  buscarUsuario(){
    return new Promise( resolve =>{
      if( !this.data.username ) return false;
      this._user.get( 
        {
          where:{
            or: [
              {
                username: {
                  contains: this.data.username || ''
                }
              },
              {
                email: {
                  contains: this.data.username || ''
                }
              },
            ]
          }
        }
      ).subscribe(( res:any )=>{
        res = res.data[0];
        this.data = res || {};
        resolve( true );
        this._tools.tooast( { title: "Usuario buscado", icon:"succes" } );
      },( )=> resolve( false ) );
    });
  }

  getPaquetes(){
    this._paquetes.get({
      where: {
        estado: "activo"
      },
      sort: "createdAt ASC",
      page: 0,
      limit: 10
    }).subscribe(( res:any )=>{
      this.listPaquetes = res.data || [];
    })
  }

  activacion(){
    this.comprandoPaquete( this.formatiando() );
  }

  seleccionP( item ){
    for( let item of this.listPaquetes ) item.check = false;
    item.check = !item.check;
    if( item.check ) this.data.paquete = item;
    console.log( item )
  }

  comprandoPaquete( data:any ){
    const
        parametros: any = {
          x_description: data.datosepayco.x_description || 'Paquete Basico',
          x_id_factura: data.datosepayco.x_id_factura + ' factura',
          x_currency_code: data.datosepayco.x_currency_code ,
          x_respuesta: data.datosepayco.x_respuesta ,
          x_amount: data.datosepayco.x_amount || data.valor,
          x_bank_name: data.datosepayco.x_bank_name || 'AutoCompra',
          x_transaction_id: data.datosepayco.x_transaction_id + ' x_transaction_id',
          x_fecha_transaccion: data.datosepayco.x_fecha_transaccion || new Date(),
          x_customer_doctype: data.datosepayco.x_customer_doctype  || 'cc',
          x_customer_document: data.datosepayco.x_customer_document  || '123',
          x_customer_email: data.datosepayco.x_customer_email,
          x_customer_ip: data.datosepayco.x_customer_ip || '10.132.70.24',
          disableretiro: data.datosepayco.disableretiro || false,
          x_test_request: data.datosepayco.x_test_request || "retiro de nota",
          x_ref_payco: data.datosepayco.x_ref_payco,
          prueba: true
        }
        ;
      if ( data.valor !== 30000 && data.valor !== 33000 ) parametros.x_description = 'Paquete Emprendedor';
      this._paquetes.comprandoPaquete( parametros ).subscribe(( res:any )=>{
        this._tools.tooast( { title: "Paquete activo", icon:"succes" } );
        this.data = {};
        for( let item of this.listPaquetes ) item.check = false;
      },( error:any )=> this._tools.tooast( { title: "Error en la compra del paquete", icon:"error" } ));
  }


  formatiando() {
    let codigo = this._tools.codigo();
    return {
      "ids": this.data.email,
      "titulo": "Paquete",
      "prioridad": "alta",
      "valor": this.data.paquete.valorextra || "33000",
      "tipo": "notificaciones",
      "user": "5e8b6044482a870459c32a79",
      "datosepayco": {
        "x_description": this.data.paquete.title || "Paquete Basico",
        "x_id_factura": codigo,
        "x_currency_code": codigo,
        "x_respuesta": "Aceptada",
        "x_amount": this.data.paquete.valorextra || "33000",
        "x_bank_name": "Compra Manual",
        "x_transaction_id": "SZ1E4 x_transaction_id",
        "x_fecha_transaccion": "2020-05-04T21:03:33.811Z",
        "x_customer_doctype": "cc",
        "x_customer_document": "123",
        "x_customer_email": this.data.email,
        "x_customer_ip": "10.132.70.24",
        "x_test_request": "Manual Admin",
        "x_ref_payco": codigo + "101",
        "app": "publihazclickrootadmin"
      },
      "descripcion": `Puedes comprar paquete con tu acomulado ${ this.data.email } el dia ${ moment().format("DD/MM/YYYY") } se Te Activara Cuando Le Des Consumir ->`,
      "app": "publihazclickrootadmin",
      "estado": "visto",
    }
  }

  async buscar(  ){
    this.query = {
      where:{ 

      },
      page: 0
    };
    await this.buscarUsuario();
    if( this.data.id != ''){
      this.query.where.user = this.data.id;
      /*this.query.where.or = [
        {
          username: {
            contains: this.data.id
          }
        },
      ];*/
    }
    this.tablet.dataRow = [];
    this.tablet.count = 0;
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
    this.query.sort = "createdAt DESC";
    this._userPaquete.get( this.query ).subscribe( async ( res:any ) =>{
      this.tablet.dataRow = _.unionBy( this.tablet.dataRow || [], res.data, 'id');
      this.tablet.count = res.count;
      this.progreses = false;
      // console.log( res );
    },( error:any )=> { this._tools.tooast( { title: "Error de servidor",icon: "error"}); this.progreses = false; });
  }

  updatePaquete( item:any ){
    this.progreses = true;
    this._userPaquete.update( { 
      id: item.id, 
      cantidaddepublicidad:item.cantidaddepublicidad, 
      disableretiro:item.disableretiro 
    } ).subscribe(( res:any )=>{
      this._tools.tooast({ title: "Actualizado"});
      this.progreses = false;
    },( error:any )=> { this._tools.tooast( { title: "Error de servidor",icon: "error"}); this.progreses = false; });
  }

  eliminar( item ){

  }


}
