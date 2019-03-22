import React,{Component} from 'react';
import { StyleSheet, Text, View, Platform,TextInput ,Image,TouchableOpacity,Modal} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import newsReplyApi from '../../api/news/newsReplyApi';
import {emoticons} from '../../utility/index';
import Images from '../../imagesRequired';

class NewsReplyItem extends Component{
    constructor(props){
        super(props)
        this.state = {
            likecount:0
        }
    }
    onLikePress =()=>{
        let {comment,index} = this.props
        let {comment_id,user_id,islike} = comment;
        let {news_id} = this.props;
        newsReplyApi.commentLike({news_id,comment_id}).then(responseJson=>{
            if (responseJson.code==200||responseJson.code==201){
                let likecount = [...this.state.likecount]
                responseJson.code==200
                ?(islike==0?likecount=0:likecount=1)
                :(islike==0?likecount=-1:likecount=0)
                this.setState({likecount});
            }
        },error=>console.log(error))
    }
    onUserReplyPress = ()=>{
        this.props.onUserReplyPress(this.getComment())
    }
    ontrianglePress =()=>{
        let {comment,index} = this.props
        this.props.navigation.navigate('UserReport',{type:'news_comment',data:comment})
    }
    getComment = ()=>{
        let {comment,index} = this.props
        let {islike,likecount} = comment;
        likecount = Math.floor(likecount)
        this.state.likecount?likecount += this.state.likecount:likecount;
        islike = !this.state.likecount||this.state.likecount==0?islike:(islike==0?1:0)
        return {...comment,islike,likecount};
    }
    render(){
        let {comment,index} = this.props
        let {avatar,content,islike,time,likecount,user_name,commentchild,user_id} = comment;
        let commentchildTotal = commentchild?commentchild.DataTotal:0;
        let key = index
        if (avatar=='') avatar = Images.defaultAvatar;
        else avatar = {uri:avatar}
        likecount = Math.floor(likecount)
        this.state.likecount?likecount += this.state.likecount:likecount;
        content = content?emoticons.parse(content):''
        islike = this.state.likecount==0?islike:(islike==0?1:0)
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
                            <TouchableOpacity onPress={()=>this.ontrianglePress()}>
                                <Icon style={styles.list_icon_text} name="exclamation-triangle"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.list_right_content}>
                        <Text style={styles.list_right_contenttext} selectable={true}>{content}</Text>
                    </View>
                    {commentchildTotal>0 &&
                    <TouchableOpacity style={styles.list_right_reply} onPress={()=>this.onUserReplyPress()}>
                    <Text style={styles.reply_text}>{`共${commentchildTotal}条回复`}</Text>
                    <Icon name="angle-right" style={styles.angle}/>
                    </TouchableOpacity>
                    }
                    <View style={styles.list_right_tag}>
                        <View style={styles.list_right_left}><Text style={styles.list_right_time}>{time}</Text></View>
                        <View style={styles.list_right_right}>
                            <TouchableOpacity  onPress={()=>this.onLikePress()}>
                                <Text style={styles.list_icon_text}><Icon name="thumbs-o-up"  color={islike==0?'#d34d3d':'#aaa'} /> {likecount}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={()=>this.props.onCommentPress(this.getComment(),index)}>
                                <Text style={styles.list_icon_text}><Icon name="commenting-o"/> {commentchildTotal}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}


function mapStateToProps(state, ownProps){
    return {
        updateNewsReply:state.root.news.updateNewsReply,
    };
}
function mapDispatchToProps(dispatch){
    return {
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(NewsReplyItem)


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
        color:'#ccc',
        fontSize:setFontSize(15)
    },
    list_right_right:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'flex-end',
    },
    list_icon_text:{
        width:40,
        fontSize:setFontSize(12),
        color:'#ccc',
        textAlign:'right'
    },
    modalStyle: {
        flex:1,
        backgroundColor: '#0008',
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