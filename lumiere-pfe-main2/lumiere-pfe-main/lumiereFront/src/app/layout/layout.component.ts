import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  showDashboard = false;

  isSidebarOpen = false;
  router: any;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  subMenuVisible: boolean = false;
  isActive: boolean = false;

  toggleSubMenu(): void {
    this.subMenuVisible = !this.subMenuVisible;
    this.isActive = !this.isActive;
  }
  
  login() {

    
    this.router.navigate(["/client/"])
  
  
}
}
