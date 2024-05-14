import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: ``
})
export class HeroPageComponent implements OnInit{

  // en un punto del ciclo de vida del componentes el valor para heroe es null
  public hero?: Hero;

  constructor(private heroService : HeroesService,
    private activatedRoute : ActivatedRoute,
    private router: Router,
    ){}

  // voy a leer el URL, usare un servicio propio del router -> ActivatedRoute
  ngOnInit(): void {
    //tengo acceso a todos los paremetros como un observable
    this.activatedRoute.params
    .pipe(
      // permite tomar los params y des-estructurar y tomar el id
      // si getHeroById da error regrea undefined
      switchMap( ({id}) => this.heroService.getHeroById(id)),
    ).subscribe(hero => {
      // si no obtiene ningún hero se saca a la persona de la pantalla
      // de manera mas automatica-> return;
      if(!hero) return this.router.navigate(['/heroes/list']);

      this.hero = hero;
      return;
    })
  }

  goBack() : void {
    this.router.navigateByUrl("heroes/list");
  }
}
