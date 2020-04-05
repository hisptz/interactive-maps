import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { map, tap } from "rxjs/operators";
import { Location } from "@angular/common";
import { Store } from "@ngrx/store";
import { AppState } from "../reducers";
import { CreateVisualizationAction } from "../actions/visualization.actions";

import * as fromRouterActions from "../actions/router.actions";

@Injectable()
export class RouterEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private router: Router,
    private location: Location
  ) {}

  @Effect({ dispatch: false })
  navigate$ = this.actions$.pipe(
    ofType(fromRouterActions.GO),
    map((action: fromRouterActions.Go) => action.payload),
    tap(({ path, query: queryParams, extras }) => {
      this.router.navigate(path, { queryParams, ...extras });
    })
  );

  @Effect({ dispatch: false })
  locationUpdate$ = this.actions$.pipe(
    ofType("ROUTER_NAVIGATION"),
    map((action: any) => action.payload.routerState),
    tap(payload => {
      const { url, queryParams } = payload;
      const itHasId =
        url.startsWith("/?") && queryParams && queryParams.id !== null;
      if (itHasId) {
        this.store.dispatch(new CreateVisualizationAction(queryParams.id));
      }
    })
  );

  @Effect({ dispatch: false })
  navigateBack$ = this.actions$.pipe(
    ofType(fromRouterActions.BACK),
    tap(() => this.location.back())
  );

  @Effect({ dispatch: false })
  navigateForward$ = this.actions$.pipe(
    ofType(fromRouterActions.FORWARD),
    tap(() => this.location.forward())
  );
}
