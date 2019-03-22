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
import * as newsReplyAction from '../../actions/message/newsReplyAction';
import SubHeader from '../Mould/SubHeader';
import NewsItem from '../Mould/NewsItem';
import ForumItem from '../Mould/ForumItem';
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
        padding:20,
        paddingTop:10,
        paddingBottom:10,
        marginBottom:5
    },

    user_view: {
        flex: 1,
        flexDirection: 'row'
    },
    user_imgview:{
    },
    user_img: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight:15
    },
    user_text: {
        flex:1,
        justifyContent: 'center',
    },
    user_name: {
        fontSize:setFontSize(15),
        color: '#d34d3d'
    },
    user_time: {
        fontSize:setFontSize(12),
        color: '#ccc',
    },
    delete_view: {
        position:'absolute',
        right:0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    delete_icon:{
        color:'#ccc',
        fontSize:setFontSize(15),
    },
    comment:{
        padding:5,
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

class NewsReply extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader title={'回复通知'} navigation={navigation} onPress={()=>{navigation.goBack()}}/>
        }
    };
    constructor(props, context){
        super(props, context);
        this.state = {
            page:1,
            showFoot:0
        };
        this.onNewsPress = this.onNewsPress.bind(this);
        this.onForumPress = this.onForumPress.bind(this);
        this.onReplyDelectPress = this.onReplyDelectPress.bind(this);
    }
    componentDidMount() {
        const input = {
            page:1,
            limit:15
        };
        this.props.newsReplyAction.getNewsReply({limit:input.limit,page:input.page});
        this.props.newsReplyAction.getReplyNumberDelect()
    }
    componentWillUnmount() {
        // this.props.newsReplyAction.getReplyNumberDelect()
    }
    onNewsPress(item){
        this.props.navigation.navigate('NewsDetail',{news: {...item,news_id:item.id}});
    }
    onForumPress(item){
        this.props.navigation.navigate('ForumDetailScreen',{forum: item});
    }

    onreplyusserPress=(item)=>{
        this.props.navigation.navigate('UserCenter',{userfollow:item});
    }
    onUserPress=(item)=>{
        this.props.navigation.navigate('UserCenter',{userfollow:{...item,user_id:item.forum_userid}});
    }
    onUserReplyPress = (comment)=>{
        if(comment.action=='forum'){
            var forumpid=comment.forumpid
            if(forumpid==0){
                forumpid=comment.forumcomment_id
            }
            this.props.navigation.navigate('ForumUserReply',{comment:{...comment,comment_id:forumpid}});
        }else{
            var newscompid=comment.newscompid
            if(newscompid==0){
                newscompid=comment.newscommentid
            }
            this.props.navigation.navigate('NewsUserReply',{comment:{...comment,comment_id:newscompid}});
        }

    }
    onReplyDelectPress(content,index){
        this.props.newsReplyAction.getNewsReplyDelect({notice_id:content.notice_id},index);
    }
    componentWillReceiveProps(nextProps) {
        if (_.result(nextProps,'newsreply.newsData.length',0) ){
            this.setState({showFoot:2})
        }else{
            this.setState({showFoot:1})
        }
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
                    <Text style={{marginTop:10}}>加载中...</Text>
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
        if(item.action=='forum'&&item.action!=null){
            return <View style={styles.list}>
                <View style={styles.user_view}>
                    <TouchableOpacity style={styles.user_imgview} onPress={()=>this.onreplyusserPress(item,index)}>
                        <Image source={{uri:item.avatar}} style={styles.user_img}></Image>
                    </TouchableOpacity>
                    <View style={styles.user_text}>
                        <Text style={styles.user_name}>{item.alias}</Text>
                        <Text style={styles.user_time}>{item.comment_time}</Text>
                    </View>
                    <TouchableOpacity style={styles.delete_view} onPress={()=>this.onReplyDelectPress(item,index)}>
                        <Icon name="trash-o"style={styles.delete_icon}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.comment}onPress={()=>this.onUserReplyPress(item)}>
                    <Text style={styles.comment_text}>{emoticons.parse(item.content)}</Text>
                </TouchableOpacity>
                <ForumItem data={{...item,avatar:item.forum_avatar,alias:item.forum_alias,cover_url:item.forum_image,
                    time:item.forum_time,is_like:item.forum_like,commentcount:item.comment_count,isfans:item.isfan}} onContentPress={this.onForumPress}onUserPress={()=>this.onUserPress(item)}/>
            </View>
        }else  if(item.action=='news'&&item.action!=null){
            return <View style={styles.list}>
            <View style={styles.user_view}>
                <View style={styles.user_imgview}>
                    <Image source={{uri:item.avatar}} style={styles.user_img}></Image>
                </View>
                <View style={styles.user_text}>
                    <Text style={styles.user_name}>{item.alias}</Text>
                    <Text style={styles.user_time}>{item.comment_time}</Text>
                </View>
                <TouchableOpacity style={styles.delete_view} onPress={()=>this.onReplyDelectPress(item,index)}>
                    <Icon name="trash-o"style={styles.delete_icon}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.comment}onPress={()=>this.onUserReplyPress(item)}>
                <Text style={styles.comment_text}>{emoticons.parse(item.content)}</Text>
            </TouchableOpacity>
            <NewsItem data={{...item,news_title:item.title,commentcount:item.comment_count,
                news_time:item.news_time,cover_url:item.news_image}} onContentPress={this.onNewsPress}/>
        </View>
        }
    }
    _onEndReached = ()=>{
        let data = this.props.newsreply && this.props.newsreply.newsData ? this.props.newsreply.newsData : []
        if (data.length<15*this.state.page) return;
        console.log('======== MessageNewsReply _onEndReached ========');
        const input = {
            page:this.state.page+1,
            limit:15,
        };
        this.setState({page:input.page,showFoot:0})
        if(input.page>this.props.newsreply.PageCount) return console.log('a');
        this.props.newsReplyAction.getNewsReply({limit:input.limit,page:input.page});
    }
    render() {
        let data = this.props.newsreply && this.props.newsreply.newsData ? this.props.newsreply.newsData : []
        return (<View style={styles.content}>
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
        </View>);
    }
}
function mapStateToProps(state, ownProps){
    return {
        newsreply: state.root.message.newsreply,
        newsreplydelete: state.root.message.newsreplydelete,
        user:state.root.user
    };
}
function mapDispatchToProps(dispatch){
    return {
        newsReplyAction: bindActionCreators(newsReplyAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(NewsReply);