
import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction } from "@reduxjs/toolkit";

export interface ICompanyDefaultInitState {
  name: string
  support_email: string
  website: string
  logo?: {
    data?: {
      attributes: {
        url: string
      }
    }
  }
}

const initialState: ICompanyDefaultInitState = {
  name: 'Company Name',
  support_email: 'example@example.com',
  website: 'http://example.com',
  logo: undefined
}

export const companySlice = createSlice({
  name: 'companyDefault',
  initialState,
  reducers: {
    setCompanyInfo: (state, action: PayloadAction<ICompanyDefaultInitState>) => {      
      state.name = action.payload?.name || "Company Name"
      state.support_email= action.payload?.support_email || 'example@example.com'
      state.website = action.payload?.website || "http://example.com"
      state.logo = action.payload?.logo || undefined
    }
  }
})

export const {setCompanyInfo} = companySlice.actions

export default companySlice.reducer