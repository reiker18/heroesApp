import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interfaces';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environments.baseUrl;

  // se pone ? (opcional) ya que en un punto del ciclo de vida el usurio sera nulo
  // se pone privado para que este user no pueda ser modificado de ninguna manera
  // fuera de este servicio
  private user?: User;

  constructor(private httpClient: HttpClient) { }

  get currentUser(): User|undefined {
    if( !this.user) return undefined;

    /* debido a que todos los objetos en javascript pasan por referencia uso
    "structuredClone" es la solución de JavaScritp para hacer un clone de manera
    profunda, una copia  */
    return structuredClone( this.user);
  }

  login( email : string, password: string): Observable<User>{

    //http.post("login", {email, password})

    return this.httpClient.get<User>(`${this.baseUrl}/users/1`)
    //return this.httpClient.get<User>('http://localhost:3000/users/1')
      .pipe(
        // por buenas practicas se recomienda que cada efecto tap etc etc haga solo
        // una cosa
        /* tap( user => {
          this.user = user;
          localStorage.setItem("toker", user.id.toString());
        }) */

        tap(user => this.user = user), // establezco el usuario
        tap(user => localStorage.setItem("token", "aa.aklpdf.asdfae"))
      );
  }

  // verifico si tengo una autenticacion preguntando al backend
  // retorno true, si es correcta la autenticación false de lo contrario
  checkAuthentication(): Observable<boolean>{

    if(!localStorage.getItem("token")) return of(false);

    const token = localStorage.getItem("token");

    return this.httpClient.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(user => this.user = user),
        /* la doble negación la uso para saber si mi objeto user tien un valor
        asignado  */
        map(user => !!user),
        catchError( err => of(false))
      )

  }

  logOut():void{
    this.user = undefined;
    localStorage.clear();
  }

}
