import React from 'react';
import { StyleSheet, Text, View, Platform,TextInput,ScrollView ,Image,TouchableOpacity,Modal} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from '../CustomComponents/CheckBox';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as commonAction  from '../../actions/common/commonAction';
import SubHeader from '../Mould/SubHeader';
const styles = StyleSheet.create({
    content:{
        flex:1,
        padding:10,
        backgroundColor:'white',
    },
    contentContainer:{
        width:'100%',
        height:'100%'
    },
    title:{
        flex:1
    },
    title_view:{
        borderBottomWidth:0.8,
        borderBottomColor:'#ccc',
        /*  borderRadius:5,*/
    },
    title_text:{
        color:'black',
        padding:0,
        paddingLeft:10,
        fontSize:setFontSize(15),
        ...Platform.select({
            ios:{
                marginBottom:8,
                marginTop:12
            }
        })
    },
    choice:{
        margin:10
    },
    choice_view:{
        flexDirection:'row',alignItems:'center',marginTop:5
    },
    choice_number:{
        fontSize:setFontSize(15), color:'#585858',width:30,
    },
    setting:{
        margin:10,
    },
    checkview:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    checkbox:{
        width:70,

    },
    time:{
        margin:10,
        marginTop:0,
    },
    voteButton:{
        width: 150,
        height: 35,
        borderRadius: 2,
        backgroundColor: '#d34d3d',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
class WriteVote extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
                title={'投票'}
                onPress={()=>{navigation.goBack()}}/>
        }
    };
    constructor(props, context){
        super(props, context);
        this.state = {
            vote_title:'',
            options:['','',''],
            timelimit:0,
            mode:0
        };
    }
    componentDidMount = () => {
        let {params = {}} = this.props.navigation.state
        if (params.hasOwnProperty('vote') && params.vote) {
            try {
                this.setState({...params.vote})
            } catch (error) {
                
            }
        }
    }
    
    setVote = ()=>{
        try {
            var options=[]
            let vote_title = this.state.vote_title
            if (!vote_title || vote_title=='') return  this.props.commonAction.showTip('需要填写标题')
            this.state.options.map((option,index)=>{
                if (option && option != ''){
                    options.push(option)
                }
            })
            if (options.length<2) return this.props.commonAction.showTip('至少填写两个选项')
            if (this.state.mode==null) returnthis.props.commonAction.showTip('请填写选项设置')
            if (this.state.timelimit==null) return this.props.commonAction.showTip('请填写有效时间')
            let vote = Object.assign({},this.state,{options})
            let {setVote} = this.props.navigation.state.params;
            setVote && setVote(vote)
            this.props.navigation.goBack()
        } catch (error) {
            this.props.commonAction.showTip('请检查')
        }
    }
    onExpiryDatePress = (timelimit)=>{
        if (this.state.timelimit==timelimit) this.setState({timelimit:null})
        else this.setState({timelimit})
    }
    onSettingPress = (mode)=>{
        if (this.state.mode==mode) this.setState({mode:null})
        else this.setState({mode})
    }
    addOptions = ()=>{
        var options = this.state.options;
        this.setState({options:[...options,'']})
    }
    reduceOptions = ()=>{
        var options = this.state.options;
        if (options.length<=2) return this.props.commonAction.showTip('请至少填写两项')
        options.pop()
        this.setState({options})
    }
    _renderTitle = ()=>{
        return (
            <View style={styles.title}>
                <Text style={{fontSize:setFontSize(18), color:"#585858",marginTop:10,marginLeft:10,}}>标题 :</Text>
                <View style={styles.title_view}>
                    <TextInput ref='titleInput' value={this.state.vote_title.toString()} onChangeText={(vote_title)=>this.setState({vote_title})} placeholder="" style={styles.title_text} underlineColorAndroid="transparent"/>
                </View>
            </View>
        )
    }
    _renderOptions = ()=>{
        return (
            <View style={styles.choice}>
                <Text style={{fontSize:setFontSize(18), color:"#585858",marginTop:10}}>投票选项 :</Text>
                {this.state.options.map((option,index)=>{
                    let key = index
                    return (
                        <View style={styles.choice_view} key={key}>
                            <Text style={styles.choice_number}>{`${key+1} . `}</Text>
                            <View style={styles.title}>
                                <View style={styles.title_view}>
                                    <TextInput  
                                        ref={`option${key}`} 
                                        value={this.state.options[key].toString()}
                                        onChangeText={option=>{
                                            let options = this.state.options;
                                            options[key] = option;
                                            this.setState({options})
                                        }} 
                                        placeholder="" 
                                        style={styles.title_text} 
                                        underlineColorAndroid="transparent"/>
                                </View>
                            </View>
                        </View>
                    )}
                )}
                <View style={[styles.choice_view]}>
                    <Text style={{marginTop:20}}>至少填写两项</Text>
                    <TouchableOpacity style={{marginTop:20,marginLeft:20,justifyContent:'center'}} onPress={this.addOptions}><Text
                        style={{fontSize:setFontSize(25)}}>+</Text></TouchableOpacity>
                    <TouchableOpacity style={{marginTop:20,marginLeft:20}} onPress={this.reduceOptions}><Text  style={{fontSize:setFontSize(40)}}>-</Text></TouchableOpacity>
                </View>
            </View>
        )
    }
    _renderSetting = ()=>{
        return (
            <View style={styles.setting}>
                <Text style={{fontSize:setFontSize(18), color:"#585858",marginTop:10}}>选项设置 :</Text>
                <View style={{flexDirection:'row',marginTop:10}}>
                <View style={styles.checkview}><CheckBox
                    style={styles.checkbox}
                    onClick={()=>this.onSettingPress(0)}
                    isChecked={this.state.mode==0}
                    leftText='单选'
                    checkBoxColor='#8a8a8a'
                /></View>
                <View style={styles.checkview}><CheckBox
                    style={styles.checkbox}
                    onClick={()=>this.onSettingPress(1)}
                    isChecked={this.state.mode==1}
                    leftText='多选'
                    checkBoxColor='#8a8a8a'
                /></View></View>
            </View>
        )
    }
    _renderTime = ()=>{
        return (
            <View style={styles.time}>
                <Text style={{fontSize:setFontSize(18), color:"#585858",marginTop:10}}>投票有效期 :</Text>
                <View style={{flexDirection:'row',marginTop:10}}>
                    <View style={styles.checkview}><CheckBox
                        style={styles.checkbox}
                        onClick={()=>this.onExpiryDatePress(0)}
                        isChecked={this.state.timelimit==0}
                        leftText='一周'
                        checkBoxColor='#8a8a8a'
                    /></View>
                    <View style={styles.checkview}><CheckBox
                        style={styles.checkbox}
                        onClick={()=>this.onExpiryDatePress(1)}
                        isChecked={this.state.timelimit==1}
                        leftText='一个月'
                        checkBoxColor='#8a8a8a'
                    /></View>
                    <View style={styles.checkview}><CheckBox
                        style={styles.checkbox}
                        onClick={()=>this.onExpiryDatePress(2)}
                        isChecked={this.state.timelimit==2}
                        leftText='三个月'
                        checkBoxColor='#8a8a8a'
                    /></View>
                </View>
            </View>
        )
    }
    _renderCommit = ()=>{
        return (
            <View style={{alignItems:'center',marginTop:10,marginBottom:50}}>
                <TouchableOpacity style={styles.voteButton} onPress={this.setVote}>
                    <Text style={{color: 'white', fontSize:setFontSize(18), textAlign: 'center'}}>发起</Text>
                </TouchableOpacity>
            </View>
        )
    }
    render() {
        return (
            <ScrollView style={styles.content} keyboardShouldPersistTaps='handled'>
                {this._renderTitle()}
                {this._renderOptions()}
                {this._renderSetting()}
                {this._renderTime()}
                {this._renderCommit()}
            </ScrollView>
        );
    }
}
function mapStateToProps(state, ownProps){
    return {
    };
}
function mapDispatchToProps(dispatch){
    return {
        commonAction: bindActionCreators(commonAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(WriteVote);