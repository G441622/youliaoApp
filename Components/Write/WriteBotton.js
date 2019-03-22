import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity,Modal,Animated} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Images from '../../imagesRequired';


const styles = StyleSheet.create({
    bottom:{
        height:40,
        flexDirection: 'row',
        backgroundColor:'white',
        borderTopWidth:1,
        borderTopColor:'#ccc',
    },
    separate:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon:{
        fontSize:setFontSize(20),
        textAlign:'center',
        color:'#505050',
    },
    text:{
        fontSize:setFontSize(13),
        textAlign:'center',
        color:'#8a8a8a',
        marginLeft:5,

    },
    line:{
        width:1,
        height:25,
        position:'absolute',
        right:0,
        backgroundColor:'#ddd',
    },
    modalStyle: {
        flex:1,
        backgroundColor: '#0008',
    },
    sharemodalStyle:{
        flex:1,
        backgroundColor: '#0008',
        justifyContent :'flex-end'
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
        padding:3,
        marginRight:10,
        width:70,
        marginBottom:10,
    },
    publish:{
        padding:3,
        backgroundColor:'#d34d3d',
        marginRight:10,
        marginBottom:10,
        borderRadius:5,
        width:70,

    },
    commentcanceltext:{
        fontSize:setFontSize(15),
        color:'#505050',
    },
    commentpublishtext:{
        fontSize:setFontSize(15),
        color:'white',
        textAlign:'center'
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
        color:'#505050',
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
        borderTopColor:'#ddd',

    },

});

class WriteBotton extends React.Component {
    render() {
        return (<Animated.View style={[styles.bottom,this.props.style]}>
            <TouchableOpacity style={styles.separate} onPress={this.props.addImage}><Image source={Images.tupian} style={{width:20,height:20}}/><Text style={styles.text}>图片</Text>
                <View style={styles.line}></View></TouchableOpacity>
            <TouchableOpacity style={styles.separate} onPress={this.props.addVideo}><Image source={Images.shipin} style={{width:20,height:20}}/><Text style={styles.text}>视频</Text>
                <View style={styles.line}></View></TouchableOpacity>
            <TouchableOpacity style={styles.separate} onPress={this.props.addLocation}><Image source={Images.weizhi} style={{width:20,height:20}}/><Text style={styles.text}>位置</Text>
                <View style={styles.line}></View></TouchableOpacity>
            <TouchableOpacity style={styles.separate} onPress={this.props.onVotePress}><Image source={Images.toupiao} style={{width:20,height:20}}/><Text style={styles.text}>投票</Text></TouchableOpacity>

        </Animated.View>);
    }
}

export default WriteBotton;