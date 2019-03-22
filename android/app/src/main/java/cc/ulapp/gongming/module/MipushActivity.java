package cc.ulapp.gongming.module;

import android.content.Intent;
import android.os.Handler;
import android.os.Message;
import android.os.Bundle;

import com.umeng.message.UmengNotifyClickActivity;
import com.umeng.message.common.UmLog;
import org.android.agoo.common.AgooConstants;

import cc.ulapp.gongming.R;

public class MipushActivity extends UmengNotifyClickActivity {
    private static String TAG = MipushActivity.class.getName();
    protected UmengPushModule mPushModule;
    protected void setmPushModule(UmengPushModule module) {
        mPushModule = module;
    }
    @Override
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView(R.layout.activity_mipush);
        mPushModule = UmengPushModule.getPushModule();
    }

    @Override
    public void onMessage(Intent intent) {
        super.onMessage(intent);  //此方法必须调用，否则无法统计打开数
        String body = intent.getStringExtra(AgooConstants.MESSAGE_BODY);
        UmLog.i(TAG, body);
        Message message = Message.obtain();
        message.obj = body;
        new Handler().postDelayed(new Runnable() {
            public void run() {
                mPushModule.sendEvent("xiaomi", null);
            }
        }, 500);
    }
}
