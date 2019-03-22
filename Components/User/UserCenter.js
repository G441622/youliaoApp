import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity,FlatList} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as UserCenterAction  from '../../actions/user/UserCenterAction';
import * as commonAction from "../../actions/common/commonAction";
import userApi from '../../api/user/userApi';
import userFansApi from '../../api/user/userFansApi';
import UserCenterApi from '../../api/user/UserCenterApi';
import Loading from "../Mould/Loading";
import * as constStyle from '../StyleConstant';
import ForumItem from '../Mould/ForumItem';
import  _ from  'lodash';
import SubHeader from '../Mould/SubHeader';
import Images from '../../imagesRequired';


const styles = StyleSheet.create({
    content:{
        flex:1,
        backgroundColor:'#f9f9f9',
        marginTop:-constStyle.headerHeight
    },
    user_header:{
        paddingTop:constStyle.headerHeight,
        backgroundColor:'#d34d3d',
    },
    header_background:{
        position:'absolute',
        width:'100%',
        height:'120%',
        resizeMode:'cover',
    },
    userbase:{
        flexDirection:'row',
        padding:20,
        paddingTop:30,
    },
    userbase_imgview:{
        justifyContent:'center'
    },
    user_img:{
        height:60,
        width:60,
        borderRadius:30,
    },
    userbase_content:{
        marginLeft:20,
    },
    user_name:{
        flex:1
    },
    user_nametext:{
        fontSize:setFontSize(20),
        color:'white',
        textAlign:'center',
        backgroundColor:'#0000',
    },
    follow_fans:{
        paddingTop:5,
        flexDirection:'row',
        width:100,
    },
    follow_fanstext:{
        color:'white',
        backgroundColor:'#0000'
    },
    follow:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    fans:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },

    userbase_follow:{
        position:'absolute',
        right:20,
        bottom:20,
    },
    followview:{
        width:70,
        height:30,
        backgroundColor:'white',
        borderRadius:5,
        justifyContent:'center'
    },
    followtext:{
        color:'#d34d3d',
        fontSize:setFontSize(15),
        textAlign:'center'
    },
    autograph:{
        flexDirection:'row',
        flex:1,
       /* borderBottomWidth:1,
        borderBottomColor:'#ddd',*/
        backgroundColor:'white'
    },
    autographview:{
        margin:10,
        marginRight:20,
        marginLeft:20,
        justifyContent:'center',
        flex:1,
    },
    autographtext:{
        fontSize:setFontSize(15),

    },
    chatview:{
        width:70,
        height:30,
        borderColor:'#d34d3d',
        borderWidth:1,
        borderRadius:5,
        justifyContent:'center',
        margin:10,
    },
    chattext:{
        fontSize:setFontSize(15),
        color:'#d34d3d',
        textAlign:'center'
    },
    listcontent:{
        backgroundColor:'white'
    },
    list:{
        padding:15,
        paddingBottom:0,
        paddingTop:0,
        marginTop:2,
        backgroundColor:'white'
    },
    news_list_content:{
        flexDirection: 'row',
        padding:5,
        /*borderBottomWidth:1,
        borderBottomColor:'white',*/
    },
    flex_2:{
        flex:2,
    },
    flex_3:{
        flex:3,
    },
    news_list_title:{
        marginRight:10,
        color:'#585858',
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
        width:110,
    },
    news_list_imgview:{
        flexDirection:'row'
    },

});

