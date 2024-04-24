import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IDropdownItem } from '@/data/wl-types'

export interface IUserLogin {
  user: {
    id?: number
    username?: string
    email?: string
    provider?: string
    confirmed?: boolean
    first_name?: string
    last_name?: string
    phone?: string
    jwt?: string
    business_role?: IDropdownItem
    how_did_you_hear?: string
    wl_member_type?: {
      id: number,
      name: string
    }
  }
}

const initialState: IUserLogin = {
  user: {
    id: undefined,
    username: '',
    email: '',
    provider: '',
    confirmed: undefined,
    first_name: '',
    last_name: '',
    phone: '',
    jwt: '',
    business_role: {
      id: '',
      name: '',
    },
    how_did_you_hear: '',
    wl_member_type: {
      id: 0,
      name: ''
    }
  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = {
        ...state.user,
        ...action.payload,
        business_role: {
          id: action.payload.business_role?.id,
          name: action.payload.business_role?.name,
        },
      }
    },
    setUserLogout: (state) => {
      state.user = {
        id: undefined,
        username: '',
        email: '',
        provider: '',
        confirmed: undefined,
        first_name: '',
        last_name: '',
        phone: '',
        jwt: '',
        business_role: {
          id: '',
          name: '',
        },
        how_did_you_hear: '',
        wl_member_type: {
          id: 0,
          name: ''
        }
      }
    },
  },
})

export const { setUser, setUserLogout } = userSlice.actions

export default userSlice.reducer
