import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonIcon } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, notificationsOutline, logOutOutline } from 'ionicons/icons';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';
import { LivraisonService, LivraisonSimple } from '../../services/livraison.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonIcon, CommonModule, FormsModule, GoogleMap, MapMarker]
})
export class MapPage implements OnInit {
  selectedLivraison: LivraisonSimple | null = null;

  center: google.maps.LatLngLiteral = { lat: 34.0, lng: 10.0 };
  zoom = 7;
  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false
  };

  sourceMarker: { position: google.maps.LatLngLiteral; options: google.maps.MarkerOptions } | null = null;
  destinationMarker: { position: google.maps.LatLngLiteral; options: google.maps.MarkerOptions } | null = null;
  vehicleMarker: { position: google.maps.LatLngLiteral; options: google.maps.MarkerOptions } | null = null;

  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private livraisonService: LivraisonService
  ) {
    addIcons({ arrowBackOutline, notificationsOutline, logOutOutline });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['livraisonId'];
      if (id) {
        this.loadLivraison(+id);
      }
    });
  }

  loadLivraison(id: number) {
    this.livraisonService.getLivraisonById(id).subscribe({
      next: (livraison: LivraisonSimple) => {
        this.selectedLivraison = livraison;
        this.setupMarkers(livraison);
      },
      error: (err: any) => console.error('Erreur chargement livraison pour la carte:', err)
    });
  }

  setupMarkers(livraison: LivraisonSimple) {
    const coords: Record<string, google.maps.LatLngLiteral> = {
      'Sfax': { lat: 34.74, lng: 10.76 },
      'Tunis': { lat: 36.8, lng: 10.18 },
      'Sousse': { lat: 35.82, lng: 10.63 },
      'Gabes': { lat: 33.88, lng: 10.11 },
      'Bizerte': { lat: 37.27, lng: 9.87 },
      'Nabeul': { lat: 36.45, lng: 10.73 },
      'Beja': { lat: 36.73, lng: 9.18 },
      'Jendouba': { lat: 36.5, lng: 8.77 },
      'Kairouan': { lat: 35.67, lng: 10.1 },
      'Gafsa': { lat: 34.42, lng: 8.78 },
      'Tozeur': { lat: 33.92, lng: 8.13 },
      'Kebili': { lat: 33.7, lng: 8.97 }
    };

    const sourceCity = livraison.chargementVille || '';
    const destCity = livraison.livraisonVille || '';

    const sourcePos: google.maps.LatLngLiteral = coords[sourceCity] || { lat: 34.0, lng: 10.0 };
    const destPos: google.maps.LatLngLiteral = coords[destCity] || { lat: 35.0, lng: 10.5 };
    const vehiclePos: google.maps.LatLngLiteral = {
      lat: (sourcePos.lat + destPos.lat) / 2,
      lng: (sourcePos.lng + destPos.lng) / 2
    };

    this.center = vehiclePos;
    this.zoom = 8;

    this.sourceMarker = {
      position: sourcePos,
      options: { title: 'Chargement: ' + sourceCity }
    };

    this.destinationMarker = {
      position: destPos,
      options: { title: 'Destination: ' + destCity }
    };

    this.vehicleMarker = {
      position: vehiclePos,
      options: { title: 'Transporteur: ' + (livraison.chauffeur || 'En route') }
    };
  }

  getStatusKey(statut: string): string {
    const statusMap: Record<string, string> = {
      NON_CONFIRME: 'pending',
      NON_PLANIFIE: 'pending',
      EN_ATTENTE: 'pending',
      PLANIFIE: 'ready',
      EN_COURS_DE_CHARGEMENT: 'ready',
      CHARGE: 'ready',
      EN_COURS_DE_LIVRAISON: 'transit',
      EN_LIVRAISON: 'transit',
      LIVRE: 'done',
      FIN: 'done'
    };
    return statusMap[statut] || 'pending';
  }

  goToNotifications() {
    this.navCtrl.navigateForward('/notifications');
  }

  logout() {
    this.navCtrl.navigateRoot('/login');
  }
}
