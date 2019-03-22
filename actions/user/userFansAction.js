import * as types from './userConstant';
import userFansApi from '../../api/user/userFansApi';


export function getUserFans(user_token,input){
    return function(dispatch, getState){
        return userFansApi.getUserFans(user_token,input)
            .then(result => {
                dispatch({type:types.GET_FANS_USER, data:result.info});
            })
            .catch(error =>{
                console.log(error);
            });
    };
}