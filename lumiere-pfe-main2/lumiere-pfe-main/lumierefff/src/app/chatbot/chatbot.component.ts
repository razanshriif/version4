import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';

interface Message {
  text: string;
  isUser: boolean;
  time: string;
}

@Component({
  selector: 'app-chatbot',
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

  // Base de connaissances pour les réponses automatiques
  private knowledgeBase: { [key: string]: string } = {
    'bonjour': 'Bonjour ! 👋 Je suis l\'assistant virtuel de Lumière Transport. Comment puis-je vous aider aujourd\'hui ?',
    'salut': 'Salut ! 😊 Comment puis-je vous assister ?',
    'aide': 'Je peux vous aider avec :\n• Suivi des commandes\n• Création d\'ordres\n• Gestion des clients\n• Informations sur les articles\n• Navigation dans l\'application',
    'commande': 'Pour suivre une commande, rendez-vous dans "Gestion des Ordres" > "Liste des Ordres". Vous pouvez filtrer par numéro de commande ou client.',
    'ordre': 'Pour créer un nouvel ordre, allez dans "Gestion des Ordres" > "Ajouter un Ordre". Remplissez tous les champs requis.',
    'client': 'La gestion des clients se trouve dans le menu "Gestion des Clients". Vous pouvez ajouter, modifier ou rechercher des clients.',
    'article': 'Pour gérer les articles, accédez à "Gestion des Articles" dans le menu principal.',
    'merci': 'Je vous en prie ! 😊 N\'hésitez pas si vous avez d\'autres questions.',
    'au revoir': 'Au revoir ! À bientôt ! 👋',
    'prix': 'Pour les informations tarifaires, veuillez contacter votre responsable commercial.',
    'livraison': 'Les délais de livraison dépendent de la destination. Consultez les détails de votre commande pour plus d\'informations.',
    'statut': 'Vous pouvez vérifier le statut de vos ordres dans "Liste des Ordres". Les statuts possibles sont : Non confirmé, Confirmé, En cours, Livré.',
    'contact': 'Pour nous contacter :\n📧 Email: contact@lumiere-transport.tn\n📞 Téléphone: +216 72200600'
  };

  constructor() {
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

    // Simuler un délai de réponse
    this.isTyping = true;
    setTimeout(() => {
      this.isTyping = false;
      const response = this.getBotResponse(userMessage);
      this.addBotMessage(response);
    }, 1000 + Math.random() * 1000); // Délai aléatoire entre 1-2 secondes
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

  private getBotResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    // Recherche de mots-clés dans le message
    for (const [keyword, response] of Object.entries(this.knowledgeBase)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    // Réponses contextuelles
    if (lowerMessage.includes('comment') || lowerMessage.includes('où')) {
      return 'Pour naviguer dans l\'application, utilisez le menu latéral à gauche. Vous y trouverez toutes les fonctionnalités principales.';
    }

    if (lowerMessage.includes('problème') || lowerMessage.includes('erreur')) {
      return 'Je suis désolé d\'apprendre que vous rencontrez un problème. Pouvez-vous me donner plus de détails ? Ou contactez le support technique.';
    }

    // Réponse par défaut
    return 'Je ne suis pas sûr de comprendre votre question. Voici ce que je peux faire pour vous :\n• Suivre vos commandes\n• Créer des ordres\n• Gérer les clients\n• Fournir des informations générales\n\nPouvez-vous reformuler votre question ?';
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
