import {GET,POST} from "../fetchTool";

class newsCollectionApi {
    static getNewsCollection(news_id) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=collectionnews`,news_id,true,false)
    }
}
export default newsCollectionApi;