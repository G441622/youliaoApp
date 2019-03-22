import initialState from '../initialState';
import * as types from '../../actions/forum/forumConstant';
import _ from 'lodash';

export default function forumReducer(state = initialState.root.forum, action) {
    switch (action.type) {
        case types.INIT_FORUM_CATEGORY: {
            if (Array.isArray(action.data)) return Object.assign({}, state, { category: action.data })
            return state;
        }
        case 'PUBLISH': {
            return Object.assign({}, state, { publish: !state.publish })
        }
        case types.GET_FORUM_LIST: {
            let cid = action.cid;
            let key = action.key;
            if (!state.forumList.hasOwnProperty(key)) {
                let forumList = Object.assign({}, state.forumList);
                forumList[key] = {
                    data: _.result(action, 'data.data', []),
                    presentPage: _.result(action, 'data.PresentPage', 0)
                }
                return Object.assign({}, state, { forumList })
            }

            let list = state.forumList[key];//object

            if (list.presentPage && list.presentPage >= _.result(action, 'data.PresentPage', 0)) {
                let forumList = Object.assign({}, state.forumList);
                forumList[key] = {
                    data: _.result(action, 'data.data', []),
                    presentPage: _.result(action, 'data.PresentPage', 0)
                }
                return Object.assign({}, state, { forumList });
            }
            let newForumData= []
            let newListData = _.result(action, 'data.data', []);
            let oldListData = _.result(list, 'data', []);
            if (list && list.data) {
                newForumData = [...oldListData, ...newListData];
            } else {
                newForumData = [...newListData];
            }
            let forumList = Object.assign({}, state.forumList);
            forumList[key] = {
                data: newForumData,
                presentPage: _.result(action, 'data.PresentPage', 0)
            }
            var newState = Object.assign({}, state, {
                forumList
            });
            return newState;
        }
        case types.GET_FORUM_SWIPER: {
            let key = action.key;
            let forumSwiper = Object.assign({}, state.forumSwiper)
            forumSwiper[key] = action.data
            var newState = Object.assign({}, state, { forumSwiper });
            return newState;
        }

        case types.GET_DETAIL_FORUM: {
            var newState = Object.assign({}, state, { forumDetail: action.data });
            return newState;
        }
        case types.GET_RECOMMEND_FORUM: {
            var newState = Object.assign({}, state, { forumRecommend: action.data });
            return newState;
        }
        case types.GET_SEARCH_FORUM: {

            if (state.forumsearch.presentPage && state.forumsearch.presentPage >= action.data.PresentPage) {
                return Object.assign({},state,{forumsearch:{presentPage:action.data.PresentPage,forumData:action.data.data}});;
            }

            var newForumData = [];
            if (state.forumsearch && state.forumsearch.forumData) {
                newForumData = [...state.forumsearch.forumData, ...action.data.data];
            } else {
                newForumData = [...action.data.data];
            }
            var newState = Object.assign({}, state, {
                forumsearch: {
                    forumData: newForumData,
                    presentPage: action.data.PresentPage
                }
            });
            return newState;
        }


        case types.SET_REPLY_FORUM: {
            return Object.assign({}, state, {
                forumReply: action.data
            })
        }
        // TODO: some case now is not useful ; like this;
        case types.GET_REPLY_FORUM: {
            if (state.forumReply.PresentPage && state.forumReply.PresentPage >= action.data.PresentPage) {
                return state;
            }
            var newForumReplyData = [];
            if (state.forumReply && state.forumReply.data.length) {
                newForumReplyData = [...state.forumReply.data, ...action.data.data];
            } else {
                newForumReplyData = [...action.data.data];
            }
            var newState = Object.assign({}, state, {
                forumReply: {
                    ...action.data,
                    data: newForumReplyData,
                }
            });
            return newState;
        }
        case types.SET_REPLY_USER_FORUM: {
            return Object.assign({}, state, {
                forumUserReply: action.data,
            })
        }
        case types.GET_REPLY_USER_FORUM: {
            if (state.forumUserReply.commentchild.PresentPage && state.forumUserReply.commentchild.PresentPage >= action.data.PresentPage) {
                return state
            }
            var newData = []
            if (state.forumUserReply && state.forumUserReply.commentchild.data.length) {
                newData = [...state.forumUserReply.commentchild.data, ...action.data.data]
            } else {
                newData = [...action.data.data]
            }
            var newState = Object.assign({}, state, {
                forumUserReply: {
                    ...state.forumUserReply,
                    commentchild: {
                        ...action.data,
                        PresentPage: action.data.PresentPage++,
                        data: newData,
                    },
                }
            })
            return newState;
        }
        case types.FORUM_REPLY: {
            var newData = [action.data, ...state.forumReply.data]
            var forumReply = { ...state.forumReply, data: newData }
            var newState = Object.assign({}, state, {
                forumReply
            });
            return newState;
        }
        case types.FORUM_USER_REPLY: {
            var newData = [action.data, ...state.forumUserReply.commentchild.data]
            var commentchild = { ...state.forumUserReply.commentchild, data: newData }
            var forumUserReply = { ...state.forumUserReply, commentchild }
            var newState = Object.assign({}, state, {
                forumUserReply
            })
            return newState;
        }
        case types.REPLACE_FORUM_REPLY: {
            return Object.assign({}, state, { forumReply: initialState.root.forum.forumReply })
        }
        case types.REPLACE_FORUM_REPLY_USER: {
            return Object.assign({}, state, { forumUserReply: {} })
        }
        case types.GET_COLLECTION_FORUM: {
            try {
                let is_collection = action.data.code == 200 ? 0 : (action.data.code == 201 ? 1 : state.forumDetail.is_collection)
                return Object.assign({}, state, { forumDetail: { ...state.forumDetail, is_collection: is_collection } })
            } catch (error) {
                return state;
            }
        }
        case types.GET_LIKE_FORUM: {
            return Object.assign({}, state, { forumlike: {} })
        }
        case types.UPDATE_FORUM_REPLY: {
            return Object.assign({}, state, { updateForumReply: action.data })
        }
        case types.UPDATED_FORUM_REPLY: {
            return Object.assign({}, state, { updateForumReply: undefined })
        }
        case types.ATTENTION: {
            let forumList = { ...state.forumList };
            Object.keys(state.forumList).map((key) => {
                let categoryList = state.forumList[key];
                let nextAttention = _.result(action, 'data', { next: undefined })
                let thisAttention = _.result(state, 'attention', { current: undefined })
                if (!_.eq(nextAttention, thisAttention)) {
                    var data = _.result(categoryList, 'data', [])
                    let newData = data.map((item, index) => {
                        if (_.result(item, 'user_id', undefined) == _.result(nextAttention, 'user_id', null)) {
                            // console.log(`is equal ---------------- ${index}`)
                            return Object.assign({}, item, { isfans: _.result(nextAttention, 'status', 1) });
                        }
                        return item;
                    })
                    forumList[key] = Object.assign({}, categoryList, { data: newData });
                }
            })
            let newState = Object.assign({}, state, { forumList, attention: action.data })
            return newState;
        }
        default: return state;
    }
}