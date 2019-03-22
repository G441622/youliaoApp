package cc.ulapp.gongming.module;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Handler;
import android.os.Looper;
import android.support.v4.app.ActivityCompat;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import com.umeng.socialize.ShareAction;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.UMShareConfig;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.UMAuthListener;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.media.UMImage;
import com.umeng.socialize.media.UMWeb;

import java.util.Map;

/**
 * Created by Song on 2017/7/10.
 */
public class ShareModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private Context context;
    private static Activity mActivity;
    private static Handler mHandler = new Handler(Looper.getMainLooper());
    private static UMShareAPI umShareAPI;
    public static void initActivity(Activity activity) {
        mActivity = activity;
        UMShareConfig config = new UMShareConfig();
        config.isNeedAuthOnGetUserInfo(true);
        UMShareAPI.get(mActivity).setShareConfig(config);
    }

    public ShareModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
        UMShareAPI umShareAPI = UMShareAPI.get(context);
        this.umShareAPI = umShareAPI;
    }

    private static void runOnMainThread(Runnable task) {
        mHandler.post(task);
    }
    private static final int REQUEST_EXTERNAL_STORAGE = 1;
    private static String[] PERMISSIONS_STORAGE = {
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
    };
    public void myPermission() {
        int permission = ActivityCompat.checkSelfPermission(mActivity, Manifest.permission.WRITE_EXTERNAL_STORAGE);
        if (permission != PackageManager.PERMISSION_GRANTED) {
            // We don't have permission so prompt the user
            ActivityCompat.requestPermissions(
                    mActivity,
                    PERMISSIONS_STORAGE,
                    REQUEST_EXTERNAL_STORAGE
            );
        }
    }
    @Override
    public String getName() {
        return "sharemodule";
    }

    /**
     * 分享链接
     * @param title
     * @param description
     * @param contentUrl
     * @param imgUrl
     * @param platform
     * @param resultCallback
     */
    @ReactMethod
    public void share(String title, String description,
                          String contentUrl, String imgUrl,final int platform,
                      final Callback resultCallback) {

        final UMWeb web = new UMWeb(contentUrl);
        web.setTitle(title); //标题
        web.setThumb(new UMImage(context, imgUrl));  //缩略图
        web.setDescription(description); //描述
        runOnMainThread(new Runnable() {
            @Override
            public void run() {
                new ShareAction(mActivity)
                        .setPlatform(getSharePlatform(platform))
                        .withMedia(web) // 分享链接
                        .setCallback(new UMShareListener() {
                            @Override
                            public void onStart(SHARE_MEDIA share_media) {
                                //分享开始的回调
                                myPermission();
                            }

                            @Override
                            public void onResult(SHARE_MEDIA share_media) {
                                resultCallback.invoke("200","分享成功");
                            }

                            @Override
                            public void onError(SHARE_MEDIA share_media, Throwable throwable) {
                                resultCallback.invoke("404","分享失败：" + throwable.getMessage());
                            }

                            @Override
                            public void onCancel(SHARE_MEDIA share_media) {
                                resultCallback.invoke("201","取消分享");
                            }
                        })
                        .share();
            }
        });
    }
//    @ReactMethod
//    public void shareAction(String title, String description,
//                            String contentUrl, String imgUrl,final int platform,
//                            final Callback resultCallback){
//        final UMWeb web = new UMWeb(contentUrl);
//        web.setTitle(title); //标题
//        web.setThumb(new UMImage(context, imgUrl));  //缩略图
//        web.setDescription(description); //描述
//        new ShareAction(mActivity)
//                .withMedia(web)
//                .setCallback(new UMShareListener() {
//                    @Override
//                    public void onStart(SHARE_MEDIA share_media) {
//
//                    }
//
//                    @Override
//                    public void onResult(SHARE_MEDIA share_media) {
//
//                    }
//
//                    @Override
//                    public void onError(SHARE_MEDIA share_media, Throwable throwable) {
//
//                    }
//
//                    @Override
//                    public void onCancel(SHARE_MEDIA share_media) {
//
//                    }
//                })
//                .open();
//    }
    @ReactMethod
    public void login(final int platform,final Callback resultCallback){
        runOnMainThread(new Runnable() {
                            @Override
                            public void run() {
                                umShareAPI.getPlatformInfo(mActivity,getSharePlatform(platform), new UMAuthListener(){
                                    /**
                                     * @desc 授权开始的回调
                                     * @param platform 平台名称
                                     */
                                    @Override
                                    public void onStart(SHARE_MEDIA platform) {

                                    }

                                    /**
                                     * @desc 授权成功的回调
                                     * @param platform 平台名称
                                     * @param action 行为序号，开发者用不上
                                     * @param data 用户资料返回
                                     */
                                    @Override
                                    public void onComplete(SHARE_MEDIA platform, int action, Map<String, String> data) {
                                        WritableMap map = Arguments.createMap();
                                        for (Map.Entry<String, String> entry : data.entrySet()) {
                                            map.putString(entry.getKey(),entry.getValue());
                                        }
                                        resultCallback.invoke(map);
                                    }

                                    /**
                                     * @desc 授权失败的回调
                                     * @param platform 平台名称
                                     * @param action 行为序号，开发者用不上
                                     * @param t 错误原因
                                     */
                                    @Override
                                    public void onError(SHARE_MEDIA platform, int action, Throwable t) {
                                        resultCallback.invoke("授权失败 :" + t.getMessage());
                                    }

                                    /**
                                     * @desc 授权取消的回调
                                     * @param platform 平台名称
                                     * @param action 行为序号，开发者用不上
                                     */
                                    @Override
                                    public void onCancel(SHARE_MEDIA platform, int action) {
                                        resultCallback.invoke("取消授权");
                                    }
                                });
                            }
                        });


    }
    private SHARE_MEDIA getSharePlatform(int platform){
        switch (platform) {
            case 0:
                return SHARE_MEDIA.QQ;
            case 1:
                return SHARE_MEDIA.SINA;
            case 2:
                return SHARE_MEDIA.WEIXIN;
            case 3:
                return SHARE_MEDIA.WEIXIN_CIRCLE;
            case 4:
                return SHARE_MEDIA.QZONE;
            case 5:
                return SHARE_MEDIA.FACEBOOK;
            default:
                return null;
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        UMShareAPI.get(mActivity).onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
