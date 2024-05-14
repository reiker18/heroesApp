
import { ActivatedRouteSnapshot, CanActivateFn,
        CanMatchFn, Route, Router, RouterStateSnapshot,
        UrlSegment } from '@angular/router';
import { Observable, tap} from 'rxjs';
import { AuthService } from '../services/auth.services';
import { inject } from '@angular/core';


/*
  CanMatch -> autoriza el ingreso a un ruta que haga match
  CanActivate -> que se pueda activar la ruta donde se ponga este Guard
*/

//No hay necesidad de crear una clase, simplemente definiendo una función flecha
//y exportándola podemos utilizar sus funcionalidades de guard en el app-routing

// se debe escribir CanActivateFn sin cambios de camel case

const checAuthStatus = (): boolean | Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthentication().pipe(
    tap((isAuthenticated) => console.log("Authenticated : ", isAuthenticated)),
    tap((isAuthenticated) => {
        if(!isAuthenticated){
          router.navigate(["/auth/login"]);
        }
    })
  );

}

export const canActivateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, state: RouterStateSnapshot
) => {
  //console.log("desde canActivate");
  //console.log({route, state});

  return checAuthStatus();
};

export const cantMatchGuard : CanMatchFn = (route: Route,
   segments : UrlSegment[]
) => {
  //console.log("Desde canMatchFn");
  //console.log({route, segments});

  return checAuthStatus();
}
