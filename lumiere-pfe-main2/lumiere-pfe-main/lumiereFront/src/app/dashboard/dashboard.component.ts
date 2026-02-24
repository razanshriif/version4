import { Component, ViewChild, OnInit } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { ApexNonAxisChartSeries, ApexResponsive, ApexChart, ApexAxisChartSeries, ApexDataLabels, ApexXAxis, ApexPlotOptions, ApexLegend } from 'ng-apexcharts';
import { DashboardService } from '../dashboard.service';

export type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: string[];
  legend: ApexLegend;
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  clientsCount = 0;
  articlesCount = 0;
  ordersCount = 0;
  usersCount = 2;
  nonPlanifieOrdersCount = 1;
  planifieOrdersCount = 2;
  enCoursDeChargementCount = 1;
  chargeCount = 3;
  enCoursDeLivraisonCount = 0;
  livreCount = 0;
  pendingUsersCount = 0;

  @ViewChild('donutChart') donutChart: ChartComponent | undefined;
  @ViewChild('barChart') barChart: ChartComponent | undefined;

  public donutChartOptions: DonutChartOptions;
  public barChartOptions: BarChartOptions;

  constructor(private service: DashboardService) {
    this.donutChartOptions = {
      series: [this.nonPlanifieOrdersCount, this.planifieOrdersCount],
      chart: {
        type: 'donut',
        height: 300,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      labels: ['Ordres Non Planifiés', 'Ordres Planifiés'],
      colors: ['#1c2526', '#ff2600'],
      legend: {
        position: 'bottom',
        fontSize: '14px',
        fontFamily: 'Poppins, sans-serif',
        labels: {
          colors: '#1c2526'
        }
      },
      responsive: [
        {
          breakpoint: 800,
          options: {
            chart: {
              height: 250
            },
            legend: {
              position: 'bottom'
            }
          }
        },
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 200
            },
            legend: {
              fontSize: '12px'
            }
          }
        }
      ]
    };

    this.barChartOptions = {
      series: [
        {
          name: 'Orders Status',
          data: [
            this.nonPlanifieOrdersCount,
            this.planifieOrdersCount,
            this.enCoursDeChargementCount,
            this.chargeCount,
            this.enCoursDeLivraisonCount,
            this.livreCount
          ]
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '80%',
          distributed: false
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [
          'Non planifié',
          'Planifié',
          'En Cours De Chargement',
          'Chargé',
          'En Cours De Livraison',
          'Livré'
        ],
        labels: {
          style: {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '12px'
          }
        }
      },
      responsive: [
        {
          breakpoint: 800,
          options: {
            chart: {
              height: 300
            },
            xaxis: {
              labels: {
                style: {
                  fontSize: '11px'
                }
              }
            }
          }
        },
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 250
            },
            xaxis: {
              labels: {
                style: {
                  fontSize: '10px'
                }
              }
            }
          }
        }
      ]
    };
  }

  ngOnInit(): void {
    this.service.countClients().subscribe(res => {
      this.clientsCount = res;
    });

    this.service.countArticles().subscribe(res => {
      this.articlesCount = res;
    });

    this.service.countOrders().subscribe(res => {
      this.ordersCount = res;
    });

    this.service.countPlanifieOrders().subscribe(res => {
      this.planifieOrdersCount = res;
      this.updateDonutChartSeries();
    });

    this.service.countNonPlanifieOrders().subscribe(res => {
      this.nonPlanifieOrdersCount = res;
      this.updateDonutChartSeries();
    });

    this.service.countEnCoursDeChargementOrders().subscribe(count => {
      this.enCoursDeChargementCount = count;
      this.updateBarChartOptions();
    });

    this.service.countChargeOrders().subscribe(count => {
      this.chargeCount = count;
      this.updateBarChartOptions();
    });

    this.service.countEnCoursDeLivraisonOrders().subscribe(count => {
      this.enCoursDeLivraisonCount = count;
      this.updateBarChartOptions();
    });

    this.service.countLivreOrders().subscribe(count => {
      this.livreCount = count;
      this.updateBarChartOptions();
    });

    this.service.countPendingUsers().subscribe(res => {
      this.pendingUsersCount = res;
    });
  }

  updateDonutChartSeries(): void {
    this.donutChartOptions.series = [this.nonPlanifieOrdersCount, this.planifieOrdersCount];
  }

  updateBarChartOptions(): void {
    this.barChartOptions.series = [
      {
        name: 'Orders Status',
        data: [
          this.nonPlanifieOrdersCount,
          this.planifieOrdersCount,
          this.enCoursDeChargementCount,
          this.chargeCount,
          this.enCoursDeLivraisonCount,
          this.livreCount
        ]
      }
    ];
  }
}
