import * as types from './userConstant';
import userAboutUsApi from '../../api/user/userAboutUsApi';



export function getAboutUs(input){
    return function(dispatch, getState){
        return userAboutUsApi.getAboutUs(input)
            .then(result => {
                dispatch({type:types.USER_ABOUTUS, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}