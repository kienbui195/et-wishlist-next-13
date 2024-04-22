import { ILogo, INavigation } from './../../components/Header/HeaderLogged';
import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction } from "@reduxjs/toolkit";

export interface IHeaderInitState {
  header: {
    logo: ILogo | null,
    navItems: INavigation[] | []
  }
}

const initialState: IHeaderInitState = {
  header: {
    logo: null,
    navItems: []
  }
}

export const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setLogo: (state, action: PayloadAction<ILogo | null>) => {
      state.header.logo = action.payload
    },
    setNavItems: (state, action: PayloadAction<INavigation[] | []>) => {
      state.header.navItems = action.payload
    }
  }
})

export const {setLogo, setNavItems} = headerSlice.actions

export default headerSlice.reducer