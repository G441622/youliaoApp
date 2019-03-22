import * as types from './newsConstant';
import newsRecommendApi from '../../api/news/newsRecommendApi';


export function getNewsRecommend(news){
    return function(dispatch, getState){
        return newsRecommendApi.getNewsRecommend(news)
            .then(result => {
                dispatch({type:types.GET_RECOMMEND_NEWS, data:result});
            })
            .catch(error =>{

            });
    };
}