import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export const menuBarDisplaySlice = createSlice({
  name: 'menuBarDisplay',
  initialState: {
    isShow: false
  },
  reducers: {
    setDisplayMenuBar: (state, action: PayloadAction<boolean>) => {
      state.isShow = action.payload
      document.body.classList[action.payload ? 'add' : 'remove']('overflow-hidden')
    },
  },
})

export const { setDisplayMenuBar } = menuBarDisplaySlice.actions

export default menuBarDisplaySlice.reducer
