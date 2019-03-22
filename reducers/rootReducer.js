import {combineReducers} from 'redux';
import news from './news/newsReducer';
import forum from './forum/forumReducer';
import user from './user/userReducer';
import message from './message/messageReducer';
import common from './common/commonReducer';

const rootReducer = combineReducers({
    news,
    forum,
    user,
    message,
    common
});
export default rootReducer;
