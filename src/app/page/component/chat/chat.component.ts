import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  
  listChat:any = [
    {
      username: "josep",
      count: 9
    }
  ];
  listConversacion:any = [
    {
      createdAt: new Date(),
      mensaje: "Hola Hp",
      username: "jose contreras",
      foto: "./assets/imagenes/perfil.png",
      vistaDel: false
    }
  ];
  txt:string;

  constructor() { }

  ngOnInit() {
  }

  openChat( item ){

  }

  envioTxt(){

  }

}
