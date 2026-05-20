import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { APP_ROUTES } from './core/constants/app-routes.constants';
import { LoginComponent } from './shared/layout/auth/login/login.component';
import { RegisterComponent } from './shared/layout/auth/register/register.component';
import { BrankComponent } from './features/home/pages/blank/brank.component';
import { CmsLayoutComponent } from './shared/layout/cms-layout/cms-layout.component';
import { CmsComponent } from './features/cms/pages/dashboard/cms.component';
import { SetListComponent } from './features/cms/pages/sets/set-list.component';
import { ItemComponent } from './features/cms/pages/items/item.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: APP_ROUTES.LOGIN,
    pathMatch: 'full'
  },
  {
    path: APP_ROUTES.LOGIN,
    component: LoginComponent
  },
  {
    path: APP_ROUTES.REGISTER,
    component: RegisterComponent
  },
  {
    path: APP_ROUTES.BRANK,
    component: BrankComponent,
    canActivate: [authGuard]
  },
  {
    path: 'cms',
    component: CmsLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: CmsComponent
      },
      {
        path: 'sets',
        component: SetListComponent
      },
      {
        path: 'sets/create',
        loadComponent: () => import('./features/cms/pages/sets/set-create/set-create.component').then(m => m.SetCreateComponent)
      },
      {
        path: 'sets/edit/:id',
        loadComponent: () => import('./features/cms/pages/sets/set-edit/set-edit.component').then(m => m.SetEditComponent)
      },
      {
        path: 'sets/view/:id',
        loadComponent: () => import('./features/cms/pages/sets/set-view/set-view.component').then(m => m.SetViewComponent)
      },
      {
        path: 'items',
        component: ItemComponent
      },
      {
        path: 'items/create',
        loadComponent: () => import('./features/cms/pages/items/item-create/item-create.component').then(m => m.ItemCreateComponent)
      },
      {
        path: 'items/view/:id',
        loadComponent: () => import('./features/cms/pages/items/item-view/item-view.component').then(m => m.ItemViewComponent)
      },
      {
        path: 'teams',
        loadComponent: () => import('./features/cms/pages/teams/team.component').then(m => m.TeamComponent)
      },
      {
        path: 'teams/create',
        loadComponent: () => import('./features/cms/pages/teams/team-create/team-create.component').then(m => m.TeamCreateComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/cms/pages/users/user.component').then(m => m.UserComponent)
      },
      {
        path: 'users/view/:id',
        loadComponent: () => import('./features/cms/pages/users/user-view/user-view.component').then(m => m.UserViewComponent)
      },
      {
        path: 'users/create',
        loadComponent: () => import('./features/cms/pages/users/user-create/user-create.component').then(m => m.UserCreateComponent)
      },
      {
        path: 'users/edit/:id',
        loadComponent: () => import('./features/cms/pages/users/user-edit/user-edit.component').then(m => m.UserEditComponent)
      },
      {
        path: 'notification',
        loadComponent: () => import('./features/cms/pages/notification/notification.component').then(m => m.NotificationComponent)
      },
      {
        path: 'role',
        loadComponent: () => import('./features/cms/pages/role/role.component').then(m => m.RoleComponent)
      },
      {
        path: 'role/create',
        loadComponent: () => import('./features/cms/pages/role/role-create/role-create').then(m => m.RoleCreate)
      },
    ]
  }
];
