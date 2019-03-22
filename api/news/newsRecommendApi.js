import { GET,POST } from "../fetchTool";

class newsRecommendApi {
    static getNewsRecommend(news) {
        return GET('http://api.ulapp.cc/index.php?m=home&c=news&a=recommend',news)
    }
}
export default newsRecommendApi;