import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AppState } from './store/reducers';
import { LoadFavouritesAction, SearchFavouritesAction } from './store/actions/favourite.actions';
import { CreateVisualizationAction } from './store/actions/visualization.actions';
import { getFavourites, getFavouriteLoading } from './store/selectors/favourite.selectors';
import { Observable } from 'rxjs';
import { Favourite } from './core/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public isFavouritesLoading$: Observable<boolean>;
  public favourites$: Observable<Favourite[]>;
  public selectedOption: Favourite;
  public favForm: FormGroup;
  public showFavList: boolean;

  constructor(private store: Store<AppState>, public fb: FormBuilder) {
    this.showFavList = false;
    store.dispatch(new LoadFavouritesAction());
  }

  ngOnInit() {
    this.favourites$ = this.store.select(getFavourites);
    this.isFavouritesLoading$ = this.store.select(getFavouriteLoading);
    this.favForm = this.fb.group({
      querystring: ['']
    });
    this.onChangeMap();
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
    this.store.dispatch(new CreateVisualizationAction(fav.id));
    this.selectedOption = fav;
    this.showFavList = !this.showFavList;
  }
}
