import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,FlatList} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as messageNoticeAction from '../../actions/message/messageNoticeAction';
import SubHeader from '../Mould/SubHeader';
import MessageList from '../Mould/MessageList';
import  _ from  'lodash';
import Images from '../../imagesRequired';


const styles = StyleSheet.create({
    content:{
        backgroundColor:'white',
        flex:1,
    },
});

class MessageNotice extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader title={'粉丝通知'} onPress={()=>{navigation.goBack()}}/>
        }
    };
    constructor(props, context){
        super(props, context);
        this.state = {
            showFoot:0
        };
    }
    componentDidMount() {
        const input = {
            page:1,
            limit:15
        };
        this.props.messageNoticeAction.getMessageNotice({limit:input.limit,page:input.page});
        this.props.messageNoticeAction.getNoticeDelete();
    }
    onNewsPress = (item)=>{
        this.props.navigation.navigate('UserCenter',{userfollow: item});
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
    _renderItem = ({item,index})=>{
        let avatar = item.avatar
        if(avatar==''){
            avatar='http://ulapp.cc/data/attached/images/201707/1500885893673766102.jpg'
        }
        return <MessageList Data={{...item,add_time:item.time,img:avatar,title:item.alias,author:item.introduce}} onPress={() => this.onNewsPress(item)}/>
    }
    _onEndReached = ()=>{
        let notice = this.props.notice && this.props.notice.data ? this.props.notice.data : []
        let page = notice.hasOwnProperty('presentPage')&&notice.presentPage?notice.presentPage:0;
        if (!notice||!page||notice.length<15*page) return;  
        console.log('======== MessageNotice _onEndReached ========');  
        const input = {
            page:page+1,
            limit:15,
        };
        this.setState({showFoot:0})
        this.props.messageNoticeAction.getMessageNotice({limit:input.limit,page:input.page});
    }
    componentWillReceiveProps(nextProps) {
        if (_.result(nextProps,'notice.data',0) ){
            this.setState({showFoot:2})
        }else{
            this.setState({showFoot:1})
        }
    }
    render() {
        let data = this.props.notice && this.props.notice.data ? this.props.notice.data : []
        return (<View style={styles.content}>
            <FlatList
                style={{paddingHorizontal:20,}}
                data={data}
                renderItem={this._renderItem}//根据行数据data渲染每一行的组件
                initialNumToRender={15}//指定一开始渲染的元素数量
                keyExtractor={(item, index) => index}//每一项的key
                keyboardShouldPersistTaps='handled'
                onEndReached={this._onEndReached}//当列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                onEndReachedThreshold={0.1}//决定当距离内容最底部还有多远时触发onEndReached回调
                ItemSeparatorComponent={()=><View style={{height:1,backgroundColor:'#ddd'}}/>}//分割线
                ListFooterComponent={this._renderFooter}
            />
        </View>);
    }
}
function mapStateToProps(state, ownProps){
    return {
        notice: state.root.message.notice,
    };
}
function mapDispatchToProps(dispatch){
    return {
        messageNoticeAction: bindActionCreators(messageNoticeAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(MessageNotice);