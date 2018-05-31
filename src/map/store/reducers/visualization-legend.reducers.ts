import * as fromVisualizationLegend from './../actions/visualization-legend.action';
import { VisualizationLegend } from '../../models/visualization-legend.model';

export interface VisualizationLegendState {
  entities: { [id: string]: VisualizationLegend };
}

export const initialState: VisualizationLegendState = {
  entities: {}
};

export function reducer(
  state = initialState,
  action: fromVisualizationLegend.VisualizationLegendAction
): VisualizationLegendState {
  switch (action.type) {
    case fromVisualizationLegend.INITIALIZE_VISUALIZATION_LEGEND: {
      const visualizationObjectId = action.payload;
      const initialVisualizationLegendState: VisualizationLegend = {
        open: false,
        pinned: false,
        filterSectionOpen: false,
        datatableIsOpen: false,
        filterSectionLoading: false,
        filterSectionJustUpdated: false
      };
      const entities = {
        ...state.entities,
        [visualizationObjectId]: initialVisualizationLegendState
      };
      return {
        ...state,
        entities
      };
    }

    case fromVisualizationLegend.TOGGLE_PIN_VISUALIZATION_LEGEND: {
      const visualizationObjectId = action.payload;
      const pinned = !state.entities[visualizationObjectId].pinned;
      const visualizationLegend = {
        ...state.entities[visualizationObjectId],
        pinned
      };
      const entities = {
        ...state.entities,
        [visualizationObjectId]: visualizationLegend
      };
      return {
        ...state,
        entities
      };
    }
    case fromVisualizationLegend.TOGGLE_OPEN_VISUALIZATION_LEGEND: {
      const visualizationObjectId = action.payload;
      const pinned = state.entities[visualizationObjectId].pinned;
      const open = !state.entities[visualizationObjectId].open;
      if (pinned) {
        return state;
      }
      const visualizationLegend = {
        ...state.entities[visualizationObjectId],
        open,
        pinned: open ? true : pinned
      };
      const entities = {
        ...state.entities,
        [visualizationObjectId]: visualizationLegend
      };
      return {
        ...state,
        entities
      };
    }

    case fromVisualizationLegend.FULLSCREEN_OPEN_VISUALIZATION_LEGEND: {
      const visualizationObjectId = action.payload;
      const pinned = true;
      const open = true;
      const visualizationLegend = {
        ...state.entities[visualizationObjectId],
        open,
        pinned
      };
      const entities = {
        ...state.entities,
        [visualizationObjectId]: visualizationLegend
      };
      return {
        ...state,
        entities
      };
    }

    case fromVisualizationLegend.TOGGLE_VISUALIZATION_FILTER_SECTION: {
      const visualizationObjectId = action.payload;
      const filterSectionOpen = !state.entities[visualizationObjectId].filterSectionOpen;
      const visualizationLegend = {
        ...state.entities[visualizationObjectId],
        filterSectionOpen
      };
      const entities = {
        ...state.entities,
        [visualizationObjectId]: visualizationLegend
      };
      return {
        ...state,
        entities
      };
    }

    case fromVisualizationLegend.TOGGLE_DATA_TABLE: {
      const visualizationObjectId = action.payload;
      const datatableIsOpen = !state.entities[visualizationObjectId].datatableIsOpen;
      const visualizationLegend = {
        ...state.entities[visualizationObjectId],
        datatableIsOpen
      };
      const entities = {
        ...state.entities,
        [visualizationObjectId]: visualizationLegend
      };
      return {
        ...state,
        entities
      };
    }

    case fromVisualizationLegend.CLOSE_VISUALIZATION_FILTER_SECTION: {
      const visualizationObjectId = action.payload;
      const filterSectionOpen = false;
      const visualizationLegend = {
        ...state.entities[visualizationObjectId],
        filterSectionOpen
      };
      const entities = {
        ...state.entities,
        [visualizationObjectId]: visualizationLegend
      };
      return {
        ...state,
        entities
      };
    }

    case fromVisualizationLegend.CLOSE_PIN_VISUALIZATION_LEGEND: {
      const visualizationObjectId = action.payload;
      const pinned = false;
      const open = !state.entities[visualizationObjectId].open;
      const visualizationLegend = {
        ...state.entities[visualizationObjectId],
        open,
        pinned
      };
      const entities = {
        ...state.entities,
        [visualizationObjectId]: visualizationLegend
      };
      return {
        ...state,
        entities
      };
    }

    case fromVisualizationLegend.VISUALIZATION_FILTER_SECTION_LOADING: {
      const visualizationObjectId = action.payload;
      const filterSectionLoading = true;
      const visualizationLegend = {
        ...state.entities[visualizationObjectId],
        filterSectionLoading
      };
      const entities = {
        ...state.entities,
        [visualizationObjectId]: visualizationLegend
      };
      return {
        ...state,
        entities
      };
    }

    case fromVisualizationLegend.VISUALIZATION_FILTER_SECTION_LOADED: {
      const visualizationObjectId = action.payload;
      const filterSectionLoading = false;
      const filterSectionJustUpdated = true;
      const visualizationLegend = {
        ...state.entities[visualizationObjectId],
        filterSectionLoading,
        filterSectionJustUpdated
      };
      const entities = {
        ...state.entities,
        [visualizationObjectId]: visualizationLegend
      };
      return {
        ...state,
        entities
      };
    }

    case fromVisualizationLegend.VISUALIZATION_FILTER_SECTION_JUST_UPDATED: {
      const visualizationObjectId = action.payload;
      const filterSectionJustUpdated = false;
      const visualizationLegend = {
        ...state.entities[visualizationObjectId],
        filterSectionJustUpdated
      };
      const entities = {
        ...state.entities,
        [visualizationObjectId]: visualizationLegend
      };
      return {
        ...state,
        entities
      };
    }

    case fromVisualizationLegend.VISUALIZATION_FILTER_SECTION_UPDATE_FAIL: {
      const filterSectionLoading = false;
      const filterSectionJustUpdated = false;
      const entities = Object.keys(state.entities).reduce((obj, key) => {
        obj[key] = {
          ...state.entities[key],
          filterSectionJustUpdated,
          filterSectionLoading
        };
        return obj;
      }, {});
      return {
        ...state,
        entities
      };
    }
  }
  return state;
}

export const getVisualizationLegendEntities = (state: VisualizationLegendState) => state.entities;
