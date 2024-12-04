import { createSlice } from "@reduxjs/toolkit";

const initialState={
    total:0,
    eachtotal:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    count:0,
    fakecount:0,
    fastcounte:0,
    orders:[],
    po:[],
    mes:[],
    ord:[]
 
}

export const totalslice=createSlice({

    name:'total',
    initialState,
    reducers:{

        addTotal:(state,action)=>{
            const {prevtotal,index,mul}=action.payload
            
            
                state.eachtotal.splice(index,1,mul);
                
         
           
          
            var co=0
            for (var x of state.eachtotal){
                co+=x

            }
            const b=Number(prevtotal)+Number(co)
         
            state.total=b

           
        },
        getcount:(state,action)=>{
            state.count=action.payload
           
                state.fakecount+=1
            
         

        },
        removeqty:(state,action)=>{
            const {index,val}=action.payload
            state.eachtotal.splice(index,1,0)
            

        },
        reset:(state)=>{
            state.eachtotal=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        },
        fastcount:(state,action)=>{
            state.fastcounte+=1

        },
        postorder:(state,action)=>{
            state.orders.push(action.payload)
            state.ord.push(action.payload)
           
        }
      
    }
})
export const {addTotal,getcount,removeqty,fastcount,reset,postorder}=totalslice.actions
export default totalslice.reducer
