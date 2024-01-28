import { createSlice } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
  name: "commands",
  initialState: {
    items: {},
  },
  reducers: {
    refresh(state, action) {
      state.items = {};
      action.payload.forEach((item) => (state.items[item.id] = item));
    },
    update(state, action) {
      action.payload.forEach((item) => (state.items[item.id] = item));
    },
    remove(state, action) {
      delete state.items[action.payload];
    },
  },
});

export { actions as commandsActions };
export { reducer as commandsReducer };
