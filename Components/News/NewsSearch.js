import React from 'react';
import { StyleSheet, Text, View, Platform,TextInput,ScrollView ,Image,TouchableOpacity , FlatList, Keyboard ,ActivityIndicator, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as newsSearchAction  from '../../actions/news/newsSearchAction';
import * as forumSearchAction  from '../../actions/forum/forumSearchAction';
import * as userAction from '../../actions/user/userAction';
import NewsItem from '../Mould/NewsItem';
import ForumItem from '../Mould/ForumItem';
import { hotSearchKeyword } from '../../actions/user/userAction';
import SubHeader from '../Mould/SubHeader';
const styles = StyleSheet.create({
    content:{
        flex:1,
        backgroundColor:'#f9f9f9'
    },
    input_view:{
        borderWidth:1,
        borderColor:'#ddd',
        borderRadius:20,
        margin:10,
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center'
    },
    input_text:{
        padding:0,
        paddingLeft:10,
        flex:1,
        ...Platform.select({
            ios:{
                marginVertical:12
            }
        })
    },
    history_listview:{

    },
    history_view:{
        backgroundColor:'white',
        flexDirection: 'row',
        marginTop:2,
        padding:10,
        paddingLeft:20,
        alignItems:'center',
        justifyContent:'space-between'
    },
    clock_icon:{
        fontSize:setFontSize(18),
        color:'#ddd'
    },
    history_text:{
        marginLeft:10,
    },
    delete_icon:{
        fontSize:setFontSize(15),
        color:'#ddd'
    },
    hot_view:{

    },
    hot_title:{
        fontSize:setFontSize(18),
        marginLeft:10,
    },
    hot_listview:{
        // borderTopWidth:1,
        // borderTopColor:'#ddd',
        // borderBottomWidth:1,
        // borderBottomColor:'#ddd',
        flexDirection: 'row',
        backgroundColor:'white'
    },
    left_list:{
        flex:1,
        borderRightWidth:1,
        borderRightColor:'#ddd',
        alignItems:'center',
        flexDirection: 'row',
    },
    right_list:{
        flex:1,
        flexDirection: 'row',
        alignItems:'center',
    },
    list_lefttext:{
        marginLeft:10,
        padding:10,
    },
    list_righttext:{
        marginLeft:10,
        padding:10,
    },
    hot_list_item:{
        flex:1,
        padding:10,
        borderColor:'#ddd',
        borderWidth:StyleSheet.hairlineWidth,
    },
    hot_text:{
        width:'100%',
        textAlign:'center',
        color:'#d34d3d'
    }

});


class NewSearch extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
                title={'搜索'}
                onPress={()=>{navigation.goBack()}}/>
        }
    };

    constructor(props, context){
        super(props, context);
        let defaultInput = this.props.placeholderSearchKeywords.length!=0?this.props.placeholderSearchKeywords[0]:''
        this.state = {
            show:false,
            input:{
                keyword:null,
                page:1,
                limit:20
            },
            focus:false,
            showFoot:0,
            data:[],
            defaultInput,
        };
        this.onchangePress = this.onchangePress.bind(this)
        this.onSearchPress = this.onSearchPress.bind(this);
        this.onKeywordChangeText = this.onKeywordChangeText.bind(this);
        this.onNewsPress = this.onNewsPress.bind(this);
        this.onForumPress = this.onForumPress.bind(this);
    }
    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',this._keyboardDidShow)
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',this._keyboardDidHide)
        // 获取热门关键词
        if(this.props.hotSearchKeywords.length==0) this.props.userAction.hotSearchKeyword();
        if(this.props.placeholderSearchKeywords.length==0) this.props.userAction.placeholderSearchKeyword();
    }
    componentWillUnmount() {
        Keyboard.removeSubscription(this.keyboardDidShowListener)
        Keyboard.removeSubscription(this.keyboardDidHideListener)
    }
    componentWillReceiveProps(nextProps) {
        let data = this.state.show
        ?(nextProps.forumsearch.hasOwnProperty('forumData') ? nextProps.forumsearch.forumData: [])
        :(nextProps.newssearch.hasOwnProperty('newsData') ? nextProps.newssearch.newsData : []);
        if (data && data.length && data.length%this.state.input.limit!=0){
            this.setState({showFoot:1,data})
        }else if(!data||data.length==0){
            this.setState({showFoot:1,data})
        }else if(!data||data.length==0){
            this.setState({showFoot:3,data})
        }else{
            this.setState({showFoot:0,data})
        }
        if (this.state.defaultInput==''&&nextProps.placeholderSearchKeywords.length!=0){
            let defaultInput = nextProps.placeholderSearchKeywords[0]
            this.setState({defaultInput})
        }
    }
    _keyboardDidShow = ()=>{
        this.setState({focus:true})
    }
    _keyboardDidHide = ()=>{
        this.setState({focus:false})
    }
    onchangePress(){
        let show = !this.state.show;
        let data = show
        ?(this.props.forumsearch.hasOwnProperty('forumData') ? this.props.forumsearch.forumData: [])
        :(this.props.newssearch.hasOwnProperty('newsData') ? this.props.newssearch.newsData : []);
        console.log(data)
        this.setState({show,data,showFoot:0});
    }
    onKeywordChangeText(text){
        var state = Object.assign({},this.state,{
            input:{
                keyword: text,
                page:1,
                limit:20
            }
        });
        this.setState(state);
    }
    onSearchPress(keyword=undefined){
        let input = {...this.state.input};
        if (keyword && typeof keyword === 'string') {
            input.keyword = keyword;
            this.setState({input})
        }
        // 边际条件判断
        if (!input.keyword||input.keyword==''){
            if (this.state.defaultInput=='') return;
            input.keyword = this.state.defaultInput;
        };
        if(this.state.show==false){
            this.props.newsSearchAction.getNewsSearch(input);
            this.props.userAction.addNewsSearchHistory(input.keyword)
        }else{
            this.props.forumSearchAction.getForumSearch(input);
            this.props.userAction.addForumSearchHistory(input.keyword)
        }
        Keyboard.dismiss()
    }
    _deleteHistory = (item)=>{
        if (this.state.show==false) this.props.userAction.deleteNewsSearchHistory(item);
        else this.props.userAction.deleteForumSearchHistory(item)
    }
    onNewsPress(item){
        this.props.navigation.navigate('NewsDetail',{news: item});
    }
    onForumPress(item){
        this.props.navigation.navigate('ForumDetailScreen',{forum: item});
    }
    _renderResults = ()=>{
        let newsResults = this.props.newssearch;
        let forumResults= this.props.forumsearch;
        let newsData = newsResults&&newsResults.hasOwnProperty('newsData')&&newsResults.newsData?newsResults.newsData:[]
        let forumData= forumResults&&forumResults.hasOwnProperty('forumData')&&forumResults.forumData?forumResults.forumData:[]
        let _keyExtractor = (item, index) => index;
        return (
            <FlatList 
                style={{paddingHorizontal:20,backgroundColor:'white',flex:1}}
                data={this.state.data} 
                initialNumToRender={10}
                renderItem={this._renderResultItem} 
                keyExtractor={_keyExtractor}
                keyboardShouldPersistTaps='handled'
                onEndReached={this._onEndReached}
                onEndReachedThreshold={0.1}
                ListFooterComponent={this._renderFooter}
                ItemSeparatorComponent={()=><View style={{height:1,backgroundColor:'#ddd'}}/>}//分割线
            />
        )
    }
    _renderFooter = ()=>{
        let footer = {
            flexDirection:'row',
            height:50,
            justifyContent:'center',
            alignItems:'center',
            marginBottom:10
        }
        if (this.state.showFoot === 1) {
            return (
                <View style={{height:30,alignItems:'center',justifyContent:'flex-start',}}>
                    <Text style={{color:'#999999',fontSize:setFontSize(14),marginTop:5,marginBottom:5,}}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if(this.state.showFoot === 2) {
            return (
                <View style={footer}>
                    <ActivityIndicator />
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        }else if(this.state.showFoot === 3) {
            return (
                <View style={footer}>
                    <Text style={{marginTop:40}}>搜索无结果</Text>
                </View>
            );
        } else if(this.state.showFoot === 0){
            return (
                <View style={footer}>
                    <Text></Text>
                </View>
            );
        }
    }
    _onEndReached = ()=>{
        let data = this.state.data;
        if(this.state.showFoot != 0 ) return;
        if (!data||!data.length) return;
        if (data && data.length && data.length%this.state.input.limit!=0) return ;
        console.log('======== NewsSearch _onEndReached ========');
        let input = this.state.input;
        input.page++
        this.setState({input,showFoot:2})
        this.state.show?this.props.forumSearchAction.getForumSearch(input):this.props.newsSearchAction.getNewsSearch(input)
    }
    onUserPress = (item)=>{
        this.props.navigation.navigate('UserCenter',{userfollow:item})
    }
    _renderResultItem = ({item})=>{
        if (this.state.show==false){//newsData
            if (!item.hasOwnProperty('news_id')||!item.news_id) return null;
            return <NewsItem data={{...item,cover_url:item.imglist}}  onContentPress={this.onNewsPress}/>
        }else{//forumData
            if (!item.hasOwnProperty('id')||!item.id) return null;
            return <ForumItem data={{...item,cover_url:item.imglist}} onUserPress={()=>this.onUserPress(item)} onContentPress={this.onForumPress}/>
        }
    }
    _renderHistory = ()=>{
        let history = this.state.show?this.props.forumSearchHistory:this.props.newsSearchHistory;
        let _keyExtractor = (item, index) => index;
        // NOTE: 做成绝对布局,或许更好?
        return (
            <FlatList 
                style={styles.history_listview} 
                data={history} 
                renderItem={this._renderHistoryItem} 
                keyExtractor={_keyExtractor}
                keyboardShouldPersistTaps='handled'
            />
        )
    }
    _renderHistoryItem = ({item})=>{
        return (
            <View style={styles.history_view}>
                <TouchableOpacity style={{flex:1,flexDirection:'row'}} activeOpacity={0.9} onPress={()=>this.onSearchPress(item)}>
                    <Icon name="clock-o" style={styles.clock_icon}/>
                    <Text style={styles.history_text}>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',paddingHorizontal:10}} activeOpacity={0.9} onPress={()=>this._deleteHistory(item)}>
                    <Icon name="close" style={styles.delete_icon}/>
                </TouchableOpacity>
            </View>
        )
    }
    _renderHotSearch = ()=>{
        let hotSearchKeywords = this.props.hotSearchKeywords;
        return (
            <View style={styles.hot_view}>
                <FlatList 
                    ListHeaderComponent={<Text style={styles.hot_title}>热门搜索</Text>}
                    data={hotSearchKeywords} 
                    renderItem={this._renderHotSearchItem} 
                    keyboardShouldPersistTaps='handled'
                    numColumns={2}
                    columnWrapperStyle={styles.hot_listview}
                />
            </View>
        )
    }
    _renderHotSearchItem = ({item})=>{
        return (
            <TouchableOpacity style={styles.hot_list_item} onPress={()=>this.onSearchPress(item)}>
                <Text style={styles.hot_text} numberOfLines={1}>{item}</Text>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <View style={styles.content} keyboardShouldPersistTaps='none'>
                <View style={styles.input_view}>
                    <TextInput  placeholder="请输入关键词..."
                                ref='searchInput'
                                style={styles.input_text}
                                defaultValue={this.state.defaultInput}
                                underlineColorAndroid="transparent"
                                onFocus={()=>this.setState({focus:true})}
                                onBlur={()=>this.setState({focus:false})}
                                value={this.state.input.keyword}
                                onChangeText={this.onKeywordChangeText}
                                onSubmitEditing={this.onSearchPress}
                                selectTextOnFocus
                                autoCapitalize='none'
                                autoCorrect={false}
                    />
                    {this.state.focus && <TouchableOpacity onPress={Keyboard.dismiss}><Text style={{marginRight:10}}>取消</Text></TouchableOpacity>}
                    <TouchableOpacity onPress={this.onchangePress}>
                    <Text style={{width:50,marginRight:10,color:'#585858',textAlign:'center',borderLeftWidth:1,borderRightWidth:1,borderColor:'#ddd'}}>{this.state.show==false?'新闻':'论坛'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onSearchPress}><Icon name="search" size={20} style={{color:'#ccc',width:30}}/></TouchableOpacity>
                </View>
                {this.state.focus&&this._renderHotSearch()}
                {this.state.focus&&this._renderHistory()}
                {!this.state.focus&&this._renderResults()}
            </View>
        );
    }
}
function mapStateToProps(state, ownProps){
    return {
        newssearch: state.root.news.newssearch,
        forumsearch: state.root.forum.forumsearch,
        newsSearchHistory:state.root.user.newsSearchHistory,
        forumSearchHistory:state.root.user.forumSearchHistory,
        hotSearchKeywords:state.root.user.hotSearchKeywords,
        placeholderSearchKeywords:state.root.user.placeholderSearchKeywords
    };
}
function mapDispatchToProps(dispatch){
    return {
        newsSearchAction: bindActionCreators(newsSearchAction, dispatch),
        forumSearchAction: bindActionCreators(forumSearchAction, dispatch),
        userAction: bindActionCreators(userAction,dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(NewSearch);