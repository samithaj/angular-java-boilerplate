import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './core/layout/main-layout.component';

import { NotFound } from './modules/general/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'addresses', pathMatch: 'full' },
      { path: 'addresses', canActivate: [authGuard], loadChildren: () => import('./modules/features/address/address.routes').then(mod => mod.routes) },
      { path: 'customers', canActivate: [authGuard], loadChildren: () => import('./modules/features/customer/customer.routes').then(mod => mod.routes) },
      { path: 'products', canActivate: [authGuard], loadChildren: () => import('./modules/features/product/product.routes').then(mod => mod.routes) },
      { path: 'orders', canActivate: [authGuard], loadChildren: () => import('./modules/features/order/order.routes') }
    ]
  },

  {
    path: 'login',
    loadComponent: () => import(`./modules/general/login/login`)
      .then(mod => mod.Login)
  },
  {
    path: 'signup',
    loadComponent: () => import(`./modules/general/signup/signup`)
      .then(mod => mod.Signup)
  },
  {
    path: 'contact',
    loadChildren: () => import(`./modules/general/contact/contact.routes`)
      .then(routes => routes.routes)
  },
  {
    path: 'about',
    loadChildren: () => import('./modules/general/about/about.routes')
      .then(routes => routes.routes)
  },

  // Keep the CRUD features accessible if needed
  {
    path: 'cities',
    loadComponent: () => import('./modules/features/crud/city/item.component')
      .then(mod => mod.ItemComponent)
  },
  {
    path: 'persons',
    loadComponent: () => import('./modules/features/crud/person/item.component')
      .then(mod => mod.ItemComponent)
  },
  {
    path: 'countries',
    loadComponent: () => import('./modules/features/crud/country/item.component')
      .then(mod => mod.ItemComponent)
  },
  {
    path: 'professions',
    loadComponent: () => import('./modules/features/crud/profession/item.component')
      .then(mod => mod.ItemComponent)
  },
  {
    path: 'continents',
    loadComponent: () => import('./modules/features/crud/continent/item.component')
      .then(mod => mod.ItemComponent)
  },

  { path: '**', component: NotFound }
];