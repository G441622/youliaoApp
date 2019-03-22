import * as types from './userConstant';
import codeApi from '../../api/user/codeApi';
import { Alert } from "react-native";

export function getCode(phone){
    return function(dispatch, getState){
        return codeApi.getCode(phone)
            .then(result => {
                dispatch({type:types.GET_CODE, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}