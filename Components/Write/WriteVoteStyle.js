import React from 'react';
import { StyleSheet, Text, View, AppRegistry, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import CheckBox from '../CustomComponents/CheckBox';
import * as Progress from 'react-native-progress';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import forumApi from '../../api/forum/forumApi'
import userApi from '../../api/user/userApi';
import {emoticons} from '../../utility/index';
import Images from '../../imagesRequired';


const styles = StyleSheet.create({

});

const vote = { 
    vote_id: '7',
    vote_forumid: '2256',
    vote_title: 'w',
    vote_selectmode: '1',
    valid_timelimit: '0',
    vote_time: '1510983082',
    vote_userid: '35',
    is_vote: 1,
    option: [   
        { vote_optionid: '18', vote_option: 'w', count: '1' },
        { vote_optionid: '19', vote_option: 'w', count: '1' },
        { vote_optionid: '20', vote_option: 'w', count: '1' } 
    ] 
} 

class WriteVoteStyle extends React.Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            cid:1,
            mode:0,
            vote_title:null,
            options:[],
            timelimit:0,
            radio:null,
            multiselect:[],
            is_over:false
        }
        this.onVotepress = this.onVotepress.bind(this)
    }
    onVotepress(){
        let {vote_selectmode} = this.props.vote;
        let result = []
        if (vote_selectmode==0){
            // 单选 radio
            if (!this.state.radio) return alert('未选择')
            result = [this.state.radio]
        }else if(vote_selectmode==1){
            // 多选 multiselect
            for (let index = 0; index < this.state.multiselect.length; index++) {
                const select = this.state.multiselect[index];
                const option_id = this.props.vote.option[index].vote_optionid
                if (select) result.push(option_id);
            }
            if (!result.length) return alert('未选择')
        }
        userApi.vote(JSON.stringify(result)).then(responseJson=>{
            if (responseJson.code==200) {
                this.setState({is_over:true})
                this.props.refreshDetial()
            }
        },error=>console.log(error))
    }
    _radioItem = (option)=>{
        if (this.state.radio && this.state.radio == option) return this.setState({radio:null})
        this.setState({radio:option})
    }
    _renderRadio = ()=>{
        // 单选
        let radio = this.state.radio;
        let options = this.props.vote.option;
        let contents = options.map((option,index)=>{
            let key = index;
            return (
                <View style={styles.checkview} key={key}>
                    <CheckBox
                        style={{marginTop:10}}
                        onClick={()=>this._radioItem(option.vote_optionid)}
                        isChecked={radio==option.vote_optionid}
                        rightText={emoticons.parse(option.vote_option)}
                        checkedImage={<Image source={Images.is_check} style={{width:15,height:15}}/>}
                        unCheckedImage={<Image source={Images.is_uncheck} style={{width:15,height:15}}/>}
                    />
                </View>
            )
        })
        return (
            <View>
                {contents}
            </View>
        )
    }
    _multiselectItem = (index)=>{
        let multiselect = this.state.multiselect;
        multiselect[index] = !multiselect[index]
        this.setState({multiselect})
    }
    _renderMultiselect = ()=>{
        // 多选
        let multiselect = this.state.multiselect;
        let options = this.props.vote.option;
        let contents = options.map((option,index)=>{
            let key = index;
            return (
                <View style={styles.checkview} key={key}>
                    <CheckBox
                        style={{marginTop:10}}
                        onClick={()=>this._multiselectItem(key)}
                        isChecked={this.state.multiselect[key]}
                        rightText={emoticons.parse(option.vote_option)}
                        checkedImage={<Image source={Images.is_check} style={{width:15,height:15}}/>}
                        unCheckedImage={<Image source={Images.is_uncheck} style={{width:15,height:15}}/>}
                    />
                </View>
            )
        })
        return (
            <View>
                {contents}
            </View>
        )
    }
    _renderResult = ()=>{
        let options = this.props.vote.option;

        let total = 0;
        for (let index = 0; index < options.length; index++) {
            const option = options[index];
            total += parseInt(option.count);
        }
        let contents = options.map((option,index)=>{
            let key = index;
            let progress = total == 0 ? 0 : option.count/total + 0.01;
            let number = total == 0 ? 0 : option.count/total*100;
            return (
                <View style={{paddingVertical:10}} key={key}>
                    <Text numberOfLines={2}>{`${key+1} . ${emoticons.parse(option.vote_option)} （${option.count}票 ${number}% ）` }</Text>
                    <Progress.Bar progress={progress} width={200} color={'#d34d3d'} style={{marginTop:5}}/>
                </View>
            )
        })
        return (
            <View>
                {contents}
            </View>
        )
    }
    render() {
        let {vote_title,vote_selectmode,valid_timelimit,vote_time,vote_userid,is_vote,option,is_over} =  this.props.vote;
        vote_title = emoticons.parse(vote_title)
        let showResult = is_vote==0||is_over==1||this.state.is_over;
        return (
            <View style={[{backgroundColor:'white',justifyContent:'center',alignItems:'center',borderTopColor:'#ddd',borderTopWidth:1,padding:10,marginTop:10},this.props.style]}>
                <View style={{width:'95%'}}>
                    <Text style={{fontSize:setFontSize(18)}}>{`${vote_title}`}</Text>
                <View>
                    {showResult ? this._renderResult() : (vote_selectmode==0 ? this._renderRadio() : this._renderMultiselect())}
                </View>
                {!showResult && <View style={{alignItems:'center'}}>
                    <TouchableOpacity onPress={this.onVotepress}   style={{width:100,height:30,backgroundColor:'#d34d3d',alignItems:'center',justifyContent:'center',borderRadius:3}}>
                        <Text style={{textAlign:'center',fontSize:setFontSize(15),color:'white'}}>投票</Text>
                    </TouchableOpacity>
                </View>}
                </View>
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
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(WriteVoteStyle)