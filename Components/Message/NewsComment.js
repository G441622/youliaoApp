import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity,FlatList} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as newsCommentAction from '../../actions/message/newsCommentAction';
import SubHeader from '../Mould/SubHeader';
import NewsItem from '../Mould/NewsItem';
import ForumItem from '../Mould/ForumItem';
import Loading from "../Mould/Loading";
import {emoticons} from '../../utility/index';
import  _ from  'lodash';
import Images from '../../imagesRequired';


const styles = StyleSheet.create({
    content:{
        backgroundColor:'#f9f9f9',
        flex:1,

    },
    list_content:{
       /* marginTop:10,*/
    },
    list:{
        backgroundColor:'white',
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10,
        marginBottom:5
    },

    user_view: {
        flex: 1,
        flexDirection: 'row',
        /*paddingLeft:20,
        paddingRight:20*/

    },
    user_imgview:{
        flex: 2,
    },
    user_img: {
        width: 30,
        height: 30,
        borderRadius: 15,
        margin: 5
    },
    user_text: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        /*backgroundColor:'black'*/
    },
    user_name: {
        fontSize:setFontSize(15),
        color: '#585858'
    },
    user_time: {
        fontSize:setFontSize(12),
        color: '#D34D3D',
    },
    delete_view: {
        width:20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    delete_icon:{
        color:'#CCC',
        fontSize:setFontSize(15),
    },
    comment:{
        padding:5,
        paddingLeft:0,
        borderBottomWidth:1,
        borderBottomColor:"#ddd"
    },
    comment_text:{
        fontSize:setFontSize(15),
        color:'#585858',
    },
    news_list_content:{
        height:70,
        flexDirection: 'row',
        padding:5,
        borderTopWidth:1,
        borderTopColor:'#ddd'
    },
    flex_1:{
        flex:1,
    },
    flex_2:{
        flex:2,
    },
    flex_3:{
        flex:3,
    },
    news_list_title:{
       /* color:'black',*/
        marginRight:10,
    },
    news_list_tag:{
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',

    },
    list_icon_text:{
        fontSize:setFontSize(12),
        marginRight:15,
        color:'#ccc',
        marginTop:5
    },
    news_list_img_one:{
        height:65
    },
});

