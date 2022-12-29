import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  loading: boolean;
  error: string | null;

  searches: google.maps.places.PlaceResult[];
};

const initialState: InitialState = {
  loading: true,
  error: null,

  searches: [],
};

const placesSlice = createSlice({
  name: "places",
  initialState,
  reducers: {
    addSearches: (
      state,
      { payload }: { payload: google.maps.places.PlaceResult }
    ) => {
      const placeFound = state.searches.find(
        (el) => el.formatted_address === payload.formatted_address
      );

      if (!placeFound) {
        state.searches = [...state.searches, payload];
      }
    },
  },
});

export const { addSearches } = placesSlice.actions;

export default placesSlice.reducer;
