import React from 'react';
import { StyleSheet, Text, View,TextInput,ScrollView ,Image,TouchableOpacity,FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import userReportApi from '../../api/user/userReportApi';
import * as userReportAction from '../../actions/user/userReportAction';
import * as commonAction from '../../actions/common/commonAction';
import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
import { emoticons } from "../../utility/index";
import SubHeader from '../Mould/SubHeader';
const styles = StyleSheet.create({
    content:{
        flex:1,
        backgroundColor:'#f9f9f9'
    },
    title:{
        backgroundColor:'white',
        padding:10,
        /*marginTop:10*/
    },
    comment:{
        padding:10,
    },
    list:{
        flexDirection:'row',
        backgroundColor:'white',
        padding:10
    },
    listitem:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        marginVertical:10
    },
    check:{
        width:15,
        height:15,
        borderRadius:8,
        borderWidth:1,
        borderColor:'#ccc',
        marginHorizontal:10
    },
    button:{
        marginTop:10
    },
    report_button:{
        margin:10,
        borderRadius:5,
        backgroundColor:'#d34d3d',
        alignItems:'center'
    },
    button_text:{
        fontSize:setFontSize(17),
        color:'white',
        textAlign:'center',
        padding:5,
    },
    user_name:{
        color:'#d34d3d'
    },
});

class UserReport extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
                title={'举报'}
                onPress={()=>{navigation.goBack()}}/>
        }
    };
    constructor(props, context){
        super(props, context);
        this.state = {
            report_id:undefined,
            reason:'',
            reportInfo:{name:'',title:'不良信息',report_id:null,type:null}
        };
    }
    componentDidMount() {
        this.props.reportOptions.length == 0 && this.props.userReportAction.userReportOptions();
        this.getData()
    }
    onCheckPress = (report_id,reason)=>{
        this.setState({report_id,reason})
    }
    report = ()=>{
        let params = {...this.state}
        delete params.reportInfo;
        if (!params.report_id) return this.props.commonAction.showTip('请选择一个理由')
        userReportApi.userReport(params)
        .then(result=>{
            if (result.code == 200){
                this.props.navigation.goBack()
            }else{

            }
        },error=>console.log(error))
    }
    getData = ()=>{
        let {type,data={}} = this.props.navigation.state.params;
        let defaultData = {name:'',title:'',report_id:0}
        switch (type) {
            case 'news':{
                let {is_collection=1,is_like=1,news_detail={},news_info={}} = data
                let {category_name='',news_id,news_like,news_source,news_time,news_title} = news_info
                let reportInfo = {name:news_source,title:news_title,report_id:news_id,type} 
                return this.setState({news_id,reportInfo})
            }
            case 'forum':{
                let {id,alias,forum_like,is_collection=1,is_like=1,isfans=1,title,user_id} = data
                let reportInfo = {name:alias,title,report_id:id,type}
                return this.setState({forum_id:id,reportInfo})
            }
            case 'news_comment':{
                let {comment_id,user_name,content} = data;
                let reportInfo = {name:user_name,title:content,report_id:comment_id,type}
                return this.setState({news_commentid:comment_id,reportInfo})
            }
            case 'forum_comment':{
                let {comment_id,user_name,content} = data;
                let reportInfo = {name:user_name,title:content,report_id:comment_id,type}
                return this.setState({forum_commentid:comment_id,reportInfo})
            }
            case 'user':{
                return defaultData;
            }
            default:return defaultData
        }
    }
    _renderItem = ({item,index})=>{
        let {options_id,options_name,check} = item;
        return (
            <TouchableOpacity style={styles.listitem} onPress={()=>this.onCheckPress(options_id,options_name)}>
                <View style={[styles.check,{backgroundColor:check?'#d34d3d':'white'}]}></View>
                <Text>{options_name}</Text>
            </TouchableOpacity>
        )
    }
    render() {
        let {name,title,report_id,type} = this.state.reportInfo
        let data = this.props.reportOptions.map(({options_id,options_name},index)=>{
            return {options_id,options_name,check:this.state.report_id==options_id}
        })
        name = emoticons.parse(name)
        title = emoticons.parse(title)

        return (
            <ScrollView style={styles.content}>
                <View style={styles.title}>
                    <Text>举报<Text style={styles.user_name}> {name} </Text>的发表: </Text>
                </View>
                <View style={styles.comment}>
                    <Text style={styles.user_name}>{name}:</Text>
                    <Text>{title}</Text>
                </View>

                <FlatList
                    data={data}
                    renderItem={this._renderItem}
                    initialNumToRender={10}
                    numColumns={2}
                    keyExtractor={(item, index) => index}
                    keyboardShouldPersistTaps='handled'
                    // ListHeaderComponent={this._renderHeader()}
                    // ItemSeparatorComponent={()=><View style={{height:1,backgroundColor:'#ddd',marginHorizontal:20}}/>}
                />
                <TouchableOpacity style={styles.button} onPress={this.report}>
                    <View style={styles.report_button}>
                        <Text style={styles.button_text}>举报</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}
function mapStateToProps(state, ownProps){
    return {
        reportOptions:state.root.user.reportOptions
    };
}
function mapDispatchToProps(dispatch){
    return {
        userReportAction: bindActionCreators(userReportAction, dispatch),
        commonAction:bindActionCreators(commonAction,dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(UserReport);