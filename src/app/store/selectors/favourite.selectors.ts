import { createSelector } from '@ngrx/store';
import { getFavouriteState } from '../reducers';
import {
  getFavouriteLoadedState,
  getFavouriteLoadingState,
  getFavouriteState as FavouriteState
} from '../reducers/favourite.reducer';

export const getFavourites = createSelector(getFavouriteState, FavouriteState);

export const getFavouriteLoading = createSelector(getFavouriteState, getFavouriteLoadingState);

export const getFavouriteLoaded = createSelector(getFavouriteState, getFavouriteLoadedState);
