import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servicio-cliente',
  templateUrl: './servicio-cliente.component.html',
  styleUrls: ['./servicio-cliente.component.scss']
})
export class ServicioClienteComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.open("https://api.whatsapp.com/send?phone=573205141638&text=ayuda");
  }

}
