import * as types from './userConstant';
import userFollowApi from '../../api/user/userFollowApi';


export function getUserFollow(user_token,input){
    return function(dispatch, getState){
        return userFollowApi.getUserFollow(user_token,input)
            .then(result => {
                dispatch({type:types.GET_FOLLOW_USER, data:result.info});
            })
            .catch(error =>{
                console.log(error);
            });
    };
}