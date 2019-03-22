import * as types from './messageConstant';
import messageContactUsApi from '../../api/message/messageContactUsApi';


export function getMessageContactUs(input){
    return function(dispatch, getState){
        return messageContactUsApi.getMessageContactUs(input)
            .then(result => {
                dispatch({type:types.MESSAGE_CONTACTUS, data:result});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}