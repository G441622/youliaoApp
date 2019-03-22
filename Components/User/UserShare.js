import React from 'react';
import { StyleSheet, Text, View, Platform,TextInput,ScrollView ,Image,TouchableOpacity,Modal,FlatList} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import SubHeader from '../Mould/SubHeader';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userShareAction from '../../actions/user/userShareAction';
import SharePlatform from '../../services/SharePlatform';
import UMShare from '../../services/share';
import _ from 'lodash';
import * as commonAction from '../../actions/common/commonAction';
import Images from '../../imagesRequired';

const styles = StyleSheet.create({
    content:{
        flex:1,
        backgroundColor:'white'
    },
    header:{
        marginTop:60,
        justifyContent:'center',
        alignItems:'center',

    },
    giftview:{
        alignItems:'center',
        position:'absolute',
        right:30,
        top:15,

        justifyContent:'center',
        flexDirection:'row'

    },
    gift:{
        color:'#919191',
        fontSize:setFontSize(17),
    },
    gifttext:{
        color:'#919191',
        fontSize:setFontSize(13),
    },
    invitationview:{
        height:120,
        width:150,
        borderRadius:5,
        backgroundColor:'#d34d3d',
        justifyContent:'center'
    },
    invitationtext:{
        fontSize:setFontSize(15),
        color:'white',
        textAlign:'center',
    },
    invitationnumber:{
        fontSize:setFontSize(20),
        color:'white',
        textAlign:'center',
        margin:20,
        paddingBottom:5,
        borderBottomColor:'white',
        borderBottomWidth:1
    },
    header_invitationtext:{
        marginVertical:10,
    },
    shareview:{
        marginTop:10,
        width:150,
        borderRadius:15,
        borderWidth:1,
        borderColor:'#d34d3d'
    },
    sharetext:{
        color:'#d34d3d',
        fontSize:setFontSize(15),
        padding:5,
        textAlign:'center',
        backgroundColor:'transparent'
    },
    line:{
        height:1,
        backgroundColor:'#ddd',
        width:300,
    },
    sharemodalStyle:{
        flex:1,
        backgroundColor: '#0008',
        justifyContent :'flex-end'
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
        color:'#6c6c6c',
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
        borderTopColor:'#ccc',

    },

    list:{
        /*marginTop:10,*/
    },
    integralview:{

    },
    integraltext:{
        fontSize:setFontSize(15),
        padding:15,
        color:'#585858'
    },
    list_view:{
        marginBottom:1,
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center'
    },
    userimg:{
        height:35,
        width:35,
        borderRadius:17,
        marginLeft:15,
    },
    text_title:{
        fontSize:setFontSize(15),
        padding:15,
    },
    text:{
        fontSize:setFontSize(15),
        padding:15,
        color:'#ccc',
        position:'absolute',
        right:0
    },
    angle:{
        fontSize:setFontSize(25),
    },
    commentcanceltext:{
        fontSize:setFontSize(15),
        color:'#6c6c6c',
        padding:5
    },
    input:{
        flexDirection:'row',width:'80%',justifyContent:'center'
    },
    textinput:{
        flex:1,borderWidth:1,borderColor:'#ddd',borderRadius:3,
        ...Platform.select({
            ios:{padding:8}
        })
    },
    getcodeview:{
        width:100, alignItems:'center',justifyContent:'center',backgroundColor:'#d34d3d',borderRadius:3,marginLeft:10
    },
    codetext:{
        fontSize:setFontSize(15),textAlign:"center",color:'white',
    },
    }
);

