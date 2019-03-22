import { GET,POST } from "../fetchTool";

class newsDetailApi {
    static getNewsDetail(news) {
        return GET('http://api.ulapp.cc/index.php?m=home&c=news&a=newsdetails',news)
    }
}
export default newsDetailApi;