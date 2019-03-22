const newsReply = {
    DataTotal:0,
    PageCount:0,
    PresentPage:0,
    data:new Array()
}
const forumReply = {
    DataTotal:0,
    likeTotal:0,
    PageCount:0,
    PresentPage:0,
    data:new Array()
}
const newsUserReply = {
    commentchild:{
        DataTotal : "0",
        PageCount : 0,
        PresentPage : 1,
        data:new Array()
    }
}
let initialState =  {
    nav:{
        index:0,
        routes:[],
        routeName:'MainNavigator',
        key:undefined
    },
    root:{
        news: {
            category:[],
            newsList:{},
            newsSwiper:{},
            newsDetail:{},
            swiper:{},
            newsRecommend:{},
            newsReply,
            newsUserReply,
            newssearch:{},
            newscollection:{},
            updateNewsReply:undefined
        },
        forum:{
            publish:false,
            category:[],
            forumList:{},
            forumSwiper:{},
            viewpoint:{},
            forumDetail:{},
            forumsearch:{},
            forumRecommend:{},
            forumReply,
            forumUserReply:newsUserReply,
            forumcollection:{},
            forumlike:{},
            updateForumReply:undefined,
            attention:{}
        },
        user:{
            tip:null,
            login:null,
            code:null,
            register:null,
            registeragree:{},
            fontSize:'small',
            userabout:{},
            userdata:{},
            userfans:{},
            userfollow:{},
            userdynamic:{},
            postsetting:{},
            getsetting:{},
            forgetPassword:false,
            changePassword:false,
            getuserdata:{},
            getuserforum:{},
            getpageuserdata:{},
            getpageuserforum:{},
            searchHistory:[],
            newsSearchHistory:[],
            forumSearchHistory:[],
            hotSearchKeywords:[],
            placeholderSearchKeywords:[],
            reportOptions:[],
            drafts:[],
            attention:{},
            sharecode:{},
            exchangecode:{},
            sharelist:{},
            tintStatusBar:false
        },
        message:{
            newsreply:{},
            replynumber:0,
            newscomment:{},
            newscollection:{},
            bulletin:{},
            notice:{},
            noticenumber:null,
            contactus:{},
            bulletindetail:{},
        },
        common:{
            loading:false,
            tip:undefined
        }
    }
};

export default initialState;
