import { IHeaderBarPage } from '@/components/HeaderBar';

import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction } from "@reduxjs/toolkit";

export interface IHeaderBarInitState {
  headerbar: IHeaderBarPage[]
}

const initialState: IHeaderBarInitState = {
  headerbar: []
}

export const headerbarSlice = createSlice({
  name: 'headerbar',
  initialState,
  reducers: {
     setHeaderBar: (state, action: PayloadAction<IHeaderBarPage[] | []>) => {
      state.headerbar = action.payload
     }
  }
})

export const {setHeaderBar} = headerbarSlice.actions

export default headerbarSlice.reducer