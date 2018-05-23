import { ActionReducerMap, createSelector, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../../environments/environment';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { currentUserReducer, CurrentUserState } from './current-user.reducer';
import { favouriteReducer, FavouriteState } from './favourite.reducer';

export interface AppState {
  route: RouterReducerState;
  currentUser: CurrentUserState;
  favourites: FavouriteState;
}

export const reducers: ActionReducerMap<AppState> = {
  route: routerReducer,
  currentUser: currentUserReducer,
  favourites: favouriteReducer
};

export const getRootState = (state: AppState) => state;

/**
 * Get current user state
 */
export const getCurrentUserState = createSelector(getRootState, (state: AppState) => state.currentUser);
export const getFavouriteState = createSelector(getRootState, (state: AppState) => state.favourites);

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];
