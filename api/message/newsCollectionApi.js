import {GET,POST} from "../fetchTool";

class newsCollectionApi {
    static getNewsCollection(input) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=newscollection`,input,true,false)
    }
    static getNewsCollectionForumDelect(input) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=collectionforum`,input,true,false)
    }
    static getNewsCollectionNewsDelect(input) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=collectionnews`,input,true,false)
    }
}
export default newsCollectionApi;