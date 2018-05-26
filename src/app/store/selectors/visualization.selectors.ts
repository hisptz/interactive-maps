import { createSelector } from '@ngrx/store';
import { getVisualizationState } from '../reducers';
import {
  getVisualizationState as visualizationState,
  getVisualizationLoadedState,
  getVisualizationLoadingState
} from '../reducers/visualization.reducer';

export const getVisualizationObject = createSelector(getVisualizationState, visualizationState);

export const isVisualizationLoading = createSelector(getVisualizationState, getVisualizationLoadingState);

export const isVisualizationLoaded = createSelector(getVisualizationState, getVisualizationLoadedState);
