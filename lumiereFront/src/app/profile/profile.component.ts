import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {



  constructor(  private authService :AuthService ) {}

  user={
    id:0,
    firstname: "",
    lastname: "",
    email: "",
    passwd: "",
    role:""
  }


  ngOnInit() {
   


    this.profile();
  }
  profile(){

    this.authService.profile().subscribe(
      (data) => this.user = data,
      (error) => console.error('Erreur lors du chargement du profil', error)
    );
  }

}
