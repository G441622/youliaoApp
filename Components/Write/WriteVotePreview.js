import React,{Component} from 'react';
import { StyleSheet, Text, View,TextInput,ScrollView ,Image,TouchableOpacity,Modal} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from '../CustomComponents/CheckBox';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as commonAction  from '../../actions/common/commonAction';
import SubHeader from '../Mould/SubHeader';

const styles = StyleSheet.create({
    content:{
        flex:1,
        backgroundColor:'white',
        padding:10,
        borderTopWidth:0.5,
        borderTopColor:'#ccc',
    },
    top:{
        flex:1,
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
class WriteVotePreview extends Component {
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
            mode:0,
            ...props.vote,
        };
    }
    componentDidMount = () => {
    }
    componentWillReceiveProps(nextProps){
        this.setState({...nextProps.vote})
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
                                    <Text style={styles.title_text} underlineColorAndroid="transparent">{this.state.options[key]}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                )}
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
                        onClick={()=>{}}
                        isChecked={this.state.mode==0}
                        leftText='单选'
                        checkBoxColor='#8a8a8a'
                    /></View>
                    <View style={styles.checkview}><CheckBox
                        style={styles.checkbox}
                        onClick={()=>{}}
                        isChecked={this.state.mode==1}
                        leftText='多选'
                        checkBoxColor='#8a8a8a'
                    /></View>
                </View>
            </View>
        )
    }
    _renderTimelimit = ()=>{
        return (
            <View style={styles.time}>
                <Text style={{fontSize:setFontSize(18), color:"#585858",marginTop:10}}>投票有效期 :</Text>
                <View style={{flexDirection:'row',marginTop:10}}>
                    <View style={styles.checkview}><CheckBox
                        style={styles.checkbox}
                        onClick={()=>{}}
                        isChecked={this.state.timelimit==0}
                        leftText='一周'
                        checkBoxColor='#8a8a8a'
                    /></View>
                    <View style={styles.checkview}><CheckBox
                        style={styles.checkbox}
                        onClick={()=>{}}
                        isChecked={this.state.timelimit==1}
                        leftText='一个月'
                        checkBoxColor='#8a8a8a'
                    /></View>
                    <View style={styles.checkview}><CheckBox
                        style={styles.checkbox}
                        onClick={()=>{}}
                        isChecked={this.state.timelimit==2}
                        leftText='三个月'
                        checkBoxColor='#8a8a8a'
                    /></View>
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={styles.top}>
                <Text style={{fontSize:setFontSize(18), color:"#585858",marginTop:10,marginLeft:10}}>标题 :</Text>
                <View style={styles.title}>
                    <View style={styles.title_view}>
                        <Text style={styles.title_text} underlineColorAndroid="transparent">{this.state.vote_title}</Text>
                    </View>
                </View>
                {this._renderOptions()}
                {this._renderSetting()}
                {this._renderTimelimit()}
            </View>
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

export default connect(mapStateToProps,mapDispatchToProps)(WriteVotePreview);