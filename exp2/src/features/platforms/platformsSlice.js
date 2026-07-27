import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { PLATFORMS } from "../../platformConfig";

const platformsAdapter = createEntityAdapter({
  selectId: (platform) => platform.id,
});

const initialState = platformsAdapter.addMany(
  platformsAdapter.getInitialState(),
  Object.values(PLATFORMS)
);

const platformsSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {},
});

export const { selectAll: selectAllPlatforms, selectById: selectPlatformById } =
  platformsAdapter.getSelectors((state) => state.platforms);

export default platformsSlice.reducer;
