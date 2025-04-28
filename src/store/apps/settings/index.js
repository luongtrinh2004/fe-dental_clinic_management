import { createSlice } from '@reduxjs/toolkit'

export const customizerSlice = createSlice({
  name: 'customizer',
  initialState: {
    isOpen: false
  },
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload
    }
  }
})

export const { setOpen } = customizerSlice.actions

export default customizerSlice.reducer
