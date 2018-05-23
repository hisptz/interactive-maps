import { CurrentUserService } from './current-user.service';
import { ManifestService } from './manifest.service';
import { HttpClientService } from './http-client.service';
import { FavouriteService } from './favourite.service';

export const services: any[] = [ManifestService, HttpClientService, CurrentUserService, FavouriteService];

export * from './http-client.service';
export * from './manifest.service';
export * from './current-user.service';
export * from './favourite.service';
