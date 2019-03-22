import * as types from './newsConstant';
import newsSwiperApi from '../../api/news/newsSwiperApi';


export function getNewsSwiper(cid,key){
    return function(dispatch, getState){
        return newsSwiperApi.getNewsSwiper(cid)
            .then(result => {
                if (result.code !== 200) return console.log('getNewsSwiper error : ',result);
                dispatch({type:types.GET_NEWS_SWIPER,data:result.info,key,cid})
            })
            .catch(error =>{

            });
    };
}