import React, { Component , cloneElement} from 'react'
import { Text, View , StyleSheet, PixelRatio} from 'react-native'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userAction  from '../../actions/user/userAction';
import moment from 'moment';
import _ from 'lodash';

class Article extends Component {
  render() {
      // adjustsFontSizeToFit={true} allowFontScaling={true} 
    return <Text {...this.props} style={[this.props.style,article[this.props.fontSize]]}>{this.props.children}</Text>
  }
}

class ListTitle extends Component {
    render(){
        //adjustsFontSizeToFit={true} allowFontScaling={true}
        return <Text  {...this.props} style={[this.props.style,listtitle[this.props.fontSize]]}>{this.props.children}</Text>
    }
}

const article = StyleSheet.create({
    large:{
        fontSize:setFontSize(25),
        lineHeight:35
    },
    middle:{
        fontSize:setFontSize(20),
        lineHeight:30,
    },
    small:{
        fontSize:setFontSize(15),
        lineHeight:25,
    }
})
const listtitle = StyleSheet.create({
    large:{
        fontSize:setFontSize(26),
        lineHeight:36,
    },
    middle:{
        fontSize:setFontSize(21),
        lineHeight:31,
    },
    small:{
        fontSize:setFontSize(16),
    }
})

function mapStateToProps(state, ownProps){
    return {
        fontSize: state.root.user.fontSize,
    };
}
function mapDispatchToProps(dispatch){
    return {
        userAction: bindActionCreators(userAction, dispatch),
    };
}

Article =  connect(mapStateToProps,mapDispatchToProps)(Article);
ListTitle = connect(mapStateToProps,mapDispatchToProps)(ListTitle);
module.exports = {
    Article,
    ListTitle
}