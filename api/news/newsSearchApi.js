import { GET,POST } from "../fetchTool";

class newsSearchApi {
	static getNewsSearch(input) {
		return GET('http://api.ulapp.cc/index.php?m=home&c=news&a=searchnews',input)
	}
}
export default newsSearchApi;