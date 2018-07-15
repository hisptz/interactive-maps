import { ActionReducerMap, createSelector, MetaReducer } from '@ngrx/store';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Params } from '@angular/router';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../../environments/environment';
import { routerReducer, RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';
import { currentUserReducer, CurrentUserState } from './current-user.reducer';
import { favouriteReducer, FavouriteState } from './favourite.reducer';
import { visualizationReducer, VisualizationState } from './visualization.reducer';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface AppState {
  route: RouterReducerState<RouterStateUrl>;
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
export const getVisualizationState = createSelector(getRootState, (state: AppState) => state.visualization);

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const { queryParams } = routerState.root;

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params } = state;

    return { url, queryParams, params };
  }
}
