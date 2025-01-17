import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  params: {
    page: 1,
    language: 'en-US',
    title: '', 
    genreName: '',
    studioName: '',
    year: '',
    minPrice: 0,
    maxPrice: 9999,
    sortBy: ''
  }
};

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setPage(state, action) {
      state.params.page = action.payload
    },
    incrementPage(state) {
      state.params.page += 1
    },
    decrementPage(state) {
      state.params.page -= 1
    },
    setLanguage(state, action) {
      state.params.language = action.payload
    },
    setTitle(state, action) {
      state.params.title = action.payload;
    },
    setQueryGenres(state, action) {
      state.params.genreName = action.payload
    },
    setQueryStudios(state, action) {
      state.params.studioName = action.payload
    },
    setYear(state, action) {
      state.params.year = action.payload
    },
    setMinPrice(state, action) {
      state.params.minPrice = action.payload
    },
    setMaxPrice(state, action) {
      state.params.maxPrice = action.payload
    },
    setSorting(state, action) {
      state.params.sortBy = action.payload
    },
    resetFilters(state) {
      const sort_by = state.params.sortBy
      state.params = {
        ...initialState.params,
        sortBy: sort_by
      }
    }
  }
})

export default querySlice.reducer
export const { setPage, incrementPage, decrementPage, setLanguage, setTitle, setQueryGenres,setQueryStudios, setYear, setMinPrice, setMaxPrice, setSorting, resetFilters } = querySlice.actions