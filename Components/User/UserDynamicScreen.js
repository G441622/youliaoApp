import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity,FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userDynamicAction  from '../../actions/user/userDynamicAction';
import * as userAction  from '../../actions/user/userAction';
import SubHeader from '../Mould/SubHeader';
import ForumItem from '../Mould/ForumItem';
import  _ from  'lodash';
import Images from '../../imagesRequired';

const styles = StyleSheet.create({
    content:{
        backgroundColor:'#f9f9f9',
        flex:1
    },
    list:{
        backgroundColor:'white',
        paddingHorizontal:20,
        paddingVertical:10,
        marginBottom:5,
    },

    delete_view: {
        flex: 1,
        /*justifyContent: 'flex-end',*/
        alignItems: 'flex-end'
    },
    delete_icon:{
        color:'#CCC',
        fontSize:setFontSize(15),
    },
});


class UserDynamicScreen extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
                title={'我的动态'}
                onPress={()=>{navigation.goBack()}}/>
        }
    };
    constructor(props, context){
        super(props, context);
        this.state = {
            page:1,
            showFoot:1
        };
    }
    componentDidMount() {
        const input = {
            page:1,
            limit:15
        };
        this.props.userDynamicAction.getUserDynamic({page:input.page,limit:input.limit});
    }

    componentWillUnmount() {
        this.props.userAction.getUser(this.props.login)
    }
    componentWillReceiveProps(nextProps) {
        if (_.result(nextProps,'userdynamic.newsData.length',0) ){
            this.setState({showFoot:0})
        }
    }
    onUserPress=(item)=>{
        this.props.navigation.navigate('UserCenter',{userfollow: item});
    }
    onNewsPress=(item)=>{
        this.props.navigation.navigate('ForumDetailScreen',{forum: item});
    }
    onDeleteForumPress=(item,index)=>{
        this.props.userDynamicAction.getUserDynamicDelete({forum_id:item.id},index);
    }
    _renderFooter = ()=>{
        let footer = {
            justifyContent:'center',
            alignItems:'center',
            marginTop:50
        }
        if (this.state.showFoot == 1) {
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
        let x=item;
        let i=index;
        let avatar = item.avatar
        if(avatar==''){
            avatar='http://ulapp.cc/data/attached/images/201707/1500885893673766102.jpg'
        }
        return (
            <View key={i}  style={styles.list}>
                <TouchableOpacity style={styles.delete_view} onPress={()=>this.onDeleteForumPress(x,i)}>
                    <Icon name="trash-o"style={styles.delete_icon}/>
                </TouchableOpacity>
                <ForumItem data={{...x,avatar:avatar}}  onContentPress={()=>this.onNewsPress(x)} onUserPress={()=>this.onUserPress(x)}/>
            </View>
        )
    }
    _onEndReached = ()=>{
        let data = this.props.userdynamic && this.props.userdynamic.newsData ? this.props.userdynamic.newsData : []
        // console.log(data)
        if (data.length<15*this.state.page) return;
        console.log('======== UserDynamicScreen _onEndReached ========');
        let currentPage = this.state.page;
        currentPage += 1
        console.log(this.state.page,currentPage)
        const input = {
            page:currentPage,
            limit:15,
        };
        this.setState({page:currentPage})
        this.props.userDynamicAction.getUserDynamic({page:input.page,limit:input.limit});
    }
    render() {
        let data = this.props.userdynamic && this.props.userdynamic.newsData ? this.props.userdynamic.newsData : []
        return (<View style={styles.content}>
            <FlatList
                data={data}
                renderItem={this._renderItem}
                initialNumToRender={15}
                keyExtractor={(item, index) => index}
                keyboardShouldPersistTaps='handled'
                onEndReached={this._onEndReached}
                ListFooterComponent={this._renderFooter}
                onEndReachedThreshold={0.1}
            />
        </View>);
    }
}



function mapStateToProps(state, ownProps){
    return {
        userdynamic: state.root.user.userdynamic,
        login: state.root.user.login,
    };
}
function mapDispatchToProps(dispatch){
    return {
        userDynamicAction: bindActionCreators(userDynamicAction, dispatch),
        userAction: bindActionCreators(userAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(UserDynamicScreen);