import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit{
  // declaro un formulario reactivo, puedes tener sus propias validaciones
  // valiaciones -> si una propiedad no cumple el formulario no puede hacer post
  // cada propiedad del formulario debe estar contenida dentro de un elemnetos HTML
  public heroForm = new FormGroup({
    // defino todas las propiedades que quiero que el formulario maneje

    // ya que FormControl es un generico le puedo establecer que tipo de dato va a manejar
    id: new FormControl<string>(""),
    superhero: new FormControl<string>("", {nonNullable: true}),

    // FormControl<Publisher> -> recibira un tipo de dato publisher y por ende establezco
    // cual será el valor por defecto

    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl<string>(""),
    first_appearance: new FormControl<string>(""),
    characters: new FormControl<string>(""),
    alt_img: new FormControl<string>(""),
  });

  public publishers = [
    { id : "DC Comics", desc: "DC - Comics"},
    { id : "Marvel Comics", desc: "Marvel - Comics"},
  ];

  // inyecto las dependencias activatedRouter para saber
  // cuales son lo parámetros que vienen por el URL
  // inyecto router porque si el id que esta en la ruta no
  // existe voy a redireccionar fuera de esta pantalla

  constructor(private heroesService : HeroesService,
    private activatedRoute : ActivatedRoute,
    private router : Router,
    private snackbar : MatSnackBar,
    private dialog : MatDialog
  ){}

  get currentHero(): Hero{
    // le digo que trate this.heroForm.value como un Hero
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {

    if( !this.router.url.includes("edit")) return;

    // si llega hasta aca hay que actualizar un hero y actualizar la data
    this.activatedRoute.params
      .pipe(
        // des estructuro params y solo tomo el id
        switchMap( ( {id} ) => this.heroesService.getHeroById(id)),
      ).subscribe( hero => {
        // el heroe no existe y lo retorno a la ruta "/"
        if(!hero) {return this.router.navigateByUrl("/");}

        // si llega hasta aca el hero existe
        this.heroForm.reset( hero );

        return;
      });

  }

  onSubmit():void{
    /* console.log({
      formIsValid: this.heroForm.valid,
      value: this.heroForm.value
    }); */

    // si el formulario no es valido no haga nada
    if ( this.heroForm.invalid ) return;

    if(this.currentHero.id){
      this.heroesService.updateHero( this.currentHero)
        .subscribe( hero => {
          this.showSnackBar(`${hero.superhero} updated`);
        });

      return;
    }

    // si no se tiene un id
    this.heroesService.addHero( this.currentHero)
      .subscribe( hero =>{
        // TODO mostar snakbar, y navegar a /heros/edit/hero.id
        //navegación a /heros/edit/hero.id el navigate acepta un arreglo
        this.router.navigate(['/heros/edit', hero.id]);
        this.showSnackBar(`${hero.superhero} created!`);

    });

  }

  onDeleteHero():void{
    if(!this.currentHero.id) throw Error("Hero id is required");

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
      .pipe(
        // si la condicion dentro de filter se cumple permite continuar con el proceso
        // de lo contrario lo bloquea
        filter( (result: boolean) => result === true),
        switchMap( () => this.heroesService.deleteHeroById( this.currentHero.id )),
        filter( (wasDeleted : boolean) => wasDeleted),
        tap( wasDeleted => console.log({wasDeleted}) ),
      )

      .subscribe(result => {
        this.router.navigate(["/heroes"])
        console.log({result});
      }
    );



    /* dialogRef.afterClosed().subscribe(result => {
     if( !result ) return;

     this.heroesService.deleteHeroById( this.currentHero.id )
      .subscribe( wasDeleted => {
        if(wasDeleted){
          this.router.navigate(["/heroes"]);
        }

      })

    }); */
  }

  showSnackBar( message: string): void{
    this.snackbar.open(message, "done", {
      duration: 2500
    })
  }

}
