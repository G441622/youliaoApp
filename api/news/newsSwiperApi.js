import { GET,POST } from "../fetchTool";

class newsSwiperApi {
    static getNewsSwiper(cid) {
        return GET('http://api.ulapp.cc/index.php?m=home&c=news&a=newscarsousel',{cid})
    }
}
export default newsSwiperApi;