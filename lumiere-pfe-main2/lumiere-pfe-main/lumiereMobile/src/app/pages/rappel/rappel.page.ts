import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent, IonHeader, IonButtons,
    IonIcon, IonFab, IonFabButton, IonModal, IonDatetime, IonButton,
    AlertController, IonTitle, IonToolbar
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
    addOutline, alarmOutline, trashOutline, checkmarkCircle, createOutline,
    arrowBackOutline, calendarOutline, notificationsOutline, informationCircleOutline,
    optionsOutline, timeOutline, logOutOutline
} from 'ionicons/icons';

export interface Rappel {
    id: string;
    titre: string;
    note?: string;
    date: string; // ISO string
    fait: boolean;
}

export interface RappelGroup {
    label: string;
    items: Rappel[];
}

@Component({
    selector: 'app-rappel',
    templateUrl: './rappel.page.html',
    styleUrls: ['./rappel.page.scss'],
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        IonContent, IonHeader, IonButtons, IonTitle,
        IonIcon, IonFab, IonFabButton, IonModal, IonDatetime, IonButton,
        IonToolbar
    ]
})
export class RappelPage implements OnInit {
    rappels: Rappel[] = [];
    groupedRappels: RappelGroup[] = [];
    isModalOpen = false;
    editingRappel: Rappel | null = null;
    newRappel: Partial<Rappel> = {
        titre: '',
        note: '',
        date: ''
    };

    constructor(
        private alertCtrl: AlertController,
        public navCtrl: NavController
    ) {
        addIcons({
            addOutline, alarmOutline, trashOutline, checkmarkCircle, createOutline,
            arrowBackOutline, calendarOutline, notificationsOutline, informationCircleOutline,
            optionsOutline, timeOutline, logOutOutline
        });
    }

    logout() {
        this.navCtrl.navigateRoot('/login');
    }

    ngOnInit() {
        this.load();
    }

    ionViewWillEnter() {
        this.load();
    }

    load() {
        try {
            const raw = localStorage.getItem('rappels');
            this.rappels = raw ? JSON.parse(raw) : [];

            // Safety: Ensure it's an array
            if (!Array.isArray(this.rappels)) {
                this.rappels = [];
            }

            // Sort by date safety
            this.rappels.sort((a, b) => {
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return dateA - dateB;
            });

            this.updateGrouping();
        } catch (e) {
            console.error('Error loading rappels:', e);
            this.rappels = [];
            this.groupedRappels = [];
        }
    }

    updateGrouping() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const groupsMap: { [key: string]: Rappel[] } = {
            "AUJOURD'HUI": [],
            "DEMAIN": [],
            "PLUS TARD": []
        };

        this.rappels.forEach(r => {
            if (!r.date) return;
            const d = new Date(r.date);
            d.setHours(0, 0, 0, 0);

            if (d.getTime() === today.getTime()) {
                groupsMap["AUJOURD'HUI"].push(r);
            } else if (d.getTime() === tomorrow.getTime()) {
                groupsMap["DEMAIN"].push(r);
            } else {
                groupsMap["PLUS TARD"].push(r);
            }
        });

        this.groupedRappels = Object.keys(groupsMap)
            .map(label => ({ label, items: groupsMap[label] }))
            .filter(g => g.items.length > 0);
    }

    save() {
        localStorage.setItem('rappels', JSON.stringify(this.rappels));
        this.updateGrouping();
    }

    openModal(r?: Rappel) {
        if (r) {
            this.editingRappel = r;
            this.newRappel = { ...r };
        } else {
            this.editingRappel = null;
            const now = new Date();
            // Local ISO string for ion-datetime
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
                this.rappels[idx] = { ...this.editingRappel, ...this.newRappel, fait: this.editingRappel.fait } as Rappel;
            }
        } else {
            const r: Rappel = {
                id: Date.now().toString(),
                titre: this.newRappel.titre!.trim(),
                note: this.newRappel.note?.trim() || undefined,
                date: this.newRappel.date || new Date().toISOString(),
                fait: false
            };
            this.rappels.push(r);
        }

        this.save();
        this.closeModal();
    }

    async deleteRappel(r: Rappel, event?: Event) {
        if (event) event.stopPropagation();
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

    toggleFait(r: Rappel, event?: Event) {
        if (event) event.stopPropagation();
        r.fait = !r.fait;
        this.save();
    }

    formatTime(iso: string): string {
        if (!iso) return '';
        try {
            const d = new Date(iso);
            return d.toLocaleTimeString('fr-FR', {
                hour: '2-digit', minute: '2-digit'
            }).replace(':', 'h');
        } catch (e) {
            return '';
        }
    }

    formatDate(iso: string): string {
        if (!iso) return '';
        try {
            return new Date(iso).toLocaleDateString('fr-FR', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
        } catch (e) {
            return '';
        }
    }
}
