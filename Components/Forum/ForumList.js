import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, FlatList, SectionList, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ForumCheck from './ForumCheck';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as forumAction from '../../actions/forum/forumAction';
import * as forumSwiperAction from '../../actions/forum/forumSwiperAction';
import NewsSwiper from "../Mould/NewsSwiper";
import Loading from "../Mould/Loading";
import ForumItem from '../Mould/ForumItem';
import _ from 'lodash';


const styles = StyleSheet.create({
    list: {
        marginBottom: 5,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'white'
    }
});
class ForumList extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
        }
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            presentPage: 0,
            showLoading: false,
            refreshing: false,
        };
    }
    componentDidMount() {
        let { category } = this.props;
        let { state, setParams } = this.props.navigation;
        let cid = 0
        let key = state.key
        for (let index = 0; index < category.length; index++) {
            const item = category[index];
            if (item.category_name == state.key) {
                cid = item.id;
                break;
            }
        }
        this.cid = cid
        this.key = key;
        this._initialForumList()
        // const input = {
        //     cid: this.cid,
        //     page:1,
        //     limit:15,
        //     key
        // };
        // this.props.forumSwiperAction.getForumSwiper(cid,key);
        // this.props.forumAction.getForum(input);
    }
    componentWillReceiveProps(nextProps) {
        let forum = this.cid != 0 && nextProps.forumList.hasOwnProperty(this.key) && nextProps.forumList[this.key] ? nextProps.forumList[this.key] : {}

        if (forum.hasOwnProperty('presentPage') && forum.presentPage && forum.presentPage > this.state.presentPage) {
            this.setState({ showLoading: false, presentPage: forum.presentPage, refreshing: false })
        }
        this.setState({ refreshing: false })
        if (forum.hasOwnProperty('presentPage') && forum.presentPage && forum.presentPage == 1) this.setState({ refreshing: false })
        if (!this.props.login&&nextProps.login){
            this._refreshList()
        }
    }

    onForumPress = (item) => {
        let navigation = this.props.screenProps.navigation;
        navigation.navigate('ForumDetailScreen', { forum: { ...item, category: this.key } });
    }
    onUserPress = (user_id) => {
        let navigation = this.props.screenProps.navigation;
        navigation.navigate('UserCenter', { userfollow: { user_id } })
    }
    _initialForumList = () => {
        this.setState({ refreshing: true, presentPage: 0 })
        const input = {
            cid: this.cid,
            page: 1,
            limit: 15,
            key: this.key
        };
        // this.props.forumSwiperAction.getForumSwiper(cid,key);
        this.props.forumAction.getForum(input);
    }
    _refreshList = () => {
        // TODO: 刷新接口,根据最新的新闻ID获取更新;
        this._initialForumList()
    }
    _onEndReached = () => {
        let forum = this.cid != 0 && this.props.forumList.hasOwnProperty(this.key) && this.props.forumList[this.key] ? this.props.forumList[this.key] : {}
        if (!forum.hasOwnProperty('presentPage')) return;
        if (forum.data.length < forum.presentPage * 15) return;
        if (this.state.showLoading) return;
        this.setState({ showLoading: true })
        console.log(`======== ForumList ${this.key} _onEndReached ========`);
        const input = {
            cid: this.cid,
            page: forum.presentPage ? forum.presentPage + 1 : 1,
            limit: 15,
            key: this.key
        };
        this.props.forumAction.getForum(input);
    }
    _renderHeader = () => {
        let swipers = this.cid != 0 && this.props.forumSwiper.hasOwnProperty(this.key) && this.props.forumSwiper[this.key] ? this.props.forumSwiper[this.key] : []
        var swiper = swipers && Array.isArray(swipers) && swipers.length ?
            swipers.map(
                (x, i) => {
                    return null;
                    return (<TouchableOpacity key={x.forum_id} onPress={() => this.onForumPress(x)} activeOpacity={1}><Text style={{ fontSize:setFontSize(18), marginBottom: 5, color: '#585858' }}>{x.title}</Text><Image style={{ width: '100%', height: '100%' }} source={{ uri: x.logo }} /></TouchableOpacity>)
                }
            ) :
            <View></View>;
            
        if (Array.isArray(swiper) && (swiper = _.compact(swiper)) && swiper.length) {
            return <NewsSwiper swiper={swiper} info={swipers} />
        }
        let forum = this.cid != 0 && this.props.forumList.hasOwnProperty(this.key) && this.props.forumList[this.key] ? this.props.forumList[this.key] : {}
        
        let data = forum && forum.hasOwnProperty('data') ? forum.data : []
        if (!this.state.refreshing&&!this.state.showLoading&&data.length==0){
            return <View style={{flex:1,justifyContent:'center',alignItems:'center',margin:20}}><Text>没有更多的数据了...</Text></View>
        }
        return null;
    }
    _renderItem = ({ item, index }) => {
        return <ForumItem data={item} onContentPress={this.onForumPress} onUserPress={this.onUserPress} />
    }
    render() {
        let forum = this.cid != 0 && this.props.forumList.hasOwnProperty(this.key) && this.props.forumList[this.key] ? this.props.forumList[this.key] : {}

        var data = forum && forum.hasOwnProperty('data') ? forum.data : []
        var loading = this.state.showLoading ? <Loading /> : <View></View>;

        return (
            <View style={{ backgroundColor: 'white', width: '100%', height: '100%' }}>
                <ForumCheck/>
                <FlatList
                    style={{ flex: 1, backgroundColor: 'white', height: '100%' }}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    data={data}
                    refreshing={this.state.refreshing}
                    onRefresh={this._refreshList}
                    renderItem={this._renderItem}
                    initialNumToRender={15}
                    keyExtractor={(item, index) => index}
                    keyboardShouldPersistTaps='handled'
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={0.1}
                    ListHeaderComponent={this._renderHeader()}
                    ListFooterComponent={loading}
                    ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#ddd' }} />}
                />
            </View>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        login:state.root.user.login,
        category: state.root.forum.category,
        forumList: state.root.forum.forumList,
        forumSwiper: state.root.forum.forumSwiper,
        attention: state.root.user.attention,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        forumAction: bindActionCreators(forumAction, dispatch),
        forumSwiperAction: bindActionCreators(forumSwiperAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ForumList);