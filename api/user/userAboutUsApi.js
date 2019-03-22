import {GET,POST} from "../fetchTool";

class getAboutUsApi {
    static getAboutUs() {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=aboutus`,{},false,false)
    }
}

export default getAboutUsApi;