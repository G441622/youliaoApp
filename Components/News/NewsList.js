import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, SectionList, TouchableOpacity, Animated, FlatList, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as newsAction from '../../actions/news/newsAction';
import * as newsSwiperAction from '../../actions/news/newsSwiperAction';
import NewsSwiper from "../Mould/NewsSwiper";
import Loading from "../Mould/Loading";
import { NavigationActions } from "react-navigation";
import NewsItem from '../Mould/NewsItem';

const styles = StyleSheet.create({
});
class NewsList extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
        }
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            presentPage: 0,
            showLoading: false,
            refreshing: false
        };
        this.cid = 0;
    }

    componentDidMount() {
        let { category } = this.props;
        let { state, setParams } = this.props.navigation;
        let cid = 0
        let key = state.key
        for (let index = 0; index < category.length; index++) {
            const item = category[index];
            if (item.name == state.key) {
                cid = item.id;
                break;
            }
        }
        this.cid = cid
        this.key = key;
        this._initialNewsList();
        // const input = {
        //     cid: this.cid,
        //     page:1,
        //     limit:15,
        //     key
        // };
        // this.props.newsSwiperAction.getNewsSwiper(input.cid,input.key);
        // this.props.newsAction.getNews(input);
    }
    componentWillReceiveProps(newProp) {
        let news = this.cid != 0 && newProp.newsList.hasOwnProperty(this.key) && newProp.newsList[this.key] ? newProp.newsList[this.key] : {}
        if (news.hasOwnProperty('presentPage') && news.presentPage && news.presentPage > this.state.presentPage) {
            let showLoading = false;
            let presentPage = news.presentPage;
            this.setState({ showLoading, presentPage, refreshing: false })
        }
        if (news.hasOwnProperty('presentPage') && news.presentPage && news.presentPage == 1) this.setState({ refreshing: false })
        if (!this.props.login&&newProp.login){
            // 新闻不用刷新
            // this._refreshList()
        }
    }
    onNewsPress = (item) => {
        let navigation = this.props.screenProps.navigation;
        navigation.navigate('NewsDetail', { news: { ...item, category: this.key } });
    }
    onUserPress = (user_id) => {

    }
    _initialNewsList = () => {
        this.setState({ refreshing: true, presentPage: 0 })
        const input = {
            cid: this.cid,
            page: 1,
            limit: 15,
            key: this.key
        };
        this.props.newsSwiperAction.getNewsSwiper(input.cid, input.key);
        this.props.newsAction.getNews(input);
    }
    _refreshList = () => {
        // TODO: 刷新接口,根据最新的新闻ID获取更新;
        this._initialNewsList()
    }
    _onEndReached = () => {
        let news = this.cid != 0 && this.props.newsList.hasOwnProperty(this.key) && this.props.newsList[this.key] ? this.props.newsList[this.key] : {}
        let data = news && news.data ? news.data : []
        if (!news.hasOwnProperty('presentPage') || data.length < 15 * news.presentPage) return;
        if (this.state.showLoading) return;
        console.log(`======== NewsList ${this.key} _onEndReached ========`);
        this.setState({ showLoading: true })
        const input = {
            cid: this.cid,
            page: news.hasOwnProperty('presentPage') && news.presentPage ? news.presentPage + 1 : 1,
            limit: 15,
            key: this.key
        };
        this.props.newsAction.getNews(input);
    }
    _renderItem = ({ item, index }) => {
        if (!item.hasOwnProperty('news_id') || !item.news_id) return null;
        return <NewsItem data={item} onContentPress={this.onNewsPress} />
    }
    _renderHeader = () => {
        let swipers = this.cid != 0 && this.props.newsSwiper.hasOwnProperty(this.key) && this.props.newsSwiper[this.key] ? this.props.newsSwiper[this.key] : []
        let {width,height} = Dimensions.get('window')
        var swiper = swipers && Array.isArray(swipers) && swipers.length ?
            swipers.map(
                (x, i) => {
                    return (
                        <TouchableOpacity style={{flex:1,width:width-40,height:200}} key={x.news_id} onPress={() => this.onNewsPress(x)} activeOpacity={1}>
                            <Text style={{ fontSize:setFontSize(18), marginBottom: 5, color: '#585858' }} numberOfLines={2}>{x.news_title}</Text>
                            <Image style={{ width: '100%', height: 180 }} resizeMode='cover' source={{ uri: x.news_cover }} />
                        </TouchableOpacity>
                    )
                }
            ) : <View></View>;
        return <NewsSwiper swiper={swiper} info={swipers} />
    }
    render() {
        let news = this.cid != 0 && this.props.newsList.hasOwnProperty(this.key) && this.props.newsList[this.key] ? this.props.newsList[this.key] : {}
        var data = news && news.data ? news.data : []
        var loading = this.state.showLoading ? <Loading /> : <View></View>;
        return (
            <FlatList
                style={{ flex: 1,backgroundColor: 'white' }}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                data={data}
                keyExtractor={(item, index) => index}
                refreshing={this.state.refreshing}
                onRefresh={this._refreshList}
                renderItem={this._renderItem}
                initialNumToRender={15}
                keyboardShouldPersistTaps='handled'
                onEndReached={this._onEndReached}
                onEndReachedThreshold={0.1}
                ListHeaderComponent={this._renderHeader()}
                ListFooterComponent={loading}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#ddd' }} />}
            />
            
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        login:state.root.user.login,
        newsList: state.root.news.newsList,
        category: state.root.news.category,
        newsSwiper: state.root.news.newsSwiper,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        newsAction: bindActionCreators(newsAction, dispatch),
        newsSwiperAction: bindActionCreators(newsSwiperAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsList);