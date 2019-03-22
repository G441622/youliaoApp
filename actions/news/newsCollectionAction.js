import * as types from './newsConstant';
import newsCollectionApi from '../../api/news/newsCollectionApi';


export function getNewsCollection(news_id){
    return function(dispatch, getState){
        return newsCollectionApi.getNewsCollection(news_id)
            .then(result => {
                dispatch({type:types.GET_COLLECTION_NEWS, data:result});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}