import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  { path: 'login', loadComponent: () => import('./pages/auth/login/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register.page').then(m => m.RegisterPage) },

  { 
    path: 'home', 
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
    canActivate: [AuthGuard] // only logged in users can access
  },
  {
    path: 'demandes/list',
    loadComponent: () => import('./pages/demandes/list/list.page').then(m => m.ListPage),
  },
  {
    path: 'demandes/create',
    loadComponent: () => import('./pages/demandes/create/create.page').then(m => m.CreatePage),
  },
  {
    path: 'demandes/details',
    loadComponent: () => import('./pages/demandes/details/details.page').then(m => m.DetailsPage),
  },
  {
    path: 'livraisons/list',
    loadComponent: () => import('./pages/livraisons/list/list.page').then(m => m.ListPage),
  },
  {
    path: 'livraisons/tracking',
    loadComponent: () => import('./pages/livraisons/tracking/tracking.page').then(m => m.TrackingPage),
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications/notifications.page').then(m => m.NotificationsPage),
  },
  {
    path: 'chatbot',
    loadComponent: () => import('./pages/chatbot/chatbot.page').then(m => m.ChatbotPage),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/map/map.page').then(m => m.MapPage),
  },
  
];
