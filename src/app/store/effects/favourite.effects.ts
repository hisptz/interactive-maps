import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap, flatMap } from "rxjs/operators";
import { of } from "rxjs";
import { FavouriteService } from "../../core/services/favourite.service";
import {
  FavouriteActionType,
  LoadFavouritesAction,
  LoadFavouritesSuccessAction,
  LoadFavouritesFailAction,
  SearchFavouritesAction
} from "../actions/favourite.actions";
import { Favourite } from "../../core/models/favourite.model";

@Injectable()
export class FavouriteEffects {
  constructor(
    private actions$: Actions,
    private favouriteService: FavouriteService
  ) {}

  @Effect()
  loadFavourites$ = this.actions$.pipe(
    ofType(FavouriteActionType.LOAD),
    flatMap(() => this.favouriteService.loadFavourites()),
    map(favourites => new LoadFavouritesSuccessAction(favourites)),
    catchError(error => of(new LoadFavouritesFailAction(error)))
  );

  @Effect()
  searchFavourites$ = this.actions$.pipe(
    ofType(FavouriteActionType.SEARCH_FAVOURITE),
    map((action: SearchFavouritesAction) => action.favouriteName),
    flatMap(favouriteName => {
      return this.favouriteService.searchFavourite(favouriteName).pipe(
        map(favourites => new LoadFavouritesSuccessAction(favourites)),
        catchError(error => of(new LoadFavouritesFailAction(error)))
      );
    })
  );
}
