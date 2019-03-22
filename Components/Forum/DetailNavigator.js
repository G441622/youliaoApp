import React from 'react';
import { StyleSheet, Text, View, Platform,TextInput,ScrollView ,Image,TouchableOpacity,Modal} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as commonAction from '../../actions/common/commonAction';
import forumCollectionApi from '../../api/forum/forumCollectionApi';
import forumLikeApi from '../../api/forum/forumLikeApi';
import forumReplyApi from '../../api/forum/forumReplyApi';
import forumDetailApi from '../../api/forum/forumDetailApi';
import SharePlatform from '../../services/SharePlatform';
import UMShare from '../../services/share';
import _ from 'lodash';
import moment from 'moment';
import Images from '../../imagesRequired';

const styles = StyleSheet.create({
    bottom:{
        height:40,
        flexDirection: 'row',
        backgroundColor:'white',
        borderTopWidth:1,
        borderTopColor:'#ccc',
    },
    separate:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon:{
        fontSize:setFontSize(20),
        textAlign:'center',
        color:'#505050',
    },
    text:{
        fontSize:setFontSize(13),
        textAlign:'center',
        color:'#8a8a8a',
        marginLeft:5,

    },
    line:{
        width:1,
        height:25,
        position:'absolute',
        right:0,
        backgroundColor:'#ddd',
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
    sharemodalStyle:{
        flex:1,
        backgroundColor: '#0008',
        justifyContent :'flex-end'
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
        padding:3,
        marginRight:10,
        width:70,
        marginBottom:10,
    },
    publish:{
        padding:3,
        backgroundColor:'#d34d3d',
        marginRight:10,
        marginBottom:10,
        borderRadius:5,
        width:70,

    },
    commentcanceltext:{
        fontSize:setFontSize(15),
        color:'#505050',
    },
    commentpublishtext:{
        fontSize:setFontSize(15),
        color:'white',
        textAlign:'center'
    },
    share_img:{
        flexDirection: 'row'},
    share_text:{
        flexDirection: 'row',
        marginBottom:10,
    },
    text_view:{
        flex:1,
        textAlign:'center',
        padding:5,
        fontSize:setFontSize(12),
        color:'#505050',
    },
    img_view:{
        flex:1,
        margin:15,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        borderRadius:30,
        height:60,
        width:60,
        marginBottom:0
    },
    img_qq:{
        height:40,
        width:40,
    },
    sharemodal_Bottom:{
        padding:5,
        justifyContent: 'center',
        alignItems:'center',
        borderTopWidth:1,
        borderTopColor:'#ddd',

    },

});

class DetailNavigator extends React.Component {
    constructor(props, context){
        super(props, context);
        let is_like = _.result(props,'forumDetail.is_like',1) 
        let is_collection = _.result(props,'forumDetail.is_collection',1)
        this.state = {
            show:false,
            is_like,
            is_collection,
            share:false,
            commented_userid:0,
            pid:0
        };
        this.onCommentPress = this.onCommentPress.bind(this)
        this.onCommentActivePress = this.onCommentActivePress.bind(this)
        this.onCommentCancelPress = this.onCommentCancelPress.bind(this)
        this.onLikePress = this.onLikePress.bind(this)
        this.onCollectionPress = this.onCollectionPress.bind(this)
        this.onSharePress = this.onSharePress.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.forumDetail){
            let is_like = _.result(nextProps,'forumDetail.is_like',1) 
            let is_collection = _.result(nextProps,'forumDetail.is_collection',1)
            this.setState({is_like,is_collection})
        }
    }
    onLikePress(){
        forumLikeApi.forumLike(this.props.forumDetail.id).then(responseJson=>{
            if (responseJson.code==200) this.setState({is_like:this.state.is_like==0?1:0})
        },error=>console.log(error))
    }
    onCollectionPress(){
        forumCollectionApi.getForumCollection({forum_id:this.props.forumDetail.id})
        .then(responseJson=>{
            if(responseJson.code==200||responseJson.code==201) {
                responseJson.code==200
                ? this.setState({ is_collection: 0 })
                : this.setState({ is_collection: 1 })
            }
        },error=>console.log(error))
    }
    onCommentPress(){
        this.setState({show:true})
    }
    onCommentCancelPress() {
        this.setState({show:false});
    }
    onCommentActivePress() {
        let content = this.refs.commentInput._lastNativeText
        let params = {
            content,
            forum_id:this.props.forumDetail.id
        }
        if (!content||content==''||!params.forum_id) return;
        forumReplyApi.forumReply(params).then(responseJson=>{
            if (responseJson.code==200){
                let {userdata} = this.props;
                let newComment = {...responseJson.info,avatar:userdata.avatar,user_name:userdata.alias,commentchild:[],islike:1,likecount:'0',time:moment().format('YYYY-MM-DD HH:mm:ss')}
                this.props.addForumReply(newComment)
            }
        },error=>console.log(error))
        this.setState({show:false});
    }
    onSharePress() {
        let isShow = this.state.share;
        this.setState({
            share:!isShow,
        });
    }
    share = (platform)=>{
        let {forumDetail,forumReply} = this.props;
        let title = forumDetail.title;
        let defaultInfo = {
            text:'来自有料客户端',
            image:encodeURI('http://www.ulapp.cc/themes/default/css/bglogo.jpg')
        }
        let text = undefined ,image = undefined;
        for (let i=0; i<forumDetail.detail.length; i++){
            let content = forumDetail.detail[i]
            if (content.type=='image'){
                image = content.content
                break;
            }else if(content.type=='text'){
                text = content.content
            }
            if (text&&image) break;
        }
        if (!text||text=='') text = defaultInfo.text;
        // if (!image||platform==SharePlatform.QQ||platform==SharePlatform.QQZONE) 
        image= defaultInfo.image;
        let url = `http://ulapp.cc/index.php?m=default&c=forum&a=post&id=${forumDetail.id}`
        UMShare.share(title,text,url,image, platform,
        (code, message) => {
            this.onSharePress()
            if (code==200||code=='分享成功'||message=='分享成功'){
                var platformString = ''
                switch (platform) {
                    case SharePlatform.WECHATMOMENT:
                        platformString = 'wx'
                        break;
                    case SharePlatform.QQZONE:
                        platformString = 'qzone'
                        break;
                    case SharePlatform.SINA:
                        platformString = 'wb'
                        break;
                    case SharePlatform.WECHAT:
                        platformString = 'wx'
                        break;
                    default:
                        break;
                }
                forumDetailApi.forumShare({action:'forum',id:forumDetail.id,third:platformString}).then(responseJson=>{
                    if (responseJson.code==200){
                        return this.props.commonAction.showTip('分享成功')
                    }
                },error=>console.log(error))

            }else{
                // this.props.commonAction.showTip('')
            }
        });
    }
    render() {
        let commentTotal = _.result(this.props,'forumReply.DataTotal',0)
        let likeTotal = _.result(this.props,'forumDetail.like_count',0) 
        let is_like = _.result(this.props,'forumDetail.is_like',1) 

        likeTotal = Math.floor(likeTotal)
        is_like == this.state.is_like ? likeTotal : (is_like==0?likeTotal-=1:likeTotal+=1)
        if (likeTotal < 0) likeTotal = 0

        return (<View style={styles.bottom}>
            <TouchableOpacity style={styles.separate} onPress={this.onCommentPress}>
                <Image source={Images.pinglunInactive} style={{width:16,height:16}}/>
                <Text style={styles.text}>{commentTotal==0?'':commentTotal}</Text>
                <View style={styles.line}></View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.separate} onPress={this.onLikePress}>
                <Image source={this.state.is_like==1?Images.likeInactive:Images.likeActive} style={{width:20,height:20}}/>
                <Text style={styles.text}>{likeTotal==0?'':likeTotal}</Text>
                <View style={styles.line}></View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.separate} onPress={this.onCollectionPress}>
                <Image source={this.state.is_collection==1?Images.collectionInactive:Images.collectionActive} style={{width:20,height:20}}/>
                <Text style={styles.text}>收藏</Text>
                <View style={styles.line}></View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.separate} onPress={this.onSharePress}>
                <Image source={Images.zhuanfa} style={{width:20,height:20}}/>
                <Text style={styles.text}>分享</Text>
            </TouchableOpacity>
            <Modal
                animationType='fade'
                transparent={true}
                visible={this.state.show}
                onShow={() => {}}
                onRequestClose={() => {}} >
                <View style={styles.modalStyle}>
                    <View style={{backgroundColor:'white',borderWidth:2,borderColor:'#7f7f7f',borderRadius:10}}>
                        <TextInput  ref='commentInput' placeholder="写下你的评论..." style={styles.write_textput} underlineColorAndroid="transparent"
                                    multiline={true}></TextInput>
                        <View style={styles.modal_Bottom}>
                            <TouchableOpacity underlayColor='transparent' onPress={this.onCommentCancelPress} style={styles.cancel}><Text style={styles.commentcanceltext}>取消</Text></TouchableOpacity>
                            <TouchableOpacity underlayColor='transparent' onPress={this.onCommentActivePress} style={styles.publish}><Text style={styles.commentpublishtext}>发表</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType='fade'
                transparent={true}
                visible={this.state.share}
                onShow={() => {}}
                onRequestClose={() => {}} >
                <TouchableOpacity style={styles.sharemodalStyle}  onPress={this.onSharePress}>
                    <View style={{backgroundColor:'#f8f8f8'}}>
                        <View style={styles.share_img}>
                            <TouchableOpacity style={styles.img_view} onPress={()=>this.share(SharePlatform.WECHAT)}><Image source={Images.wx} style={styles.img_qq}></Image></TouchableOpacity>
                            <TouchableOpacity style={styles.img_view} onPress={()=>this.share(SharePlatform.WECHATMOMENT)}><Image source={Images.wxmoment} style={styles.img_qq}></Image></TouchableOpacity>
                            <TouchableOpacity style={styles.img_view} onPress={()=>this.share(SharePlatform.QQZONE)}><Image source={Images.qqzone} style={styles.img_qq}></Image></TouchableOpacity>
                            <TouchableOpacity style={styles.img_view} onPress={()=>this.share(SharePlatform.SINA)}><Image source={Images.wb} style={styles.img_qq}></Image></TouchableOpacity>
                        </View>
                        <View style={styles.share_text}>
                            <Text style={styles.text_view}>微信好友</Text>
                            <Text style={styles.text_view}>微信朋友圈</Text>
                            <Text style={styles.text_view}>QQ空间</Text>
                            <Text style={styles.text_view}>新浪微博</Text>
                        </View>
                        <TouchableOpacity style={styles.sharemodal_Bottom}onPress={this.onSharePress}>
                            <View underlayColor='transparent' style={styles.cancel}><Text style={styles.commentcanceltext}>取消分享</Text></View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>);
    }
}
function mapStateToProps(state, ownProps){
    return {
        userdata:state.root.user.userdata
    };
}
function mapDispatchToProps(dispatch){
    return {
        commonAction: bindActionCreators(commonAction, dispatch),
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(DetailNavigator);