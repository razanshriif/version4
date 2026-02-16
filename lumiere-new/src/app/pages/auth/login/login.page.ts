// src/app/pages/auth/login/login.page.ts

import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../../../services/auth.service';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  logInOutline,
  personAddOutline,
  businessOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonInput,      // ✅ IMPORTANT : IonInput ajouté ici
    IonButton,
    IonIcon,
    IonSpinner
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // ✅ IMPORTANT : Permet d'utiliser les custom elements Ionic
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    // Enregistrer toutes les icônes
    addIcons({
      'mail-outline': mailOutline,
      'lock-closed-outline': lockClosedOutline,
      'eye-outline': eyeOutline,
      'eye-off-outline': eyeOffOutline,
      'log-in-outline': logInOutline,
      'person-add-outline': personAddOutline,
      'business': businessOutline
    });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Login
  async onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loading = await this.loadingController.create({
        message: 'Connexion en cours...',
        spinner: 'crescent'
      });
      await loading.present();

      this.authService.login(this.loginForm.value).subscribe({
        next: async (response) => {
          this.isLoading = false;
          await loading.dismiss();
          await this.showToast('Connexion réussie !', 'success');
          this.router.navigate(['/home']);
        },
        error: async (error) => {
          this.isLoading = false;
          await loading.dismiss();
          let errorMessage = 'Email ou mot de passe incorrect';

          if (error.status === 0) {
            errorMessage = 'Erreur de connexion au serveur. Vérifiez que le backend est lancé et accessible.';
          } else if (error.status >= 500) {
            errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
          }

          await this.showToast(errorMessage, 'danger');
          console.error('Login error:', error);
        }
      });
    } else {
      await this.showToast('Veuillez remplir tous les champs', 'warning');
    }
  }

  // Navigate to register
  goToRegister() {
    this.router.navigate(['/register']);
  }

  // Show toast
  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    toast.present();
  }
  testBackend() {
    const payload = {
      email: 'test@example.com',
      password: '123456'
    };

    this.authService.login(payload).subscribe({
      next: (res) => {
        console.log('Backend works! Response:', res);
        alert('Login success! JWT token: ' + res.token);
      },
      error: (err) => {
        console.error('Backend error:', err);
        alert('Login failed: ' + JSON.stringify(err));
      }
    });
  }

}