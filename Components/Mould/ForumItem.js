import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import userApi from '../../api/user/userApi';
import {Article,ListTitle} from '../CustomComponents/CustomText';
import userFansApi from '../../api/user/userFansApi';
import { connect } from 'react-redux';
import {emoticons} from '../../utility/index';
import _ from 'lodash';
import { CustomHeadersImage } from "../CustomComponents/CustomImage";
import Images from '../../imagesRequired';


class ForumItem extends Component {
    static defaultProps = {
        hide : false
    }
    constructor(props, context) {
        super(props, context);
        let isfans = this.props.data.isfans==0
        let self = _.result(this.props,'userdata.user_id',false) 
        let isSelf = this.props.login&&self&&self==this.props.data.user_id?true:false
        if (!this.props.login||!self||!this.props.data.user_id) isSelf=true
        this.state = { 
            isfans ,
            isSelf
        };
    }
    componentWillReceiveProps(nextProps) {
        let isfans = nextProps.data.isfans==0
        this.setState({isfans})
    }
    attention = ()=>{
        let {user_id} = this.props.data;
        userApi.attention(user_id).then(responseJson=>{
            this.props.dispatch({type:'SHOW_TIP',data:'操作失败,请重试'})
            if (responseJson.code == 200){
                this.setState({isfans:true});
            }else if(responseJson.code==201){
                this.setState({isfans:false});
            } else{
                this.props.dispatch({type:'SHOW_TIP',data:'操作失败,请重试'})
            }
        },error=>{
            console.log(error)
        })
    }
    render() {
        let {cover_url,avatar,alias,time,title,is_like,commentcount,visit,user_id,forum_share} = this.props.data;
        if (!user_id) return null;
        if (cover_url && Array.isArray(cover_url) &&cover_url.length) {
            cover_url = _.uniq(cover_url)
            cover_url = cover_url.map(url=>{
                if (url && typeof (url) == 'string' && url.length ){
                    url = url.indexOf('http')!=-1?url:'http://www.ulapp.cc'+(url.charAt(0)=='/'?url:'/'+url)
                    url = url.replace(/&amp;/g,'&')
                    //.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'\"')
                }else{
                    url = null;
                }
                return url;
            })
            cover_url = _.compact(cover_url)
        }
        let images = cover_url && Array.isArray(cover_url) && cover_url.length
        ? (cover_url.length < 3 
            ? <View style={styles.content_img_view}><CustomHeadersImage source={{uri:cover_url[0]}} resizeMode='cover' style={styles.content_img_full}/></View>
            : <View style={styles.content_img_view}>{cover_url.map((image,index)=>index>2?null:<CustomHeadersImage key={index} resizeMode='cover' source={{uri:image}} style={styles.content_img}/>)}</View>)
        : <View></View>
        title = title ? emoticons.parse(title) : ''
        avatar = avatar ? {uri:avatar} : Images.defaultAvatar;
        return <View>
            <View style={styles.list}>
                <View style={styles.list_content}>
                    <TouchableOpacity style={styles.user_view} onPress={()=>this.props.onUserPress(user_id)} >
                        <Image source={avatar} style={styles.user_img}></Image>
                        <View style={{flex:1,justifyContent:'center'}}>
                            <Text style={styles.user_name}>{alias}</Text>
                            <Text style={styles.user_time}>{time}</Text>
                        </View>
                        {(!this.state.isSelf&&!this.props.hide)&&<View style={styles.follow_view}>
                            <TouchableOpacity style={this.state.isfans==false?styles.follow_content:styles.follow_content1} onPress={this.attention}>
                                <Text style={this.state.isfans==false?styles.follow_text:styles.follow_text1} allowFontScaling={false}>{this.state.isfans==false?'+ 关注':'已关注'}</Text>
                            </TouchableOpacity>
                        </View>}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.props.onContentPress(this.props.data)} style={styles.flex_2}>
                        <View style={styles.content_title_view}>
                            <ListTitle style={styles.content_title_text}  numberOfLines={2}>{title}</ListTitle>
                        </View>
                        {images}
                    </TouchableOpacity>
                    <View style={styles.list_bottom_tag}>
                        <Text style={styles.list_icon_firsttext}><Icon name="thumbs-o-up" size={15}/>  {is_like}</Text>
                        <Text style={styles.list_icon_text}><Icon name="eye"  size={15}/>  {visit}</Text>
                        <Text style={styles.list_icon_text}><Icon name="share-square-o" size={15}/>  {forum_share}</Text>
                        <Text style={styles.list_icon_text}><Icon name="commenting-o" size={15}/>  {commentcount}</Text>
                    </View>
                </View>
            </View>
        </View>;
    }
}

const styles = StyleSheet.create({
    list: {
        backgroundColor:'white',
    },
    list_content: {
        flex: 1,
        marginBottom: 0,
        marginTop:10,
    },
    user_view: {
        flex: 1,
        flexDirection: 'row'
    },
    user_name: {
        fontSize:setFontSize(15),
        color: '#585858'
    },
    user_img: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15
    },
    user_time: {
        fontSize:setFontSize(10)
    },
    follow_view: {
        position:'absolute',
        right:0,
        justifyContent: 'center',
        alignItems: 'center'
    },

    follow_content:{
        width: 50,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        backgroundColor:'#d34d3d'
    },
    follow_text: {
        fontSize:setFontSize(14),
        color: 'white'
    },
    follow_content1:{
        width: 50,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        borderColor: '#ddd',
        borderWidth: 1
    },
    follow_text1: {
        fontSize:setFontSize(14),
        color: '#ccc'
    },
    content_title_view: {
        flex: 1,
        marginTop: 10
    },
    content_title_text: {
        color: '#585858'
    },
    content_img_view: {
        flex:2,
        marginTop: 10,
        flexDirection: 'row',
        minHeight:60,
    },
    content_img_full: {
        flex:1,
        marginLeft:5,
        marginRight:5,
        height:150,
        width:'100%',
        backgroundColor:'#aaa'
    },
    content_img: {
        flex:1,
        marginLeft:5,
        marginRight:5,
        width:'100%',
        maxHeight:200,
        backgroundColor:'#aaa'
    },

    list_bottom_tag: {
        flex: 1,
        height: 30,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    list_icon_text: {
        flex: 1,
        textAlign: 'center',
        fontSize:setFontSize(13),
        color:'#ccc',
        borderLeftWidth:1,
        borderLeftColor:'#ddd'
    },
    list_icon_firsttext: {
        flex: 1,
        textAlign: 'center',
        fontSize:setFontSize(13),
        color:'#ccc',
    },
})
function mapStateToProps(state, ownProps){
    return {
        attention:state.root.user.attention,
        login:state.root.user.login,
        userdata:state.root.user.userdata
    };
}
export default connect(mapStateToProps)(ForumItem);