import { Favourite } from '../../core/models/favourite.model';
import { FavouritesAction, FavouriteActionType } from '../actions/favourite.actions';

export interface FavouriteState {
  favourites: Favourite[];
  loading: boolean;
  loaded: boolean;
}

export const initialState: FavouriteState = {
  loading: false,
  loaded: false,
  favourites: null
};

export function favouriteReducer(state: FavouriteState = initialState, action: FavouritesAction): FavouriteState {
  switch (action.type) {
    case FavouriteActionType.LOAD:
      return {
        ...state,
        loading: true
      };
    case FavouriteActionType.LOAD_SUCCESS:
      return {
        ...state,
        favourites: action.favourites,
        loaded: true,
        loading: false
      };
  }

  return state;
}

export const getFavouriteState = (state: FavouriteState) => state.favourites;
export const getFavouriteLoadingState = (state: FavouriteState) => state.loading;
export const getFavouriteLoadedState = (state: FavouriteState) => state.loaded;
