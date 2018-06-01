import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AppState } from './store/reducers';
import { LoadFavouritesAction, SearchFavouritesAction } from './store/actions/favourite.actions';
import { CreateVisualizationAction } from './store/actions/visualization.actions';
import { getFavourites, getFavouriteLoading } from './store/selectors/favourite.selectors';
import { getVisualizationObject, isVisualizationLoading } from './store/selectors/visualization.selectors';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Favourite, Visualization } from './core/models';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  public isFavouritesLoading$: Observable<boolean>;
  public isVisualizationLoading$: Observable<boolean>;
  public favourites$: Observable<Favourite[]>;
  public vizObject$: Observable<Visualization>;
  public selectedOption: Favourite;
  public favForm: FormGroup;
  public showFavList: boolean;

  constructor(private store: Store<AppState>, public fb: FormBuilder, private router: Router) {
    this.showFavList = false;
    store.dispatch(new LoadFavouritesAction());
    this.vizObject$ = this.store.select(getVisualizationObject);
    this.isVisualizationLoading$ = this.store.select(isVisualizationLoading);
  }

  ngOnInit() {
    this.favourites$ = this.store.select(getFavourites);
    this.isFavouritesLoading$ = this.store.select(getFavouriteLoading);
    this.favForm = this.fb.group({
      querystring: ['']
    });
    this.onChangeMap();
  }
  ngAfterViewInit() {
    const mymap = L.map('mapid', { zoomControl: false }).setView([22.763672, 9.795678], 3);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy;<a href="https://carto.com/attribution">cartoDB</a>',
      maxZoom: 18
    }).addTo(mymap);
    L.control.scale().addTo(mymap);
  }

  onChangeMap(): void {
    // ... do other stuff here ...
    this.favForm.valueChanges.subscribe(val => {
      if (val.querystring) {
        const querystring = val.querystring;
        this.store.dispatch(new SearchFavouritesAction(querystring));
      }
    });
  }

  toggleFavSelection(event) {
    event.stopPropagation();
    this.showFavList = !this.showFavList;
  }

  setSelectedFav(fav: Favourite, event) {
    event.stopPropagation();
    this.router.navigate([''], { queryParams: { id: fav.id } });
    this.selectedOption = fav;
    this.showFavList = !this.showFavList;
  }
}
