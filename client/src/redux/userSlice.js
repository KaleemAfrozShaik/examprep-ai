import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name:"user",
    initialState: {
        userData: null,
        loading: true
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData = action.payload

        },
        updateCredits:(state,action)=>{
            if(state.userData){
                state.userData.credits = action.payload
            }
        },
        setLoading:(state,action)=>{
            state.loading = action.payload
        }
    }
})

export const {setUserData , updateCredits, setLoading} = userSlice.actions

export default userSlice.reducer