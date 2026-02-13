import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonCheckbox,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,

  imports: [
    CommonModule,
    FormsModule, // ✅ REQUIRED for ngModel

    // ✅ Ionic standalone components
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonCheckbox
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA] // ✅ REQUIRED
})
export class RegisterPage {

  showPassword = false;
  showConfirmPassword = false;

  formData = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({
      eyeOutline,
      eyeOffOutline
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
  async onRegister() {
  // 1️⃣ Simple validation
  if (!this.formData.nom || !this.formData.prenom || !this.formData.email ||
      !this.formData.password || !this.formData.confirmPassword) {
    const toast = await this.toastCtrl.create({
      message: 'Veuillez remplir tous les champs obligatoires',
      color: 'warning',
      duration: 3000,
      position: 'top'
    });
    toast.present();
    return;
  }

  if (this.formData.password !== this.formData.confirmPassword) {
    const toast = await this.toastCtrl.create({
      message: 'Les mots de passe ne correspondent pas',
      color: 'danger',
      duration: 3000,
      position: 'top'
    });
    toast.present();
    return;
  }

  if (!this.formData.acceptTerms) {
    const toast = await this.toastCtrl.create({
      message: 'Veuillez accepter les conditions',
      color: 'warning',
      duration: 3000,
      position: 'top'
    });
    toast.present();
    return;
  }

  // 2️⃣ Show loading
  const loading = await this.loadingCtrl.create({
    message: 'Création du compte...',
    spinner: 'crescent'
  });
  await loading.present();

  // 3️⃣ Prepare payload for backend
  const payload = {
    firstname: this.formData.prenom,
    lastname: this.formData.nom,
    email: this.formData.email,
    password: this.formData.password
  };

  // 4️⃣ Call backend
  this.authService.register(payload).subscribe({
    next: async () => {
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Compte créé avec succès 🎉',
        color: 'success',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.router.navigate(['/home']);
    },
    error: async () => {
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Erreur lors de l’inscription',
        color: 'danger',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  });
}

}
