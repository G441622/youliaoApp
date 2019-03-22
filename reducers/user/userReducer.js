import initialState from '../initialState';
import * as types from '../../actions/user/userConstant';
import  Storage from "../../data/Storage";
import _ from 'lodash';

export default function userReducer(state = initialState.root.user, action){
    switch(action.type){
        case 'tipDismiss':{
            return Object.assign({},state,{tip:null})
        }
        case 'tip':{
            return Object.assign({},state,{tip:action.data||'出现错误'})
        }
        case 'REPLACE_PHONE_CODE':{
            return Object.assign({},state,{forgetPassword:false,changePassword:false,code:null})
        }
        case types.SIGN_OUT:{
            return initialState.root.user
        }
        case types.FORGET_PASSWORD:{
            return Object.assign({},state,{forgetPassword:!state.forgetPassword,code:null})
        }
        case types.CHANGE_PASSWORD:{
            return Object.assign({},state,{changePassword:!state.changePassword,code:null})
        }
        case types.GET_TOKEN_LOGIN:{
            var loginState = Object.assign({},state,{login:action.data});
            return loginState;
        }
        case types.GET_TOKEN_REGISTER:{
            var loginState = Object.assign({},state,{register:action.data,login:action.data});
            return loginState;
        }
        case types.GET_REGISTER_AGREE:{
            var loginState = Object.assign({},state,{registeragree:action.data});
            return loginState;
        }
        case types.GET_CODE:{
            var loginState = Object.assign({},state,{code:action.data});
            return loginState;
        }
        case types.GET_USER:{
            let loginState = Object.assign({},state,{userdata:{...state.userdata,...action.data}});
            // Storage.update('user',{...loginState}).then(result=>{},error=>{})
            updateUser(loginState);
            return loginState;
        }
        case types.GET_FANS_USER:{
            let newState = Object.assign({},state,{userfans:{...action.data,newsData:action.data.data}})
            return newState;
        }
        case types.GET_FOLLOW_USER:{
            if(state.userfollow.presentPage && state.userfollow.presentPage >= action.data.PresentPage){
                return Object.assign({},state,{userfollow:{presentPage:action.data.PresentPage,newsData:action.data.data}});
            }

            var newNewsData = [];
            if(state.userfollow && state.userfollow.newsData){
                newNewsData = [...state.userfollow.newsData, ...action.data.data];
            }else{
                newNewsData = [...action.data.data];
            }
            var newState = Object.assign({}, state, {
                userfollow:{
                    newsData: newNewsData,
                    presentPage: action.data.PresentPage
                }
            });
            return newState;
        }
        case types.GET_DYNAMIC_USER:{
            if(state.userdynamic.presentPage && state.userdynamic.presentPage >= action.data.PresentPage){
                return Object.assign({},state,{userdynamic:{presentPage:action.data.PresentPage,newsData:action.data.data}});
            }

            var newNewsData = [];
            if(state.userdynamic && state.userdynamic.newsData){
                newNewsData = [...state.userdynamic.newsData, ...action.data.data];
            }else{
                newNewsData = [...action.data.data];
            }
            var newState = Object.assign({}, state, {
                userdynamic:{
                    newsData: newNewsData,
                    presentPage: action.data.PresentPage
                }
            });
            return newState;
        }
        case types.GET_DYNAMIC_DELETE:{
            let newsData = [...state.userdynamic.newsData]
            newsData.splice(action.index,1)
            newState = Object.assign({},state,{userdynamic:{...state.userdynamic,newsData}})
            return newState;
        }
        case types.IS_LOGIN:{
            let loginState = Object.assign({},state,{...action.data});
            return loginState;
        }
        case types.FONT_SIZE:{
            let newState = Object.assign({},state,{fontSize:action.data})
            // Storage.update('user',newState).then(result=>{},error=>console.log(error))
            updateUser(newState);
            return newState;
        }
        case types.USER_ABOUTUS:{
            let newState = Object.assign({},state,{userabout:action.data})
            return newState;
        }
        case types.POST_SETTING:{
            var newState = Object.assign({},state,{getsetting:action.data,postsetting:action.data,userdata:{...state.userdata,...action.data}})
            return newState;
        }
        case types.GET_SETTING:{
            var newState = Object.assign({},state,{getsetting:action.data,userdata:{...state.userdata,...action.data}})
            return newState;
        }
        case types.GET_DATA_USER:{
            var newState = Object.assign({},state,{getuserdata:action.data})
            return newState;
        }
        case types.GET_PAGEDATA_USER:{
            var newState = Object.assign({},state,{getpageuserdata:action.data})
            return newState;
        }
        case types.SET_FORUM_USER:{
            let newState = Object.assign({},state,{getuserforum:{...action.data,forumData:action.data.data}})
            return newState
        }
        case types.GET_PAGEFORUM_USER:{
            let newState = Object.assign({},state,{getpageuserforum:{...action.data,forumData:action.data.data}})
            return newState
        }
        case types.REPLACE_USER_FORUM:{
            return Object.assign({},state,{getuserforum:{},getuserdata:{}})
        }
        case types.GET_FORUM_USER:{
            if(state.getuserforum.presentPage && state.getuserforum.presentPage >= action.data.PresentPage){
                return Object.assign({},state,{getuserforum:{presentPage:action.data.PresentPage,forumData:action.data.data}});
            }

            var newNewsData = [];
            if(state.getuserforum && state.getuserforum.forumData){
                newNewsData = [...state.getuserforum.forumData, ...action.data.data];
            }else{
                newNewsData = [...action.data.data];
            }
            var newState = Object.assign({}, state, {
                getuserforum:{
                    forumData: newNewsData,
                    presentPage: action.data.PresentPage
                }
            });
            return newState;
        }
        case types.BIND_THIRD_PARTY_ACCOUNT:{
            let platform = action.data;
            let newUserdata = {...state.userdata};
            newUserdata[`third_${platform}`]=0
            newUserdata[`${platform}_name`]=action.name
            // console.log('The third platform bind : ',state.userdata,newUserdata)
            return Object.assign({},state,{userdata:newUserdata});
        }
        case types.FREE_BIND_THIRD_PARTY_ACCOUNT:{
            let platform = action.data;
            let newUserdata = {...state.userdata};
            newUserdata[`third_${platform}`]=1
            newUserdata[`${platform}_name`]=null
            // console.log('The third platform free bind : ',state.userdata,newUserdata)
            return Object.assign({},state,{userdata:newUserdata});
        }
        case types.BIND_PHONE:{
            return Object.assign({},state,{userdata:{...state.userdata,phone:0}})
        }
        case types.FREE_BIND_PHONE:{
            return Object.assign({},state,{userdata:{...state.userdata,phone:1}})
        }
        case types.ADD_NEWS_SEARCH_HISTORY:{
            let newsSearchHistory = new Array(...state.newsSearchHistory)
            let index = newsSearchHistory.indexOf(action.data)
            if (index!=-1){
                let temp = newsSearchHistory[index]
                newsSearchHistory.splice(index,1)
                newsSearchHistory.unshift(temp)
            }else{
                newsSearchHistory.unshift(action.data)
            }
            return Object.assign({},state,{newsSearchHistory})
        }
        case types.DELETE_NEWS_SEARCH_HISTORY:{
            let newsSearchHistory = new Array(...state.newsSearchHistory)
            if (action.data != null){//删除一项
                let index = newsSearchHistory.indexOf(action.data)
                if (index!=-1){
                    let temp = newsSearchHistory[index]
                    newsSearchHistory.splice(index,1)
                }
            }else{//删除所有
                newsSearchHistory = []
            }
            return Object.assign({},state,{newsSearchHistory})
        }
        case types.ADD_FORUM_SEARCH_HISTORY:{
            let forumSearchHistory = new Array(...state.forumSearchHistory)
            let index = forumSearchHistory.indexOf(action.data)
            if (index!=-1){
                let temp = forumSearchHistory[index]
                forumSearchHistory.splice(index,1)
                forumSearchHistory.unshift(temp)
            }else{
                forumSearchHistory.unshift(action.data)
            }
            return Object.assign({},state,{forumSearchHistory})
        }
        case types.DELETE_FORUM_SEARCH_HISTORY:{
            let forumSearchHistory = new Array(...state.forumSearchHistory)
            if (action.data != null){//删除一项
                let index = forumSearchHistory.indexOf(action.data)
                if (index!=-1){
                    let temp = forumSearchHistory[index]
                    forumSearchHistory.splice(index,1)
                }
            }else{//删除所有
                forumSearchHistory = []
            }
            return Object.assign({},state,{forumSearchHistory})
        }
        case types.HOT_SEARCH_KEYWORD:{
            return Object.assign({},state,{hotSearchKeywords:action.data})
        }
        case types.PLACEHOLDER_SEARCH_KEYWORD:{
            return Object.assign({},state,{placeholderSearchKeywords:action.data})
        }
        case types.CHANGE_AVATAR:{
            return Object.assign({},state,{userdata:{...state.userdata,avatar:action.data}})
        }
        case types.CHANGE_BACKGROUND:{
            return Object.assign({},state,{userdata:{...state.userdata,background_image:action.data}})
        }
        case types.SET_REPORT_OPTION:{
            return Object.assign({},state,{reportOptions:action.data})
        }
        case types.SET_DRAFTS:{
            return Object.assign({},state,{drafts:action.data})
        }
        case types.ADD_DRAFTS:{
            let drafts = [action.data,...state.drafts]
            let newState = Object.assign({},state,{drafts})
            updateUser(newState);
            return newState;
        }
        case types.CHANGE_DRAFTS:{
            let drafts = [...state.drafts];
            if (action.index) drafts.splice(action.index,1,action.data)
            else {
                let change_index = 0
                for (let index = 0; index < drafts.length; index++) {
                    const draft = drafts[index];
                    if (JSON.stringify(draft) == JSON.stringify(action.data)){
                        change_index = index;
                        break;
                    }
                }
                drafts.splice(change_index,1,action.data)
            }
            let newState = Object.assign({},state,{drafts})
            updateUser(newState);
            return newState;
        }
        case types.REMOVE_DRAFTS:{
            let drafts = [...state.drafts];
            if (action.index) drafts.splice(action.index,1);
            else {
                let remove_index = 0
                for (let index = 0; index < drafts.length; index++) {
                    const draft = drafts[index];
                    if (JSON.stringify(draft) == JSON.stringify(action.data)){
                        remove_index = index;
                        break;
                    }
                }
                drafts.splice(remove_index,1)
            }
            let newState = Object.assign({},state,{drafts})
            updateUser(newState);
            return newState;
        }
        case types.GET_CODE_SHARE:{
            return Object.assign({},state,{sharecode:action.data})
        }
        case types.EXCHANGE_CODE:{
            return Object.assign({},state,{exchangecode:action.data})
        }
        case types.SHARE_LIST:{
            return Object.assign({},state,{sharelist:action.data})
        }
        case types.CHANGE_TINT_STATUSBAR:{
            return Object.assign({},state,{tintStatusBar:!state.tintStatusBar})
        }
        default: return state;
    }
}

function updateUser(newState) {
    Storage.update('users',[newState],(users)=>{
        let loginUser = Object.assign({},newState,{lastUser:true})
        let index = _.findIndex(users,(user={})=>_.result(user,'userdata.user_id',undefined)==_.result(newState,'userdata.user_id',undefined));
        if (index==-1) return [...users,loginUser];
        users[index] = loginUser;
        return users;
    }).then(result=>{console.log('update : ',result)},error=>{})
    .catch( error=>console.log(error) )
}