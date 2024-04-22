import { configureStore } from "@reduxjs/toolkit";
import headerReducer from "./features/global/headerSlice";
import footerReducer from "./features/global/footerSlice";
import headerBarReducer from "./features/global/headerbarSlice";
import loginReducer from "./features/authenticate/loginSlice";
import userReducer from "./features/authenticate/userSlice";
import shopReducer from "./features/authenticate/shopSlice";
import mutedVideoReducer from "./features/global/mutedVideoSlice";
import companyDefaultReducer from "./features/global/companyDefaultSlice";
import volumeVideoReducer from "./features/global/volumeVideoSlice";
import menuBarDisplayReducer from "./features/global/menuBarDisplaySlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      header: headerReducer,
      footer: footerReducer,
      headerBar: headerBarReducer,
      openModalLogin: loginReducer,
      user: userReducer,
      shop: shopReducer,
      mutedVideo: mutedVideoReducer,
      companyDefault: companyDefaultReducer,
      volumeVideo: volumeVideoReducer,
      menuBarDisplay: menuBarDisplayReducer,
    },
  });
};
//
// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
