import { Component, EventEmitter, Output } from '@angular/core';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  constructor(private service:NotificationService ){}


  
  ngOnInit(): void {
    this.afficher();
  }
  @Output() menuClicked = new EventEmitter<boolean>();


  showNotifications: boolean = false;
  notifications: any[] = [];
  clients:any[]=[];
  hasNewNotifications: boolean = this.service.read; // Indique qu'il y a de nouvelles notifications

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  

    if (this.showNotifications) {
      this.hasNewNotifications = false; // Réinitialiser l'état de nouvelles notifications
      for(let i of this.clients){

            i.isRead=false;

      }

    }
  }

 
  afficher() {
    this.service.afficher().subscribe(clients => {this.clients = clients;

      this.clients=this.clients.reverse();
    
    });



  }




  // Exemple pour ajouter une nouvelle notification
 
}


