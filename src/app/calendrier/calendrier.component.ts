import { Component, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // Utilisez CalendarOptions
import { Calendar } from '@fullcalendar/core'; // Importez également Calendar si nécessaire
import dayGridPlugin from '@fullcalendar/daygrid'; // Plugin de grille journalière
import interactionPlugin from '@fullcalendar/interaction'; // Plugin d'interaction
import { TaskService } from '../Services/Task.service';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { AddTaskDialogComponent } from '../Tasks/add-task-dialog/add-task-dialog.component';
import { MatDialog } from '@angular/material/dialog';
declare var $: any;

@Component({
  selector: 'app-calendrier',
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.css']
})
export class CalendrierComponent {

  calendarOptions: CalendarOptions = { // Utilisez FullCalendarOptions
    initialView: 'dayGridMonth',
    events: [
     
    ],
    locale:'fr',
    selectable: true,
    select: this.handleDateSelect.bind(this),
    plugins: [dayGridPlugin, interactionPlugin] // Activez les plugins nécessaires
  };
  constructor(private tasksService: TaskService,    private dialog: MatDialog  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }
  handleDateClick(arg:any) {
    alert('date click! ' + arg.dateStr);
  }
  loadTasks() {
    this.tasksService.getAllTasks().subscribe({
      next: (tasks) => {
        const filteredTasks = tasks.filter(task => task.statusTask !== 'FAIT');
        console.log(filteredTasks)
        const events = filteredTasks.map(task => ({
          title: task.name,
          start: task.dateDebut, // Utilisez la propriété dateDebut ou dateFin selon votre besoin
          end: task.dateFin, // Utilisez la propriété dateDebut ou dateFin selon votre besoin
          description: task.description // Ajoutez d'autres propriétés si nécessaire
          
        }));
        
        // Mettez à jour la propriété events de calendarOptions avec les événements formatés
        this.calendarOptions.events = events;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tâches:', error);
      }
    });
  }
  handleDateSelect(info:any) {
    const startDate = info.startStr;
    const endDate = info.endStr;
    if (startDate && endDate) {
      this.showModal(startDate, endDate);
    }
   
  }
  showModal(startDate: Date, endDate: Date) {
    const data = {
      name: "",
      dateDebut: startDate,
      dateFin: endDate,
      statusTask: "",
      typeActivity: "",
      description:""
    }
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadTasks();
        }
      },
    });

    // Afficher la modal avec les dates sélectionnées
    // Vous devrez implémenter votre propre logique pour afficher la modal
    // par exemple, en utilisant une bibliothèque de modals comme NgbModal de ng-bootstrap
    // ou en créant votre propre composant modal
  }
}
