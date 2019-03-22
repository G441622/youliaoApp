package cc.ulapp.gongming.module;

import android.app.Activity;
import android.app.DownloadManager;
import android.app.DownloadManager.Request;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.preference.PreferenceManager;
import android.text.TextUtils;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by youliao on 2017/11/28.
 */

public class
DeviceUtiliy extends ReactContextBaseJavaModule implements ActivityEventListener {
    private Context context;
    private static Activity mActivity;
    private static Handler mHandler = new Handler(Looper.getMainLooper());
    public static void initActivity(Activity activity) {
        mActivity = activity;
    }
    private static DownloadManager manager;
    private static SharedPreferences preferences ;
    private static String download_url;
    //下载完成的广播
    private BroadcastReceiver receiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if(intent.getAction().equals(DownloadManager.ACTION_DOWNLOAD_COMPLETE)){
                long id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, 0);
                long myid = preferences.getLong(download_url, 0);
                if(myid == id){
                    installFile(id);
                }
            }
        }
    };
    public DeviceUtiliy(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
        preferences = PreferenceManager.getDefaultSharedPreferences(context);
        String serviceString = Context.DOWNLOAD_SERVICE;
        manager = (DownloadManager) context.getSystemService(serviceString);
    }

    private static void runOnMainThread(Runnable task) {
        mHandler.post(task);
    }

    @Override
    public String getName() {
        return "DeviceUtiliy";
    }
    @ReactMethod
    public void openMarket(){
        this.openMarket("cc.ulapp.gongming","");
    }
    @ReactMethod
    public void openMarket(String appPkg){
        this.openMarket(appPkg,"");
    }

    @ReactMethod
    public void openMarket(String appPkg, String marketPkg) {
        try {
            if (TextUtils.isEmpty(appPkg)) appPkg = "cc.ulapp.gongming";
            Uri uri = Uri.parse("market://details?id=" + appPkg);
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            if (TextUtils.isEmpty(marketPkg)) marketPkg = "";
            if (!TextUtils.isEmpty(marketPkg)) {
                intent.setPackage(marketPkg);
            }
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @ReactMethod
    public void installApk(String filePath) {
        File apkfile = new File(filePath);
        if (!apkfile.exists()) {
            return;
        }
        // 通过Intent安装APK文件
        Intent i = new Intent(Intent.ACTION_VIEW);
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        i.setDataAndType(Uri.parse("file://" + apkfile.toString()),
                "application/vnd.android.package-archive");
        context.startActivity(i);
        android.os.Process.killProcess(android.os.Process.myPid());
    }
    @ReactMethod
    public void startDownLoad(String url){
        String name = getLastString(url);
        if (name==null||name.equals("")) name="有料APP";
        startDownLoad(url,name);
    }
    //开始下载指定路径的apk文件
    @ReactMethod
    public void startDownLoad(String url,String name){
        boolean can = canDownloadState();
        if (!can) return;
        long downloadId = preferences.getLong(url, -1L);
        if (downloadId != -1L) {
            alreadyDownload(downloadId);
            return;
        }
        download_url = url;
        if (name==null||name=="") name=getLastString(url);
        Uri uri = Uri.parse(url);
        Request request = new Request(uri);
        //设置什么网路环境下才可以更新，这里是流量和wifi都可以
        request.setAllowedNetworkTypes(Request.NETWORK_MOBILE|Request.NETWORK_WIFI)  ;
        //设置通知栏显示的几种状态
        //只在下载过程中显示通知栏，下载完成后会自动消失
        //request.setNotificationVisibility(Request.VISIBILITY_VISIBLE);
        request.setNotificationVisibility(Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
        //下载过程中显示通知 栏，下载完成后通知栏不消失，提示下载完成,点击进行安装
        request.setVisibleInDownloadsUi(true);
        //request.setVisibleInDownloadsUi(false);
        //设置文件存储路径
        request.setDestinationInExternalFilesDir(context, Environment.DIRECTORY_DOWNLOADS, name+".apk");
        //设置下载的文件的类型
        request.setMimeType("application/vnd.android.package-archive");

        //设置标题和描述
        request.setTitle(name);
//        request.setDescription("");
        //获取唯一id
        long myid = manager.enqueue(request);

        preferences.edit().putLong(url, myid).commit();
        //注册下载完成的广播
        context.registerReceiver(receiver, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
    }
    //安装应用，指定位置
    private void installFile(long id) {
        Intent install = new Intent(Intent.ACTION_VIEW);
        Uri downloadFileUri = manager.getUriForDownloadedFile(id);
        install.setDataAndType(downloadFileUri, "application/vnd.Android.package-archive");
        install.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(install);
    }
    public static void startInstall(Context context, Uri uri) {
        Intent install = new Intent(Intent.ACTION_VIEW);
        install.setDataAndType(uri, "application/vnd.android.package-archive");
        install.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(install);
    }

    private void alreadyDownload(Long downloadId){
        DownloadManager.Query query = new DownloadManager.Query().setFilterById(downloadId);
        Cursor c = manager.query(query);
        int status = -1;
        if (c != null) {
            try {
                if (c.moveToFirst()) {
                    status = c.getInt(c.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS));
                }
            } finally {
                c.close();
            }
        }
        if (status == DownloadManager.STATUS_SUCCESSFUL) {
            // 下载成功
            Uri uri = manager.getUriForDownloadedFile(downloadId);
            if (uri != null) {
                if (compare(getApkInfo(context, uri.getPath()), context)) {
                    startInstall(context, uri);
                    return;
                } else {
                    manager.remove(downloadId);
                }
            }
        } else if (status == DownloadManager.STATUS_FAILED) {
            // 下载失败
        } else {
        }
    }
    private static boolean compare(PackageInfo apkInfo, Context context) {
        if (apkInfo == null) {
            return false;
        }
        String localPackage = context.getPackageName();
        if (apkInfo.packageName.equals(localPackage)) {
            try {
                PackageInfo packageInfo = context.getPackageManager().getPackageInfo(localPackage, 0);
                if (apkInfo.versionCode > packageInfo.versionCode) {
                    return true;
                } else {

                }
            } catch (PackageManager.NameNotFoundException e) {
                e.printStackTrace();
            }
        }
        return false;
    }
    private static PackageInfo getApkInfo(Context context, String path) {
        PackageManager pm = context.getPackageManager();
        PackageInfo info = pm.getPackageArchiveInfo(path, PackageManager.GET_ACTIVITIES);
        if (info != null) {
            //String packageName = info.packageName;
            //String version = info.versionName;
            //Log.d(TAG, "packageName:" + packageName + ";version:" + version);
            //String appName = pm.getApplicationLabel(appInfo).toString();
            //Drawable icon = pm.getApplicationIcon(appInfo);//得到图标信息
            return info;
        }
        return null;
    }
    private boolean canDownloadState() {
        try {
            int state = context.getPackageManager().getApplicationEnabledSetting("com.android.providers.downloads");

            if (state == PackageManager.COMPONENT_ENABLED_STATE_DISABLED
                    || state == PackageManager.COMPONENT_ENABLED_STATE_DISABLED_USER
                    || state == PackageManager.COMPONENT_ENABLED_STATE_DISABLED_UNTIL_USED) {
                return false;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
    public static String getLastString(String str) {
        URL url;
        try {
            url = new URL(str);
        } catch (MalformedURLException e) {
            return "有料APP";
        }
        String file = url.getFile();
        String[] splitStr = file.split("/");
        int len = splitStr.length;
        String result = splitStr[len-1];
        return result;
    }
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    }
    @Override
    public void onNewIntent(Intent intent) {
    }
}
