import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity , FlatList} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userAction from '../../actions/user/userAction';
import userApi from '../../api/user/userApi';
import * as userFollowAction  from '../../actions/user/userFollowAction';
import userFollowApi from '../../api/user/userFollowApi';
import * as commonAction from '../../actions/common/commonAction';
import SubHeader from '../Mould/SubHeader';
import  _ from  'lodash';
import Images from '../../imagesRequired';


const styles = StyleSheet.create({
    scroll:{
        flex:1,
        backgroundColor:'white',
        borderTopColor:'#ddd',
        borderTopWidth:1
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
class UserFollow extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
                title={'关注'}
                onPress={()=>{navigation.goBack()}}/>
        }
    };
    constructor(props, context){
        super(props, context);
        let {user_id} = this.props.navigation.state.params;
        let userdata = this.props.userdata
        let self = userdata.user_id
        let isSelf = !user_id || user_id==self;
        this.state = {
            showFoot:0,
            input :{
                user_id,
                page:1,
                limit:15
            },
            userfollow:undefined,
            isSelf,
            routeKey:undefined
        }
    }
    componentDidMount() {
        this.state.userfollow==undefined && this.getUserFollow('componentDidMount')
    }
    getUserFollow = (call)=>{
        const input = this.state.input
        userFollowApi.getUserFollow(input).then(responseJson=>{
            if (responseJson.code!=200) return;
            let userfollow = responseJson.info
            this.setState({userfollow,routeKey:this.props.routeKey})
            if(this.state.userfollow.data.length){
                this.setState({showFoot:2})
            }else{
                this.setState({showFoot:1})
            }
        },error=>{
            this.setState({showFoot:1})
            console.log(error)
        })
    }    
    componentWillReceiveProps(nextProps){
        if (this.props.routeName!='UserFollow'&&nextProps.routeName=='UserFollow'&&this.state.routeKey==nextProps.routeKey&&this.state.userfollow){
            this.getUserFollow()
            if (this.state.isSelf){
                this.props.userAction.getUser(this.props.login)
            }
            this.props.commonAction.hideLoading()
        }
    }
    componentWillUnmount() {
        this.props.userAction.getUser(this.props.login)
    }
    onNewsPress = (item)=>{
        this.props.navigation.navigate('UserCenter',{userfollow: item});
    }
    attention = (user_id,index)=>{
        userApi.attention(user_id).then(responseJson=>{
            if (responseJson.code == 200 || responseJson.code == 201){
                let {data,...other} = this.state.userfollow;
                let newData = new Array(...data)
                let isattention = newData[index].isattention
                let nowisattention = (isattention!=0&&!isattention)||isattention==0?1:0
                newData[index] = {...newData[index],isattention:nowisattention}
                this.setState({userfollow:{...other,data:newData}})
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
                    <Text style={{marginTop:10}}>这里还没有内容</Text>
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
        if (!this.state.userfollow||!this.state.userfollow.hasOwnProperty('data')) return;
        if (this.state.userfollow.data.length<this.state.input.limit*this.state.input.page) return;
        console.log('======== UserFollow _onEndReached ========');
        const input = {
            ...this.state.input,
            page:this.state.input.page+1,
        };
        this.setState({input,showFoot:0})
        this.getMoreFollow(input);
    }
    getMoreFollow = (input)=>{
        userFollowApi.getUserFollow(input).then(responseJson=>{
            if (responseJson.code!=200) return;
            let userfollow = responseJson.info
            if (_.result(userfollow,'data.length',0)){
                this.setState({showFoot:2,userfollow:Object.assign({},userfollow,{data:[...this.state.userfollow.data,...userfollow.data]})})
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
        let attentioned = !item.hasOwnProperty('isattention')||item.isattention==0
        let key = item.user_id
        return (
            <TouchableOpacity activeOpacity={1} style={styles.list_conent} onPress={() => this.onNewsPress(item)}>
                <View>
                    <Image source={avatar} style={styles.fans_img}/>
                </View>
                <View style={styles.fans_text}>
                    <View><Text style={styles.fans_name}>{item.alias}</Text></View>
                    <View><Text numberOfLines={1} style={styles.fans_updata}>{item.introduce}</Text></View>
                </View>
                
                <TouchableOpacity style={styles.fans_follow} onPress={()=>this.attention(item.user_id,index)}>
                    <View style={attentioned?styles.unfollow_view:styles.follow_view}>
                        <Text style={attentioned?styles.unfollow_text:styles.follow_text} allowFontScaling={false}>{attentioned?'已关注':'+ 关注'}</Text>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }
    render() {
        let data = this.state.userfollow && this.state.userfollow.hasOwnProperty('data') ?this.state.userfollow.data:[];
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

// export default UserFollow;
function mapStateToProps(state, ownProps){
    return {
        login: state.root.user.login,
        userdata:state.root.user.userdata,
        routeName:state.nav.routeName,
        routeKey :state.nav.key,
        attention:state.root.forum.attention
    };
}
function mapDispatchToProps(dispatch){
    return {
        userAction: bindActionCreators(userAction, dispatch),
        commonAction:bindActionCreators(commonAction,dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(UserFollow);