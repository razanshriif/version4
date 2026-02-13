import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Article } from '../models/article.model';
import { Subscription } from 'rxjs';
import { ArticleService } from '../services/article.service';
import { AuthService } from '../auth.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  article: Article ={};
  mode: 'list' | 'create' | 'edit' | 'detail' = 'list';
  private subscription: Subscription = new Subscription();

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    private authService:AuthService, private ser: NotificationService
  ) { }
  user={
    id:0,
    firstname: "",
    lastname: "",
    email: "",
    passwd: "",
    role:""
  }



  profile(){

    this.authService.profile().subscribe(
      (data) => this.user = data,
      (error) => console.error('Erreur lors du chargement du profil', error)
    );
  }
  ngOnInit(): void {
    this.loadArticles();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        if (this.mode === 'edit' || this.mode === 'detail') {
          this.loadArticle(Number(id));
        }
      }
    });

    
    this.profile();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadArticles(): void {
    this.subscription.add(this.articleService.getArticles().subscribe(data => {
      this.articles = data;
      this.mode = 'list';
    }));
  }

  loadArticle(id: number): void {
    this.subscription.add(this.articleService.getArticle(id).subscribe(data => {
      this.article = data;
      this.mode = 'detail';
    }));
  }

  createArticle(): void {
    if (this.article) {
      this.subscription.add(this.articleService.createArticle(this.article).subscribe(() => {
        this.mode = 'list';
        this.loadArticles();

        this.ser.notification.type = "Article";
        this.ser.notification.message = "Création d'un nouveau Article :" + this.article.id +  "par :"+this.user.firstname+this.user.lastname;
        this.ser.ajouternotification(this.ser.notification);
      }));
    }
  }

  updateArticle(): void {
    if (this.article) {
      this.subscription.add(this.articleService.createArticle(this.article).subscribe(() => {
        this.mode = 'list';
        this.loadArticles();
      }));
    }
  }

  deleteArticle(id: number): void {
    this.subscription.add(this.articleService.deleteArticle(id).subscribe(() => {
      this.mode = 'list';
      this.loadArticles();
      this.ser.notification.type = "Article";
      this.ser.notification.message = "Suppression d'un nouveau Article :" + this.article.id +  "par :"+this.user.firstname+this.user.lastname;
      this.ser.ajouternotification(this.ser.notification);
      
    }));
  }

  onCreate(): void {
    this.article = {
      codeArticle: '',
      label: '',
      type: '',
      typeDeMarchandise: 0,
      typeDeRemorque: '',
      unite: '',
      quantiteMinimum: 0,
      prixUnitaire: 0,
      vente: 0,
      achat: 0
    };
    this.mode = 'create';
  }

  onEdit(i: any): void {
    this.article=i;
    this.mode = 'edit';
  }

  onDetail(i: any): void {
    this.article=i;
    this.mode = 'detail';
  }

  onBack(): void {
    this.router.navigate(['/articles']);
    this.mode = 'list';
  }
}
