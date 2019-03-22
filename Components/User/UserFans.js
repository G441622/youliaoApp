import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity, FlatList} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import userApi from '../../api/user/userApi';
import userFansApi from '../../api/user/userFansApi';
import * as userAction from '../../actions/user/userAction';
import * as commonAction from '../../actions/common/commonAction';
import * as userFansAction  from '../../actions/user/userFansAction';
import * as constStyle from '../StyleConstant';
import SubHeader from '../Mould/SubHeader';
import  _ from  'lodash';
import {store} from '../../App';
import Images from '../../imagesRequired';


const styles = StyleSheet.create({
    scroll:{
        flex:1,
        backgroundColor:'white',
        borderTopColor:'#ddd',
        borderTopWidth:1,
    },
    list_conent:{
        flex:1,
        paddingVertical:10,
        paddingHorizontal:20,
        flexDirection: 'row',
        alignItems:'center',justifyContent:'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        borderStyle: 'solid'
    },
    fans_img:{
        height:50,
        width:50,
        borderRadius:25,
        // borderColor:'black',
        // borderWidth:1,
        alignItems:'center',justifyContent:'center',
    },
    fans_text:{
        flex:1,
        marginLeft:10
    },
    fans_name:{
        fontSize:setFontSize(17),
        color:'#585858',

    },
    fans_updata:{
        paddingTop:5,
        color:'#ccc'
    },
    fans_follow:{
        backgroundColor:'#ddd'
    },
    follow_view:{
        marginRight:0,
        width:70,
        height:25,
        borderRadius:3,
        backgroundColor:'#D34D3D',
        alignItems:'center',justifyContent:'center',
    },
    follow_text:{
        color:'white'
    },
    unfollow_view:{
        marginRight:0,
        width:70,
        height:25,
        borderRadius:3,
        backgroundColor:'white',
        alignItems:'center',justifyContent:'center',
        borderStyle: 'solid',
        borderColor: '#ddd',
        borderWidth: 1
    },
    unfollow_text:{
        color:'#585858'
    }

});


class UserFans extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
                title={'粉丝'}
                onPress={()=>{navigation.goBack()}}/>
        }
    };
    constructor(props, context){
        super(props, context);
        let {user_id,...params} = this.props.navigation.state.params
        this.onNewsPress = this.onNewsPress.bind(this);
        let userdata = this.props.userdata
        let self = userdata.user_id
        let isSelf = self==user_id;
        this.state = {
            showFoot:0,
            input :{
                user_id,
                page:1,
                limit:15
            },
            userfans:null,
            self,
            isSelf,
            routeKey:undefined
        }
    }
    componentDidMount() {
        this.getUserFans()
    }
    componentWillReceiveProps(nextProps) {
        // return;
        // 上层返回该页面 且 为用户自己的粉丝页
        if (this.state.routeKey==nextProps.routeKey&&nextProps.routeName=='UserFans'&&this.state.userfans){
            this.getUserFans()
            // this.props.userAction.getUser(this.props.login)
            this.props.commonAction.hideLoading()
        }

    }
    componentWillUnmount() {
        this.props.userAction.getUser(this.props.login)
    }
    getUserFans = ()=>{
        userFansApi.getUserFans(this.state.input).then(responseJson=>{
            if (responseJson.code != 200) return;
            let userfans = responseJson.info;
            this.setState({userfans,routeKey:this.props.routeKey})
            if(this.state.userfans.data.length){
                this.setState({showFoot:2})
            }else{
                this.setState({showFoot:1})
            }
        },error=>{
            this.setState({showFoot:1})
            console.log(error)
        })
    }
    onNewsPress(item){
        this.props.navigation.navigate('UserCenter',{userfollow: item});
    }
    attention = (user_id,index)=>{
        userApi.attention(user_id).then(responseJson=>{
            if (responseJson.code == 200 || responseJson.code == 201){
                let {data,...other} = this.state.userfans;
                let newData = new Array(...data)
                let isattention = newData[index].isattention
                let nowisattention = isattention==0?1:0
                newData[index] = {...newData[index],isattention:nowisattention}
                this.setState({userfans:{...other,data:newData}})
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
            marginTop:50
        }
        if (this.state.showFoot == 0){
            return (
                <View style={footer}>
                    <Text style={{marginTop:10}}>加载中...</Text>
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
        if (!this.state.userfans||!this.state.userfans.hasOwnProperty('data')) return;
        if (this.state.userfans.data.length<this.state.input.limit*this.state.input.page) return;
        console.log('======== UserFans _onEndReached ========');
        const input = {
            ...this.state.input,
            page:this.state.input.page+1,
        };
        this.setState({input,showFoot:0})
        this.getMoreFans(input);
    }
    getMoreFans = (input)=>{
        userFansApi.getUserFans(input).then(responseJson=>{
            if (responseJson.code!=200) return;
            let userfans = responseJson.info;
            if (_.result(userfans,'data.length',0)){
                this.setState({showFoot:2,userfans:{...userfans,data:[...this.state.userfans.data,...userfans.data]}})
            }else{
                this.setState({showFoot:2})
            }
        },error=>{
            this.setState({showFoot:2})
            console.log(error)
        })
    }
    renderItem = ({item,index})=>{
        let avatar = item.avatar&&item.avatar!=''? {uri:item.avatar} : Images.defaultAvatar;
        let attentioned = item.isattention==0
        let key = item.user_id
        return (
            <TouchableOpacity  activeOpacity={1} style={styles.list_conent} onPress={() => this.onNewsPress(item)}>
                <View>
                    <Image source={avatar} style={styles.fans_img}/>
                </View>
                <View style={styles.fans_text}>
                    <View><Text style={styles.fans_name}>{item.alias}</Text></View>
                    <View><Text numberOfLines={1} style={styles.fans_updata}>{item.introduce}</Text></View>
                </View>
                {this.state.self!=item.user_id&&
                <TouchableOpacity style={styles.fans_follow} onPress={()=>this.attention(item.user_id,index)}>
                    <View style={attentioned?styles.unfollow_view:styles.follow_view}>
                        <Text style={attentioned?styles.unfollow_text:styles.follow_text} allowFontScaling={false}>{attentioned?'已关注':'+ 关注'}</Text>
                    </View>
                </TouchableOpacity>}
            </TouchableOpacity>
        )
    }
    render() {
        let data = this.state.userfans && this.state.userfans.data ?this.state.userfans.data:[];
        return (
            <FlatList
                style={{backgroundColor:'white'}}
                data={data}
                renderItem={this.renderItem}
                initialNumToRender={10}
                keyExtractor={(item, index) => index}
                keyboardShouldPersistTaps='handled'
                onEndReached={this._onEndReached}
                onEndReachedThreshold={0.1}
                ListFooterComponent={this._renderFooter}
            />
        );
    }
}

// export default UserFans;
function mapStateToProps(state, ownProps){
    return {
        routeKey :state.nav.key,
        routeName:state.nav.routeName,
        login: state.root.user.login,
        userdata:state.root.user.userdata
    };
}
function mapDispatchToProps(dispatch){
    return {
        userAction: bindActionCreators(userAction, dispatch),
        commonAction:bindActionCreators(commonAction,dispatch) 
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(UserFans);