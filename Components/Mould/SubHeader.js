import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import _ from 'lodash';
import Images from '../../imagesRequired';

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        backgroundColor: '#D43D3D',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 44,
    },
    tintStatusBarContainer:{
        flexDirection:'row',
        backgroundColor: '#D43D3D',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 44+statusBarHeight,
        paddingTop:statusBarHeight
    },
    headerTitleContainer:{
        position:'absolute',
        top:0,bottom:0,left:0,right:0,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'transparent'
    },
    headerTitle:{
        color: 'white',
        alignSelf:'center',
        textAlign:'center',
        fontSize:setFontSize(20),
    },
    headerLeft:{

    },
    headerRight:{

    },
    imgview:{
        width:40,
        height:40,
        left:10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    img:{
        width:25,
        height:25
    },
});
class SubHeader extends React.Component{
    static defaultProps = {
        headerTintColor:null,
        headerTitle:'',
        headerStyle:{},
        showBottomLine:false,
        hideLeft:false,
        hideRight:false,
        tintStatusBar:false // 优先级高
    }
    constructor(props){
        super(props)
        this.shouldReset = this.props.tintStatusBar != this.props.userTintStatusBar;
        if (this.shouldReset) this.props.dispatch({type:'CHANGE_TINT_STATUSBAR'})
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.userTintStatusBar!=this.props.userTintStatusBar){
            
        }
    }
    componentWillUnmount() {
        if (this.shouldReset) this.props.dispatch({type:'CHANGE_TINT_STATUSBAR'})
    }
    onPress = ()=>{
        if (this.props.onPress && typeof this.props.onPress == 'function'){
            return this.props.onPress()
        }
        if (this.props.navigation){
            return this.props.navigation.goBack()
        }
    }
    onTitlePress = ()=>{
        if (this.props.onCategoryPress && typeof this.props.onCategoryPress == 'function'){
            return this.props.onCategoryPress()
        }
        if (this.props.onTitlePress && typeof this.props.onTitlePress == 'function'){
            return this.props.onTitlePress()
        }
    }
    renderHeaderLeft = ()=>{
        let routeName = _.result(this.props,'navigation.state.routeName','');
        let routes = _.result(this.props,'nav.routes');
        let reduceRouteName = _.result(this.props,'nav.routeName')
        
        let headerTintColor = this.props.headerTintColor
        let headerLeft = null;
        // 第一级页面不显示返回按钮
        if (routeName=='主页'||reduceRouteName=='MainScreen'||!routes||!Array.isArray(routes)||routes.length<=1) {
            // console.log('顶级route隐藏左侧返回按钮')
        }else if (this.props.headerLeft){
            if (typeof this.props.headerLeft == 'function'){
                headerLeft = this.props.headerLeft()
            }else {//if (typeof this.props.headerLeft == PropTypes.element)
                headerLeft = this.props.headerLeft;
            }
        }else if(this.props.hideLeft){
            // console.log('属性隐藏左侧返回按钮')
        }else{
            headerLeft = <TouchableOpacity onPress={this.onPress} style={styles.imgview}><Image source={Images.fanhui}   style={[styles.img,headerTintColor&&{tintColor:headerTintColor}]}/></TouchableOpacity>
        }
        return (
            <View style={styles.headerLeft}>
                {headerLeft}
            </View>
        )
    }
    renderHeaderTitle = ()=>{
        let headerTintColor = this.props.headerTintColor
        let headerTitle = this.props.title||this.props.headerTitle
        let tintStatusBar = this.props.tintStatusBar || this.props.userTintStatusBar;
        return <TouchableOpacity activeOpacity={1} onPress={this.onTitlePress} style={[styles.headerTitleContainer,tintStatusBar&&{paddingTop:statusBarHeight}]}><Text style={[styles.headerTitle,this.props.headerTitleStyle,headerTintColor&&{color:headerTintColor}]}>{headerTitle}</Text></TouchableOpacity>        
    }
    renderHeaderRight = ()=>{
        let headerTintColor = this.props.headerTintColor
        if (this.props.headerRight){
            let headerRight = null;
            if (typeof this.props.headerRight == 'function'){
                headerRight = this.props.headerRight()
            }else {//if (typeof this.props.headerLeft == PropTypes.element)
                headerRight = this.props.headerRight;
            }
            return (
                <View style={styles.headerRight}>
                    {headerRight}
                </View>
            )
        }else{
            return null;            
        }
    }
    render(){
        let {headerTintColor,showBottomLine} = this.props
        let containerStyle = this.props.tintStatusBar || this.props.userTintStatusBar
        ? styles.tintStatusBarContainer
        : styles.container
        let setHeaderStyle  = typeof this.props.headerStyle == 'object' ? this.props.headerStyle : StyleSheet.flatten(this.props.headerStyle)
        let lineStyle = showBottomLine?{borderBottomColor:'#aaa',borderBottomWidth:StyleSheet.hairlineWidth}:{};
        let style = [containerStyle,setHeaderStyle,lineStyle]
        return (
            <View style={style}>
                {this.renderHeaderTitle()}
                {this.renderHeaderLeft()}
                {this.renderHeaderRight()}
            </View>
        );
    }
}
function mapStateToProps(state, ownProps){
    return {
        nav:state.nav,
        userTintStatusBar:state.root.user.tintStatusBar
    };
}
export default connect(mapStateToProps)(SubHeader);