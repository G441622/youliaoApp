import * as types from './userConstant';
import registerApi from '../../api/user/registerApi';
import * as commonAction  from '../common/commonAction';

export function getToken(account,pwd){
    return function(dispatch, getState){
        return registerApi.getToken(account,pwd)
            .then(result => {
                if(result.code==306){
                    return dispatch(commonAction.showTip('该手机号已注册'))
                }
                dispatch({type:types.GET_TOKEN_REGISTER, data:result.info});
            })
            .catch(error =>{

            });
    };
}
export function getAgree(){
    return function(dispatch, getState){
        return registerApi.getAgree()
            .then(result => {
                dispatch({type:types.GET_REGISTER_AGREE, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}