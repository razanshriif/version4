import { Component } from '@angular/core';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrl: './emails.component.css'
})
export class EmailsComponent {
  isModalOpen = false;

  email = {
    to: '',
    subject: '',
    body: ''
  };

  openModal() {
    this.isModalOpen = true;
  }

  closeModal(event?: MouseEvent) {
    this.isModalOpen = false;
  }

  onSubmit() {
    console.log('Email envoyé:', this.email);
    // Ajoutez ici la logique pour envoyer l'email via un service Angular
    this.closeModal();
  }
}
