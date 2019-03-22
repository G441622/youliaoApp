import { GET,POST } from "../fetchTool";

class forumSearchApi {
	static getForumSearch(input) {
		return GET('http://api.ulapp.cc/index.php?m=home&c=forum&a=searchforum',input,true )
	}
}
export default forumSearchApi;