class NewsComment extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader title={'我的评论'} navigation={navigation} onPress={()=>{navigation.goBack()}}/>
        }
    };
    constructor(props, context){
        super(props, context);
        this.state = {
            shownews:true,
            showforum:false,
            page:1,
            showFoot:0
        };
        this.onNewsPress = this.onNewsPress.bind(this);
        this.onForumPress = this.onForumPress.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (_.result(nextProps,'newscomment.newsData.length',0) ){
            this.setState({showFoot:2})
        }else{
            this.setState({showFoot:1})
        }
    }
    onnewschangePress = ()=>{
        this.setState({
            shownews:true,
            showforum:false,
        });
        const input = {
            page:1,
            limit:15
        };
        this.props.newsCommentAction.replaceData();
        this.props.newsCommentAction.getNewsComment({limit:input.limit,page:input.page,action:'news'});
    }
    onforumchangePress = ()=>{
        this.setState({
            showforum:true,
            shownews:false
        });
        const input = {
            page:1,
            limit:15
        };
        this.props.newsCommentAction.replaceData();
        this.props.newsCommentAction.getNewsComment({limit:input.limit,page:input.page,action:'forum'});
    }
    onNewsPress(item){
        this.props.navigation.navigate('NewsDetail',{news: {...item,category:'详情'}});
    }
    onForumPress(item){
        this.props.navigation.navigate('ForumDetailScreen',{forum: {...item,category:'详情'}});
    }
    onUserReplyPress = (comment)=>{
        var pid=comment.pid
        let self_id = comment.id;
        if(pid==0){
            pid =comment.id
        }
        this.props.navigation.navigate('NewsUserReply',{comment:{...comment,self:comment,comment_id:pid,self_id}});
    }
    onUserReplyPressForum = (comment)=>{
        var pid=comment.pid
        let self_id = comment.com_id;
        if(pid==0){
            pid =comment.com_id
        }
        this.props.navigation.navigate('ForumUserReply',{comment:{...comment,self:comment,comment_id:pid,self_id}});
    }
    onUserPress=(item)=>{
        this.props.navigation.navigate('UserCenter',{userfollow:item});
    }
    onCommentDelectPress=(content,index)=>{
        this.state.shownews==true
        ?this.props.newsCommentAction.getNewsCommentDelect({id:content.id,action:'news'},index)
        :this.props.newsCommentAction.getNewsCommentDelect({id:content.com_id,action:'forum'},index)

    }
    componentDidMount() {
        const input = {
            page:1,
            limit:15,
        };
        this.props.newsCommentAction.getNewsComment({limit:input.limit,page:input.page,action:'news'});
    }
    componentWillUnmount() {
        this.props.newsCommentAction.replaceData();
    }
    _renderFooter = ()=>{
        let footer = {
            justifyContent:'center',
            alignItems:'center',
            marginTop:50
        }
        if (this.state.showFoot == 0){
            return (
                <View style={footer}>
                    <Text style={{marginTop:20}}>正在加载...</Text>
                </View>
            )
        }else if (this.state.showFoot == 1) {
            return (
                <View style={footer}>
                    <Image source={Images.nodata} style={{width:100,height:100}}/>
                    <Text style={{marginTop:20}}>这里还没有内容</Text>
                </View>
            );
        }else{
            return (
                <View style={footer}>
                    <Text></Text>
                </View>
            );
        }
    }
    _renderItem = ({item,index})=>{
        let x=item;
        let i=index;
        if(this.state.shownews==true){
            return <View style={styles.list} key={i}>
                <View style={styles.user_view}>
                    <View style={styles.user_text}>
                        <Text style={styles.user_time}>{x.news_time}</Text>
                    </View>
                    <TouchableOpacity style={styles.delete_view}onPress={()=>this.onCommentDelectPress(item,index)}>
                        <Icon name="trash-o"style={styles.delete_icon}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.comment} onPress={()=>this.onUserReplyPress(item)}>
                    <Text style={styles.comment_text}>{emoticons.parse(x.content)}</Text>
                </TouchableOpacity>
                <NewsItem data={{...x,commentcount:x.count_comment}} onContentPress={this.onNewsPress}/>
            </View>
        }else if(this.state.showforum==true){
            return <View style={styles.list} key={i}>
                <View style={styles.user_view}>
                    <View style={styles.user_text}>
                        <Text style={styles.user_time}>{x.time}</Text>
                    </View>
                    <TouchableOpacity style={styles.delete_view}onPress={()=>this.onCommentDelectPress(item,index)}>
                        <Icon name="trash-o"style={styles.delete_icon}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.comment}onPress={()=>this.onUserReplyPressForum(item)}>
                    <Text style={styles.comment_text}>{emoticons.parse(x.content)}</Text>
                </TouchableOpacity>
                <ForumItem data={{...x,commentcount:x.count_comment,isfans:x.isfan}} onContentPress={this.onForumPress}  onUserPress={()=>this.onUserPress(item)}/>
            </View>
        }
    }
    _onEndReached = ()=>{
        let data = this.props.newscomment && this.props.newscomment.newsData ? this.props.newscomment.newsData : []
        if (data.length<15*this.state.page) return;
        console.log('======== MessageNewsComment _onEndReached ========');
        let currentPage = this.state.page;
        currentPage += 1
        const input = {
            page:currentPage,
            limit:15,
        };
        this.setState({page:currentPage,showFoot:0})
        this.state.shownews==true
        ? this.props.newsCommentAction.getNewsComment({limit:input.limit,page:input.page,action:'news'})
        : this.props.newsCommentAction.getNewsComment({limit:input.limit,page:input.page,action:'forum'});

    }
    render() {
        var loading = this.state.showLoading==true ?
            <Loading />:<View></View>;
        var ending = this.state.showending==true ?
            <Text style={{textAlign:'center',marginTop:30}}>加载完成</Text>:<View></View>;
        let data = this.props.newscomment && this.props.newscomment.newsData ? this.props.newscomment.newsData : []
        return (
            <View style={styles.content}>
                <View style={{flexDirection:'row'}}>
                    <TouchableOpacity style={[{flex:1,alignItems:'center',justifyContent:'center',paddingVertical:10},{backgroundColor:this.state.shownews==true?'white':'#f9f9f9'}]} activeOpacity={0.5} onPress={this.onnewschangePress}>
                        <Text style={{fontSize:setFontSize(20),textAlign:'center'}}>
                            新闻
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={[{flex:1,alignItems:'center',justifyContent:'center',paddingVertical:10},{backgroundColor:this.state.showforum==true?'white':'#f9f9f9'}]} activeOpacity={0.5} onPress={this.onforumchangePress}>
                        <Text style={{fontSize:setFontSize(20), textAlign:'center',}}>
                            论坛
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <FlatList
                        data={data}
                        renderItem={this._renderItem}
                        initialNumToRender={15}
                        keyExtractor={(item, index) => index}
                        keyboardShouldPersistTaps='handled'
                        onEndReached={this._onEndReached}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={this._renderFooter}
                    />
                    {loading}
                    {ending}
                </View>
            </View>
        );
    }
}
function mapStateToProps(state, ownProps){
    return {
        newscomment: state.root.message.newscomment,
        user:state.root.user
    };
}
function mapDispatchToProps(dispatch){
    return {
        newsCommentAction: bindActionCreators(newsCommentAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(NewsComment);