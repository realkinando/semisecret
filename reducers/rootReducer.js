const initialState = {
}

export default function rootReducer(state = initialState, action) {
    switch (action.type){
        case 'setAddress' :
            return Object.assign({},state,{
                address : action.value
            })
        case 'setPhrase' :
            return Object.assign({},state,{
                phrase : action.value
            })
        default:
            return state
        }
    }