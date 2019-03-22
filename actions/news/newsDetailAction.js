import * as types from './newsConstant';
import newsDetailApi from '../../api/news/newsDetailApi';


export function getNewsDetail(news){
    return function(dispatch, getState){
        return newsDetailApi.getNewsDetail(news)
            .then(result => {
                dispatch({type:types.GET_DETAIL_NEWS, data:result.info});
            })
            .catch(error =>{
               console.log(error)
            });
    };
}