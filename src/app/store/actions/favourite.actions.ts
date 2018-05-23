import { Action } from '@ngrx/store';
import { Favourite } from '../../core/models/favourite.model';

export enum FavouriteActionType {
  LOAD = '[Favourites] Load favourite',
  LOAD_SUCCESS = '[Favourites] Load favourite success',
  LOAD_FAIL = '[Favourites] Load favourite fail'
}

export class LoadFavouritesAction implements Action {
  readonly type = FavouriteActionType.LOAD;
}

export class LoadFavouritesSuccessAction implements Action {
  readonly type = FavouriteActionType.LOAD_SUCCESS;

  constructor(public favourites: Favourite[]) {}
}

export class LoadFavouritesFailAction implements Action {
  readonly type = FavouriteActionType.LOAD_FAIL;
}

export type FavouritesAction = LoadFavouritesAction | LoadFavouritesSuccessAction | LoadFavouritesFailAction;
