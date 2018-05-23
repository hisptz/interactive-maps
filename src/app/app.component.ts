import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LoadFavouritesAction, AppState } from './store';
import { getFavourites, getFavouriteLoading, getFavouriteLoaded } from './store/selectors/favourite.selectors';
import { Observable } from 'rxjs';
import { Favourite } from './core/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public isFavouritesLoaded$: Observable<boolean>;
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
    this.isFavouritesLoaded$ = this.store.select(getFavouriteLoaded);
    this.favForm = this.fb.group({
      querystring: ['']
    });
    this.onChangeMap();
  }

  onChangeMap(): void {
    // ... do other stuff here ...
    this.favForm.valueChanges.subscribe(val => {
      if (val.querystring) {
        console.log(val.querystrin);
      }
    });
  }

  toggleFavSelection(event) {
    event.stopPropagation();
    this.showFavList = !this.showFavList;
  }

  setSelectedFav(fav: Favourite, event) {
    event.stopPropagation();
    this.selectedOption = fav;
    this.showFavList = !this.showFavList;
    console.log(fav.id);
  }
}
