import {GET,POST} from "../fetchTool";

class messageContactUsApi {
    static getMessageContactUs(input) {
        return POST(`http://api.ulapp.cc/index.php?m=home&c=news&a=contactus`,input,true,false)
    }
}
export default messageContactUsApi;