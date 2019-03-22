import * as types from './newsConstant';
import newsApi from '../../api/news/newsApi';
import * as commonAction from '../../actions/common/commonAction';
import Storage from '../../data/Storage';
import _ from 'lodash';

export function getNews(input){
    return function(dispatch, getState){
        return newsApi.getNews(input)
        .then(result => {
            if (result.code !==200) return dispatch({ type: types.GET_NEWS_LIST, data: {}, cid: input.cid, key: input.key });
            dispatch({type:types.GET_NEWS_LIST, data:result.info , cid:input.cid , key:input.key})
        },error=>console.log('fetch result json error'))
        .catch(error =>{

        });
    };
}

export function initCategory(){
    return function(dispatch,getState){
        Storage.get('newsCategory').then(newsCategory=>{
            let state = getState()
            let reduxNewsCategory = _.result(state,'root.news.category',[]);
            if (reduxNewsCategory.length) return;
            if (newsCategory&&Array.isArray(newsCategory)&&newsCategory.length){
                dispatch({type: types.INIT_NEWS_CATEGORY, data : newsCategory})
            }
        },error=>console.log(error))
        Storage.get('newsCategory')
        return newsApi.initCategory()
        .then(result=>{
            if (result.code !== 200) return dispatch(commonAction.showTip('网络错误'));
            Storage.save('newsCategory',result.info)
            dispatch({type:types.INIT_NEWS_CATEGORY,data:result.info})
        })
    }
}