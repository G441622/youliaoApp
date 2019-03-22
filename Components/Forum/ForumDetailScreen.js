import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Image, TouchableOpacity, Dimensions, Modal, FlatList, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ForumReply from "./ForumReply";
import ForumReplyItem from './ForumReplyItem';
import ForumRecommend from "./ForumRecommend";
import DetailNavigator from "./DetailNavigator";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as commonAction from '../../actions/common/commonAction';
import forumDetailApi from '../../api/forum/forumDetailApi';
import forumReplyApi from '../../api/forum/forumReplyApi';
import userApi from '../../api/user/userApi';
import forumRecommendApi from '../../api/forum/forumRecommendApi';
import {Article,ListTitle} from '../CustomComponents/CustomText';
import {emoticons} from '../../utility/index';
import WriteVoteStyle from '../Write/WriteVoteStyle';
import SubHeader from '../Mould/SubHeader';
import _ from 'lodash';
import moment from 'moment';
import Gallery from "react-native-image-gallery";
import { CustomImage } from "../CustomComponents/CustomImage";
import Video from 'react-native-video';
import VideoPlayer from '../CustomComponents/VideoPlayer';
import AudioPlayer from '../CustomComponents/AudioPlayer';
import Images from "../../imagesRequired";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    flex_2: {
        flex: 2,
    },
    flex_1: {
        flex: 1,
        justifyContent:'center',
    },
    news: {
        marginHorizontal:20,
        marginTop:10
    },
    news_title_view: {
        flex: 1,
        /*marginTop: 10*/
    },
    news_title_text: {
        color: 'black',
        fontSize:setFontSize(20),
        fontWeight: '100'
    },
    news_user_img: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15
    },
    news_user_name: {
        fontSize:setFontSize(15),
        color: '#585858'
    },
    news_user_time: {
        fontSize:setFontSize(10)
    },
    follow_view: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    follow_view_content: {
        width: 60,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        backgroundColor: '#D34D3D'
    },
    follow_view_text: {
        fontSize:setFontSize(15),
        color: 'white'
    },
    unfollow_view_content: {
        width: 60,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderWidth:1,
        borderColor:'#ddd'
    },
    unfollow_view_text: {
        fontSize:setFontSize(15),
        color: '#585858'
    },
    news_content_view: {
        width: '100%',
        marginVertical:10
    },
    news_content_text: {
        fontSize:setFontSize(15),
        marginVertical:10
    },
    news_content_img: {
        width:'100%',
        backgroundColor:'#aaa'
    },
    content:{
        /*justifyContent: 'center',*/
        /*alignItems: 'center',*/
        marginVertical:10
    },
    video:{
        width:'100%',
        height:240
    },
    comment_tag:{
        backgroundColor:'#F6F6F6',
        flexDirection: 'row',
        padding:20,
        paddingTop:5,
        paddingBottom:5,

    },
    comment_tag_text:{
        color:'#585858',
        fontSize:setFontSize(16),
    },
    modalStyle: {
        flex:1,
        backgroundColor: '#0008',
        ...Platform.select({
            ios:{
                marginTop:statusBarHeight,
            }
        })
    },
    write_textput:{
        padding:10,
        fontSize:setFontSize(15),
        height:150,
        textAlignVertical:'top'
    },
    modal_Bottom:{
        padding:5,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    cancel:{
        padding:5,
        marginRight:10,
        width:70,
    },
    publish:{
        padding:5,
        backgroundColor:'#d34d3d',
        marginRight:10,
        borderRadius:5,
        width:70,

    },
    commentcanceltext:{
        fontSize:setFontSize(15),
        color:'#6c6c6c',
    },
    commentpublishtext:{
        fontSize:setFontSize(15),
        color:'white',
        textAlign:'center'
    },
});

