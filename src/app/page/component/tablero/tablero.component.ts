import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexNonAxisChartSeries,
  ApexResponsive
} from "ng-apexcharts";
import { EstadisticasService } from 'src/app/servicesComponents/estadisticas.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

export type ChartOptions2 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};


@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss']
})
export class TableroComponent implements OnInit {

  @ViewChild("chart", {static: false}) chart: ChartComponent;
  public tareasDiarias: Partial<ChartOptions>;
  public gananciasDiarias: Partial<ChartOptions>;
  public gananciasDiariasRef: Partial<ChartOptions>;
  public cantidadRef: Partial<ChartOptions2>;
  public cantidadActividades: Partial<ChartOptions2>;
  public cantidadPaquetes: Partial<ChartOptions2>;
  dataUser:any = {};
  progreses: boolean = false;
  tablet:any = {
    dataHeader: ["Foto","Username", "foto","dia","dia",'dia','dia','dia'],
    dataRow: [],
    count: 0
  };

  constructor(
    private _estadisticas: EstadisticasService,
    private _store: Store<STORAGES>,
  ) {
    this._store.subscribe((store: any) => {
      //console.log(store);
      store = store.name;
      if (!store) return false;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() {
    // resumen de 5 dias de mis tareas diarias
    this.tareasDiarias = {
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        },
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Tareas diarias",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep"
        ]
      }
    };
    // resumen de 5 dias de los clicks que hago
    this.gananciasDiarias = {
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Ganancias de mis click",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep"
        ]
      }
    };
    // resumen de 5 dias de los referidos sus ganancias
    this.gananciasDiariasRef = {
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Ganancias de mis referidos",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep"
        ]
      }
    };
    //los que estan activos y gratuitos
    this.cantidadRef = {
      series: [ 44, 55, 13, 43, 22],
      chart: {
        width: 380,
        type: "pie"
      },
      
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
    // mis activades realizadas y no realizados
    this.cantidadActividades = {
      series: [ 44, 55, 13, 43, 22],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
    // cantidad de paquetes
    this.cantidadPaquetes = {
      series: [ 44, 55, 13, 43, 22],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
    this.getEstadisticas();
  }

  getEstadisticas(){
    this.progreses = true;
    this._estadisticas.tablero( { where: { user: this.dataUser.id }} ).subscribe(( res:any )=>{
      this.tareasDiarias = {
        ... this.tareasDiarias,
        ... res.tareasDiarias,
        xaxis: { categories: res.tareasDiarias.categories },
        title: { text: res.tareasDiarias.text, align: "left" }
      };
      this.gananciasDiarias = {
        ... this.gananciasDiarias,
        ... res.gananciasDiarias,
        xaxis: { categories: res.gananciasDiarias.categories },
        title: { text: res.gananciasDiarias.text, align: "left" }
      }
      this.gananciasDiariasRef = {
        ... this.gananciasDiariasRef,
        ... res.gananciasDiariasRef,
        xaxis: { categories: res.gananciasDiariasRef.categories },
        title: { text: res.gananciasDiariasRef.text, align: "left" }
      };
      this.cantidadRef = {
        ... this.cantidadRef,
        ... res.cantidadRef
      };
      this.cantidadActividades = {
        ... this.cantidadActividades,
        ... res.cantidadActividades,
      }
      this.cantidadPaquetes = {
        ... this.cantidadPaquetes,
        ... res.cantidadPaquetes,
      };
      this.tablet.dataRow = res.diasActividad.list;
      this.tablet.dataHeader[3] = this.tablet.dataHeader[3] + res.diasActividad.detaFecha[0];
      this.tablet.dataHeader[4] = this.tablet.dataHeader[4] + res.diasActividad.detaFecha[1];
      this.tablet.dataHeader[5] = this.tablet.dataHeader[5] + res.diasActividad.detaFecha[2];
      this.tablet.dataHeader[6] = this.tablet.dataHeader[6] + res.diasActividad.detaFecha[3];
      this.tablet.dataHeader[7] = this.tablet.dataHeader[7] + res.diasActividad.detaFecha[4];
      this.progreses = false;
      console.log( this.cantidadRef,this.tablet);
    },()=> this.progreses = false );
  }

}
