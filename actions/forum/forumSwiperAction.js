import * as types from './forumConstant';
import forumSwiperApi from '../../api/forum/forumSwiperApi';


export function getForumSwiper(cid,key){
    return function(dispatch, getState){
        return forumSwiperApi.getForumSwiper(cid)
            .then(result => {
                if (result.code !== 200) return ;console.log('getForumSwiper error : ',result);
                dispatch({type:types.GET_FORUM_SWIPER,data:result.info,key,cid})
            })
            .catch(error =>{
                console.log(error)
            });
    };
}