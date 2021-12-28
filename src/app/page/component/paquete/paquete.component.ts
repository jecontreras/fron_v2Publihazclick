import { Component, OnInit } from '@angular/core';
import { PaquetesService } from 'src/app/servicesComponents/paquetes.service';
import { ToolsService } from 'src/app/services/tools.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { PuntosResumenService } from 'src/app/servicesComponents/puntos-resumen.service';
import * as moment from 'moment';
import { PuntosService } from 'src/app/servicesComponents/puntos.service';
import { environment } from 'src/environments/environment';
declare var ePayco: any;

@Component({
  selector: 'app-paquete',
  templateUrl: './paquete.component.html',
  styleUrls: ['./paquete.component.scss']
})
export class PaqueteComponent implements OnInit {
  
  listPaquetes:any = [];
  query:any = {
    where: {
      estado: "activo"
    },
    sort: "createdAt ASC",
    page: 0,
    limit: 10
  };
  formatoMoneda:any = {};
  dataUser:any = {};
  paquete:any = false;
  ocultar:boolean = false;
  disabledB:boolean = false;
  keyEpayco = environment.keyEpayco;
  estadoPruebaPagos = environment.estadoPruebaPagos;
  disabedPn:boolean = false;
  
  constructor(
    private _paquetes: PaquetesService,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
    private _puntoResumen: PuntosResumenService,
    private _punto: PuntosService
  ) { 
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
      if( this.dataUser.miPaquete ) if( this.dataUser.miPaquete.paquete ) this.paquete = this.dataUser.miPaquete;
    });
  }

  ngOnInit() {
    this.formatoMoneda = this._tools.formatoMoneda;
    this.getPaquetes();
    console.log( this.paquete );
  }

  getPaquetes(){
    this._paquetes.get( this.query ).subscribe(( res:any )=>{
      this.listPaquetes = res.data;
      for( let row of this.listPaquetes ) {
        if( row.valorextra == 250000) row.valorTransaccion = 12000;
        else row.valorTransaccion = 3000;
      }
    });
  }

  async comprarPaqueteAcomulado(){
    if( this.paquete ) return this._tools.error( { mensaje: "Error En estos momento tienes un paquete activo", footer: "" } );
    let alerta:any = await this._tools.confirm( { title:"Activacion paquete", detalle:" al activar tu paquete se te hara el descuento de una y se activar automatico", confir:"" } );
    if( !alerta ) return false;
    this.ocultar = false;
    this._puntoResumen.get( { where: { user: this.dataUser.id, state: "valido" }, limit: 1 } ).subscribe( ( res:any )=>{
      res = res.data[0];
      if( !res ) return false;
      if( res.valorTotal < 33000 ) return this._tools.presentToast("lo sentimos no tienes fondos suficientes");
      let dataFormato = this.formatiando();
      this.comprandoPaquete( dataFormato );
    } );
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
        // console.log( res );
        this.restartPuntos();
      },( error:any )=> this._tools.tooast( { title: "Error en la compra del paquete", icon:"error" } ));
  }

  restartPuntos(){
    this._punto.restarPunto( { user: this.dataUser.id, valor: 20100 } ).subscribe( ( res:any )=>{
      console.log( res );
      this._tools.tooast( { title: "Operacion exitosa" } );
      setTimeout( ()=> location.reload(), 3000 );
    },( error:any )=> this._tools.tooast( { title: "Error de servidor", icon:"error" } ));
  }



  formatiando() {
    let codigo = this._tools.codigo();
    return {
      "ids": this.dataUser.email,
      "titulo": "Paquete",
      "prioridad": "alta",
      "valor": "33000",
      "tipo": "notificaciones",
      "user": "5e8b6044482a870459c32a79",
      "datosepayco": {
        "x_description": "Paquete Basico",
        "x_id_factura": codigo,
        "x_currency_code": codigo,
        "x_respuesta": "Aceptada",
        "x_amount": "33000",
        "x_bank_name": "Compra Manual",
        "x_transaction_id": "SZ1E4 x_transaction_id",
        "x_fecha_transaccion": "2020-05-04T21:03:33.811Z",
        "x_customer_doctype": "cc",
        "x_customer_document": "123",
        "x_customer_email": this.dataUser.email,
        "x_customer_ip": "10.132.70.24",
        "x_test_request": "Manual Admin",
        "x_ref_payco": codigo + "101",
        "app": "publihazclickrootadmin"
      },
      "descripcion": `Puedes comprar paquete con tu acomulado ${ this.dataUser.email } el dia ${ moment().format("DD/MM/YYYY") } se Te Activara Cuando Le Des Consumir ->`,
      "app": "publihazclickrootadmin",
      "estado": "visto",
    }
  }

  openPaquete( item:any ){
    //window.open( item.url );
    if( this.disabedPn ) return false;
    this.disabedPn = true;
    let obj:any = {
        url: item.url || "https://recaudos.pagosinteligentes.com/CollectForm.aspx?Token=be3c7e95-5c30-47e3-9209-9e88a2e6f57d",
        otrourl: item.otrourl || "https://publihazclick.s3.amazonaws.com/paquetes/19fd8728-c89b-44c7-951b-79dcbbace3ff.jpg",
        wester: item.wester || "https://www.google.com.co/",
        imgwester: item.imgwester || "https://www.viviendocali.com/wp-content/uploads/2017/10/Western-Union-en-bucaramanga.jpg",
        name: item.title,
        invoice: this._tools.codigo(),
        currency: 'cop',
        amount: item.valorextra,
        tax_base: '0',
        tax: '0',
        country: 'co',
        test: false,
        lang: 'eng',
        external: 'true',
        extra1: 'extra1',
        extra2: 'extra2',
        extra3: 'extra3',
        name_billing: this.dataUser.name + ' ' + this.dataUser.lastname,
        email_billing: this.dataUser.email,
        address_billing: this.dataUser.ciudad || 'cucuta',
        type_doc_billing: this.dataUser.tipdoc,
        mobilephone_billing: this.dataUser.celular,
        number_doc_billing: this.dataUser.celular
    };
    //console.log( obj)
    try {
      const handler: any = ePayco.checkout.configure({
        key: this.keyEpayco,
        test: this.estadoPruebaPagos
      })
        ;
      handler.open(obj);
    } catch (error) {
      console.log("************", error)
      this._tools.tooast("Eror en el proceso de compra");
    }

    setTimeout(()=>this.disabedPn = true, 3000 );
  }

  copiar(){
    const val = `0x16ee3B7D6eB35b644400ed6a36887380B84BeDC4`;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this._tools.basicIcons({ header: "Recomendando", subheader: 'Copiado:' + ' ' + val });
  }

}
