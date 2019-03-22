import * as types from './commonConstant';

let tipTimer = null;

export function showLoading(){
    return function(dispatch, getState){
        let state = getState()
        let routeName = state.nav.routeName
        if (routeName=='MainNavigator'||routeName=='MainScreen') return;
        dispatch({type:types.SHOW_LOADING})
    };
}

export function hideLoading() {
    return function(dispatch, getState) {
        dispatch({type:types.HIDE_LOADING})
    }
}

export function showTip(tip,timeout=2000) {
    return function(dispatch, getState) {
        if (!tip || tip == '') return;
        if (tipTimer!=null) clearTimeout(tipTimer);
        dispatch({type:types.SHOW_TIP,tip})
        tipTimer = setTimeout(() => {
            dispatch({type:types.HIDE_TIP});
            clearTimeout(tipTimer);
            tipTimer = null;
        }, timeout);
    }
}

export function hideTip() {
    return function(dispatch, getState) {
        if (tipTimer!=null) clearTimeout(tipTimer);
        dispatch({type:types.HIDE_TIP});
        tipTimer = null;
    }
}