import initialState from '../initialState';
import * as types from '../../actions/message/messageConstant';
import _ from 'lodash';

export default function messageReducer(state = initialState.root.message, action){
    switch(action.type){
        case types.REPLACE_NEWS:{
            return Object.assign({},state,{newscomment:{},newscollection:{},newsreply:{},})
        }
        case types.MESSAGE_NEWSREPLY:{
            if(state.newsreply.presentPage && state.newsreply.presentPage >= action.data.PresentPage){
                return Object.assign({},state,{newsreply:{newsData:action.data.data,presentPage: action.data.PresentPage,PageCount: action.data.PageCount}});
            }

            let newNewsData = [];
            if(state.newsreply && state.newsreply.newsData){
                newNewsData = [...state.newsreply.newsData, ...action.data.data];
            }else{
                newNewsData = [...action.data.data];
            }
            newNewsData = newNewsData.map((item,index)=>{
                if (_.result(item,'forumcomment_id',undefined)==null&&_.result(item,'newscommentid',undefined)==null){
                    return null;
                 }else {
                    return item;
                }
            })
            newNewsData = _.compact(newNewsData);
            let newState = Object.assign({}, state, {
                newsreply:{
                    newsData: newNewsData,
                    presentPage: action.data.PresentPage,
                    PageCount: action.data.PageCount
                }
            });
            return newState;
        }
        case types.MESSAGE_NEWSREPLY_DELETE:{
            let newsData = [...state.newsreply.newsData]
            newsData.splice(action.index,1)
            newState = Object.assign({},state,{newsreply:{...state.newsreply,newsData}})
            return newState;
        }
        case types.MESSAGE_REPLY_NUMBER:{
            let newState = Object.assign({},state,{replynumber:action.data});
            return newState;
        }
        case types.MESSAGE_REPLY_NUMBERDELETE:{
            let newState = Object.assign({},state,{replynumber:0});
            return newState;
        }
        case types.MESSAGE_NEWSCOMMENT:{
            if(state.newscomment.hasOwnProperty('presentPage')&&state.newscomment.presentPage && state.newscomment.presentPage >= action.data.PresentPage){
                return Object.assign({},state,{newscomment:{presentPage:action.data.PresentPage,newsData:action.data.data}});
            }
            let newNewsData = [];
            if(state.newscomment && state.newscomment.newsData){
                newNewsData = [...state.newscomment.newsData, ...action.data.data];
            }else{
                newNewsData = [...action.data.data];
            }
            let newState = Object.assign({}, state, {
                newscomment:{
                    newsData: newNewsData,
                    presentPage: action.data.PresentPage
                }
            });
            return newState;
        }
        case types.MESSAGE_NEWSCOMMENT_DELETE:{
            let newsData = [...state.newscomment.newsData]
            newsData.splice(action.index,1)
            newState = Object.assign({},state,{newscomment:{...state.newscomment,newsData}})
            return newState;
        }
        case types.MESSAGE_NEWSCOLLECTION:{
            if(state.newscollection.presentPage && state.newscollection.presentPage >= action.data.PresentPage){
                return Object.assign({},state,{newscollection:{newsData:action.data.data,presentPage:action.data.PresentPage}});
            }
            let newNewsData = [];
            if(state.newscollection && state.newscollection.newsData){
                newNewsData = [...state.newscollection.newsData, ...action.data.data];
            }else{
                newNewsData = [...action.data.data];
            }
            let newState = Object.assign({}, state, {
                newscollection:{
                    newsData: newNewsData,
                    presentPage: action.data.PresentPage
                }
            });
            return newState;
        }
        case types.MESSAGE_NEWSCOLLECTION_DELETE:{
            let newsData = [...state.newscollection.newsData]
            newsData.splice(action.index,1)
            newState = Object.assign({},state,{newscollection:{...state.newscollection,newsData}})
            return newState;
        }
        case types.MESSAGE_BULLETIN:{
            if(state.bulletin.presentPage && state.bulletin.presentPage >= action.data.PresentPage){
                return Object.assign({},state,{bulletinData: action.data.data,presentPage: action.data.PresentPage,PageCount: action.data.PageCount});
            }
            let newNewsData = [];
            if(state.bulletin && state.bulletin.bulletinData){
                newNewsData = [...state.bulletin.bulletinData, ...action.data.data];
            }else{
                newNewsData = [...action.data.data];
            }
            let newState = Object.assign({}, state, {
                bulletin:{
                    bulletinData: newNewsData,
                    presentPage: action.data.PresentPage,
                    PageCount: action.data.PageCount
                }
            });
            return newState;
        }
        case types.MESSAGE_NOTICE:{
            let newState = Object.assign({},state,{notice:action.data});
            return newState;
        }
        case types.MESSAGE_NOTICE_NUMBER:{
            let newState = Object.assign({},state,{noticenumber:action.data});
            return newState;
        }
        case types.MESSAGE_NOTICE_DELETE:{
            let newState = Object.assign({},state,{noticenumber:null});
            return newState;
        }
        case types.MESSAGE_CONTACTUS:{
            let newState = Object.assign({},state,{contactus:action.data});
            return newState;
        }

        case types.MESSAGE_BULLETINDETAIL:{
            let newState = Object.assign({},state,{bulletindetail:action.data});
            return newState;
        }
        default: return state;
    }
}