class ForumDetailScreen extends React.Component {
    static navigationOptions = ({navigation})=>{
        let {params={}} = navigation.state;
        let category_name = params.category;
        return {
            header:<SubHeader
                title={['论坛·',category_name?category_name:'详情']}
                onPress={()=>{navigation.goBack()}}
                onCategoryPress={()=>{navigation.navigate('论坛',{category_name})}}/>
        }
    };
    constructor(props, context){
        super(props, context);
        let forum_user_id = _.result(this.props.navigation.state,'params.forum.user_id',false)
        let user_id = _.result(this.props.userdata,'user_id',false)
        let isSelf = false;
        if (!forum_user_id||!user_id||forum_user_id==user_id) isSelf=true
        let {id=null,forum_id=null,...params} = this.props.navigation.state.params.forum
        forum_id = id||forum_id
        this.state = {
            forumDetail:undefined,
            forumReply:undefined,
            forumRecommend:undefined,
            isSelf,
            imageDetail:false,
            initialPage:0,
            showCommentInput:false,
            comment:null,
            index:undefined,
            input:{
                page:1,
                limit:15,
                childcount:10,
                forum_id:forum_id
            },
        }
    }
    componentDidMount() {
        this.getForumDetail()
        this.getForumRecommend()
        this.getForumReply()
    }
    getForumDetail = ()=>{
        let {id=null,forum_id=null,...params} = this.props.navigation.state.params.forum
        forum_id = id||forum_id
        forumDetailApi.getForumDetail({forum_id}).then(responseJson=>{
            if (responseJson.code==200){
                this.setState({forumDetail:responseJson.info})
                let forumDetail = responseJson.info;
                let {setParams} = this.props.navigation
                var category_name = forumDetail&&forumDetail.hasOwnProperty('category_name')
                ?forumDetail.category_name:''
                if (setParams) setParams({category:category_name})
            }else{
                this.props.commonAction.showTip('该帖子已经被删除')
                this.props.navigation.goBack()
            }
        },error=>{

        });
    }

