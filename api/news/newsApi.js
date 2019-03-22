import {GET,POST} from '../fetchTool';

class newsApi {
	static getNews(input) {
		return GET('http://api.ulapp.cc/index.php?m=home&c=news&a=index',input)
	}
	static initCategory(){
		return GET('http://api.ulapp.cc/index.php?m=home&c=news&a=getcategory')
	}
}
export default newsApi;