import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
    IonContent,
    IonButton,
    ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-pending',
    templateUrl: './pending.page.html',
    styleUrls: ['./pending.page.scss'],
    standalone: true,
    imports: [CommonModule, IonContent, IonButton]
})
export class PendingPage implements OnInit, OnDestroy {

    isChecking = false;
    email: string = '';
    private pollInterval: any;

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastCtrl: ToastController
    ) {
    }

    ngOnInit() {
        this.email = sessionStorage.getItem('pending_email') || '';

        if (!this.email) {
            // No email stored, go back to login
            this.router.navigate(['/login']);
            return;
        }

        // Poll every 10 seconds
        this.startPolling();
    }

    ngOnDestroy() {
        this.stopPolling();
    }

    private startPolling() {
        // Check immediately, then every 10s
        this.checkStatus();
        this.pollInterval = setInterval(() => this.checkStatus(), 10000);
    }

    private stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }
    }

    private checkStatus() {
        if (!this.email) return;
        this.isChecking = true;

        this.authService.checkAccountStatus(this.email).subscribe({
            next: async (res) => {
                this.isChecking = false;
                if (res.status === 'ACTIVE') {
                    this.stopPolling();
                    sessionStorage.removeItem('pending_email');
                    const toast = await this.toastCtrl.create({
                        message: '🎉 Votre compte a été activé ! Bienvenue sur Lumière.',
                        color: 'success',
                        duration: 4000,
                        position: 'top'
                    });
                    toast.present();
                    this.router.navigate(['/login']);
                } else if (res.status === 'REJECTED') {
                    this.stopPolling();
                    const toast = await this.toastCtrl.create({
                        message: '❌ Votre compte a été rejeté. Contactez l\'administrateur.',
                        color: 'danger',
                        duration: 5000,
                        position: 'top'
                    });
                    toast.present();
                    sessionStorage.removeItem('pending_email');
                    this.router.navigate(['/login']);
                }
                // If still PENDING, do nothing — just wait for next poll
            },
            error: (err) => {
                this.isChecking = false;
                console.error('Status check error:', err);
            }
        });
    }

    goToLogin() {
        this.stopPolling();
        this.router.navigate(['/login']);
    }
}
