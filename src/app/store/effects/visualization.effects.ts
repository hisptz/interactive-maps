import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, flatMap, mergeMap, tap } from 'rxjs/operators';
import { of, forkJoin, Observable, merge } from 'rxjs';
import { FavouriteService } from '../../core/services/favourite.service';
import {
  VisualizationActionTypes,
  CreateVisualizationAction,
  LoadVisualizationFailAction,
  LoadVisualizationSuccessAction,
  TransformFavouriteAction,
  LoadLegendSet,
  LoadVisualizationAnalyticsAction
} from '../actions/visualization.actions';
import { Visualization } from '../../core/models/visualization.model';
import {
  updateVisualizationWithSettings,
  getMergedAnalytics,
  getSanitizedAnalytics,
  standardizeIncomingAnalytics,
  constructAnalyticsUrl
} from '../../core/helpers';
import { HttpClientService } from '../../core/services/http-client.service';
import * as _ from 'lodash';

const FAVOURITE_TYPE = 'MAP';
const MAP_HEIGHT = '100vh';

@Injectable()
export class VisualizationEffects {
  constructor(
    private actions$: Actions,
    private favouriteService: FavouriteService,
    private httpClient: HttpClientService
  ) {}

  @Effect()
  LoadMapFavourites$ = this.actions$.ofType(VisualizationActionTypes.LOAD_MAP_FROM_FAV).pipe(
    map((action: CreateVisualizationAction) => action.favouriteID),
    flatMap(favouriteID => {
      return this.favouriteService
        .getMapFromFav(favouriteID)
        .pipe(
          map(favourite => new TransformFavouriteAction(favourite)),
          catchError(error => of(new LoadVisualizationFailAction(error)))
        );
    })
  );

  @Effect()
  TransformFavourite$ = this.actions$.ofType(VisualizationActionTypes.TRANSFORM_FAVOURITE).pipe(
    map((action: TransformFavouriteAction) => {
      const { id, name, description, lastUpdated, created } = action.visualization;
      const initialVisualization = {
        type: FAVOURITE_TYPE,
        id,
        name,
        description,
        lastUpdated,
        created,
        subtitle: null,
        details: {
          currentVisualization: FAVOURITE_TYPE,
          cardHeight: '100vh',
          type: FAVOURITE_TYPE,
          favorite: {
            type: FAVOURITE_TYPE,
            id
          }
        },
        layers: []
      };
      const visualization = updateVisualizationWithSettings(initialVisualization, action.visualization);
      return visualization;
    }),
    map(visualization => new LoadLegendSet(visualization)),
    catchError(error => of(new LoadVisualizationFailAction(error)))
  );

  @Effect()
  LoadLegendSets$ = this.actions$.ofType<LoadLegendSet>(VisualizationActionTypes.LOAD_LEGENDSET).pipe(
    flatMap((action: LoadLegendSet) => {
      const visualizationObject: Visualization = { ...action.visualization };
      const visualizationLayers: any[] = [...visualizationObject.layers];
      const legendSetPromise$ = visualizationLayers.map(({ settings }) => this.getLegendsPromise(settings.legendSet));
      return forkJoin(legendSetPromise$).pipe(
        map(legendResponse => {
          const layers = visualizationLayers.map((layer, index) => {
            const { settings } = layer;
            const legendSet = legendResponse[index];
            return { ...layer, settings: { ...settings, legendSet } };
          });
          return { ...visualizationObject, layers };
        })
      );
    }),
    map(legendSets => new LoadVisualizationAnalyticsAction(legendSets)),
    catchError(error => of(new LoadVisualizationFailAction(error)))
  );

  @Effect()
  loadAnalytics$ = this.actions$.ofType<LoadVisualizationAnalyticsAction>(VisualizationActionTypes.LOAD_ANALYTICS).pipe(
    flatMap((action: LoadVisualizationAnalyticsAction) => {
      const visualizationObject: Visualization = { ...action.visualization };
      const visualizationDetails: any = { ...visualizationObject.details };
      const visualizationLayers: any[] = [...visualizationObject.layers];
      const analyticsPromises = _.map(visualizationLayers, (visualizationLayer: any) => {
        const visualizationFilter = _.find(visualizationDetails.filters, ['id', visualizationLayer.settings.id]);

        const dxFilterObject = _.find(visualizationFilter ? visualizationFilter.filters : [], ['name', 'dx']);

        /**
         * Get dx items for non function items
         */
        const normalDxItems = _.filter(
          dxFilterObject ? dxFilterObject.items : [],
          normalDx => normalDx.dimensionItemType !== 'FUNCTION_RULE'
        );

        const newFiltersWithNormalDx = _.map(visualizationFilter ? visualizationFilter.filters : [], filter => {
          return filter.name === 'dx'
            ? {
                ...filter,
                items: normalDxItems,
                value: _.map(normalDxItems, item => item.dimensionItem || item.id).join(';')
              }
            : filter;
        });

        /**
         * Get dx items for function items
         */
        const functionItems = _.filter(
          dxFilterObject ? dxFilterObject.items : [],
          normalDx => normalDx.dimensionItemType === 'FUNCTION_RULE'
        );

        const newFiltersWithFunction =
          functionItems.length > 0
            ? _.map(visualizationFilter ? visualizationFilter.filters : [], filter => {
                return filter.name === 'dx'
                  ? {
                      ...filter,
                      items: functionItems,
                      value: _.map(functionItems, item => item.id).join(';')
                    }
                  : filter;
              })
            : [];

        /**
         * Construct analytics promise
         */
        return forkJoin(
          this.getNormalAnalyticsPromise(visualizationObject.type, visualizationLayer.settings, newFiltersWithNormalDx),
          this.getFunctionAnalyticsPromise(newFiltersWithFunction)
        ).pipe(
          map((analyticsResponse: any[]) => {
            const sanitizedAnalyticsArray: any[] = _.filter(analyticsResponse, analyticsObject => analyticsObject);
            return sanitizedAnalyticsArray.length > 1
              ? getMergedAnalytics(sanitizedAnalyticsArray)
              : sanitizedAnalyticsArray[0];
          })
        );
      });

      return forkJoin(analyticsPromises).pipe(
        map((analyticsResponse: any[]) => {
          const layers = _.map(action.visualization.layers, (visualizationLayer: any, layerIndex: number) => {
            const visualizationFilter = _.find(visualizationDetails.filters, ['id', visualizationLayer.settings.id]);

            const analytics = getSanitizedAnalytics(
              { ...analyticsResponse[layerIndex] },
              visualizationFilter ? visualizationFilter.filters : []
            );

            return {
              ...visualizationLayer,
              analytics: analytics.headers || analytics.count ? standardizeIncomingAnalytics(analytics, true) : null
            };
          });
          return {
            ...action.visualization,
            details: {
              ...action.visualization.details,
              loaded: true
            },
            layers: layers,
            operatingLayers: layers
          };
        }),
        map(
          (visualizationObjectResult: Visualization) => new LoadVisualizationSuccessAction(visualizationObjectResult)
        ),
        catchError(error => of(new LoadVisualizationFailAction(error)))
      );
    })
  );

