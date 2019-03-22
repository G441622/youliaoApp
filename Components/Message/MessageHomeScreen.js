import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity,Modal} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import MessageNavigation from './MessageNavigation';

const styles = StyleSheet.create({
    content:{
        backgroundColor:'#f9f9f9'
    },
    userContainer:{
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#f6f6f6',
        padding: 8,
        paddingLeft:20,
        paddingRight:20,
        flexDirection:'row',
    },
    userText:{
        color:'#585858',
        fontSize:setFontSize(15),
        flex:1
    },
    userText_icon:{
        color:'#D34D3D',
        fontSize:setFontSize(15)
    },
    angleright:{
        /*flex:1,*/
        color:'#ddd',
        fontSize:setFontSize(25)
    },
    userTitleText:{
        fontSize:setFontSize(16),
        padding:10,
        paddingLeft:20,
        color:'#585858',
        marginTop:5,
        backgroundColor:'#fff',
    },
    system_list:{
        marginTop:10,
    },
    img_view:{
        flex:1,
    },
    user_img:{
      width:50,
      height:50,
      borderRadius:8,
    },
    content_view:{
        flex:4,
        justifyContent: 'center',
    },
    name_text:{
        color:'#585858',
        fontSize:setFontSize(15),

    },
    chat_text:{
        marginTop:2

    },
    time_view:{
        justifyContent: 'center',
    },
});
class MessageHomeScreen extends React.Component {
    render() {
        return (
            <View>
                <MessageNavigation
                    onCommentPress={this.props.onCommentPress}
                    onCollectionPress={this.props.onCollectionPress}
                    onReplyPress={this.props.onReplyPress}
                    onNoticePress={this.props.onNoticePress}
                    onBulletinPress={this.props.onBulletinPress}
                    onContactusPress={this.props.onContactusPress}
                />
            </View>
        );
    }
}
export default MessageHomeScreen;