import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as newsRecommendAction  from '../../actions/news/newsRecommendAction';
import NewsItem from '../Mould/NewsItem';
const styles = StyleSheet.create({
    recommend:{
        margin:20,
        marginTop:10,
        marginBottom:10,
    },
    title:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    title_text:{
        color:'#585858',
        fontSize:setFontSize(18),
        fontWeight:'100',
    },
});

class NewsRecommend extends React.Component {
    constructor(props, context){
        super(props, context);
    }

    componentDidMount() {

    }
    render() {
        var content = this.props.newsRecommend && Array.isArray(this.props.newsRecommend) && this.props.newsRecommend.length ?
            this.props.newsRecommend.map(
                (x,i)=> {
                    return <NewsItem key={i} data={{...x,cover_url:x.imglist}} onContentPress={this.props.onNewsPress}/>
                }
            ) :
            <View></View>;
        return (<View style={styles.recommend}>
                <View style={styles.title}>
                    <Text style={styles.title_text}>推荐阅读</Text>
                </View>
                {content}
            </View>

        );
    }
}
// function mapStateToProps(state, ownProps){
//     return {
//         newsRecommend: state.root.news.newsRecommend
//     };
// }
// function mapDispatchToProps(dispatch){
//     return {
//         newsRecommendAction: bindActionCreators(newsRecommendAction, dispatch)
//     };
// }

export default connect()(NewsRecommend);