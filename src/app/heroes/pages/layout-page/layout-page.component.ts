import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.services';
import { User } from '../../../auth/interfaces/user.interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent {

  // son las opciones del menu, para trabajar entre diferentes pantallas
  // sin cambiar la url
  public sidebarItems = [
    {label: 'Listado', icon: 'label', url: './list'},
    {label: 'Añadir', icon: 'add', url: './new-hero'},
    {label: 'Buscar', icon: 'search', url: './search'},
  ]

  constructor(private authService: AuthService, private router: Router){}

  get user(): User|undefined {
    return this.authService.currentUser;
  }

  onLogOut(): void{
    this.authService.logOut();
    this.router.navigate(['/auth/login']);
  }
}
