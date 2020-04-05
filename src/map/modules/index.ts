import { DataFilterModule } from "./data-filter/data-filter.module";
import { PeriodFilterModule } from "./period-filter/period-filter.module";

export const modules = [DataFilterModule, PeriodFilterModule];

export * from "./data-filter/data-filter.module";
export * from "./period-filter/period-filter.module";
