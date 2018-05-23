import { Visualization } from '../../core/models/visualization.model';
import { VisualizationAction, VisualizationActionTypes } from '../actions/visualization.actions';

export interface VisualizationState {
  visualization: Visualization;
  loading: boolean;
  loaded: boolean;
}

export const initialState: VisualizationState = {
  loading: false,
  loaded: false,
  visualization: null
};

export function visualizationReducer(
  state: VisualizationState = initialState,
  action: VisualizationAction
): VisualizationState {
  switch (action.type) {
    case VisualizationActionTypes.LOAD:
    case VisualizationActionTypes.LOAD_MAP_FROM_FAV:
      return {
        ...state,
        loading: true
      };
    case VisualizationActionTypes.LOAD_SUCCESS:
      return {
        ...state,
        visualization: action.visualization,
        loaded: true,
        loading: false
      };
  }

  return state;
}

export const getVisualizationState = (state: VisualizationState) => state.visualization;
export const getVisualizationLoadingState = (state: VisualizationState) => state.loading;
export const getVisualizationLoadedState = (state: VisualizationState) => state.loaded;
