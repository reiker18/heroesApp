import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: ``
})
export class SearchPageComponent {

  public searchInput = new FormControl('');

  public heroes: Hero[] = [];

  public selectedHero?: Hero;

  constructor(private herosServices: HeroesService){

  }
  searchHero(){
    // en algún punto del ciclo de vida this.searchInput.value puede
    // llegar a ser vacio por ende se pone un string vacio
    const value : string = this.searchInput.value || '';

    this.herosServices.getSuggestions( value )
      .subscribe( heroes => this.heroes = heroes);
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent):void{
    if(!event.option.value){
      this.selectedHero = undefined;
      return;
    }

    // aunque el value puede llegar con distintos tipo de valores ya que estoy
    // seguro de que va a retornar un heroe lo asigno de esta manera
    const hero : Hero = event.option.value;
    this.searchInput.setValue(hero.superhero);

    this.selectedHero = hero;

  }
}
