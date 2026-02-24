import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,

  IonButton,
  IonButtons,
  IonBackButton,
  IonInput,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubbleEllipsesOutline, arrowBackOutline, createOutline, keyOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  host: { 'class': 'ion-page' },
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonInput,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProfilePage implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  loading = false;
  updating = false;
  editMode = false;
  selectedSegment = 'profile';
  user: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({ chatbubbleEllipsesOutline, arrowBackOutline, createOutline, keyOutline, logOutOutline });
  }

  ngOnInit() {
    this.initForms();
    this.loadProfile();
  }

  initForms() {
    // Profile form
    this.profileForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      adresse: [''],
      ville: [''],
      codePostal: ['']
    });

    // Password change form
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.profileForm.disable();
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  loadProfile() {
    this.loading = true;
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue(user);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.loading = false;

        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;

    if (this.editMode) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      this.profileForm.patchValue(this.user);
    }
  }

  async onSubmitProfile() {
    if (this.profileForm.invalid) {
      await this.showToast('Veuillez remplir tous les champs obligatoires', 'warning');
      return;
    }

    this.updating = true;

    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: async (response) => {
        this.user = response;
        this.editMode = false;
        this.profileForm.disable();
        this.updating = false;
        await this.showToast('Profil mis à jour avec succès', 'success');
      },
      error: async (error) => {
        console.error('Error updating profile:', error);
        this.updating = false;
        await this.showToast('Erreur lors de la mise à jour du profil', 'danger');
      }
    });
  }

  async onSubmitPassword() {
    if (this.passwordForm.invalid) {
      if (this.passwordForm.hasError('passwordMismatch')) {
        await this.showToast('Les mots de passe ne correspondent pas', 'warning');
      } else {
        await this.showToast('Veuillez remplir tous les champs', 'warning');
      }
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmer',
      message: 'Voulez-vous vraiment changer votre mot de passe ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Confirmer',
          handler: () => {
            this.changePassword();
          }
        }
      ]
    });

    await alert.present();
  }

  changePassword() {
    this.updating = true;
    const { currentPassword, newPassword } = this.passwordForm.value;

    // Simulate API call (you'll need to implement this in AuthService)
    setTimeout(async () => {
      this.updating = false;
      this.passwordForm.reset();
      await this.showToast('Mot de passe modifié avec succès', 'success');
    }, 1500);
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Déconnexion',
      message: 'Voulez-vous vraiment vous déconnecter ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Déconnexion',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

  getUserInitials(): string {
    if (!this.user) return 'U';
    const firstname = this.user.firstname || '';
    const lastname = this.user.lastname || '';
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase() || 'U';
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
