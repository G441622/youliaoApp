package cc.ulapp.gongming;

import android.content.Intent;

import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.media.WBShareCallBackActivity;

public class WBShareActivity extends WBShareCallBackActivity {
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        UMShareAPI.get(this).onActivityResult(requestCode,resultCode,data);
    }
}