    getForumReply = ()=>{
        let {id=null,forum_id=null,...params} = this.props.navigation.state.params.forum
        let input = {
            page:1,
            limit:15,
            childcount:10,
            forum_id
        };
        forum_id = id||forum_id
        forumReplyApi.getForumReply(forum_id,input).then(responseJson=>{
            if (responseJson.code==200) this.setState({forumReply:responseJson.info})
        },error=>console.log(error))
    }
    getMoreForumReply = ()=>{
        let {id=null,forum_id=null,...params} = this.props.navigation.state.params.forum
        input = {
            page:this.state.forumReply.PresentPage+1,
            limit:15,
            childcount:10,
        }
        forum_id = id||forum_id
        forumReplyApi.getForumReply(forum_id,input).then(responseJson=>{
            if (responseJson.code==200) this.setState({forumReply:{...responseJson.info,data:[...this.state.forumReply.data,...responseJson.info.data]}})
        },error=>console.log(error))
    }
    getForumRecommend = ()=>{
        let {forum={}} = this.props.navigation.state.params
        try {
            let {id=null,forum_id=null} = forum;
            forum_id = id||forum_id;
            forum.forum_id = forum_id;
            forum.id = forum_id;
        } catch (error) {
            
        }
        forumRecommendApi.getForumRecommend(forum).then(responseJson=>{
            if (responseJson.code==200) this.setState({forumRecommend:responseJson.info})
        },error=>console.log(error))
    }
    onUserReplyPress = (comment)=>{
        // let navigation = this.props.screenProps.navigation;
        comment.forum_id = this.state.input.forum_id
        this.props.navigation.navigate('ForumUserReply',{comment});
    }
    onUserPress = (user_id)=>{
        if(!user_id) return;
        this.props.navigation.navigate('UserCenter',{userfollow:{user_id}})
    }
    onForumPress = (item)=>{
        this.props.navigation.navigate('ForumDetailScreen',{forum: item});
    }
    onReportPress = ()=>{
        if (!this.state.forumDetail) return;
        this.props.navigation.navigate('UserReport',{type:'forum',data:this.state.forumDetail});
    }
    addForumReply = (newForumReply)=>{
        let { forumReply = {} } = this.state;
        let { DataTotal=0, data=[] } = forumReply;
        this.setState({forumReply:Object.assign({},forumReply,{DataTotal:Math.floor(DataTotal)+1,data:[newForumReply,...data]})})
        // this.refreshReply()
    }
    attention = ()=>{
        let user_id = this.state.forumDetail&&this.state.forumDetail.hasOwnProperty('user_id')?this.state.forumDetail.user_id:undefined;
        if (!user_id || !this.props.login) return;
        
        userApi.attention(user_id).then(responseJson=>{
            if (responseJson.code == 200 || responseJson.code == 201){
                let {isfans,...other} = this.state.forumDetail;
                let nowIsfans = isfans==0?1:0
                this.setState({forumDetail:{...other,isfans:nowIsfans}})
            }else{
                // this.props.dispatch({type:'SHOW_TIP',data:'操作失败,请重试'})
            }
        },error=>{
            console.log(error)
        })
    }
    onCommentPress = (comment,index)=>{
        this.setState({showCommentInput:true,comment,index})
    }
    onCommentCancelPress = ()=> {
        this.setState({showCommentInput:false,comment:null});
    }
    onCommentActivePress = ()=> {
        let {comment_id,user_id} = this.state.comment
        let forum_id = this.state.input.forum_id
        let content = this.refs.commentInput._lastNativeText
        if (!content||content==''||!forum_id) return;
        let params = {
            commented_userid:user_id,
            pid:comment_id,
            content,
            forum_id
        }
        forumReplyApi.forumReply(params).then(responseJson=>{
            if (responseJson.code==200) {
                // this.getforumReply()
                let { userdata } = this.props;
                let { forumReply = {} } = this.state;
                let { data=[] } = forumReply;
                let changeComment = data[this.state.index];
                let newComment = {...responseJson.info,avatar:userdata.avatar,user_name:userdata.alias,islike:1,likecount:'0',time:moment().format('YYYY-MM-DD HH:mm:ss')}                
                let commentchild = changeComment.commentchild?changeComment.commentchild:{}
                // let {}
                changeComment.commentchild = {DataTotal:Math.floor(_.result(commentchild,'DataTotal',0))+1,data:[newComment,...(_.result(commentchild,'data',[]))]}
                let newData = new Array(...data)
                newData[this.state.index] = changeComment
                
                let newForumReply = JSON.parse(JSON.stringify({...forumReply,data:newData}))
                this.setState({forumReply:newForumReply,comment:null,index:undefined})
            }
        },error=>console.log(error))
        this.setState({showCommentInput:false});
    }
    _renderHeader = ()=>{
        
        let forum = this.props.navigation.state.params.forum;
        let source = _.result(this.state,'forumDetail.alias','')
        let avatar = _.result(this.state,'forumDetail.avatar','')
        if (avatar==''|| !avatar) avatar = Images.defaultAvatar
        else avatar = {uri:avatar}
        let isfans = _.result(this.state,'forumDetail.isfans',1) 
        let vote = _.result(this.state,'forumDetail.vote',null)
        let option = _.result(this.state,'forumDetail.vote.option',false) 
        let user_id = _.result(this.state,'forumDetail.user_id',null)
        let detail = _.result(this.state,'forumDetail.detail',[])
        let DataTotal = _.result(this.state,'forumReply.DataTotal',0)
        let images = []
        let forumDetailContent = detail.length ? detail.map((x,i)=>{
            if(x.type=='text'||x.type=='b'){
                let content = x.content
                if (!content||content=='') return null;
                content = emoticons.parse(content)
                return<View key={i}><ListTitle style={styles.news_content_text}>{content}</ListTitle></View>
            }else if(x.type=='image'){
                let uri = x.content
                uri = uri.replace(/\s/g,'').replace(/\"/g,'').replace(/&amp;/g,'&');
                if (uri) uri=uri.replace(/.*(https?.*)(\.[jpg|jpeg|png|gif|bmp|webp|psd])(.*)/i,'$1$2$3')
                let source = uri && typeof uri == 'string' && uri.length ? (uri.indexOf('http')!=-1?{uri}:{uri:'http://www.ulapp.cc'+uri}):null;
                if (source==null) return null;
                let initialPage = images.length;
                images.push({source})
                return (
                    <TouchableOpacity key={i} style={styles.news_content_view} activeOpacity={1} onPress={()=>{this.setState({imageDetail:true,initialPage})}}>
                        <CustomImage resizeMode="contain" resizeMethod='resize' style={styles.news_content_img} source={source}/>
                    </TouchableOpacity>
                )
            }else if(x.type=='video'||x.type=='iframe'){
                // NOTE: 视频控制器? ios可以使用自有的控制器,RCTVideo.m/playerLayer.showsPlaybackControls
                let VideoPlayerContainer = Platform.select({
                    ios:Video,
                    android:VideoPlayer
                })
                return (
                    <VideoPlayer
                        ref={`video${i}`}
                        key={i}
                        rate={0}
                        paused={true}
                        repeat={false} 
                        playInBackground={false}
                        playWhenInactive={false}
                        source={{uri:x.content}} 
                        resizeMode={'contain'}
                        // controls={true}
                        controlTimeout={ 15000 }         // hide controls after ms of inactivity.
                        seekColor={ '#FFF' }             // fill/handle colour of the seekbar
                        videoStyle={ {} }                // Style appended to <Video> component
                        style={styles.video}             // Style appended to <View> container
                        // disabling individual controls
                        disableFullscreen={ false }      // Used to hide the Fullscreen control.
                        disableSeekbar={ false }         // Used to hide the Seekbar control.
                        disableVolume={ false }          // Used to hide the Volume control.
                        disableBack={ true }            // Used to hide the Back control.
                        disableTimer={ false }           // Used to hide the Timer control.
                    />
                )
            }else if (x.type == 'audio'){
                return (
                    <AudioPlayer source={{uri:'http://qqma.tingge123.com:823/mp3/2017-11-29/1511941480.mp3'}} />
                )
            }
        })
        :<View style={{justifyContent:'center',alignItems:'center',padding:20}}><Text>加载中...</Text></View>;
        
        return  (
            <View style={{flex:1,backgroundColor:'white'}}>
                <View style={styles.news}>
                    <View style={styles.news_title_view}>
                        <Text style={styles.news_title_text} numberOfLines={2}>{emoticons.parse(forum.title?forum.title:'')}</Text>
                    </View>
                    <View style={{flex:1,flexDirection: 'row',marginVertical:10}}>
                        <TouchableOpacity onPress={() => this.onUserPress(user_id)}>
                            <Image source={avatar} style={styles.news_user_img}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.flex_1}onPress={() => this.onUserPress(user_id)}>
                            <Text style={styles.news_user_name}>{source}</Text>
                            <Text style={styles.news_user_time}>{forum.time}</Text>
                        </TouchableOpacity>
                        {!this.state.isSelf&&<View style={styles.follow_view}>
                            <TouchableOpacity style={isfans==1?styles.follow_view_content:styles.unfollow_view_content} onPress={this.attention}>
                                <Text style={isfans==1?styles.follow_view_text:styles.unfollow_view_text} allowFontScaling={false}>{isfans==1?'关注':'已关注'}</Text>
                            </TouchableOpacity>
                        </View>}
                    </View>
                    <View style={styles.content}>
                        {forumDetailContent}
                    </View>
                    {option&&<WriteVoteStyle vote={vote} refreshDetial={this.getForumDetail}/>}
                </View>
                <TouchableOpacity style={{height:40}} onPress={this.onReportPress}>
                    <Text style={{fontSize:setFontSize(15),position:'absolute',right:30,}}><Icon name="exclamation-triangle"style={styles.triangle}/>  举报</Text>
                </TouchableOpacity>
                <ForumRecommend forum={this.props.navigation.state.params.forum} forumRecommend={this.state.forumRecommend} onForumPress={this.onForumPress}/>
                <View style={styles.comment_tag}>
                    <Text style={styles.comment_tag_text}>全部评论 </Text>
                <Text style={styles.comment_tag_text}>{DataTotal}</Text>
            </View>
            </View>
        )
    }
    _renderFooter = ()=>{
        return null;
    }
    _renderEmpty = ()=>{
        return <Text style={{padding:20}}>暂无评论</Text>
    }
    _renderItem = ({item,index})=>{
        let forum = this.props.navigation.state.params.forum;
        return (
            <View style={{paddingHorizontal:20}}>
                <ForumReplyItem comment={item} index={index} forum_id={this.state.input.forum_id} onUserPress={this.onUserPress} onUserReplyPress={this.onUserReplyPress} onCommentPress={this.onCommentPress} navigation={this.props.navigation}/>
            </View>
        )
    }
    _onEndReached = ()=>{
        let data = _.result(this.state,'forumReply',[]);
        if (!data.length||data.length<this.state.input.page*this.state.input.limit) return;
        console.log('======== ForumDetailScreen _onEndReached ========');
        this.getMoreForumReply()
    }
    _renderCommentInput = ()=>{
        return (
            <Modal
                animationType='fade'
                transparent={true}
                visible={this.state.showCommentInput}
                onShow={() => {}}
                onRequestClose={() => {}} >
                <TouchableOpacity activeOpacity={1} style={styles.modalStyle}>
                    <View style={{backgroundColor:'white',borderWidth:2,borderColor:'#7f7f7f',borderRadius:10}}>
                        <TextInput  ref='commentInput' placeholder="写下你的评论..." style={styles.write_textput} underlineColorAndroid="transparent"
                                    multiline={true}></TextInput>
                        <View style={styles.modal_Bottom}>
                            <TouchableOpacity underlayColor='transparent' onPress={this.onCommentCancelPress} style={styles.cancel}><Text style={styles.commentcanceltext}>取消</Text></TouchableOpacity>
                            <TouchableOpacity underlayColor='transparent' onPress={this.onCommentActivePress} style={styles.publish}><Text style={styles.commentpublishtext}>发表</Text></TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
    _renderGallery = ()=>{
        let images = [];
        let detail = _.result(this.state,'forumDetail.detail',[])
        detail.map((content)=>{
            if (_.result(content,'type','')!='image') return;
            let uri = content.content
            uri = uri.replace(/\s/g,'').replace(/\"/g,'').replace(/&amp;/g,'&');
            if (uri) uri=uri.replace(/.*(https?.*)(\.[jpg|jpeg|png|gif|bmp|webp|psd])(.*)/i,'$1$2$3')
            let source = uri && typeof uri == 'string' && uri.length ? (uri.indexOf('http')!=-1?{uri}:{uri:'http://www.ulapp.cc'+uri}):null;
            if (source==null) return null;
            let initialPage = images.length;
            images.push({source})
        });
        images = [images[this.state.initialPage]]
        return (
            <Modal
                visible={this.state.imageDetail&&images.length>0}
                animationType='fade'
                onShow={()=>{}}//console.log('Gallery : ',images[0])
                onRequestClose={()=>{}}//console.log('Gallery : ',images[0])
            >
                <View style={{flex:1}}>
                    <Gallery
                        style={{ flex: 1, width:screenWidth,height:screenHeight,backgroundColor: 'black' }}
                        images={images}
                        initialPage={this.state.initialPage>=images.length?0:this.state.initialPage}
                        onSingleTapConfirmed={()=>this.setState({imageDetail:false})}
                        // onLongPress={()=>console.log('long press , maybe should download the image?')}
                        errorComponent={this.renderError}
                    />
                    <TouchableOpacity style={{position:'absolute',bottom:8,left:20,right:20,borderRadius:8,height:44,paddingVertical:8,justifyContent:'center',alignItems:'center'}} onPress={()=>this.setState({imageDetail:false})}>
                        <Text style={{color:'#aaa',backgroundColor:'transparent'}}> 关闭 </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }
    render() {
        let forum = this.props.navigation.state.params.forum;
        let images = [];
        let source = _.result(this.state,'forumDetail.alias','')
        let isfans = _.result(this.state,'forumDetail.isfans',1) 
        let vote = _.result(this.state,'forumDetail.vote',null)
        let option = _.result(this.state,'forumDetail.vote.option',false) 
        let user_id = _.result(this.state,'forumDetail.user_id',null)
        let data = _.result(this.state,'forumReply.data',[])

        return (
            <View style={{flex:1,backgroundColor:'white'}}>
                <FlatList
                    data={data}
                    extraData={this.state}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._renderHeader()}
                    ListFooterComponent={this._renderFooter()}
                    ListEmptyComponent ={this._renderEmpty()}
                    keyExtractor={(item, index) => index}
                    keyboardShouldPersistTaps='handled'
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={0.1}
                />
                {this.state.forumDetail&&this.state.forumReply!=undefined&&<DetailNavigator  forumDetail={this.state.forumDetail} forumReply={this.state.forumReply} addForumReply={this.addForumReply}/>}
                {this._renderCommentInput()}
                {this._renderGallery()}
            </View>
        )
    }
    renderError =()=> {
        return (
            <TouchableOpacity style={{ flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }} onPress={()=>this.setState({imageDetail:false})}>
                 <Text style={{ color: 'white', fontSize:setFontSize(15), fontStyle: 'italic' }}>图片加载失败</Text>
                 <Text style={{ color: 'white', fontSize:setFontSize(15), fontStyle: 'italic' }}>点击返回</Text>
            </TouchableOpacity>
        );
    }
}
function mapStateToProps(state, ownProps){
    return {
        login:state.root.user.login,
        userdata:state.root.user.userdata
    };
}
function mapDispatchToProps(dispatch){
    return {
        commonAction: bindActionCreators(commonAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ForumDetailScreen);