class UserCenter extends React.Component {
    static navigationOptions = ({navigation})=>{
        let headerTintColor='white'
        let headerStyle = {
            height:constStyle.headerHeight,
            backgroundColor:'transparent'
        }
        return {
            header:<SubHeader navigation={navigation} headerStyle={headerStyle} headerTintColor={headerTintColor}/>
        }
    };
    constructor(props, context){
        super(props, context);
        this.onForumPress = this.onForumPress.bind(this);
        this.onFansPress = this.onFansPress.bind(this);
        let login = this.props.login;
        let {user_id,...params} = this.props.navigation.state.params.userfollow;
        let isSelf = !login ||!user_id || user_id==this.props.userdata.user_id;
        this.state = {
            showFoot:0,
            presentPage:0,
            currentOffset:0,
            showLoading: true,
            input:{
                user_id,
                page:1,
                limit:15
            },
            userdata:undefined,
            isSelf
        };
    }
    onUserPress=()=>{
        this.props.commonAction.showTip('当前页面')
    }
    onForumPress(item){
        this.props.navigation.navigate('ForumDetailScreen',{forum: item});
    }
    onFansPress(){
        let {user_id,...params} = this.props.navigation.state.params.userfollow
        this.props.navigation.navigate('UserFans',{user_id});
    }
    onFollowPress= ()=>{
        let {user_id,...params} = this.props.navigation.state.params.userfollow
        this.props.navigation.navigate('UserFollow',{user_id});
    }
    componentDidMount() {
        let {user_id,...params} = this.props.navigation.state.params.userfollow
        UserCenterApi.getUserData({user_id}).then(responseJson=>{
            if (responseJson.code==200){
                let userdata = responseJson.info;
                this.setState({userdata})
            }
            
        },error=>{
            console.log(error)
        })  
        UserCenterApi.getUserForum(this.state.input).then(responseJson=>{
            if (responseJson.code==200){
                let userforum = responseJson.info
                this.setState({userforum,showLoading:false})
                if(_.result(this.state,'userforum.data.length',0)){
                    this.setState({showFoot:2})
                }else{
                    this.setState({showFoot:1})
                }
            }else{
                this.setState({showFoot:1})
            }
        },error=>{
            this.setState({showFoot:1})
            console.log(error)
        })
    }
    attention = ()=>{
        let user_id = this.state.input.user_id;
        userApi.attention(user_id).then(responseJson=>{
            if (responseJson.code == 200||responseJson.code==201){
                let {isfans,...other} = this.state.userdata;
                let nowIsfans = isfans==0?1:0
                this.setState({userdata:{...other,isfans:nowIsfans}})
            }else{
                this.props.commonAction.showTip('操作失败,请重试')
            }
        },error=>{
            console.log(error)
        })
    }
    _renderFooter = ()=>{
        let footer = {
            justifyContent:'center',
            alignItems:'center',
            marginTop:10
        }
        if (this.state.showFoot == 1) {
            return (
                <View style={footer}>
                    <Image source={Images.nodata} style={{width:100,height:100}}/>
                    <Text style={{marginTop:20}}>没有更多内容...</Text>
                </View>
            );
        }else if (this.state.showFoot == 0){
            return (
                <View style={footer}>
                    <Text>加载中...</Text>
                </View>
            );
        }else{
            return null;
        }
    }
    _renderItem = ({item,index})=>{
        let avatar=item.avatar
        if(avatar==''){
            avatar='http://ulapp.cc/data/attached/images/201707/1500885893673766102.jpg'
        }
        let isfans = this.state.userdata && this.state.userdata.hasOwnProperty('isfans')?this.state.userdata.isfans:1

        return <View style={{marginHorizontal:20}} key={index}><ForumItem  data={{...item,avatar:avatar,isfans:isfans}} hide={true}  onContentPress={this.onForumPress} onUserPress={this.onUserPress}/></View>
    }
    _onEndReached = ()=>{
        var data = this.state.userforum && this.state.userforum.data && this.state.userforum.data.length ? this.state.userforum.data : []
        var page = this.state.userforum && this.state.userforum.PresentPage? this.state.userforum.PresentPage : 1
        if (data.length<15*page) return;
        console.log('======== UserCenter _onEndReached ========');
        let {user_id,...params} = this.props.navigation.state.params.userfollow;
        const input = {
            user_id,
            page:page+1,
            limit:15,
        };
        this.setState({showFoot:0})
        UserCenterApi.getUserForum(input).then(responseJson=>{
            if (responseJson.code!=200) return this.setState({showFoot:1});
            if (_.result(responseJson,'info.data',[]).length==0) return this.setState({showFoot:1});
            let userforum = {...responseJson.info,data:[...this.state.userforum.data,...responseJson.info.data]}
            this.setState({userforum,showLoading:false,showFoot:2})
        },error=>{
            console.log(error)
            return this.setState({showFoot:1});
        })
    }
    _renderHeader = ()=>{
        var userName = this.state.userdata && this.state.userdata.hasOwnProperty('alias')?this.state.userdata.alias:'用户登录'
        var userSign = this.state.userdata && this.state.userdata.hasOwnProperty('introduce')&&this.state.userdata.introduce?this.state.userdata.introduce:'有态度，有意思'
        var follow_count = this.state.userdata && this.state.userdata.hasOwnProperty('follow_count')?this.state.userdata.follow_count:0
        var fans_count = this.state.userdata && this.state.userdata.hasOwnProperty('fans_count')?this.state.userdata.fans_count:0
        var isfans = this.state.userdata && this.state.userdata.hasOwnProperty('isfans')?this.state.userdata.isfans:1
        var avatar = this.state.userdata && this.state.userdata.hasOwnProperty('avatar')&&this.state.userdata.avatar&&this.state.userdata.avatar!=''?{uri:this.state.userdata.avatar}:Images.defaultAvatar;
        var backgroundImage = this.state.userdata && this.state.userdata.hasOwnProperty('background_image')&&this.state.userdata.background_image&&this.state.userdata.background_image!=''?{uri:this.state.userdata.background_image}:undefined;
        return (
            <View style={styles.user_header}>
                {backgroundImage!=undefined&&<Image source={backgroundImage} style={styles.header_background} onLoad={()=>console.log('background load')}/>}
                <View style={styles.userbase}>
                    <View style={styles.userbase_imgview}>
                        <Image style={styles.user_img} source={avatar}/>
                    </View>
                    <View style={styles.userbase_content}>
                        <View style={styles.user_name}>
                            <Text style={styles.user_nametext} numberOfLines={1}>{userName}</Text>
                        </View>
                        <View style={styles.follow_fans}>
                            <TouchableOpacity style={styles.follow} onPress={this.onFollowPress} disabled={!follow_count}>
                                <Text style={styles.follow_fanstext}>{follow_count}</Text>
                                <Text style={styles.follow_fanstext}>关注</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.fans} onPress={this.onFansPress} disabled={!fans_count}>
                                <Text style={styles.follow_fanstext}>{fans_count}</Text>
                                <Text style={styles.follow_fanstext}>粉丝</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {!this.state.isSelf&&<TouchableOpacity style={styles.userbase_follow} onPress={this.attention}>
                        <View style={styles.followview}>
                            <Text style={styles.followtext} allowFontScaling={false}>{isfans==0?'已关注':'+ 关注'}</Text>
                        </View>
                    </TouchableOpacity>}
                </View>
                <View style={styles.autograph}>
                    <View style={styles.autographview}>
                        <Text style={styles.autographtext}>签名: {userSign}</Text>
                    </View>
                    {/*<View style={styles.chatview}>
                        <Text style={styles.chattext}>聊天</Text>
                    </View>*/}
                </View>
            </View>
        )
    }

    render() {
        var data = this.state.userforum && this.state.userforum.data && this.state.userforum.data.length ? this.state.userforum.data : []
        return (
            <View style={styles.content}>
                <FlatList
                    style={{backgroundColor:'white'}}
                    data={data}
                    renderItem={this._renderItem}
                    initialNumToRender={15}
                    keyExtractor={(item, index) => index}
                    keyboardShouldPersistTaps='handled'
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={0.1}
                    ListHeaderComponent={this._renderHeader()}
                    ItemSeparatorComponent={()=><View style={{height:1,backgroundColor:'#ddd',marginHorizontal:20}}/>}
                    ListFooterComponent={this._renderFooter}
                />
            </View>
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
        commonAction:bindActionCreators(commonAction,dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(UserCenter);