import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  addCircleOutline,
  bulb,
  cartOutline,
  flashOutline,
  logOutOutline,
  navigateOutline,
  notificationsOutline,
  personOutline,
  personCircleOutline,
  person,
  hourglassOutline,
  carOutline,
  checkmarkCircleOutline,
  documentTextOutline,
  timeOutline,
  checkmarkDoneOutline,
  cubeOutline,
  arrowForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    /**
     * Registering icons for Standalone mode.
     * This resolves the [Ionicons Warning] in your console.
     */
    addIcons({
      'add': add,
      'add-circle-outline': addCircleOutline,
      'bulb': bulb,
      'cart-outline': cartOutline,
      'flash-outline': flashOutline,
      'log-out-outline': logOutOutline,
      'navigate-outline': navigateOutline,
      'notifications-outline': notificationsOutline,
      'person-circle-outline': personCircleOutline,
      'person': person,
      'person-outline': personOutline,
      'hourglass-outline': hourglassOutline,
      'car-outline': carOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'document-text-outline': documentTextOutline,
      'time-outline': timeOutline,
      'checkmark-done-outline': checkmarkDoneOutline,
      'cube-outline': cubeOutline,
      'arrow-forward-outline': arrowForwardOutline
    });
  }
}