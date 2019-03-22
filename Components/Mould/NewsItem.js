import React,{Component} from 'react';
import { StyleSheet, Text, View ,TextInput,ScrollView,Image ,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Article,ListTitle} from '../CustomComponents/CustomText';
import { connect } from "react-redux";
import {emoticons} from '../../utility/index';
import _ from 'lodash';
import { CustomHeadersImage } from "../CustomComponents/CustomImage";

const styles = StyleSheet.create({
    news_list_content:{
        backgroundColor:'white',
        paddingTop:10,
        paddingBottom:10,
        marginBottom:1
    },
    img_one_view:{
        flex:1,
        height:60,
    },
    img_three_view:{
        flex:3,
        flexDirection: 'row',
        height:60,
        marginTop:5,
        marginBottom:5
    },
    flex_2:{
        flex:1,
        flexDirection:'row'
    },
    news_list_titleview:{
        flex:2,
    },
    news_list_title:{
        color:'#585858',
    },
    news_list_tag:{
        flex:1,
        marginTop:8,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    list_icon_text:{
        fontSize:setFontSize(12),
        marginRight:15,
        color:'#ddd',
        maxWidth:100
    },
    news_list_img:{
        flex:1,
        marginLeft:5,
        marginRight:5,
        backgroundColor:'#aaa'
    },
    news_list_img_one:{
        flex:1,
        marginLeft:10,
        backgroundColor:'#aaa'
     },
    line:{
        height:1,
        backgroundColor:'#ddd',
        marginLeft:20,
        marginRight:20,
    },
});

class NewsItem extends Component {
    constructor(props, context){
        super(props, context);
    }
    render() {
        let {news_title,commentcount,news_time,news_source,cover_url,news_id} = this.props.data;
        let rightImage = <View/>,bottomImage = <View/>
        if (cover_url && Array.isArray(cover_url) && cover_url.length) {
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
        cover_url && Array.isArray(cover_url) && cover_url.length
        ? (cover_url.length < 3 
            ? rightImage = <View style={styles.img_one_view}><CustomHeadersImage resizeMode='cover' resizeMethod='resize' style={styles.news_list_img_one} source={{uri:cover_url[0]}} /></View>
            : bottomImage = <View style={styles.img_three_view}>{cover_url.map((image,index)=>index>2?null:<CustomHeadersImage key={index} resizeMode='cover' resizeMethod='resize' source={{uri:image}} style={styles.news_list_img}/>)}</View>) 
        : null;
        news_title = news_title? emoticons.parse(news_title):''
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={()=>this.props.onContentPress(this.props.data)}>
                <View style={styles.news_list_content}>
                    <View style={styles.flex_2}>
                        <View style={styles.news_list_titleview}>
                            <ListTitle style={styles.news_list_title} numberOfLines={2}>{news_title}</ListTitle>
                        </View>
                        {rightImage}
                    </View>
                    {bottomImage}
                    <View style={styles.news_list_tag}>
                        <Text style={styles.list_icon_text} numberOfLines={1}>{news_source}</Text>
                        <Text style={styles.list_icon_text}><Icon name="commenting-o" />  {commentcount}</Text>
                        <Text style={styles.list_icon_text}><Icon name="clock-o" />  {news_time}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
function mapStateToProps(state,ownProps) {
    return {
        login:state.root.user.login,
        userdata:state.root.user.userdata
    }
}
export default connect()(NewsItem);