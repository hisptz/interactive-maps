import { CurrentUserEffects } from './current-user.effects';
import { RouterEffects } from './router.effects';
import { FavouriteEffects } from './favourite.effects';

export const effects: any[] = [CurrentUserEffects, RouterEffects, FavouriteEffects];

export * from './current-user.effects';
export * from './router.effects';
export * from './favourite.effects';
