import * as types from './userConstant';
import userReportApi from '../../api/user/userReportApi';


export function userReportOptions(){
    return function(dispatch, getState){
        return userReportApi.userReportOptions()
            .then(result => {
                dispatch({type:types.SET_REPORT_OPTION, data:result.info});
            })
            .catch(error =>{
                console.log(error);
            });
    };
}

export function userReport(params) {
    return function(dispatch, getState) {
        return userReportApi.userReport(params)
        .then(result=>{
            
        },error=>console.log(error))
    }
}