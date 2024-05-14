import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from "@angular/router";
import { Observable, map, tap } from "rxjs";
import { AuthService } from "../services/auth.services";
import { inject } from "@angular/core";

const checkCanLogin = (): boolean | Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthentication().pipe(
    tap((isAuthenticated) => console.log("Authenticated Login : ", isAuthenticated)),
    tap((isAuthenticated) => {
        if(isAuthenticated){
          router.navigate(["/heroes/list"]);
        }
    }),
    map( isAuthenticated => !isAuthenticated)
  );

}

export const canActivateLogin: CanActivateFn = (
  route: ActivatedRouteSnapshot, state : RouterStateSnapshot
) => {
  return checkCanLogin();
}
export const canMatchLogin: CanMatchFn = (
  route : Route, segments : UrlSegment[]
) => {
  return checkCanLogin();
}
