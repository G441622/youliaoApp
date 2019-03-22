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
import * as forumRecommendAction  from '../../actions/forum/forumRecommendAction';
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

class ForumRecommend extends React.Component {
    constructor(props, context){
        super(props, context);
    }

    componentDidMount() {
        // this.props.forumRecommendAction.getForumRecommend(this.props.forum);
    }
    render() {
        var content = this.props.forumRecommend && this.props.forumRecommend ?
            this.props.forumRecommend.map(
                (x,i)=> {
                    return <NewsItem key={i} data={{...x,news_title:x.title,news_source:x.alias,news_time:x.time,cover_url:x.imglist}} onContentPress={this.props.onForumPress}/>
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
function mapStateToProps(state, ownProps){
    return {
        // forumRecommend: state.root.forum.forumRecommend
    };
}
function mapDispatchToProps(dispatch){
    return {
        // forumRecommendAction: bindActionCreators(forumRecommendAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ForumRecommend);