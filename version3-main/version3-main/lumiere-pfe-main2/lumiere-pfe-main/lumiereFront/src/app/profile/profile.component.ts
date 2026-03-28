import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {



  constructor(private authService: AuthService) { }

  user = {
    id: 0,
    firstname: "",
    lastname: "",
    email: "",
    passwd: "",
    role: ""
  }


  ngOnInit() {



    this.profile();
  }
  profile() {

    this.authService.profile().subscribe(
      (data) => this.user = data,
      (error) => console.error('Erreur lors du chargement du profil', error)
    );
  }

}
