import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as messageBulletinAction from '../../actions/message/messageBulletinAction';
import Loading from "../Mould/Loading";
import SubHeader from '../Mould/SubHeader';
import MessageList from '../Mould/MessageList';
const styles = StyleSheet.create({
    content:{
        backgroundColor:'white',
        flex:1,
    },

});

class MessageBulletin extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
            title={'公告'}
            onPress={()=>{navigation.goBack()}}/>
        }
    };
    constructor(props, context) {
        super(props, context);
        this.state = {
            presentPage:0,
            currentOffset:0,
            showLoading: false,
            showending:false,
            data:[0,0,0,0,0,0]
        };
        this.onBulletinPress = this.onBulletinPress.bind(this);
            this.onScroll = this.onScroll.bind(this);
    }
    onBulletinPress(item){
        this.props.navigation.navigate('BulletinDetail',{Bulletin: item});
    }
    componentDidMount() {
        const input = {
            page:1,
            limit:15
        };
        this.props.messageBulletinAction.getMessageBulletin({limit:input.limit,page:input.page});
    }
    onScroll(evt){
        if(evt.nativeEvent.contentOffset.y > this.state.currentOffset)
        {
            this.state.currentOffset = evt.nativeEvent.contentOffset.y;
            const input = {
                page:this.props.bulletin.presentPage+1,
                limit:15
            };
                if(this.props.bulletin.presentPage==this.props.bulletin.PageCount){
                    this.setState({
                        showending:true,
                        showLoading:false
                    });
                }else{
                    this.props.messageBulletinAction.getMessageBulletin({limit:input.limit,page:input.page});
                }
        }
    }
    render() {
        var loading = this.state.showLoading==true ?
            <Loading />:<View></View>;
        var ending = this.state.showending==true ?
            <Text style={{textAlign:'center',marginTop:30}}>加载完成</Text>:<View></View>;
        var content = this.props.bulletin && this.props.bulletin.bulletinData ?
            this.props.bulletin.bulletinData.map(
                (x,i)=> {
                        return <MessageList
                            key={i}
                            Data={{...x,add_time:x.add_time}}
                            onPress={() => this.onBulletinPress(x)}/>
                }
            ) :
            <View></View>;
        return (<ScrollView style={styles.content} onScroll={this.onScroll}>
            <View style={{backgroundColor:'#f9f9f9',marginLeft:20,marginRight:20}}>
                {content}
            </View>
            {loading}
            {ending}
        </ScrollView>);
    }
}
function mapStateToProps(state, ownProps){
    return {
        bulletin: state.root.message.bulletin,
    };
}
function mapDispatchToProps(dispatch){
    return {
        messageBulletinAction: bindActionCreators(messageBulletinAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(MessageBulletin);