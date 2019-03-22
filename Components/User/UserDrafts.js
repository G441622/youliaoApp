import React from 'react';
import { StyleSheet, Text, View, FlatList,TextInput,ScrollView ,Image, TouchableOpacity} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserHeader from './UserHeader';
import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
import * as userAction from '../../actions/user/userAction';
import moment from 'moment';
import SubHeader from '../Mould/SubHeader';
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
        padding:10,
        marginBottom:5
    },

    user_view: {
        flex: 1,
        flexDirection: 'row'
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
        color: '#585858'
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
        flexDirection: 'row',
        padding:5,
        borderTopWidth:1,
        borderTopColor:'white',
    },
    news_list_content_three:{
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
    news_list_titleview:{
        flex:3,
        /*justifyContent: 'center',
        alignItems: 'center',*/
    },
    news_list_title:{
        color:'#585858',
        marginRight:10,
        fontSize:setFontSize(15),
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
        flex:1,
        height:65,
        margin:5
    },
    news_list_img_view:{
        /* marginTop:5,*/
        flex:1,
        flexDirection: 'row',
    },
});



class UserDrafts extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
                title={'草稿箱'}
                onPress={()=>{navigation.goBack()}}/>
        }
    };
    onSelect = (item,index)=>{
        this.props.navigation.navigate('WriteArticle',{isDraft:true,index,draft:item})
    }
    remove = (item,index)=>{
        this.props.userAction.removeDrafts(item,index)
    }
    _renderItem = ({item,index})=>{
        let {title,article,time} = item;
        let date = moment(time)
        let timeString = date.format('MM/DD  HH:mm')
        let text,image;
        for (let index = 0; index < article.length; index++) {
            const content = article[index];
            if (content.type=='text') text=content.data;
            if (content.type=='image')image=content.data;
            if (text&&image) break;
        }
        return (
            <TouchableOpacity key={index} style={styles.list} onPress={()=>this.onSelect(item,index)}>
                <View style={styles.user_view}>
                    <View style={styles.user_text}>
                        <Text style={styles.user_time}>{timeString}</Text>
                    </View>
                    <TouchableOpacity style={styles.delete_view} onPress={()=>this.remove(item,index)}>
                        <Icon name="trash-o"style={styles.delete_icon}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.news_list_content}>
                    <View style={styles.flex_2}>
                        <View style={styles.news_list_titleview}>
                            <Text style={[styles.news_list_title,title&&{color:'#ddd'}]} numberOfLines={2}>{title?title:'标题'}</Text>
                            <Text style={styles.news_list_title} numberOfLines={2}>{text}</Text>
                        </View>
                    </View>
                    {image&&<View style={styles.flex_1}>
                        <Image style={styles.news_list_img_one} source={{uri:image}} />
                    </View>}
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <FlatList
                data={this.props.drafts}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => index}
            />
        )
    }
}
function mapStateToProps(state, ownProps){
    return {
        drafts:state.root.user.drafts
    };
}
function mapDispatchToProps(dispatch){
    return {
        userAction: bindActionCreators(userAction,dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(UserDrafts);