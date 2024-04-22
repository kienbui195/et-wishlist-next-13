import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction } from "@reduxjs/toolkit";

export interface ILoginComponentState {
  openModalLogin: boolean
}

const initialState: ILoginComponentState = {
  openModalLogin: false
}

export const loginSlice = createSlice({
  name: 'openModalLogin',
  initialState,
  reducers: {
     setOpenModalLogin: (state, action: PayloadAction<boolean>) => {
      state.openModalLogin = action.payload
       action.payload ? document.body.classList.add('overflow-hidden') : document.body.classList.remove('overflow-hidden')
     }
  }
})

export const {setOpenModalLogin} = loginSlice.actions

export default loginSlice.reducer
