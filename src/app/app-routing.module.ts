import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { canActivateGuard, cantMatchGuard } from './auth/guards/auth.guard';
import { canActivateLogin, canMatchLogin } from './auth/guards/public.guard';

const routes: Routes = [
  // definicion de las rutas a los submodulos Auth y Heroes
  {
    path: 'auth',
    // aca especifico que lo cargo mediante lazyload
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [canActivateLogin],
    canMatch: [canMatchLogin]
  },
  {
    path: 'heroes',
    // loadChildren es una funcion al cual le paso el path del modulo que necesito cargar
    loadChildren: () => import('./heroes/heroes.module').then(m => m.HeroesModule),
    canActivate: [canActivateGuard],
    canMatch: [cantMatchGuard]
  },
  {
    path: '404',
    component: Error404PageComponent
  },
  {
    // esta es la ruta por defecto, donde redirecciono al path de heroes

    path: '',
    redirectTo: 'heroes',
    // pathMatch para que sea exactamente como esta en el atributo path
    pathMatch: 'full'
  },
  {
    path:'**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
