import { AfterViewInit, Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationItem } from '../navigation';
import { NextConfig } from '../../../../../app-config';
import { Location } from '@angular/common';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { ToolsService } from 'src/app/services/tools.service';
import { UserAction } from 'src/app/redux/app.actions';
import { Router } from '@angular/router';
import { UserNivelService } from 'src/app/servicesComponents/user-nivel.service';

const URL = environment.urlFront;

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit, AfterViewInit {
  public nextConfig: any;
  public navigation: any;
  public prevDisabled: string;
  public nextDisabled: string;
  public contentWidth: number;
  public wrapperWidth: any;
  public scrollWidth: any;
  public windowWidth: number;

  @Output() onNavMobCollapse = new EventEmitter();

  @ViewChild('navbarContent', {static: false}) navbarContent: ElementRef;
  @ViewChild('navbarWrapper', {static: false}) navbarWrapper: ElementRef;
  dataUser:any = {};
  miNivel:string = "JADE";
  rolName:string = "";

  disabled:boolean = false;

  constructor(
    public nav: NavigationItem, 
    private zone: NgZone, 
    private location: Location,
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
    private Router: Router,
    private _userNivel: UserNivelService
  ) {
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
      if( this.dataUser.miNivel ) if( this.dataUser.miNivel['nivel'] )  this.miNivel = this.dataUser.miNivel['nivel'].title;
      if( this.dataUser.rol ) this.rolName = this.dataUser.rol.nombre;
    });

    this.nextConfig = NextConfig.config;
    this.windowWidth = window.innerWidth;

    this.navigation = this.nav.get();
    console.log( this.navigation)
    if( this.rolName != 'admin')this.navigation = this.navigation.filter( ( item:any )=> item.disabled == this.rolName );
    this.prevDisabled = 'disabled';
    this.nextDisabled = '';
    this.scrollWidth = 0;
    this.contentWidth = 0;
  }

  ngOnInit() {
    if (this.windowWidth < 992) {
      this.nextConfig['layout'] = 'vertical';
      setTimeout(() => {
        document.querySelector('.pcoded-navbar').classList.add('menupos-static');
        (document.querySelector('#nav-ps-next') as HTMLElement).style.maxHeight = '100%';
      }, 500);
    }
  }

  portapapeles() {
    const val = `${ URL }/auths/${ this.dataUser.username }`;
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

  ngAfterViewInit() {
    if (this.nextConfig['layout'] === 'horizontal') {
      this.contentWidth = this.navbarContent.nativeElement.clientWidth;
      this.wrapperWidth = this.navbarWrapper.nativeElement.clientWidth;
    }
  }

  scrollPlus() {
    this.scrollWidth = this.scrollWidth + (this.wrapperWidth - 80);
    if (this.scrollWidth > (this.contentWidth - this.wrapperWidth)) {
      this.scrollWidth = this.contentWidth - this.wrapperWidth + 80;
      this.nextDisabled = 'disabled';
    }
    this.prevDisabled = '';
    if(this.nextConfig.rtlLayout) {
      (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginRight = '-' + this.scrollWidth + 'px';
    } else {
      (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginLeft = '-' + this.scrollWidth + 'px';
    }
  }

  scrollMinus() {
    this.scrollWidth = this.scrollWidth - this.wrapperWidth;
    if (this.scrollWidth < 0) {
      this.scrollWidth = 0;
      this.prevDisabled = 'disabled';
    }
    this.nextDisabled = '';
    if(this.nextConfig.rtlLayout) {
      (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginRight = '-' + this.scrollWidth + 'px';
    } else {
      (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginLeft = '-' + this.scrollWidth + 'px';
    }

  }

  fireLeave() {
    const sections = document.querySelectorAll('.pcoded-hasmenu');
    for (let i = 0; i < sections.length; i++) {
      sections[i].classList.remove('active');
      sections[i].classList.remove('pcoded-trigger');
    }

    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('active');
      } else if(up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('active');
      }
    }
  }

  navMob() {
    if (this.windowWidth < 992 && document.querySelector('app-navigation.pcoded-navbar').classList.contains('mob-open')) {
      this.onNavMobCollapse.emit();
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        if (this.nextConfig['layout'] === 'vertical') {
          parent.classList.add('pcoded-trigger');
        }
        parent.classList.add('active');
      } else if(up_parent.classList.contains('pcoded-hasmenu')) {
        if (this.nextConfig['layout'] === 'vertical') {
          up_parent.classList.add('pcoded-trigger');
        }
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        if (this.nextConfig['layout'] === 'vertical') {
          last_parent.classList.add('pcoded-trigger');
        }
        last_parent.classList.add('active');
      }
    }
  }

 async cerrarSesion(){
    let accion = new UserAction( this.dataUser, 'drop');
    this._store.dispatch( accion );
    await this._tools.ProcessTime( { title: "Cerrando sesion ..." } );
    this.Router.navigate(['/portada/publihazclick']);
    setTimeout(()=>{
      location.reload();
    },3000)
  }

  getMiPaquete(){
    if( this.disabled ) return false;
    this.disabled = true;
    this._userNivel.getMiNivel( { user: this.dataUser.id }).subscribe(( res:any )=>{
      res = res[0];
      this._tools.tooast( { title: "Completado" });
      this.disabled = false;
      try {
        this.dataUser.miNivel = res.miNivel;
        let accion:any = new UserAction( this.dataUser, 'post');
        this._store.dispatch( accion );
      } catch (error) {  }
    },()=> { this._tools.tooast( { title: "Error", icon: "error" } ); this.disabled = false; } );
  }

}
