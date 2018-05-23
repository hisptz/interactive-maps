import { ActionReducerMap, createSelector, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../../environments/environment';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { currentUserReducer, CurrentUserState } from './current-user.reducer';
import { favouriteReducer, FavouriteState } from './favourite.reducer';
import { visualizationReducer, VisualizationState } from './visualization.reducer';

export interface AppState {
  route: RouterReducerState;
  currentUser: CurrentUserState;
  favourites: FavouriteState;
  visualization: VisualizationState;
}

export const reducers: ActionReducerMap<AppState> = {
  route: routerReducer,
  currentUser: currentUserReducer,
  favourites: favouriteReducer,
  visualization: visualizationReducer
};

export const getRootState = (state: AppState) => state;

/**
 * Get current user state
 */
export const getCurrentUserState = createSelector(getRootState, (state: AppState) => state.currentUser);
export const getFavouriteState = createSelector(getRootState, (state: AppState) => state.favourites);
export const getVisualizationObject = createSelector(getRootState, (state: AppState) => state.visualization);

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];
