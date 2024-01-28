import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { errorsReducer as errors } from "./errors";
import { sessionReducer as session } from "./session";
import { devicesReducer as devices } from "./devices";
import { eventsReducer as events } from "./events";
import { geofencesReducer as geofences } from "./geofences";
import { groupsReducer as groups } from "./groups";
import { driversReducer as drivers } from "./drivers";
import { maintenancesReducer as maintenances } from "./maintenances";
import { calendarsReducer as calendars } from "./calendars";
import { reportsReducer as reports } from "./reports";
import { commandsReducer as commands } from "./commands";

import reducers from "./reducers";
import throttleMiddleware from "./throttleMiddleware";

const reducer = combineReducers({
  errors,
  session,
  devices,
  events,
  geofences,
  groups,
  drivers,
  maintenances,
  calendars,
  reports,
  reducers,
  commands,
});

export { errorsActions } from "./errors";
export { sessionActions } from "./session";
export { devicesActions } from "./devices";
export { eventsActions } from "./events";
export { geofencesActions } from "./geofences";
export { groupsActions } from "./groups";
export { driversActions } from "./drivers";
export { maintenancesActions } from "./maintenances";
export { calendarsActions } from "./calendars";
export { reportsActions } from "./reports";
export { commandsActions } from "./commands";
export { reducers } from "./reducers";

// const { dispatch } = reducer;

// export { reducer, dispatch };

export default configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(throttleMiddleware),
});
