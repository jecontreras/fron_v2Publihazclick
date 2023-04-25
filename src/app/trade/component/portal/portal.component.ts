import { Component, OnInit } from '@angular/core';
import { MarketsService } from '../../services/markets.service';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit {

  listRow:any = [];

  constructor(
    private _markets: MarketsService
  ) { }

  ngOnInit() {
    this.getMarkets();
  }

  getMarkets(){
    this._markets.getMarkets({}).subscribe(res=>{
      this.listRow = res;
    });
  }

}
