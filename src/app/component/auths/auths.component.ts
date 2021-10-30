import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auths',
  templateUrl: './auths.component.html',
  styleUrls: ['./auths.component.scss']
})
export class AuthsComponent implements OnInit {

  constructor(
    private _router: Router,
    private activate: ActivatedRoute,
  ) { }

  ngOnInit() {
    let id = this.activate.snapshot.paramMap.get('id');
    console.log( id )
    this._router.navigate(['/auth/registrate', id]);
  }

}
