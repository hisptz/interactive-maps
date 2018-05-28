import { Action } from '@ngrx/store';
import { Visualization } from '../../core/models/visualization.model';

export enum VisualizationActionTypes {
  LOAD_MAP_FROM_FAV = '[Visualization] Load map from Favourite',
  LOAD_GEOFEATURES = '[Visualization] Load map Geofeatures',
  TRANSFORM_FAVOURITE = '[Visualization] Create visualization from favourite',
  LOAD_ANALYTICS = '[Visualization] Load map Analytics',
  LOAD = '[Visualization] Load current visualization',
  LOAD_SUCCESS = '[Visualization] Load current visualization success',
  LOAD_LEGENDSET = '[Visualization] Load LegendSets',
  LOAD_LEGENDSET_SUCCESS = '[Visualization] Load LegendSets success',
  LOAD_FAIL = '[Visualization] Load current visualization fail'
}

export class CreateVisualizationAction implements Action {
  readonly type = VisualizationActionTypes.LOAD_MAP_FROM_FAV;
  constructor(public favouriteID: string) {}
}

export class LoadLegendSet implements Action {
  readonly type = VisualizationActionTypes.LOAD_LEGENDSET;
  constructor(public visualization: Visualization) {}
}

export class LoadLegendSuccess implements Action {
  readonly type = VisualizationActionTypes.LOAD_LEGENDSET_SUCCESS;
  constructor(public legend: any) {}
}

export class TransformFavouriteAction implements Action {
  readonly type = VisualizationActionTypes.TRANSFORM_FAVOURITE;
  constructor(public visualization: Visualization) {}
}

export class LoadVisualizationAction implements Action {
  readonly type = VisualizationActionTypes.LOAD;
}

export class LoadVisualizationAnalyticsAction implements Action {
  readonly type = VisualizationActionTypes.LOAD_ANALYTICS;
  constructor(public visualization: Visualization, public legenSets?: any) {}
}

export class LoadVisualizationSuccessAction implements Action {
  readonly type = VisualizationActionTypes.LOAD_SUCCESS;

  constructor(public visualization: Visualization) {}
}

export class LoadVisualizationFailAction implements Action {
  readonly type = VisualizationActionTypes.LOAD_FAIL;
  constructor(public error: any) {}
}

export type VisualizationAction =
  | LoadVisualizationAction
  | LoadLegendSuccess
  | LoadLegendSet
  | CreateVisualizationAction
  | LoadVisualizationSuccessAction
  | LoadVisualizationFailAction;
