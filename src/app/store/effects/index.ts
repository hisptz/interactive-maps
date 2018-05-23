import { CurrentUserEffects } from './current-user.effects';
import { RouterEffects } from './router.effects';
import { FavouriteEffects } from './favourite.effects';
import { VisualizationEffects } from './visualization.effects';

export const effects: any[] = [CurrentUserEffects, RouterEffects, FavouriteEffects, VisualizationEffects];

export * from './current-user.effects';
export * from './router.effects';
export * from './favourite.effects';
export * from './visualization.effects';
