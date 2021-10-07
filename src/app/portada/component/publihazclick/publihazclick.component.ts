import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';

@Component({
  selector: 'app-publihazclick',
  templateUrl: './publihazclick.component.html',
  styleUrls: ['./publihazclick.component.scss']
})
export class PublihazclickComponent implements OnInit {
  public usuario:any = {};
  public data:any = {
    dia: 1,
    hora: 2,
    minutos: 60,
    segundos: 60
  };
  public check:any = {};

  constructor(
    private activate: ActivatedRoute,
    private _user: UsuariosService
  ) { }
  ngOnInit() {
    this._user.get({ where:{ username: "joseeduardo112" } })
    .subscribe((rta)=>{ this.usuario = rta['data'][0]; if(!this.usuario){this._user.get({ where:{ username: "joseeduardo112"} }).subscribe((rta)=>this.usuario['data'][0]);}});
    const interval = setInterval(() => {
      // console.log(data.stop)
      this.data.segundos = this.data.segundos - 1;
      if (this.data.segundos === 0) {
        this.data.segundos = 60;
        this.data.minutos = this.data.minutos - 1;
        if(this.data.minutos === 0){
          this.data.minutos = 60;
          if(this.data.dia === 0) {
            if(this.data.dia === 0){
              this.stopConter(interval);
            }
            this.data.hora = this.data.hora - 1;
          }
        }
      }
    }, 1000);

  }
  stopConter(interval: any) {
    clearInterval(interval);
  }

}
