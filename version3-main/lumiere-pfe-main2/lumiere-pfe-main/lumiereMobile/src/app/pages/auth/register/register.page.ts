import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonBackButton,
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
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonCheckbox
  ]
})
export class RegisterPage {

  showPassword = false;
  showConfirmPassword = false;

  formData = {
    firstname: '',
    lastname: '',
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
    if (!this.formData.firstname || !this.formData.lastname || !this.formData.email ||
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
      firstname: this.formData.firstname,
      lastname: this.formData.lastname,
      email: this.formData.email,
      password: this.formData.password,
      role: 'USER'
    };

    // 4️⃣ Call backend
    this.authService.register(payload).subscribe({
      next: async (res) => {
        await loading.dismiss();
        // Save email so the pending page can poll status
        sessionStorage.setItem('pending_email', this.formData.email);
        const toast = await this.toastCtrl.create({
          message: '🕐 Compte créé ! En attente de validation par un administrateur.',
          color: 'warning',
          duration: 4000,
          position: 'top'
        });
        toast.present();
        this.router.navigate(['/pending']);
      },
      error: async (err) => {
        await loading.dismiss();
        const message = err?.error?.message || 'Erreur lors de l’inscription';
        const toast = await this.toastCtrl.create({
          message,
          color: 'danger',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    });
  }

}
