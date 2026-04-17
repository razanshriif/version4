import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../services/chatbot.service';

interface Message {
  text: string;
  isUser: boolean;
  time: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  isChatOpen = false;
  userInput = '';
  messages: Message[] = [];
  isTyping = false;
  hasNewMessages = false;
  unreadCount = 0;
  showQuickReplies = true;

  quickReplies = [
    '📦 Suivre une commande',
    '📋 Créer un ordre',
    '👤 Gestion clients',
    '❓ Aide'
  ];

  constructor(private chatbotService: ChatbotService) {
    // Message de bienvenue
    this.addBotMessage('Bonjour ! 👋 Je suis votre assistant virtuel. Comment puis-je vous aider aujourd\'hui ?');
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      this.hasNewMessages = false;
      this.unreadCount = 0;
    }
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput.trim();
    this.addUserMessage(userMessage);
    this.userInput = '';
    this.showQuickReplies = false;

    // Appel au service Gemini via le backend
    this.isTyping = true;
    this.chatbotService.sendMessage(userMessage).subscribe({
      next: (res) => {
        this.isTyping = false;
        this.addBotMessage(res.response);
      },
      error: (err) => {
        this.isTyping = false;
        this.addBotMessage('Désolé, je rencontre une erreur de connexion. Veuillez vérifier votre connexion ou réessayer plus tard.');
        console.error('Chatbot error:', err);
      }
    });
  }

  sendQuickReply(reply: string) {
    this.userInput = reply;
    this.sendMessage();
  }

  private addUserMessage(text: string) {
    this.messages.push({
      text,
      isUser: true,
      time: this.getCurrentTime()
    });
  }

  private addBotMessage(text: string) {
    this.messages.push({
      text,
      isUser: false,
      time: this.getCurrentTime()
    });

    if (!this.isChatOpen) {
      this.hasNewMessages = true;
      this.unreadCount++;
    }
  }


  private getCurrentTime(): string {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
}
