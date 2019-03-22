import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Images from '../../imagesRequired';


const styles = StyleSheet.create({
    MainContainer: {
        backgroundColor: 'white',
    },
    container:{
        backgroundColor: '#D43D3D',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        flexDirection:'row',
    },
    header:{
        color: 'white',
        fontSize:setFontSize(20),
    },
    search_icon:{
        color: 'white',
        fontSize:setFontSize(20),
    },
    searchview: {
        position:'absolute',
        right:20
    },
});
class NewsHeader extends React.Component{
    constructor(props, context){
        super(props, context);
        this.onSearchPress = this.onSearchPress.bind(this);
    }
    onSearchPress(){
        this.props.navigation.navigate('NewsSearch',{});
    }
    render(){
        return (<View style={styles.MainContainer}>
            <View style={styles.container}>
                <Text style={styles.header}>有料新闻</Text>
                <View style={styles.searchview}>
                    <TouchableOpacity onPress={this.onSearchPress}>
                        <Image source={Images.search} style={{width:20,height:20}}/>
                    </TouchableOpacity>
                </View>

            </View>
        </View>);
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

export default connect(mapStateToProps,mapDispatchToProps)(NewsHeader);
