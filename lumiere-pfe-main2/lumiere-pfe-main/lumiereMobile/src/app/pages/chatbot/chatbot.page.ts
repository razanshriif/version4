import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonFooter,
  IonTextarea
} from '@ionic/angular/standalone';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonFooter,
    IonTextarea,
    CommonModule,
    FormsModule
  ]
})
export class ChatbotPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;

  messages: Message[] = [];
  userInput = '';
  isTyping = false;

  // Predefined responses
  private responses: { [key: string]: string } = {
    'bonjour': 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
    'hello': 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
    'salut': 'Salut ! Que puis-je faire pour vous ?',
    'aide': 'Je peux vous aider avec :\n• Suivi de vos commandes\n• Création d\'une nouvelle demande\n• Informations sur les livraisons\n• Questions générales',
    'help': 'Je peux vous aider avec :\n• Suivi de vos commandes\n• Création d\'une nouvelle demande\n• Informations sur les livraisons\n• Questions générales',
    'commande': 'Pour suivre vos commandes, rendez-vous dans la section "Mes Demandes" depuis le menu principal.',
    'livraison': 'Vous pouvez suivre vos livraisons en temps réel dans la section "Suivi" de l\'application.',
    'nouvelle demande': 'Pour créer une nouvelle demande, cliquez sur le bouton "Nouvelle Demande" sur la page d\'accueil.',
    'contact': 'Vous pouvez nous contacter par email à support@lumiere.com ou par téléphone au +33 1 23 45 67 89',
    'horaires': 'Nos horaires d\'ouverture sont du lundi au vendredi de 9h à 18h.',
    'prix': 'Pour obtenir un devis personnalisé, veuillez créer une nouvelle demande avec les détails de votre envoi.',
    'merci': 'Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions.',
    'au revoir': 'Au revoir ! Bonne journée !',
    'bye': 'Au revoir ! Bonne journée !'
  };

  constructor() { }

  ngOnInit() {
    // Welcome message
    this.addBotMessage('Bonjour ! Je suis l\'assistant virtuel Lumiere. Comment puis-je vous aider aujourd\'hui ?');
  }

  sendMessage() {
    const message = this.userInput.trim();

    if (!message) return;

    // Add user message
    this.messages.push({
      text: message,
      isUser: true,
      timestamp: new Date()
    });

    this.userInput = '';
    this.scrollToBottom();

    // Simulate typing
    this.isTyping = true;

    setTimeout(() => {
      this.isTyping = false;
      const response = this.getBotResponse(message);
      this.addBotMessage(response);
    }, 1000);
  }

  private getBotResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    // Check for exact matches
    for (const [key, response] of Object.entries(this.responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    // Default response
    return 'Je ne suis pas sûr de comprendre. Pouvez-vous reformuler votre question ? Tapez "aide" pour voir ce que je peux faire.';
  }

  private addBotMessage(text: string) {
    this.messages.push({
      text,
      isUser: false,
      timestamp: new Date()
    });
    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 100);
  }

  getMessageTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  clearChat() {
    this.messages = [];
    this.addBotMessage('Conversation réinitialisée. Comment puis-je vous aider ?');
  }
}
