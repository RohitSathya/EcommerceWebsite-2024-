import {configureStore} from '@reduxjs/toolkit'
import Totalslice from './Redux/totalslice'
export const store=configureStore({

    reducer:{
        total:Totalslice
     
    }
})