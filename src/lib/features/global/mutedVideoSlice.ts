import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export const mutedVideoSlice = createSlice({
  name: 'mutedVideo',
  initialState: true,
  reducers: {
    setMutedVideo: (state, action: PayloadAction<boolean>) => {
      return action.payload
    },
  },
})

export const { setMutedVideo } = mutedVideoSlice.actions

export default mutedVideoSlice.reducer
