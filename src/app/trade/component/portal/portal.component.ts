import { Component, OnInit } from '@angular/core';
import { MarketsService } from '../../services/markets.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit {

  listRow:any = [];

  constructor(
    private _markets: MarketsService,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.getMarkets();
  }

  getMarkets(){
    this._markets.getMarkets({}).subscribe(res=>{
      this.listRow = res;
    });
  }

  openView( item ){
    this._router.navigate(['/trade/detailcryptocurrency']);
  }

}
