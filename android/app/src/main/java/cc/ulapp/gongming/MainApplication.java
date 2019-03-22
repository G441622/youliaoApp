package cc.ulapp.gongming;

import android.content.Context;
import android.support.multidex.MultiDex;

import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.otomogroove.OGReactNativeWaveform.OGWavePackage;
import cn.reactnative.httpcache.HttpCachePackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import cc.ulapp.gongming.module.DeviceUtiliyPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.github.kevinejohn.keyevent.KeyEventPackage;
import com.rnfs.RNFSPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.umeng.socialize.Config;
import com.umeng.socialize.PlatformConfig;
import com.umeng.socialize.UMShareAPI;
import cc.ulapp.gongming.module.SharePackage;
import java.util.Arrays;
import java.util.List;
import com.reactnativecomponent.amap.RCTAMapPackage;
import com.reactnativecomponent.amaplocation.RCTAMapLocationPackage;
import com.umeng.socialize.UMShareConfig;
import cc.ulapp.gongming.module.UmengPushApplication;
import cc.ulapp.gongming.module.UmengPushPackage;
/*
│ Production │ PMHTKUsod5XaErnsD107mNoed9T0a80e605e-5fa7-4e74-8076-6aba359c1ae1 │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging    │ 0XZtfP4FisZ19jBg-uR6FTM4Uy48a80e605e-5fa7-4e74-8076-6aba359c1ae1 │
        */
public class MainApplication extends UmengPushApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG),
            new OGWavePackage(),
            new HttpCachePackage(),
            new SplashScreenReactPackage(),
            new UmengPushPackage(),
            new DeviceUtiliyPackage(),
            new RNDeviceInfo(),
            new PickerPackage(),
            new KeyEventPackage(),
            new RNFSPackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new ImagePickerPackage(),
            new SharePackage(),
            new RCTAMapPackage(),
            new RCTAMapLocationPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  protected void attachBaseContext(Context context){
    super.attachBaseContext(context);
    MultiDex.install(this);
  }
  @Override
  public void onCreate() {
    super.onCreate();
    System.setProperty("sun.jnu.encoding","utf-8");
    System.setProperty("file.encoding","utf-8");
//    MiPushRegistar
    SoLoader.init(this, /* native exopackage */ false);
    Config.shareType = "react native";
    UMShareAPI.get(this);
    Config.DEBUG = false;
      //
    UMShareConfig config = new UMShareConfig();
    config.isNeedAuthOnGetUserInfo(true);
    UMShareAPI.get(this).setShareConfig(config);
  }

  // 配置平台
  {
    PlatformConfig.setWeixin("wxd4378bcc9aab1cb6", "a3beb5aa8afd728cba7960b55e094387");
    PlatformConfig.setQQZone("1106514810", "slTGie5ZkHz5xxNL");
    PlatformConfig.setSinaWeibo("583809100", "f2b3c97f4ff2bbee6ee2837456ecd6ae", "http://www.ulapp.cc");
  }
}
