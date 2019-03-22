import { GET,POST } from "../fetchTool";

class forumSwiperApi {
    static getForumSwiper(cid) {
        return GET('http://api.ulapp.cc/index.php?m=home&c=forum&a=forumcarsousel',{cid})
    }
}
export default forumSwiperApi;