import React from 'react';
import { StyleSheet, Text, View, Platform,TextInput,ScrollView ,Image,TouchableOpacity, Modal} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as forumReplyAction  from '../../actions/forum/forumReplyAction';
import forumReplyApi from '../../api/forum/forumReplyApi';
import forumLikeApi from '../../api/forum/forumLikeApi';
import {emoticons} from '../../utility/index';
import Images from '../../imagesRequired';

const styles = StyleSheet.create({
    comment:{
        marginTop:10,
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
    comment_list_view:{
        margin:20,
        marginTop:10,
        marginBottom:10,
    },
    comment_list_content:{
        flex:1,
        flexDirection: 'row',
        marginTop:10,
    },
    list_left:{
        flex:1,
    },
    list_user_img:{
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    list_right:{
        flex:5,
        borderBottomColor:'#ddd',
        borderBottomWidth:1,
    },
    list_right_name:{
        flex:1,
        flexDirection: 'row',
    },
    list_right_content:{  flex:2, margin:5,marginLeft:0
    },
    list_right_reply:{
        flex:1,
        backgroundColor:'#f4f4f4',
        flexDirection: 'row',
        /* justifyContent: 'center',*/
        alignItems: 'center'
    },
    list_right_contenttext:{
        color:'#585858'
    },
    reply_text:{
        padding:3,
        color:'#d34d3d',
        marginLeft:10,
        fontSize:setFontSize(12)
    },
    angle:{
        padding:3,
        color:'#d34d3d',
        fontSize:setFontSize(18),
        marginLeft:5,
    },
    list_right_name_text:{
        fontSize:setFontSize(16),
        color:'#585858'
    },
    list_right_tag:{
        marginTop:5,
        marginBottom:5,
        flexDirection: 'row',
    },
    list_right_left:{
        flex:1,
    },
    list_right_time:{
        color:'#ccc'
    },
    list_right_right:{
        flexDirection: 'row',
        width:100,
        alignItems:'center',
        justifyContent:'flex-end',
    },
    list_icon_text:{
        width:40,
        color:'#ccc',
        textAlign:'right'
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

class ForumReply extends React.Component {

    constructor(props, context){
        super(props, context);
        this.state = {
            show:false,
            likecount:[]
        };
        this.input = {
            page:1,
            limit:15,
            childcount:10,
        };
        this.onCommentPress = this.onCommentPress.bind(this)
        this.onCommentCancelPress = this.onCommentCancelPress.bind(this)
        this.onCommentActivePress = this.onCommentActivePress.bind(this)
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps){
        if (this.props.updateForumReply!=nextProps.updateForumReply&&nextProps.updateForumReply==this.props.forum_id){
            this.props.refreshReply();
            this.props.forumReplyAction.updatedForumReply()
        }
        this.setState({likecount:[]})
    }
    ontrianglePress =(comment,index)=>{
        this.props.navigation.navigate('UserReport',{type:'forum_comment',data:comment})
    }
    onLikePress =(comment,index)=>{
        let {comment_id,user_id,islike} = comment;
        let {forum_id} = this.props;
        forumReplyApi.commentLike({forum_id,comment_id}).then(responseJson=>{
            if (responseJson.code==200||responseJson.code==201){
                let likecount = [...this.state.likecount]
                responseJson.code==200
                ?(islike==0?likecount[index]=0:likecount[index]=1)
                :(islike==0?likecount[index]=-1:likecount[index]=0)
                this.setState({likecount});
            }
        },error=>console.log(error))
    }
    onCommentPress(comment){
        let {user_id,comment_id} = comment
        this.setState({show:true,commented_userid:user_id,pid:comment_id})
    }
    onCommentCancelPress() {
        this.setState({show:false});
    }
    onCommentActivePress() {
        let {commented_userid,pid} = this.state
        // console.log(this.refs.commentInput)
        let content = this.refs.commentInput._lastNativeText
        let forum_id = this.props.forum_id
        if (!content||content==''||!forum_id) return;
        let params = {
            commented_userid,
            pid,
            content,
            forum_id
        }
        forumReplyApi.forumReply(params).then(responseJson=>{
            if (responseJson.code==200){
                this.props.refreshReply()
            }
        },error=>console.log(error))
        this.setState({show:false});
    }
    onUserReplyPress(comment,index){
        let {islike,likecount} = comment;
        likecount = Math.floor(likecount)
        this.state.likecount[index]?likecount += this.state.likecount[index]:likecount;
        islike = !this.state.likecount[index]||this.state.likecount[index]==0?islike:(islike==0?1:0)
        this.props.onUserReplyPress({...comment,forum_id:this.props.forum_id,islike,likecount})
    }
    render() {
        let forumReply = this.props.forumReply;
        let DataTotal = 0
        let commentContents = (
            <View>
                <Text>暂无评论</Text>
            </View>
        )
        if (forumReply && forumReply.hasOwnProperty('DataTotal') && forumReply.DataTotal>0) {
            DataTotal = forumReply.DataTotal
            commentContents = forumReply.data.map((comment,index)=>{
                //TODOFIXED: 子评论点赞及点赞数,评论数
                let {avatar,content,islike,time,likecount,user_name,commentchild,user_id} = comment
                let commentchildTotal = commentchild?commentchild.DataTotal:0;
                let key = index
                if (avatar=='') avatar = Images.defaultAvatar;
                else avatar = {uri:avatar}
                likecount = Math.floor(likecount)
                this.state.likecount[index]?likecount += this.state.likecount[index]:likecount;
                content = content?emoticons.parse(content):''
                islike = !this.state.likecount[index]||this.state.likecount[index]==0?islike:(islike==0?1:0)
                return (
                    <View key={key} style={styles.comment_list_content}>
                        <TouchableOpacity style={styles.list_left} onPress={()=>this.props.onUserPress(user_id)}>
                            <Image source={avatar} style={styles.list_user_img}></Image>
                        </TouchableOpacity>
                        <View style={styles.list_right}>
                            <View style={styles.list_right_name}>
                                <View style={styles.list_right_left}>
                                    <Text style={styles.list_right_name_text}>{user_name}</Text>
                                </View>
                                <View style={styles.list_right_right}>
                                    <TouchableOpacity onPress={()=>this.ontrianglePress(comment)}>
                                        <Icon style={styles.list_icon_text} name="exclamation-triangle"/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.list_right_content}>
                                <Text style={styles.list_right_contenttext}>{content}</Text>
                            </View>
                            {commentchildTotal>0 &&
                            <TouchableOpacity style={styles.list_right_reply} onPress={()=>this.onUserReplyPress(comment,index)}>
                            <Text style={styles.reply_text}>{`共${commentchildTotal}条回复`}</Text>
                            <Icon name="angle-right" style={styles.angle}/>
                            </TouchableOpacity>
                            }
                            <View style={styles.list_right_tag}>
                                <View style={styles.list_right_left}><Text style={styles.list_right_time}>{time}</Text></View>
                                <View style={styles.list_right_right}>
                                    <TouchableOpacity  onPress={()=>this.onLikePress(comment,index)}>
                                        <Text style={styles.list_icon_text}><Icon name="thumbs-o-up" color={islike==0?'#d34d3d':'#aaa'} /> {likecount}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity  onPress={()=>this.onCommentPress(comment)}>
                                        <Text style={styles.list_icon_text}><Icon name="commenting-o"/> {commentchildTotal}</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </View>
                )
            })
        }
        return (<View style={styles.comment}>
            <View style={styles.comment_tag}>
                <Text style={styles.comment_tag_text}>全部评论 </Text>
                <Text style={styles.comment_tag_text}>{DataTotal}</Text>
            </View>
            <View  style={styles.comment_list_view}>
                {commentContents}
            </View>
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
        </View>);
    }
}

function mapStateToProps(state, ownProps){
    return {
        updateForumReply: state.root.forum.updateForumReply
    };
}
function mapDispatchToProps(dispatch){
    return {
        forumReplyAction: bindActionCreators(forumReplyAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(ForumReply);
