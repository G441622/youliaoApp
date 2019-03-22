package cc.ulapp.gongming.module;

import android.app.Application;
import android.app.Notification;
import android.content.Context;
import android.os.Handler;
import android.util.Log;

import com.umeng.commonsdk.UMConfigure;
import com.umeng.message.IUmengCallback;
import com.umeng.message.IUmengRegisterCallback;
import com.umeng.message.MsgConstant;
import com.umeng.message.PushAgent;
import com.umeng.message.UmengMessageHandler;
import com.umeng.message.UmengNotificationClickHandler;
import com.umeng.message.common.UmLog;
import com.umeng.message.entity.UMessage;

import org.android.agoo.huawei.HuaWeiRegister;
import org.android.agoo.xiaomi.MiPushRegistar;

import cc.ulapp.gongming.BuildConfig;

/**
 * Created by user on 16/4/20.
 */
public class UmengPushApplication extends Application {
    protected static final String TAG = UmengPushModule.class.getSimpleName();
    protected UmengPushModule mPushModule;
    protected String mRegistrationId;
    protected PushAgent mPushAgent;
    //应用退出时，打开推送通知时临时保存的消息
    private UMessage tmpMessage;
    //应用退出时，打开推送通知时临时保存的事件
    private String tmpEvent;

    @Override
    public void onCreate() {
        super.onCreate();
        // 新版必须调用函数
        UMConfigure.init(this,UMConfigure.DEVICE_TYPE_PHONE,"641614bb3a778f87637cbfb216065a83");
        // debug log
        UMConfigure.setLogEnabled(true);
        // 小米
        MiPushRegistar.register(this, "2882303761517678037", "5961767879037");
        // 华为
        HuaWeiRegister.register(this);
        // 设置参数
        mPushAgent = PushAgent.getInstance(this);
        // push设置
        registerPush();
    }
    protected String getRegistrationId(){
        if (mRegistrationId!=null&&!mRegistrationId.isEmpty()) {
            return mRegistrationId;
        }
        String device_token = PushAgent.getInstance(this).getRegistrationId();

        return mPushAgent.getRegistrationId();
    }
    protected void setmPushModule(UmengPushModule module) {
        mPushModule = module;
        if (tmpMessage != null && tmpEvent != null && mPushModule != null) {
            //execute the task
            clikHandlerSendEvent(tmpEvent, tmpMessage);
            //发送事件之后，清空临时内容
            tmpEvent = null;
            tmpMessage = null;
        }
    }
    public void enablePush(){
        mPushAgent.enable(new IUmengCallback() {
            @Override
            public void onSuccess() {

            }

            @Override
            public void onFailure(String s, String s1) {

            }
        });
    }

    //开启推送
    private void registerPush() {
        if (mPushAgent==null) mPushAgent = PushAgent.getInstance(this);
        //统计应用启动数据
        mPushAgent.onAppStart();
        Handler handler = new Handler(getMainLooper());

        //sdk开启通知声音
        mPushAgent.setNotificationPlaySound(MsgConstant.NOTIFICATION_PLAY_SDK_ENABLE);

        UmengNotificationClickHandler notificationClickHandler = new UmengNotificationClickHandler() {
            @Override
            public void launchApp(Context context, UMessage msg) {
                super.launchApp(context, msg);
//                Log.i(TAG, "launchApp");
                clikHandlerSendEvent(UmengPushModule.DidOpenMessage, msg);
            }

            @Override
            public void openUrl(Context context, UMessage msg) {
                super.openUrl(context, msg);
                clikHandlerSendEvent(UmengPushModule.DidOpenMessage, msg);
            }

            @Override
            public void openActivity(Context context, UMessage msg) {
                super.openActivity(context, msg);
                clikHandlerSendEvent(UmengPushModule.DidOpenMessage, msg);
            }

            @Override
            public void dealWithCustomAction(Context context, UMessage msg) {
                super.dealWithCustomAction(context, msg);
                clikHandlerSendEvent(UmengPushModule.DidOpenMessage, msg);
            }
        };

        //设置通知点击处理者
        mPushAgent.setNotificationClickHandler(notificationClickHandler);

        //设置消息和通知的处理
        mPushAgent.setMessageHandler(new UmengMessageHandler() {
            @Override
            public Notification getNotification(Context context, UMessage msg) {
                messageHandlerSendEvent(UmengPushModule.DidReceiveMessage, msg);
                Log.i(TAG, msg.toString());
                return super.getNotification(context, msg);
            }

            @Override
            public void dealWithCustomMessage(Context context, UMessage msg) {
                super.dealWithCustomMessage(context, msg);
                messageHandlerSendEvent(UmengPushModule.DidReceiveMessage, msg);
            }
        });

        //设置debug状态
//        if(BuildConfig.DEBUG) {
//            mPushAgent.setDebugMode(true);
//        }
        //前台不显示通知
        // mPushAgent.setNotificaitonOnForeground(false);

        //注册推送服务，每次调用register方法都会回调该接口
        mPushAgent.register(new IUmengRegisterCallback() {
            @Override
            public void onSuccess(String deviceToken) {
                //注册成功会返回device token
                UmLog.i(TAG, "device token: " + deviceToken);
                mRegistrationId = deviceToken;
            }

            @Override
            public void onFailure(String s, String s1) {
                UmLog.i(TAG, "push register (device token) error : " + s + " " + s1);
            }
        });
        enablePush();
    }

    /**
     * 点击推送通知触发的事件
     * @param event
     * @param msg
     */
    private void clikHandlerSendEvent(final String event, final UMessage msg) {
        if(mPushModule == null) {
            tmpEvent = event;
            tmpMessage = msg;
            return;
        }
        //延时500毫秒发送推送，否则可能收不到
        new Handler().postDelayed(new Runnable() {
            public void run() {
                mPushModule.sendEvent(event, msg);
            }
        }, 500);
    }

    /**
     * 消息处理触发的事件
     * @param event
     * @param msg
     */
    private void messageHandlerSendEvent(String event, UMessage msg) {
        if(mPushModule == null) {
            return;
        }
        mPushModule.sendEvent(event, msg);
    }
}
