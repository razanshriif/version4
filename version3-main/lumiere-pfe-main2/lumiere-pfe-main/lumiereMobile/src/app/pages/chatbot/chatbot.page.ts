import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
  IonFooter,
  IonTextarea
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notificationsOutline, logOutOutline, arrowBackOutline, trashOutline } from 'ionicons/icons';
import { NavController } from '@ionic/angular';
import { ChatbotService } from '../../services/chatbot.service';

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
    IonToolbar,
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
  constructor(
    public navCtrl: NavController,
    private chatbotService: ChatbotService
  ) {
    addIcons({ notificationsOutline, logOutOutline, arrowBackOutline, trashOutline });
  }

  ngOnInit() {
    this.chatbotService.messages$.subscribe(msgs => {
      this.messages = msgs.map(m => ({
        text: m.content,
        isUser: m.sender === 'user',
        timestamp: m.timestamp
      }));
      // S'assurer que le scroll descend après le rendu
      this.scrollToBottom(500);
    });
  }

  goToNotifications() {
    this.navCtrl.navigateForward('/notifications');
  }

  logout() {
    this.navCtrl.navigateRoot('/login');
  }

  sendMessage() {
    const message = this.userInput.trim();
    if (!message) return;

    this.userInput = '';
    // Scroll immédiat pour le message de l'utilisateur
    this.scrollToBottom(100);

    // Call real API
    this.isTyping = true;
    this.chatbotService.sendMessage(message).subscribe({
      next: (botMsg) => {
        this.isTyping = false;
        // The service adds the message to its own subject but we can handle it here or sync
        // Actually the service already calls this.addMessage(botMessage) which updates messages$
      },
      error: (err) => {
        this.isTyping = false;
        this.addBotMessage("Une erreur est survenue lors de la communication avec l'assistant.");
        console.error('Chatbot error:', err);
      }
    });
  }


  private addBotMessage(text: string) {
    this.messages.push({
      text,
      isUser: false,
      timestamp: new Date()
    });
    this.scrollToBottom();
  }

  private scrollToBottom(duration: number = 300) {
    if (this.content) {
      setTimeout(() => {
        this.content.scrollToBottom(duration);
      }, 150);
    }
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
