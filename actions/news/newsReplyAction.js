import * as types from './newsConstant';
import newsReplyApi from '../../api/news/newsReplyApi';

export function setNewsReply(newsId,input){
    return function(dispatch, getState){
        return newsReplyApi.getNewsReply(newsId,input)
            .then(result => {
                if (result.code == 200 && result.hasOwnProperty('info') && typeof(result.info) == 'object'){
                    dispatch({type:types.SET_REPLY_NEWS, data:result.info});
                }
            })
            .catch(error =>{
                console.log('catch : ',error)
            });
    };
}
/**
 * 
 * @param {pid:'评论pid',page:'页数',limit:'数量'} params 
 */
export function setNewsUserReply(params){
    return function(dispatch, getState){
        return newsReplyApi.getNewsUserReply(params)
            .then(result => {
                if (result.code == 200 && result.hasOwnProperty('info') && typeof(result.info) == 'object'){
                    dispatch({type:types.SET_REPLY_USER_NEWS, data:result.info});
                }
            })
            .catch(error =>{
                console.error(error)
            });
    };
}

export function getNewsReply(newsId,input){
    return function(dispatch, getState){
        return newsReplyApi.getNewsReply(newsId,input)
            .then(result => {
                if (result.code == 200 && result.hasOwnProperty('info') && typeof(result.info) == 'object'){
                    dispatch({type:types.GET_REPLY_NEWS, data:result.info});
                }
            })
            .catch(error =>{
                console.log('catch : ',error)
            });
    };
}
/**
 * 
 * @param {pid:'评论pid',page:'页数',limit:'数量'} params 
 */
export function getNewsUserReply(params){
    return function(dispatch, getState){
        if (params.page==0) return dispatch({type:types.SET_REPLY_USER_NEWS, data:params.data})
        return newsReplyApi.getNewsUserReply(params)
            .then(result => {
                if (result.code == 200 && result.hasOwnProperty('info') && typeof(result.info) == 'object'){
                    dispatch({type:types.GET_REPLY_USER_NEWS, data:result.info});
                }
            })
            .catch(error =>{
                console.error(error)
            });
    };
}

/**
 * 
 * @param {news_id(新闻ID)  commented_userid(被评论者id 如果是一级评论则是0) pid(如果是一级评论则是0 二级评论带上上一级评论id) content(评论内容)} params 
 */
export function newsReply(params={news_id:'',commented_userid:0,pid:0,content:''}){
    return function(dispatch, getState){
        return newsReplyApi.newsReply(params)
            .then(result=>{
                if (result.code==200){
                    let state = getState()
                    let data = {...result.info,time:'刚刚',user_name:result.info.alias,user_avatar:state.root.user.userdata.user_avatar}                    
                    if (params.commented_userid){
                        if (state.root.news.newsUserReply.commentchild.data.length){
                            dispatch(setNewsUserReply({
                                pid: state.news.newsUserReply.comment_id,
                                page:1,
                                limit:10
                            }))
                            dispatch({type:types.NEWS_USER_REPLY,data})
                        }else{
                            dispatch(setNewsReply(state.root.news.newsDetail.news_info.news_id,{
                                page:1,
                                limit:15,
                                childcount:10,
                            }))
                        }
                    }else{
                        dispatch(setNewsReply(state.root.news.newsDetail.news_info.news_id,{
                            page:1,
                            limit:15,
                            childcount:10,
                        }))
                        dispatch({type:types.NEWS_REPLY,data})
                    }
                }
            })
    }
}
export function replaceReply(){
    return function(dispatch, getState){
        dispatch({type:types.REPLACE_NEWS_REPLY})
    }
}
export function replaceUserReply(){
    return function(dispatch, getState){
        dispatch({type:types.REPLACE_NEWS_REPLY_USER})
    }
}

export function updateNewsReply(news_id) {
    return function(dispatch, getState) {
        dispatch({type:types.UPDATE_NEWS_REPLY,data:news_id})
    }
}
export function updatedNewsReply(news_id) {
    return function(dispatch, getState) {
        dispatch({type:types.UPDATED_NEWS_REPLY,data:news_id})
    }
}