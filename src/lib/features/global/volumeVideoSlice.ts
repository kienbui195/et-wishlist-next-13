import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export const volumeVideoSlice = createSlice({
  name: 'volumeVideo',
  initialState: 0,
  reducers: {
    setVolume: (state, action: PayloadAction<number>) => {
      return action.payload
    },
  },
})

export const { setVolume } = volumeVideoSlice.actions

export default volumeVideoSlice.reducer