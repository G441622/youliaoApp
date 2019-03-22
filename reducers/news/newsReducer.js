import initialState from '../initialState';
import * as types from '../../actions/news/newsConstant';
import _ from 'lodash';

export default function newsReducer(state = initialState.root.news, action){
    switch(action.type){
        case types.INIT_NEWS_CATEGORY:{
            if (Array.isArray(action.data)) return Object.assign({},state,{category:action.data})
            return state;
        }
        case types.GET_NEWS_LIST:{
            let cid = action.cid;
            let key = action.key;
            if (!state.newsList.hasOwnProperty(key)){
                let newsList = Object.assign({},state.newsList);
                newsList[key] = {
                    data: _.result(action,'data.data',[]),
                    presentPage: _.result(action,'data.PresentPage',0)  
                } 
                return Object.assign({},state,{newsList})
            }

            let list = state.newsList[key];//object

            if(list.presentPage && list.presentPage >= _.result(action,'data.PresentPage',0) ){
                let newsList = Object.assign({},state.newsList);
                newsList[key] = {
                    data: _.result(action,'data.data',[]),
                    presentPage: _.result(action,'data.PresentPage',0)  
                } 
                return Object.assign({},state,{newsList})
            }
            let newNewsData = [];
            let newListData = _.result(action, 'data.data', []);
            let oldListData = _.result(list, 'data', []);
            if (list && list.data) {
                newNewsData = [...oldListData, ...newListData];
            } else {
                newNewsData = [...newListData];
            }
            let newsList = Object.assign({},state.newsList);
            newsList[key] = {
                data: newNewsData,
                presentPage: action.data.PresentPage  
            } 
            var newState = Object.assign({}, state, {
                newsList
            });
            return newState;
        }
        case types.GET_NEWS_SWIPER:{
            let key = action.key;
            let newsSwiper = Object.assign({},state.newsSwiper)
            newsSwiper[key] = action.data
            var newState = Object.assign({},state,{newsSwiper});
            return newState;
        }

        case types.GET_DETAIL_NEWS:{
            var newState = Object.assign({},state,{newsDetail:action.data});
            return newState;
        }
        case types.GET_RECOMMEND_NEWS:{
            var newState = Object.assign({},state,{newsRecommend:action.data});
            return newState;
        }
        case types.GET_SEARCH_NEWS:{
            if(state.newssearch.hasOwnProperty('presentPage')&&state.newssearch.presentPage && state.newssearch.presentPage >= action.data.PresentPage){
                return Object.assign({},state,{newssearch:{presentPage:action.data.PresentPage,newsData:action.data.data}});
            }
            var newNewsData = [];
            if(state.newssearch && state.newssearch.newsData){
                newNewsData = [...state.newssearch.newsData, ...action.data.data];
            }else{
                newNewsData = [...action.data.data];
            }
            var newState = Object.assign({}, state, {
                newssearch:{
                    newsData: newNewsData,
                    presentPage: action.data.PresentPage
                }
            });
            return newState;
        }
        case types.SET_REPLY_NEWS:{
            return Object.assign({},state,{
                newsReply:action.data
            })
        }
        case types.GET_REPLY_NEWS:{
            if(state.newsReply.PresentPage && state.newsReply.PresentPage >= action.data.PresentPage){
                return Object.assign({},state,{newsReply:{...action.data}});
            }
            var newNewsReplyData = [];
            if(state.newsReply && state.newsReply.data.length){
                newNewsReplyData = [...state.newsReply.data, ...action.data.data];
            }else{
                newNewsReplyData = [...action.data.data];
            }
            var newState = Object.assign({}, state, {
                newsReply:{
                    ...action.data,
                    data: newNewsReplyData,
                }
            });
            return newState;
        }
        case types.SET_REPLY_USER_NEWS:{
            return Object.assign({},state,{
                newsUserReply:action.data,
            })
        }
        case types.GET_REPLY_USER_NEWS:{
            if (state.newsUserReply.commentchild.PresentPage && state.newsUserReply.commentchild.PresentPage>=action.data.PresentPage){
                return state
            }
            var newData = []
            if (state.newsUserReply && state.newsUserReply.commentchild.data.length){
                newData = [...state.newsUserReply.commentchild.data,...action.data.data]
            }else{
                newData = [...action.data.data]
            }
            var newState = Object.assign({},state,{
                newsUserReply:{
                    ...state.newsUserReply,
                    commentchild:{
                        ...action.data,
                        PresentPage:action.data.PresentPage++,
                        data:newData,
                    },
                }
            })
            return newState;
        }
        case types.NEWS_REPLY:{
            var newData = [action.data,...state.newsReply.data]
            var newsReply = {...state.newsReply,data: newData}
            var newState = Object.assign({}, state, {
                newsReply
            });
            return newState;
        }
        case types.NEWS_USER_REPLY:{
            var newData = [action.data,...state.newsUserReply.commentchild.data]
            var commentchild = {...state.newsUserReply.commentchild,data:newData}
            var newsUserReply = {...state.newsUserReply,commentchild}
            var newState = Object.assign({},state,{
                newsUserReply
            })
            return newState;
        }
        case types.REPLACE_NEWS_REPLY:{
            return Object.assign({},state,{newsReply:initialState.root.news.newsReply})
        }
        case types.REPLACE_NEWS_REPLY_USER:{
            return Object.assign({},state,{newsUserReply:{}})
        }
        case types.UPDATE_NEWS_REPLY:{
            return Object.assign({},state,{updateNewsReply:action.data})
        }
        case types.UPDATED_NEWS_REPLY:{
            return Object.assign({},state,{updateNewsReply:undefined})
        }
        default:  return state;
    }
}