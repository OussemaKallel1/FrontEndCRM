import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { ClientService } from '../Services/client.service';
import { ProspectService } from '../Services/Prospect.service';
import { TaskService } from '../Services/Task.service';
import { Tasks } from '../Modéles/Tasks';
import { User } from '../Modéles/user';
import { UserConnected } from '../Modéles/UserConnected';

declare var $: any;

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit{
  tasks : Tasks[] = [];
  user : UserConnected = {
    email : "",
    username : "",
    fullName :""
  }
  tasksOfToday : Tasks[] = [];
  chartTask = {
    title: 'Nombre de tâches par mois',
    type: ChartType.LineChart  as ChartType,
    columnNames: ['Mois', 'Nombre de tâches'],
    data: [] as any[], // Initialiser comme un tableau vide
    options: {
      hAxis: {
        title: 'Mois'
      },
      vAxis: {
        title: 'Nombre de tâches'
      },
      legend: { position: 'none' },
      chartArea: { width: '100%' }
    }
  };


numberOfClients : number =0;
numberOfProspects : number = 0;
numberOfQualifiedProspects: number = 0;
numberOfNonQualifiedProspects: number = 0;

chart = {
  title: 'Prospects Qualifiés et Non Qualifiés',
  type: ChartType.PieChart as ChartType,
  columnNames: ['Type', 'Percentage'],
  data: [] as any[], // Initialiser comme un tableau vide
  options: {
    pieHole: 0.4, // Optionnel : pour un Donut Chart
    is3D: true,   // Optionnel : pour un effet 3D
    title: 'Pourcentage de prospects qualifiés et non qualifiés',
    slices: {
      0: { color: '#2BB673' }, // Couleur personnalisée pour les clients
      1: { color: '#d91e48' }  // Couleur personnalisée pour les prospects
    },
    legend: {
      position: 'bottom',
      alignment: 'center',
      textStyle: {
        color: '#333',
        fontSize: 14
      }
    },
    tooltip: {
      textStyle: {
        color: '#333',
        fontSize: 20
      },
      showColorCode: true
    },
    chartArea: {
      left: 20,
      top: 20,
      width: '100%',
      height: '75%'
    }
  }
};
typeActivity = [
  {value: 'REUNION', viewValue: 'Réunion'},
  {value: 'APPEL_TELEPHONIQUE', viewValue: 'Appel Téléphonique'},
  {value: 'RESUME_APPEL', viewValue: 'Résumé de l’appel'},
  {value: 'DESCRIPTION', viewValue: 'Description'}
];
constructor( private clientService: ClientService,  private prospectService: ProspectService,private tasksService: TaskService) { }

ngOnInit(): void {
  this.loadClients();
  this.loadProspect();
  this.calculatePercentages();
  this.loadTasks()
  this.loadTasksOfToday()
  this.loadUser()
}

calculatePercentages(): void {
  console.log(this.numberOfClients)
  const totalProspects = this.numberOfQualifiedProspects + this.numberOfNonQualifiedProspects;
  const qualifiedPercentage = (this.numberOfQualifiedProspects / totalProspects) * 100;
  const nonQualifiedPercentage = (this.numberOfNonQualifiedProspects / totalProspects) * 100;

  this.chart.data = [
    ['Prospect Qualifié', qualifiedPercentage],
    ['Prospect Non Qualifié', nonQualifiedPercentage]
  ];
}
prepareChartData(): void {
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Initialiser les données pour chaque mois avec 0
  const taskCountsByMonth = Array(12).fill(0);

  // Compter les tâches par mois
  this.tasks.forEach(task => {
    const dateDebut = new Date(task.dateDebut);
    const month = dateDebut.getMonth(); // Mois (0-11)
    taskCountsByMonth[month]++;
  });

  // Mettre à jour les données du graphique
  this.chartTask.data = taskCountsByMonth.map((count, index) => [
    monthNames[index],
    count
  ]);
}
contacts: any[] = [];

loadClients() {
  this.clientService.getAllClients().subscribe({
    next: (res) => {
      this.contacts = res;
        this.numberOfClients = this.contacts.filter(contact => contact.typeContact === 'Client').length;
        console.log(this.numberOfClients);
    },
  });
}
loadUser() {
  this.clientService.getUserById(localStorage.getItem("id")).subscribe({
    next: (res) => {
     this.user=res
     console.log(this.user)
    },
  });
}
loadProspect() {
  this.prospectService.getAllProspects().subscribe({
    next: (res) => {
      console.log(res)
      this.numberOfProspects=res.length
      console.log(this.numberOfProspects)
      this.calculatePercentages()
    },
  });
  this.prospectService.getAllProspects().subscribe({
    next: (res) => {
      this.numberOfQualifiedProspects = res.filter(prospect => prospect.statusProspect === 'Qualifié').length;
      this.numberOfNonQualifiedProspects = res.filter(prospect => prospect.statusProspect === 'NonQualifie').length;
      this.calculatePercentages();
    },
  });
}

loadTasks() {
  this.tasksService.getAllTasks().subscribe({
    next: (res) => {
     this.tasks=res
     this.prepareChartData();
    },
  });
}

loadTasksOfToday() {
  this.tasksService.getTasksOfToday().subscribe({
    next: (res) => {
     this.tasksOfToday=res

    },
  });
}
getViewValue(value: string): string {
  const type = this.typeActivity.find(t => t.value === value);
  return type ? type.viewValue : value;
}
}
