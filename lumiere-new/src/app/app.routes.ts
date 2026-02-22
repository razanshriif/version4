import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', loadComponent: () => import('./pages/auth/login/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register.page').then(m => m.RegisterPage) },
  { path: 'pending', loadComponent: () => import('./pages/auth/pending/pending.page').then(m => m.PendingPage) },
  { path: 'orders/non-planned', loadComponent: () => import('./pages/orders/non-planned/non-planned.page').then(m => m.NonPlannedPage) },


  {
    path: '',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'demandes',
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          {
            path: 'list',
            loadComponent: () => import('./pages/demandes/list/list.page').then(m => m.ListPage),
          },
          {
            path: 'create',
            loadComponent: () => import('./pages/demandes/create/create.page').then(m => m.CreatePage),
          },
          {
            path: 'details',
            loadComponent: () => import('./pages/demandes/details/details.page').then(m => m.DetailsPage),
          },
        ]
      },
      {
        path: 'livraisons',
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          {
            path: 'list',
            loadComponent: () => import('./pages/livraisons/list/list.page').then(m => m.ListPage),
          },
          {
            path: 'tracking',
            loadComponent: () => import('./pages/livraisons/tracking/tracking.page').then(m => m.TrackingPage),
          },
        ]
      },
      {
        path: 'clients',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/clients/clients').then(m => m.Clients),
          },
          {
            path: 'create',
            loadComponent: () => import('./pages/clients/client-form/client-form').then(m => m.ClientForm),
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./pages/clients/client-form/client-form').then(m => m.ClientForm),
          }
        ]
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
      },
    ]
  },

  // Routes outside tabs
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications/notifications.page').then(m => m.NotificationsPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'chatbot',
    loadComponent: () => import('./pages/chatbot/chatbot.page').then(m => m.ChatbotPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/map/map.page').then(m => m.MapPage),
    canActivate: [AuthGuard]
  },
];
