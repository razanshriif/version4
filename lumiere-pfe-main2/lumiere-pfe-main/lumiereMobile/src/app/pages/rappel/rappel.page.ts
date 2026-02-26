import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonIcon, IonFab, IonFabButton, IonBadge, IonModal, IonDatetime, IonButton,
    AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    addOutline, alarmOutline, trashOutline, checkmarkCircle,
    arrowBackOutline, calendarOutline, notificationsOutline, informationCircleOutline
} from 'ionicons/icons';

export interface Rappel {
    id: string;
    titre: string;
    note?: string;
    date: string; // ISO string
    fait: boolean;
}

@Component({
    selector: 'app-rappel',
    templateUrl: './rappel.page.html',
    styleUrls: ['./rappel.page.scss'],
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
        IonIcon, IonFab, IonFabButton, IonBadge, IonModal, IonDatetime, IonButton
    ]
})
export class RappelPage implements OnInit {
    rappels: Rappel[] = [];
    isModalOpen = false;
    editingRappel: Rappel | null = null;
    newRappel: Partial<Rappel> = {
        titre: '',
        note: '',
        date: ''
    };
    showInfo = false;

    constructor(private alertCtrl: AlertController) {
        addIcons({
            addOutline, alarmOutline, trashOutline, checkmarkCircle,
            arrowBackOutline, calendarOutline, notificationsOutline, informationCircleOutline
        });
    }

    ngOnInit() {
        this.load();
    }

    ionViewWillEnter() {
        this.load();
    }

    load() {
        const raw = localStorage.getItem('rappels');
        if (raw) {
            this.rappels = JSON.parse(raw);
        } else {
            this.rappels = [];
        }
        // Sort: pending first, then by date
        this.rappels.sort((a, b) => {
            if (a.fait !== b.fait) return a.fait ? 1 : -1;
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
    }

    save() {
        localStorage.setItem('rappels', JSON.stringify(this.rappels));
    }

    openModal(r?: Rappel) {
        if (r) {
            this.editingRappel = r;
            this.newRappel = { ...r };
        } else {
            this.editingRappel = null;
            const now = new Date();
            const localeDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
            this.newRappel = {
                titre: '',
                note: '',
                date: localeDateTime
            };
        }
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    saveRappel() {
        if (!this.newRappel.titre?.trim()) return;

        if (this.editingRappel) {
            const idx = this.rappels.findIndex(x => x.id === this.editingRappel!.id);
            if (idx > -1) {
                this.rappels[idx] = { ...this.editingRappel, ...this.newRappel } as Rappel;
            }
        } else {
            const r: Rappel = {
                id: Date.now().toString(),
                titre: this.newRappel.titre!.trim(),
                note: this.newRappel.note?.trim() || undefined,
                date: this.newRappel.date || new Date().toISOString(),
                fait: false
            };
            this.rappels.unshift(r);
        }

        this.save();
        this.load();
        this.closeModal();
    }

    toggleFait(r: Rappel) {
        r.fait = !r.fait;
        this.save();
        this.load();
    }

    async deleteRappel(r: Rappel) {
        const alert = await this.alertCtrl.create({
            header: 'Supprimer',
            message: `Supprimer « ${r.titre} » ?`,
            buttons: [
                { text: 'Annuler', role: 'cancel' },
                {
                    text: 'Supprimer', role: 'destructive',
                    handler: () => {
                        this.rappels = this.rappels.filter(x => x.id !== r.id);
                        this.save();
                    }
                }
            ]
        });
        await alert.present();
    }

    toggleInfo() {
        this.showInfo = !this.showInfo;
    }

    formatDate(iso: string): string {
        if (!iso) return '';
        const d = new Date(iso);
        const datePart = d.toLocaleDateString('fr-FR', {
            weekday: 'short', day: '2-digit', month: 'short'
        });
        const timePart = d.toLocaleTimeString('fr-FR', {
            hour: '2-digit', minute: '2-digit'
        });
        return `${datePart} à ${timePart}`;
    }

    isPast(iso: string): boolean {
        return new Date(iso) < new Date();
    }

    get pending() { return this.rappels.filter(r => !r.fait); }
    get done() { return this.rappels.filter(r => r.fait); }
}
