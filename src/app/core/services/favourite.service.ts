import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClientService } from './http-client.service';
import { Favourite } from '../models/favourite.model';

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {
  constructor(private httpClient: HttpClientService) {}

  loadFavourites(): Observable<Favourite[]> {
    return this.httpClient
      .get(`maps.json?fields=id,displayName~rename(name)&_dc=1514366772136&pageSize=8&page=1&start=0&limit=8`)
      .pipe(map(({ maps }) => maps));
  }
}
