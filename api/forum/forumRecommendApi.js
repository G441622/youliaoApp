import {GET,POST} from '../fetchTool';

class forumRecommendApi {
    static getForumRecommend(forum) {
        return GET('http://api.ulapp.cc/index.php?m=home&c=forum&a=recommend',{forum_id:forum.id})
        // return fetch(`http://api.ulapp.cc/index.php?m=home&c=forum&a=recommend&token=${token}&forum_id=${forum.id}`,
        //     {
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         },
        //         method: "GET",
        //     });
    }
}
export default forumRecommendApi;