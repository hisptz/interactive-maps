import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FavouriteService } from '../../core/services/favourite.service';
import {
  FavouriteActionType,
  LoadFavouritesAction,
  LoadFavouritesSuccessAction,
  LoadFavouritesFailAction
} from '../actions/favourite.actions';
import { Favourite } from '../../core/models/favourite.model';

@Injectable()
export class FavouriteEffects {
  constructor(private actions$: Actions, private favouriteService: FavouriteService) {}

  @Effect()
  loadCurrentUser$ = this.actions$.pipe(
    ofType(FavouriteActionType.LOAD),
    switchMap(() => this.favouriteService.loadFavourites()),
    map(favourites => new LoadFavouritesSuccessAction(favourites)),
    catchError(error => of(new LoadFavouritesFailAction()))
  );
}
