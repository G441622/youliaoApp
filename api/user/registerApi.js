import {GET,POST} from "../fetchTool";

class registerApi {
    static getToken(input) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=register`,input,false,false)
    }
    static getAgree() {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=registrationagreemen`,{},false,false)
    }
}
export default registerApi;