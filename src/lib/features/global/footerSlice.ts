
import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction } from "@reduxjs/toolkit";
import { INavigation } from '../../../components/Header/HeaderLogged';

export interface IFooterInitState {
  footer: {
    menu: INavigation[] | [],
    submenu: INavigation[] | [],
  }
}

const initialState: IFooterInitState = {
  footer: {
    menu: [],
    submenu: []
  }
}

export const footerSlice = createSlice({
  name: 'footer',
  initialState,
  reducers: {
    setFooterMenu: (state, action: PayloadAction<INavigation[] | []>) => {
      state.footer.menu = action.payload
    },
    setFooterSubMenu: (state, action: PayloadAction<INavigation[] | []>) => {
      state.footer.submenu = action.payload
    }
  }
})

export const {setFooterMenu, setFooterSubMenu} = footerSlice.actions

export default footerSlice.reducer