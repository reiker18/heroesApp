import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environments } from '../../../environments/environments';
import { Hero } from '../interfaces/hero.interface';

@Injectable({providedIn: 'root'})
export class HeroesService {

  private baseUrl: string = environments.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getHeroes():Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(`${this.baseUrl}/heroes`);
  }
  //Observable<Hero|undefined> -> este observable va a retornan una de estas opciones porque puede ser que
  // la persona escribio un id que no existe, basado en el valor undifined puedo retornar un error o una
  // respuesta especifica
  getHeroById(id: string): Observable<Hero|undefined>{
    return this.httpClient.get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        // of -> es una forma de crear observables apartir del valor que se le pasa en los parentecis
        // es decir si da error voy a retornar un observable que devuelve undifined
        catchError( error => of(undefined) )
      )
  }

  // retorno valores de Hero como arreglo
  getSuggestions( query:string ): Observable<Hero[]>{
    // si el get no retorna nada siempre se va a devolver un arreglo de Hero aunque sea vacio
    return this.httpClient.get<Hero[]>(`${this.baseUrl}/heroes?q=${ query }&_limit=6`);
  }

  // funciones para hacer CRUD al JSON-Server


  addHero( hero : Hero): Observable<Hero>{
    // envío la url a la que quiero hacer el post y como segundo parámetro envío el Hero
    // información que quiero enviar en este caso el hero que llega a la función
    return this.httpClient.post<Hero>(`${this.baseUrl}/heroes`, hero);
  }

  updateHero( hero : Hero): Observable<Hero>{
    if(!hero.id) throw Error("Hero is required");
    // envío la url a la que quiero hacer el post y como segundo parámetro envío el Hero
    // información que quiero enviar en este caso el hero que llega a la función

    // hago un patch debido a que quiero actualizar parcialmente la información y no
    // destruir lo que habia antes

    return this.httpClient.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
  }

  deleteHeroById(id:string): Observable<boolean>{
    return this.httpClient.delete(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        // si se llaga al map implica que la respuesta no fue un error por ende siempre
        // retorno true
        map( resp => true),
        catchError( err => of(false)),
      );

  }

}