  private getNormalAnalyticsPromise(
    visualizationType: string,
    visualizationSettings: any,
    visualizationFilters: any[]
  ): Observable<any> {
    const analyticsUrl = constructAnalyticsUrl(visualizationType, visualizationSettings, visualizationFilters);
    const altenalteAnalyticsUrl = constructAnalyticsUrl(
      visualizationType,
      {
        ...visualizationSettings,
        eventClustering: false
      },
      visualizationFilters
    );
    return analyticsUrl !== ''
      ? this.httpClient.get(`api/${analyticsUrl}`).pipe(
          mergeMap((analyticsResult: any) => {
            return analyticsResult.count && analyticsResult.count < 2000
              ? this.httpClient.get(`api/${altenalteAnalyticsUrl}`)
              : of(analyticsResult);
          })
        )
      : of(null);
  }

  private getLegendsPromise(legendSet: any): Observable<any> {
    const needLegends = legendSet && legendSet.id;
    const fields = [
      'id',
      'displayName~rename(name)',
      'legends[*,!created',
      '!lastUpdated',
      '!displayName',
      '!externalAccess',
      '!access',
      '!userGroupAccesses'
    ];
    return needLegends
      ? this.httpClient.get(`api/legendSets/${legendSet.id}.json?fields=${fields.join(',')}`)
      : of(null);
  }

  private getFunctionAnalyticsPromise(visualizationFilters: any[]): Observable<any> {
    return new Observable(observer => {
      if (visualizationFilters.length === 0 || _.some(visualizationFilters, filter => filter.items.length === 0)) {
        observer.next(null);
        observer.complete();
      } else {
        const ouObject = _.find(visualizationFilters, ['name', 'ou']);
        const ouValue = ouObject ? ouObject.value : '';

        const peObject = _.find(visualizationFilters, ['name', 'pe']);
        const peValue = peObject ? peObject.value : '';

        const dxObject = _.find(visualizationFilters, ['name', 'dx']);

        const functionAnalyticsPromises = _.map(dxObject ? dxObject.items : [], dxItem => {
          return this._runFunction(
            {
              pe: peValue,
              ou: ouValue,
              rule: dxItem.config ? dxItem.config.ruleDefinition : null,
              success: result => {},
              error: error => {}
            },
            dxItem.config ? dxItem.config.functionString : ''
          );
        });

        forkJoin(functionAnalyticsPromises).subscribe((analyticsResponse: any[]) => {
          observer.next(analyticsResponse.length > 1 ? getMergedAnalytics(analyticsResponse) : analyticsResponse[0]);
          observer.complete();
        });
      }
    });
  }

  private _runFunction(functionParameters: any, functionString: string): Observable<any> {
    return new Observable(observ => {
      if (!this._isError(functionString)) {
        try {
          functionParameters.error = error => {
            observ.error(error);
            observ.complete();
          };
          functionParameters.success = results => {
            observ.next(results);
            observ.complete();
          };
          functionParameters.progress = results => {};
          const execute = Function('parameters', functionString);

          execute(functionParameters);
        } catch (e) {
          observ.error(e.stack);
          observ.complete();
        }
      } else {
        observ.error({ message: 'Errors in the code.' });
        observ.complete();
      }
    });
  }

  private _isError(code) {
    let successError = false;
    let errorError = false;
    let progressError = false;
    const value = code
      .split(' ')
      .join('')
      .split('\n')
      .join('')
      .split('\t')
      .join('');
    if (value.indexOf('parameters.success(') === -1) {
      successError = true;
    }
    if (value.indexOf('parameters.error(') === -1) {
      errorError = true;
    }
    if (value.indexOf('parameters.progress(') === -1) {
      progressError = true;
    }
    return successError || errorError;
  }
}
