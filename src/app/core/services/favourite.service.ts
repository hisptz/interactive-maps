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

  searchFavourite(favName: string): Observable<Favourite[]> {
    return this.httpClient
      .get(
        `api/maps.json?fields=id,displayName~rename(name)&filter=displayName:ilike:${favName}&_dc=1514366772136&pageSize=8&page=1&start=0&limit=8`
      )
      .pipe(map(({ maps }) => maps));
  }

  getMapFromFav(favId): Observable<any> {
    return this.httpClient.get(
      `api/maps/${favId}.json?fields=id,user,displayName,
        longitude,latitude,zoom,basemap,mapViews%5B*,columns%5Bdimension,filter,
        items%5BdimensionItem,dimensionItemType,displayName%5D%5D,
        rows%5Bdimension,filter,items%5BdimensionItem,dimensionItemType,
        displayName%5D%5D,filters%5Bdimension,filter,
        items%5BdimensionItem,dimensionItemType,
        displayName%5D%5D,dataDimensionItems,
        program%5Bid,displayName%5D,programStage%5Bid,
        displayName%5D,legendSet%5Bid,displayName%5D,
        !lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,
        !userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,
        !externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,
        !user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,
        !dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,
        !organisationUnitLevels,!organisationUnits,!sortOrder,!topLimit%5D&_dc=1514366821016`
    );
  }
}
