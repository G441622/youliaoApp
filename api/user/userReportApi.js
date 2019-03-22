import {GET,POST} from "../fetchTool";

class userReportApi {
    static userReportOptions(input) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=reportoptions`,{})
    }
    static userReport(params){
        return GET('http://api.ulapp.cc/index.php?m=home&c=news&a=report',params,true)
    }
}
export default userReportApi;