import initialState from '../initialState';
import * as types from '../../actions/common/commonConstant';

export default function commonReducer(state = initialState.root.common, action){
    switch(action.type){
        case types.SHOW_LOADING:{
            return Object.assign({},state,{loading:true})
        }
        case types.HIDE_LOADING:{
            return Object.assign({},state,{loading:false})
        }
        case types.SHOW_TIP:{
            return Object.assign({},state,{tip:action.tip})
        }
        case types.HIDE_TIP:{
            return Object.assign({},state,{tip:undefined})
        }
        default : return state;
    }
}