class UserShare extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader title={'我的分享'} onPress={()=>{navigation.goBack()}} navigation={navigation}/>
        }
    };
    constructor(props, context){
        super(props, context);
        this.state = {
            share:false,
            inputcode:null,
            is_canget:0
        };
        this.onSharePress = this.onSharePress.bind(this)
        this.oninputcodePress=this.oninputcodePress.bind(this)
    }
    componentDidMount() {
        this.props.userShareAction.getShareCode();
        const  input={
            page:1,
            limit:15
        }
        this.props.userShareAction.getShareList({limit:input.limit,page:input.page});
    }
    componentWillReceiveProps(nextProps) {
        let is_canget = _.result(nextProps,'sharecode.is_canget',0)
        if(_.result(nextProps,'exchangecode',0)!=0) is_canget = 1
        this.setState({is_canget})
    }
    onUserCenterPress=(item)=>{
        this.props.navigation.navigate('UserCenter',{userfollow:item});
    }
    onSharePress() {
        let isShow = this.state.share;
        this.setState({
            share:!isShow,
        });
    }
    ongiftPress=()=>{
        this.props.navigation.navigate('UserGift',{});
    }
    oninputcodePress(text){
        var state = Object.assign({},this.state,{
            inputcode:text
        });
        this.setState(state);
    }
    ongetcodePress=()=>{
        this.props.userShareAction.getExchangeCode({code:this.state.inputcode});
    }
    _renderItem = ({item,index})=>{
        let avatar = item.avatar
        if(avatar==''){
            avatar='http://ulapp.cc/data/attached/images/201707/1500885893673766102.jpg'
        }
        return <TouchableOpacity style={styles.list_view} onPress={()=>this.onUserCenterPress(item)}>
            <Image source={{uri:avatar}} style={styles.userimg}></Image>
            <Text style={styles.text_title}>{item.alias}</Text>
            <Text style={styles.text}>{item.integral}</Text>
        </TouchableOpacity>
    }
    _onEndReached = ()=>{
        let list = this.props.sharelist && this.props.sharelist.data ? this.props.sharelist.data : []
        let page = list.hasOwnProperty('presentPage')&&list.presentPage?list.presentPage:0;
        if (!list||!page||list.length<15*page) return;
        console.log('======== UserShare _onEndReached ========');
        const input = {
            page:page+1,
            limit:15,
        };
        this.props.userShareAction.getShareList({limit:input.limit,page:input.page});
    }
    share = (platform)=>{
        let {sharecode} = this.props;
        let title = '你的小伙伴'+sharecode.alias + '送你有料大礼包，速来！';
        let defaultInfo = {
            text:'来自有料客户端',
            image:encodeURI('http://www.ulapp.cc/themes/default/css/bglogo.jpg')
        }
        let text = defaultInfo.text;
        let image =defaultInfo.image;
        let url = `http://www.ulapp.cc/index.php?m=default&c=news&a=user_share&alias=${sharecode.alias}&code=${sharecode.integral_code}`
        UMShare.share(title,text,url,image, platform,
            (code, message) => {
                this.onSharePress()
                if (code==200||code=='分享成功'||message=='分享成功'){
                    this.props.commonAction.showTip('分享成功')
                }
            });
    }
    render() {
        let data = this.props.sharelist && this.props.sharelist.data ? this.props.sharelist.data : []
        let integral_code = this.props.sharecode && this.props.sharecode.hasOwnProperty('integral_code')?this.props.sharecode.integral_code:''
        let avatar = this.props.sharecode && this.props.sharecode.hasOwnProperty('avatar') &&this.props.sharecode.avatar!=''?this.props.sharecode.avatar:'http://ulapp.cc/data/attached/images/201707/1500885893673766102.jpg'
        let alias = this.props.sharecode && this.props.sharecode.hasOwnProperty('alias')?this.props.sharecode.alias:'有料用户'
        let integral_points = this.props.sharecode && this.props.sharecode.hasOwnProperty('integral_points')?this.props.sharecode.integral_points:''
        return (
            <ScrollView style={styles.content} keyboardShouldPersistTaps='handled'>
                <TouchableOpacity style={styles.giftview} disabled={true} onPress={()=>this.ongiftPress()}><Icon name="gift" style={styles.gift}/><Text style={styles.gifttext}>  奖励明细</Text></TouchableOpacity>
                <View style={styles.header}>
                    <View style={styles.invitationview}>
                        <Text style={styles.invitationtext}>我的邀请码</Text>
                        <TextInput underlineColorAndroid={'transparent'} style={styles.invitationnumber} value={integral_code}></TextInput>
                    </View>

                    <TouchableOpacity style={styles.shareview} onPress={this.onSharePress}>
                        <Text style={styles.sharetext}>分享给好友</Text>
                    </TouchableOpacity>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.share}
                        onShow={() => {}}
                        onRequestClose={() => {}} >
                        <TouchableOpacity style={styles.sharemodalStyle} onPress={this.onSharePress}>
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
                    <Text style={styles.header_invitationtext}>您和TA将同时获得150积分</Text>
                    {this.state.is_canget==0?
                    <View style={styles.input}>
                        <TextInput  placeholder="请输入好友邀请码"
                                    placeholderTextColor={'#ccc'}
                                    style={styles.textinput}
                                    value={this.state.inputcode}
                                    onChangeText={this.oninputcodePress}
                                    underlineColorAndroid={'transparent'}
                                    />
                        <TouchableOpacity style={styles.getcodeview} onPress={()=>this.ongetcodePress()}><Text
                            style={styles.codetext}>获取积分</Text></TouchableOpacity>
                    </View>
                    :
                    <Text>已接受邀请</Text>}
                </View>
                <View style={styles.list}>
                    <View style={styles.integral}>
                        <Text style={styles.integraltext}>积分详情</Text>
                    </View>
                    <TouchableOpacity style={styles.list_view} onPress={()=>this.onUserCenterPress(this.props.userdata)}>
                        <Image source={{uri:avatar}} style={styles.userimg}></Image>
                        <Text style={[styles.text_title,{color:'#d34d3d'}]}>{alias}</Text>
                        <Text style={styles.text}>{integral_points}</Text>
                    </TouchableOpacity>
                    <View style={{height:1,backgroundColor:'#ddd'}}/>
                    <FlatList
                        data={data}
                        renderItem={this._renderItem}
                        initialNumToRender={15}
                        keyExtractor={(item, index) => index}
                        keyboardShouldPersistTaps='handled'
                        onEndReached={this._onEndReached}
                        onEndReachedThreshold={0.1}
                        ItemSeparatorComponent={()=><View style={{height:1,backgroundColor:'#ddd'}}/>}//分割线
                    />
                </View>
            </ScrollView>
        );
    }
}

function mapStateToProps(state, ownProps){
    return {
        sharecode: state.root.user.sharecode,
        exchangecode: state.root.user.exchangecode,
        sharelist:state.root.user.sharelist,
        userdata:state.root.user.userdata
    };
}
function mapDispatchToProps(dispatch){
    return {
        userShareAction: bindActionCreators(userShareAction, dispatch),
        commonAction:bindActionCreators(commonAction,dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(UserShare);