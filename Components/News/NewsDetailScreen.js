import React from 'react';
import { StyleSheet, Text, View, Image,Platform, TextInput, ScrollView,TouchableOpacity,Modal,Dimensions, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import NewsReply from "./NewsReply";
import NewsReplyItem from "./NewsReplyItem";
import NewsRecommend from "./NewsRecommend";
import DetailNavigator from "./DetailNavigator";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import newsDetailApi from '../../api/news/newsDetailApi';
import newsReplyApi from '../../api/news/newsReplyApi';
import newsRecommendApi from '../../api/news/newsRecommendApi';
import {Article,ListTitle} from '../CustomComponents/CustomText';
import SubHeader from '../Mould/SubHeader';
import Gallery from "react-native-image-gallery";
import { CustomImage } from "../CustomComponents/CustomImage";
import _ from 'lodash';
import moment from 'moment';

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
    flex_8: {
        flex: 8,
    },
    news: {
        margin: 20,
        marginTop:10,
        marginBottom:10,
    },
    news_title_view: {
        flex: 1,
        /*marginTop: 10*/
    },
    news_title_text: {
        color:'black',
        fontSize:setFontSize(20),
        fontWeight: 'bold'
    },
    news_user_img: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15
    },
    news_user_name: {
        fontSize:setFontSize(15),
    },
    news_user_time: {
        fontSize:setFontSize(10)
    },
    follow_view: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    follow_view_content: {
        width: 50,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#D34D3D'
    },
    follow_view_text: {
        fontSize:setFontSize(15),
        color: 'white'
    },
    content:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:10,
    },
    news_content_view: {
        width: '100%',
        marginVertical:10
    },
    news_content_text: {
        fontSize:setFontSize(16),
    },
    news_content_img: {
        width:'100%',
        backgroundColor:'#aaa'
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

class NewsDetailScreen extends React.Component {
    static navigationOptions = ({navigation})=>{
        let {params={}} = navigation.state;
        let category_name = params.category;
        return {
            header:<SubHeader
                title={['新闻·',category_name?category_name:'详情']}
                onPress={()=>{navigation.goBack()}}
                onCategoryPress={()=>{
                    navigation.navigate('主页',{category_name})
                }}
                />
        }
    };
    constructor(props, context){
        super(props, context);
        this.state = {
            newsDetail:undefined,
            newsReply:undefined,
            newsRecommend:undefined,
            imageDetail:false,
            initialPage:0,
            input:{
                page:1,
                limit:15,
                childcount:10,
                news_id:this.props.navigation.state.params.news.news_id
            },
            addNewsReply:[],
            showCommentInput:false,
            comment:null,
            index:undefined
        }
    }
    componentDidMount() {
        this.getNewsDetail()
        this.getNewsRecommend()
        this.getNewsReply()
    }
    
    componentWillReceiveProps(nextProps) {

    }
    getNewsDetail = ()=>{
        newsDetailApi.getNewsDetail({news_id:this.props.navigation.state.params.news.news_id})
        .then(responseJson=>{
            if (responseJson.code == 200) this.setState({newsDetail:responseJson.info})
            let newsDetail = responseJson.info;
            let {setParams} = this.props.navigation
            var category_name = newsDetail&&newsDetail.hasOwnProperty('news_info')
            &&newsDetail.news_info.hasOwnProperty('category_name')?newsDetail.news_info.category_name:''
            if (setParams) setParams({category:category_name})
        },error=>console.log(error))
        newsReplyApi.getNews
    }
    getNewsReply = ()=>{
        let news_id = this.state.input.news_id
        newsReplyApi.getNewsReply(news_id,this.state.input).then(responseJson=>{
            if (responseJson.code==200) {
                this.setState({newsReply:responseJson.info})
            }
        },error=>console.log(error))
    }
    addNewsReply = (newNewsReply)=>{
        let { newsReply = {} } = this.state;
        let { DataTotal=0, data=[] } = newsReply;
        this.setState({newsReply:Object.assign({},this.state.newsReply,{DataTotal:Math.floor(DataTotal)+1,data:[newNewsReply,...data]})})
        // this.refreshReply()
    }
    getMoreNewsReply = ()=>{
        const input = {
            ...this.state.input,
            page:this.state.newsReply.PresentPage+1,
        }
        let news_id = input.news_id
        this.setState({input})
        newsReplyApi.getNewsReply(news_id,input).then(responseJson=>{
            if (responseJson.code==200) this.setState({newsReply:{...responseJson.info,data:[...this.state.newsReply.data,...responseJson.info.data]}})
        },error=>console.log(error))
    }
    getNewsRecommend = ()=>{
        newsRecommendApi.getNewsRecommend(this.props.navigation.state.params.news).then(responseJson=>{
            if (responseJson.code==200) this.setState({newsRecommend:responseJson.info})
        },error=>console.log(error))
    }
    onCommentPress = (comment,index)=>{
        this.setState({showCommentInput:true,comment,index})
    }
    onCommentCancelPress = ()=> {
        this.setState({showCommentInput:false,comment:null});
    }
    onCommentActivePress = ()=> {
        let {comment_id,user_id} = this.state.comment
        let news_id = this.state.input.news_id
        let content = this.refs.commentInput._lastNativeText
        if (!content||content==''||!news_id) return;
        let params = {
            commented_userid:user_id,
            pid:comment_id,
            content,
            news_id
        }
        newsReplyApi.newsReply(params).then(responseJson=>{
            if (responseJson.code==200) {
                // this.getNewsReply()
                let { userdata } = this.props;
                let { newsReply = {} } = this.state;
                let { data=[] } = newsReply;
                let changeComment = data[this.state.index];
                let newComment = {...responseJson.info,avatar:userdata.avatar,user_name:userdata.alias,islike:1,likecount:'0',time:moment().format('YYYY-MM-DD HH:mm:ss')}                
                let commentchild = changeComment.commentchild?changeComment.commentchild:{}
                // let {}
                changeComment.commentchild = {DataTotal:Math.floor(_.result(commentchild,'DataTotal',0))+1,data:[newComment,...(_.result(commentchild,'data',[]))]}
                let newData = new Array(...data)
                newData[this.state.index] = changeComment
                
                let newNewsReply = JSON.parse(JSON.stringify({...newsReply,data:newData}))
                this.setState({newsReply:newNewsReply,comment:null,index:undefined})
            }
        },error=>console.log(error))
        this.setState({showCommentInput:false});
    }
    onUserReplyPress = (comment)=>{
        comment.news_id = this.state.input.news_id
        this.props.navigation.navigate('NewsUserReply',{comment});
    }
    onUserPress = (user_id)=>{
        this.props.navigation.navigate('UserCenter',{userfollow:{user_id}})
    }
    onReportPress = ()=>{
        if (!this.state.newsDetail) return;
        this.props.navigation.navigate('UserReport',{type:'news',data:this.state.newsDetail});
    }
    onNewsPress = (item)=>{
        this.props.navigation.navigate('NewsDetail',{news: item});
    }
    _renderHeader = ()=>{
        let news = this.props.navigation.state.params.news;
        let images = [];
        let news_source = _.result(this.state,'newsDetail.news_info.news_source','')
        let time = _.result(this.state,'newsDetail.news_info.news_time','') 
        let is_collection= _.result(this.state,'newsDetail.is_collection',1) 
        let news_detail = _.uniq(_.result(this.state,'newsDetail.news_detail',[]));
        let DataTotal = _.result(this.state,'newsReply.DataTotal',0)
        let newsDetailContent = news_detail.length 
        ? news_detail.map((x,i)=>{
            if(x.newsdetail_type=='text'){
                let contentText = x.newsdetail_newscontent
                if (!contentText||contentText=='') return null;
                return<View key={i}><Article style={styles.news_content_text}>{contentText}</Article></View>
            }else if(x.newsdetail_type=='image'){
                let uri = x.newsdetail_newscontent
                uri = uri.replace(/\s/g,'').replace(/\"/g,'').replace(/&amp;/g,'&');
                if (uri) uri=uri.replace(/.*(https?.*)(\.[jpg|jpeg|png|gif|bmp|webp|psd])(.*)/i,'$1$2$3')
                let source = uri && typeof (uri) == 'string' ? (uri.indexOf('http')!=-1?{uri}:{uri:'http://www.ulapp.cc'+uri}):null;
                if (source==null) return null;
                let initialPage = images.length;
                images.push({source})
                return (
                    <TouchableOpacity key={i} style={styles.news_content_view} activeOpacity={1} onPress={()=>{this.setState({imageDetail:true,initialPage})}}>
                        <CustomImage resizeMode="contain" style={styles.news_content_img} source={source}/>
                    </TouchableOpacity>
                )
            }
        })
        :<View style={{justifyContent:'center',alignItems:'center',padding:20}}><Text>加载中...</Text></View>;

        return (
            <View style={{flex:1}}>
                <View style={styles.news}>
                    <View style={styles.news_title_view}>
                        <Text style={styles.news_title_text}>{news.news_title}</Text>
                    </View>
                    <View style={{flex:1,flexDirection: 'row',padding:5,backgroundColor:'#fcfcfc'}}>
                        <View style={styles.flex_8}>
                            <Text style={styles.news_user_name}>{news_source}   {time} </Text>
                        </View>
                    </View>
                    <View style={styles.content}>
                        {newsDetailContent}
                    </View>
                    <TouchableOpacity style={{height:40,alignSelf:'flex-end'}} onPress={this.onReportPress}>
                        <Text style={{fontSize:setFontSize(15)}}><Icon name="exclamation-triangle" style={styles.triangle}/>  举报 </Text>
                    </TouchableOpacity>
                </View>
                <NewsRecommend newsRecommend={this.state.newsRecommend} onNewsPress={this.onNewsPress}/>
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
        return (
            <View style={{paddingHorizontal:20}}>
                <NewsReplyItem comment={item} index={index} news_id={this.state.input.news_id} onUserPress={this.onUserPress} onUserReplyPress={this.onUserReplyPress} onCommentPress={this.onCommentPress} navigation={this.props.navigation}/>
            </View>
        )
    }
    _onEndReached = ()=>{
        let data = _.result(this.state,'newsReply.data',[]);
        if (!data.length||data.length<this.state.input.page*this.state.input.limit) return;
        console.log('======== NewsDetailScreen _onEndReached ========');
        this.getMoreNewsReply()
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
        let news_detail = _.uniq(_.result(this.state,'newsDetail.news_detail',[]));;
        news_detail.map((content)=>{
            if (_.result(content,'newsdetail_type','')!='image') return;
            let uri = content.newsdetail_newscontent;
            uri = uri.replace(/\s/g,'').replace(/\"/g,'').replace(/&amp;/g,'&');
            if (uri) uri=uri.replace(/.*(https?.*)(\.[jpg|jpeg|png|gif|bmp|webp|psd])(.*)/i,'$1$2$3')
            let source = uri && typeof (uri) == 'string' ? (uri.indexOf('http')!=-1?{uri}:{uri:'http://www.ulapp.cc'+uri}):null;
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
                <View scrollEnabled={false} style={{flex:1}}>
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
        let news = this.props.navigation.state.params.news;
        let news_source = _.result(this.state,'newsDetail.news_info.news_source','')
        let time = _.result(this.state,'newsDetail.news_info.news_time','') 
        let is_collection= _.result(this.state,'newsDetail.is_collection',1) 
        let data = _.result(this.state,'newsReply.data',[])
        data = new Array(...this.state.addNewsReply,...data)
        data = _.uniq(data,'comment_id')
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
                {this.state.newsDetail&&this.state.newsReply!=undefined&&<DetailNavigator newsDetail={this.state.newsDetail} newsReply={this.state.newsReply} addNewsReply={this.addNewsReply}/>}
                {this._renderCommentInput()}
                {this._renderGallery()}
            </View>
        )
    }
    renderError = ()=>{
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
        userdata : state.root.user.userdata
    };
}
function mapDispatchToProps(dispatch){
    return {
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(NewsDetailScreen);