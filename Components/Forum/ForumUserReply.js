import React from 'react';
import { StyleSheet, Text, View, FlatList,TextInput,ScrollView ,Image,TouchableOpacity,Modal,Platform} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import forumUserReplyApi from '../../api/forum/forumReplyApi';
import * as forumReplyAction from '../../actions/forum/forumReplyAction';
import * as commonAction from '../../actions/common/commonAction';
import newsReplyApi from '../../api/news/newsReplyApi';
import SubHeader from '../Mould/SubHeader';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {emoticons} from '../../utility/index';
import _ from 'lodash';
import Images from '../../imagesRequired';

const styles = StyleSheet.create({
    user_replycontent:{
        flexDirection: 'row',
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:20,
        paddingRight:20,
        /*borderBottomWidth:1,
        borderBottomColor:'#ddd'*/
    },
    left:{
        marginRight:10
    },
    left_img:{
        width:40,
        height:40,
        borderRadius:20,
    },
    right:{
        flex:1,
    },
    right_top:{
        flexDirection: 'row',
    },
    top_text:{
        flex:1,
    },
    text_top:{

    },
    user_name:{
        color:'#d34d3d',
        fontSize:setFontSize(16)
    },
    text_time:{
        /*flexDirection: 'row',*/
    },
    text_timetext:{
        color:'#ddd',
    },
    usertext_name:{
        color:'#585858',
        fontSize:setFontSize(16)
    },
    top_icon:{
        flexDirection: 'row',
        width:100,
        alignItems:'center',
        justifyContent:'flex-end',
    },
    top_icontext:{
        width:40,
        color:'#ccc',
        textAlign:'right'
    },
    right_content:{
        marginTop:5,
    },
    right_contenttext:{
        color:'#585858',
        fontSize:setFontSize(14),
        paddingBottom:10,
    },
    user_right:{
        flex:1,
    },
    user_allreply:{
        flexDirection: 'row',
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#f9f9f9',
        paddingLeft:20,
        paddingRight:20,
    },
    user_top_text:{
        flex:1
    },
    user_top_icon:{
        flex:1,
        marginRight:20,
        flexDirection: 'row',
    },
    user_top_icontext:{
        color:'#ddd',
        marginRight:10,
        fontSize:setFontSize(12)
    },
    reply_username:{
        color:'#D34D3D',
        fontSize:setFontSize(14)
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


class ForumUserReply extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
                title={'回复'}
                onPress={()=>{navigation.goBack()}}/>
        }
    };
    constructor(props){
        super(props)
        let {comment} = this.props.navigation.state.params
        this.state = {
            show:false,
            showLoading:false,
            data:'',
            datapar:'',
            input:{
                pid:comment.comment_id,
                page:1,
                limit:15
            },
            comment:null,
            index:undefined,
            headerlikecount:0,
            likecount:[]
        }
    }
    componentDidMount() {
        let {params={}} = this.props.navigation.state;
        let {pid=undefined} = params; 
        if (pid!=undefined){
            this.getForumUserReplyFromPid(pid)
        }else{
            this.getForumUserReply()
        }
    }
    componentWillUnmount() {
        let {forum_id} = this.props.navigation.state.params.comment;
        this.props.forumReplyAction.updateForumReply(forum_id)
    }
    getForumUserReplyFromPid = ()=>{
        forumUserReplyApi.getForumUserReply({pid:pid,page:1,limit:15})
        .then(responseJson=>{
            if(responseJson.code==200) this.setState({data:responseJson.info.data})
        },error=>console.log(error))
    }
    getForumUserReply = ()=>{
        // console.log(this.props.navigation.state.params)
        // pid(父级评论id) page(请求的页数)  limit(每页请求数量) 
        let {comment=undefined} = this.props.navigation.state.params
        /*if (comment && comment.commentchild && comment.commentchild.DataTotal<10) return;*/
        newsReplyApi.getNewsUserReplyPar({action:'forum',pid:comment.comment_id})
            .then(responseJson=>{
                // console.log(responseJson)
                if(responseJson.code==200) this.setState({datapar:responseJson.info})
            },error=>console.log(error))
        forumUserReplyApi.getForumUserReply({pid:comment.comment_id,page:1,limit:15})
        .then(responseJson=>{
            if(responseJson.code==200) {
                let data = responseJson.info.data;
                if (comment.hasOwnProperty('self_id')&&comment.comment_id!=comment.self_id){
                    let index = _.findIndex(data,(item)=>{
                        return item.comment_id == comment.self_id;
                    })
                    if (index==-1){
                        data = [comment.self,...data]
                    }else{
                        let self = data[index]
                        data.splice(index,1)
                        data = [self,...data]
                    }
                }
                this.setState({data})
            }
        },error=>console.log(error))
    }
    refreshForumUserReply = ()=>{
        // pid(父级评论id) page(请求的页数)  limit(每页请求数量) 
        let {comment=undefined,pid=undefined} = this.props.navigation.state.params
        let comment_id = comment?comment.comment_id:(pid?pid:null)
        if (comment_id==null) return;
        forumUserReplyApi.getForumUserReply({pid:comment_id,page:1,limit:15})
        .then(responseJson=>{
            if(responseJson.code==200) this.setState({data:responseJson.info.data})
        },error=>console.log(error))
    }
    onLikePress =(comment,index)=>{
        // TODOFIXED: 点赞失败 -> url中action(a)参数与新闻请求的名称不一样...
        let {comment_id,user_id,islike} = comment;
        let {forum_id} = this.props.navigation.state.params.comment;
        forumUserReplyApi.commentLike({forum_id,comment_id}).then(responseJson=>{
            if (responseJson.code==200||responseJson.code==201){
                let likecount = [...this.state.likecount]
                let headerlikecount = this.state.headerlikecount;
                if (index==-1){
                    responseJson.code==200
                    ?(islike==0?headerlikecount=0:headerlikecount=1)
                    :(islike==0?headerlikecount=-1:headerlikecount=0)
                }else{
                    responseJson.code==200
                    ?(islike==0?likecount[index]=0:likecount[index]=1)
                    :(islike==0?likecount[index]=-1:likecount[index]=0)
                }
                this.setState({likecount,headerlikecount});
            }
        },error=>console.log(error))
    }
    onCommentPress = (comment,index)=>{
        // console.log(comment,index)
        this.setState({show:true,comment,index})
    }
    ontrianglePress = (comment)=>{
        this.props.navigation.navigate('UserReport',{type:'forum_comment',data:comment})
    }
    onCommentCancelPress = ()=>{
        this.setState({show:false,comment:null});
    }
    onCommentActivePress = ()=>{
        let {comment} = this.state
        if (!comment) return this.setState({show:false,comment:null});;
        let {user_id,comment_id,user_name} = comment
        let commented_userid = user_id
        let pid = this.props.navigation.state.params.comment.comment_id
        let forum_id = this.props.navigation.state.params.comment.forum_id;
        let content = this.refs.commentInput._lastNativeText
        if (!content||content==''||!forum_id) return this.setState({show:false});
        let params = {
            commented_userid,
            pid,
            content,
            forum_id
        }
        forumUserReplyApi.forumReply(params).then(responseJson=>{
            if (responseJson.code==200){
                try {
                    let {avatar,alias} = this.props.userdata;
                    let newData = Object.assign({},responseJson.info,{commented_username:user_name,user_name:alias,user_avatar:avatar,islike:1,likecount:0,time:moment().format('YYYY-MM-DD HH:mm:ss')})
                    let data = [newData,...this.state.data];
                    this.setState({data,show:false,comment:undefined,likecount:[0,...this.state.likecount]})
                } catch (error) {
                    console.log(error)
                }
                // this.refreshForumUserReply()
            }else{
                // TODO: 错误提示
            }
        },error=>console.log(error))
        this.setState({show:false})
    }
    getMoreReply = (input)=>{
        forumUserReplyApi.getForumUserReply(input)
        .then(responseJson=>{
            // console.log(responseJson)
            if(responseJson.code==200) this.setState({data:[...this.state.data,...responseJson.info.data]})
        },error=>console.log(error))
    }
    onUserPress = (user_id)=>{
        this.props.navigation.navigate('UserCenter',{userfollow:{user_id}})
    }
    _onEndReached = ()=>{
        // if (this.state.data.length==this.state.)
        if (this.state.data.length<this.state.input.limit*this.state.input.page) return;
        console.log('======== ForumUserReply _onEndReached ========');
        let {comment} = this.props.navigation.state.params;
        const input = {
            pid: comment.comment_id,
            page:this.state.input.page+1,
            limit:10
        };
        this.setState({input})
        this.getMoreReply(input);
    }
    _renderHeader = ()=>{
        let {comment} = this.props.navigation.state.params;
        let alias = this.state.datapar && this.state.datapar.hasOwnProperty('alias')?this.state.datapar.alias:''
        let avatar = this.state.datapar && this.state.datapar.hasOwnProperty('avatar')&&this.state.datapar.avatar!=''?this.state.datapar.avatar:'http://ulapp.cc/data/attached/images/201707/1500885893673766102.jpg'
        let liked = this.state.datapar && this.state.datapar.hasOwnProperty('liked')?this.state.datapar.liked:0
        let comment_count = this.state.datapar && this.state.datapar.hasOwnProperty('comment_count')?this.state.datapar.comment_count:0
        let comment_time = this.state.datapar && this.state.datapar.hasOwnProperty('comment_time')?this.state.datapar.comment_time:''
        let islike = this.state.datapar && this.state.datapar.hasOwnProperty('islike')?this.state.datapar.islike:''
        let content = this.state.datapar && this.state.datapar.hasOwnProperty('content')?this.state.datapar.content:''
        /*let {alias,avatar,comment_count,comment_time,content,like_count,user_id} = comment*/
        liked = Math.floor(liked)
        liked += this.state.headerlikecount
        islike = this.state.headerlikecount==0?islike:(islike==0?1:0)
        content = content?emoticons.parse(content):''
        if(content){return (
            <View style={styles.user_replycontent}>
                <TouchableOpacity style={styles.left} onPress={()=>this.onUserPress(this.state.datapar.user_id)}>
                    <Image source={{uri:avatar}} style={styles.left_img}></Image>
                </TouchableOpacity>
                <View style={styles.right}>
                    <View style={styles.right_top}>
                        <View style={styles.top_text}>
                            <View style={styles.text_top}>
                                <Text style={styles.user_name}>{alias}</Text>
                            </View>
                        </View>
                        <View style={styles.top_icon}>
                            <TouchableOpacity   onPress={()=>this.ontrianglePress(comment)}>
                                <Text style={styles.top_icontext}><Icon name="exclamation-triangle"/></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.right_content}>
                        <Text style={styles.right_contenttext} selectable={true}>{content}</Text>
                    </View>
                    <View style={styles.right_top}>
                        <View style={styles.top_text}>
                            <View style={styles.text_time}>
                                <Text style={styles.text_timetext}>{comment_time}</Text>
                            </View>
                        </View>
                        <View style={styles.top_icon}>
                            <TouchableOpacity  onPress={()=>this.onLikePress(comment,-1)}>
                                <Text style={styles.top_icontext}><Icon name="thumbs-o-up"  color={islike==0?'#d34d3d':'#aaa'}/> {liked}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={()=>this.onCommentPress(comment,-1)}>
                                <Text style={styles.top_icontext}><Icon name="commenting-o"/> {comment_count}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )}else{
            return  <Text style={{paddingVertical:20,textAlign:'center',fontSize:setFontSize(15)}}>此评论已删除</Text>
        }
    }
    _renderItem = ({item,index})=>{
        let {comment} = this.props.navigation.state.params
        let usercomment = item;
        let key=index
        let {user_avatar,content,time,commented_username,commented_userid,user_name,user_id,islike,likecount} = usercomment
        let replyComponent = <Text></Text>
        if (commented_userid != comment.user_id||commented_username){
            replyComponent = (<Text>回复 <Text style={styles.reply_username}>{commented_username}</Text> :</Text>)
        }
        if (user_avatar=='') user_avatar = Images.defaultAvatar;
        else user_avatar = {uri:user_avatar}
        likecount = likecount? Math.floor(likecount):0
        this.state.likecount[index]?likecount += this.state.likecount[index]:likecount;
        let DataTotal = 0
        content = content?emoticons.parse(content):''
        islike = !this.state.likecount[index]||this.state.likecount[index]==0?islike:(islike==0?1:0)
        return (
            <View key={key} style={styles.user_allreply}>
                <TouchableOpacity style={styles.left} onPress={()=>this.onUserPress(user_id)}>
                    <Image source={user_avatar} style={styles.left_img}></Image>
                </TouchableOpacity>
                <View style={styles.user_right}>
                    <View style={styles.right_top}>
                        <View style={styles.user_top_text}>
                            <View style={styles.text_top}>
                                <Text style={styles.usertext_name}>{user_name}</Text>
                            </View>
                        </View>
                        <View style={styles.top_icon}>
                            <TouchableOpacity  onPress={()=>this.ontrianglePress(usercomment)}>
                                <Text style={styles.top_icontext}><Icon name="exclamation-triangle"/></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.right_content}>
                        <Text style={styles.right_contenttext} selectable={true}>{replyComponent}{content}</Text>
                    </View>
                    <View style={styles.right_top}>
                        <View style={styles.user_top_text}>
                            <View style={styles.text_time}>
                                <Text style={styles.text_timetext}>{time}</Text>
                            </View>
                        </View>
                        <View style={styles.top_icon}>
                            <TouchableOpacity  onPress={()=>this.onLikePress(usercomment,index)}>
                                <Text style={styles.top_icontext}><Icon name="thumbs-o-up"   color={islike==0?'#d34d3d':'#aaa'}/> {likecount}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={()=>this.onCommentPress(usercomment,index)}>
                                <Text style={styles.top_icontext}><Icon name="commenting-o"/> {DataTotal}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={{backgroundColor:'white',  flex:1}}>
                <FlatList
                    style={{backgroundColor:'white'}}
                    data={this.state.data}
                    renderItem={this._renderItem}
                    initialNumToRender={10}
                    keyExtractor={(item, index) => index}
                    keyboardShouldPersistTaps='handled'
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={0.1}
                    ListHeaderComponent={this._renderHeader()}
                    ItemSeparatorComponent={()=><View style={{height:2,backgroundColor:'white',paddingLeft:20,paddingRight:20}}/>}
                />
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.show}
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
            </View>
        )
    }
}
function mapStateToProps(state, ownProps){
    return {
        userdata:state.root.user.userdata
    };
}
function mapDispatchToProps(dispatch){
    return {
        forumReplyAction:bindActionCreators(forumReplyAction,dispatch),
        commonAction:bindActionCreators(commonAction,dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ForumUserReply);