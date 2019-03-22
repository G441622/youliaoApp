import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as messageNoticeAction from '../../actions/message/messageNoticeAction';
import * as newsReplyAction from '../../actions/message/newsReplyAction';
import Images from '../../imagesRequired';


const styles = StyleSheet.create({
    MainContainer: {
        backgroundColor: 'white',

    },
    content:{
        justifyContent:'center',
        flexDirection:'row',
        alignItems:'center',
        marginTop:10,
    },
    view:{
        flex:1,
        alignItems:'center',
    },
    textview:{
        marginTop:10,justifyContent:'center',alignItems:'center'
    },
    text:{
        textAlign:'center',
        padding:5,
        fontSize:setFontSize(12),
    },
    numberview:{
        position:'absolute',
        right:35,
        backgroundColor:'#d34d3d',
        width:25,
        height:25,
        borderRadius:13,
        justifyContent:'center',
        alignItems:'center',
    },
    numbertext:{
        color:'white',
        fontSize:setFontSize(20),

    }

});
class MessageNavigation extends React.Component {
    componentDidMount() {
        if (this.props.login){
            this.props.messageNoticeAction.getNoticeNumber();
            this.props.newsReplyAction.getReplyNumber();
        }
    }
    render(){
        var noticenumber = this.props.message && this.props.message.hasOwnProperty('noticenumber')?this.props.message.noticenumber:null;
        var replynumber = this.props.message && this.props.message.hasOwnProperty('replynumber')?this.props.message.replynumber:0;
        if (!this.props.login){
            noticenumber = null
            replynumber = 0
        }
        return (<View style={styles.MainContainer}>
            <View style={styles.content}>
                <TouchableOpacity style={styles.view} onPress={this.props.onCommentPress}>
                    <View style={styles.textview}>
                    <Image source={Images.pinglunActive} style={{width:23,height:23}}/>
                    <Text style={styles.text}>我的评论</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.view}onPress={this.props.onCollectionPress}>
                    <View style={styles.textview}>
                    <Image source={Images.shoucang} style={{width:23,height:23}}/>
                    <Text style={styles.text}>我的收藏</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.view}onPress={this.props.onReplyPress}>
                    {replynumber==0?<View></View>:<View style={styles.numberview}><Text style={styles.numbertext}>{replynumber}</Text></View>}
                    <View style={styles.textview}>
                    <Image source={Images.huifu} style={{width:25,height:25}}/>
                    <Text style={styles.text}>回复通知</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <TouchableOpacity style={styles.view}onPress={this.props.onBulletinPress}>
                    <View style={styles.textview}>
                    <Image source={Images.gonggao} style={{width:25,height:25}}/>
                    <Text style={styles.text}>公告</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.view}onPress={this.props.onContactusPress}>
                    <View style={styles.textview}>
                    <Image source={Images.lianxi} style={{width:25,height:25}}/>
                    <Text style={styles.text}>联系我们</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.view}onPress={this.props.onNoticePress}>
                    {noticenumber==null?<View></View>:<View style={styles.numberview}><Text style={styles.numbertext}>{noticenumber}</Text></View>}
                    <View style={styles.textview}>
                        <Image source={Images.myfans} style={{width:23,height:23}}/>
                        <Text style={styles.text}>粉丝通知</Text>
                    </View>
                </TouchableOpacity>
            </View>

        </View>);
    }
}
function mapStateToProps(state, ownProps){
    return {
        message: state.root.message,
        login:state.root.user.login
    };
}
function mapDispatchToProps(dispatch){
    return {
        messageNoticeAction: bindActionCreators(messageNoticeAction, dispatch),
        newsReplyAction: bindActionCreators(newsReplyAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(MessageNavigation);