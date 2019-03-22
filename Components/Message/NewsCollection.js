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
import * as newsCollectionAction from '../../actions/message/newsCollectionAction';
import SubHeader from '../Mould/SubHeader';
import NewsItem from '../Mould/NewsItem';
import ForumItem from '../Mould/ForumItem';
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
        flexDirection: 'row',
        marginBottom:5
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
        flex:10,
        flexDirection: 'row',
        alignItems: 'center',
        /*backgroundColor:'black'*/
    },
    user_name: {
        fontSize:setFontSize(15),
        color: 'black'
    },
    user_time: {
        fontSize:setFontSize(12),
        color: '#D34D3D',
        paddingLeft:5,
    },
    delete_view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    delete_icon:{
        color:'#CCC',
        fontSize:setFontSize(15),
    },
    comment:{
        padding:5,
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
        borderTopColor:'white',
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
         color:'#585858',
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
    news_img_view:{
        flex:1,
    },
    news_list_img_one:{
        height:65,
    },
});

class NewsCollection extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
                title={'我的收藏'}
                onPress={()=>{navigation.goBack()}}/>
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
        this.props.newsCollectionAction.replaceData();
        this.props.newsCollectionAction.getNewsCollection({limit:input.limit,page:input.page,action:'news'});
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
        this.props.newsCollectionAction.replaceData();
        this.props.newsCollectionAction.getNewsCollection({limit:input.limit,page:input.page,action:'forum'});

    }

    componentDidMount() {
        const input = {
            page:1,
            limit:15
        };
        this.props.newsCollectionAction.getNewsCollection({limit:input.limit,page:input.page,action:'news'});
    }
    componentWillReceiveProps(nextProps) {
        let length = _.result(nextProps,'newscollection.newsData.length',0)
        if (length){
            this.setState({showFoot:2})
        }else{
            this.setState({showFoot:1})
        }
    }
    componentWillUnmount() {
        this.props.newsCollectionAction.replaceData();
    }
    onNewsPress=(item)=>{
        this.props.navigation.navigate('NewsDetail',{news: {...item,category:'详情'}});
    }
    onForumPress=(item)=>{
        this.props.navigation.navigate('ForumDetailScreen',{forum: {...item,category:'详情'}});
    }
    onUserPress=(item)=>{
        this.props.navigation.navigate('UserCenter',{userfollow:item});
    }
    onCollectionDelectPress=(content,index)=>{
        this.state.shownews==true?this.props.newsCollectionAction.getNewsCollectionNewsDelect({news_id:content.news_id},index):this.props.newsCollectionAction.getNewsCollectionForumDelect({forum_id:content.forum_id},index)
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
    _onEndReached = ()=>{
        let data = this.props.newscollection && this.props.newscollection.newsData ? this.props.newscollection.newsData : []
        if (data.length<15*this.state.page) return;
        console.log('======== MessageNewsCollection _onEndReached ========');
        let currentPage = this.state.page;
        currentPage += 1
        console.log(this.state.page,currentPage)
        const input = {
            page:currentPage,
            limit:15,
        };
        this.setState({page:currentPage,showFoot:0})
        this.state.shownews==true
            ? this.props.newsCollectionAction.getNewsCollection({limit:input.limit,page:input.page,action:'news'})
            : this.props.newsCollectionAction.getNewsCollection({limit:input.limit,page:input.page,action:'forum'});
    }
    _renderItem = ({item,index})=>{
        let x=item;
        let i=index;
        if(this.state.shownews==true){
            // 新闻
            if (!x||x.collection_time==null||x.news_id==null) return null;
            return <View style={styles.list} >
                    <View style={styles.user_view}>
                        <View style={styles.user_text}>
                            <Text style={styles.user_time}>{x.collection_time}</Text>
                        </View>
                        <TouchableOpacity style={styles.delete_view}onPress={()=>this.onCollectionDelectPress(item,index)}>
                            <Icon name="trash-o"style={styles.delete_icon}/>
                        </TouchableOpacity>
                    </View>
                <NewsItem data={x} onContentPress={()=>this.onNewsPress(x)}/>
                </View>
        }else{
            // 论坛
            if (!x||x.collection_time==null||x.collection_id==null) return null;
            return <View style={styles.list} >
                    <View style={styles.user_view}>
                        <View style={styles.user_text}>
                            <Text style={styles.user_time}>{x.collection_time}</Text>
                        </View>
                        <TouchableOpacity style={styles.delete_view}onPress={()=>this.onCollectionDelectPress(item,index)}>
                            <Icon name="trash-o"style={styles.delete_icon}/>
                        </TouchableOpacity>
                    </View>
                    <ForumItem data={{...x,commentcount:x.commentcount,isfans:x.isfan}}  onContentPress={()=>this.onForumPress(x)} onUserPress={()=>this.onUserPress(item)}/>
                </View>
        }
    }
    render() {
        let data = this.props.newscollection && this.props.newscollection.newsData ? this.props.newscollection.newsData : []
        return (<View style={styles.content}>
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
            </View></View>);
    }
}
function mapStateToProps(state, ownProps){
    return {
        newscollection: state.root.message.newscollection
    };
}
function mapDispatchToProps(dispatch){
    return {
        newsCollectionAction: bindActionCreators(newsCollectionAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(NewsCollection);