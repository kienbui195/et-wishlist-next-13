import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface IShopItem {
  id: number
  active: boolean
  connected: boolean
}

export interface IShopState {
  shop: IShopItem
}

const initialState: IShopState = {
  shop: {
    id: 0,
    active: false,
    connected: false
  },
}

export const shopSlice = createSlice({
  name: 'shopInfo',
  initialState,
  reducers: {
    updateShopInfo: (state, action: PayloadAction<IShopItem>) => {
      state.shop = {
        ...state.shop,
        ...action.payload
      }
    },
  },
})

export const { updateShopInfo } = shopSlice.actions

export default shopSlice.reducer
