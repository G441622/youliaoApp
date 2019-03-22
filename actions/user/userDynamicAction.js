import * as types from './userConstant';
import userDynamicApi from '../../api/user/userDynamicApi';


export function getUserDynamic(user_token,input){
    return function(dispatch, getState){
        return userDynamicApi.getUserDynamic(user_token,input)
            .then(result => {
                dispatch({type:types.GET_DYNAMIC_USER, data:result.info});
            })
            .catch(error =>{
                console.log(error);
            });
    };
}
export function getUserDynamicDelete(forum_id,index){
    return function(dispatch, getState){
        return userDynamicApi.getUserDynamicDelete(forum_id,index)
            .then(result => {
                dispatch({type:types.GET_DYNAMIC_DELETE, data:result.info,index:index});
            })
            .catch(error =>{
                console.log(error);
            });
    };
}