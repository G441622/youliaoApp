import * as types from './newsConstant';
import newsSearchApi from '../../api/news/newsSearchApi';


export function getNewsSearch(input){
    return function(dispatch, getState){
        return newsSearchApi.getNewsSearch(input)
            .then(result => {
                let data = typeof result == 'object'&&result.hasOwnProperty('info')&&result.info?result.info:{PresentPage:0,data:[]}
                dispatch({type:types.GET_SEARCH_NEWS, data});
            })
            .catch(error =>{

            });
    };
}