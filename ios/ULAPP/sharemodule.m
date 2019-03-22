//
//  share.m
//  Created by song on 2017/7/7.

#import "sharemodule.h"


#import <React/RCTBridgeModule.h>
#import <UMSocialCore/UMSocialCore.h>
#import <UMSocialCore/UMSocialManager.h>

@implementation sharemodule


RCT_EXPORT_MODULE(sharemodule)
RCT_EXPORT_METHOD(share:(NSString*)title descr:(NSString*)descr
                  webpageUrl:(NSString*)webpageUrl
                  thumbURL:(NSString*)thumbURLl
                  NSInteger:(NSInteger)platformType
                  callback:(RCTResponseSenderBlock)callback
                  )
{
  //创建分享消息对象
  UMSocialMessageObject *messageObject = [UMSocialMessageObject messageObject];
  //创建网页内容对象
  NSString* thumbURL =  thumbURLl;
  UMShareWebpageObject *shareObject = [UMShareWebpageObject shareObjectWithTitle:title descr:descr thumImage:thumbURL];
  //设置网页地址
  shareObject.webpageUrl = webpageUrl;
  //分享消息对象设置分享内容对象
  messageObject.shareObject = shareObject;
  
  UMSocialPlatformType type = UMSocialPlatformType_Sina ;
  
  switch (platformType) {
    case 0:
      type = UMSocialPlatformType_QQ;
      break;
    case 1:
      type = UMSocialPlatformType_Sina;
      break;
    case 2:
      type = UMSocialPlatformType_WechatSession;
      break;
    case 3:
      type = UMSocialPlatformType_WechatTimeLine;
      break;
    case 4:
      type = UMSocialPlatformType_Qzone;
      break;
    case 5:
      type = UMSocialPlatformType_Facebook;
      break;
    default:
      break;
  }

  
  dispatch_async(dispatch_get_main_queue(), ^{
    //调用分享接口
    [[UMSocialManager defaultManager] shareToPlatform:type messageObject:messageObject currentViewController:nil completion:^(id data, NSError *error) {
      NSString *code = @"200";
      NSString *message = @"分享成功";
      if (error) {
        UMSocialLogInfo(@"************Share fail with error %@*********",error);
        code = [NSString stringWithFormat:@"%ld",error.code];
        if(error.code == 2009){
          message = @"取消分享";
        }else{
          message = @"分享失败";
        }
      }else{
        if ([data isKindOfClass:[UMSocialShareResponse class]]) {
          UMSocialShareResponse *resp = data;
          //分享结果消息
          UMSocialLogInfo(@"response message is %@",resp.message);
          //第三方原始返回的数据
          UMSocialLogInfo(@"response originalResponse data is %@",resp.originalResponse);
          //          code = @"200";
          //          message = resp.originalResponse;
        }else{
          UMSocialLogInfo(@"response data is %@",data);
        }
      }
      callback( [[NSArray alloc] initWithObjects:code,message, nil]);
    }];
    
  });
}

RCT_EXPORT_METHOD(login:(NSInteger)platformType callback:(RCTResponseSenderBlock)callback){
  UMSocialPlatformType type = [self transPlatformType:platformType];
  dispatch_async(dispatch_get_main_queue(), ^{
    [[UMSocialManager defaultManager] getUserInfoWithPlatform:type currentViewController:nil completion:^(id result, NSError *error) {
      if (error) {
        callback(@[@"error"]);
      }else{
        UMSocialUserInfoResponse *resp = result;
        NSDictionary * message = @{
                                   @"uid":resp.uid,
                                   @"openid":resp.openid,
                                   @"accessToken":resp.accessToken,
                                   @"refreshToken":resp.refreshToken,
                                   @"expiration":resp.expiration,
                                   @"name":resp.name,
                                   @"iconurl":resp.iconurl,
                                   @"gender":resp.gender
                                   };
        callback(@[message]);
      }
    }];
  });
}

- (UMSocialPlatformType)transPlatformType:(NSInteger)platformType{
  switch (platformType) {
    case 0: return UMSocialPlatformType_QQ;
    case 1: return UMSocialPlatformType_Sina;
    case 2: return UMSocialPlatformType_WechatSession;
    case 3: return UMSocialPlatformType_WechatTimeLine;
    case 4: return UMSocialPlatformType_Qzone;
    case 5: return UMSocialPlatformType_Facebook;
    default:return UMSocialPlatformType_Sina;
  }
}

- (void)getUserInfoForPlatform:(UMSocialPlatformType)platformType
{
  [[UMSocialManager defaultManager] getUserInfoWithPlatform:platformType currentViewController:self completion:^(id result, NSError *error) {
    
    UMSocialUserInfoResponse *resp = result;
    
    // 第三方登录数据(为空表示平台未提供)
    // 授权数据
    NSLog(@" uid: %@", resp.uid);
    NSLog(@" openid: %@", resp.openid);
    NSLog(@" accessToken: %@", resp.accessToken);
    NSLog(@" refreshToken: %@", resp.refreshToken);
    NSLog(@" expiration: %@", resp.expiration);
    
    // 用户数据
    NSLog(@" name: %@", resp.name);
    NSLog(@" iconurl: %@", resp.iconurl);
    NSLog(@" gender: %@", resp.unionGender);
    
    // 第三方平台SDK原始数据
    NSLog(@" originalResponse: %@", resp.originalResponse);
  }];
}
- (void)getAuthWithUserInfoFromSina
{
  [[UMSocialManager defaultManager] getUserInfoWithPlatform:UMSocialPlatformType_Sina currentViewController:nil completion:^(id result, NSError *error) {
    if (error) {
      
    } else {
      UMSocialUserInfoResponse *resp = result;
      
      // 授权信息
      NSLog(@"Sina uid: %@", resp.uid);
      NSLog(@"Sina accessToken: %@", resp.accessToken);
      NSLog(@"Sina refreshToken: %@", resp.refreshToken);
      NSLog(@"Sina expiration: %@", resp.expiration);
      
      // 用户信息
      NSLog(@"Sina name: %@", resp.name);
      NSLog(@"Sina iconurl: %@", resp.iconurl);
      NSLog(@"Sina gender: %@", resp.unionGender);
      
      // 第三方平台SDK源数据
      NSLog(@"Sina originalResponse: %@", resp.originalResponse);
    }
  }];
}
- (void)getAuthWithUserInfoFromQQ
{
  [[UMSocialManager defaultManager] getUserInfoWithPlatform:UMSocialPlatformType_QQ currentViewController:nil completion:^(id result, NSError *error) {
    if (error) {
      
    } else {
      UMSocialUserInfoResponse *resp = result;
      
      // 授权信息
      NSLog(@"QQ uid: %@", resp.uid);
      NSLog(@"QQ openid: %@", resp.openid);
      NSLog(@"QQ unionid: %@", resp.unionId);
      NSLog(@"QQ accessToken: %@", resp.accessToken);
      NSLog(@"QQ expiration: %@", resp.expiration);
      
      // 用户信息
      NSLog(@"QQ name: %@", resp.name);
      NSLog(@"QQ iconurl: %@", resp.iconurl);
      NSLog(@"QQ gender: %@", resp.unionGender);
      
      // 第三方平台SDK源数据
      NSLog(@"QQ originalResponse: %@", resp.originalResponse);
    }
  }];
}
- (void)getAuthWithUserInfoFromWechat
{
  [[UMSocialManager defaultManager] getUserInfoWithPlatform:UMSocialPlatformType_WechatSession currentViewController:nil completion:^(id result, NSError *error) {
    if (error) {
      
    } else {
      UMSocialUserInfoResponse *resp = result;
      
      // 授权信息
      NSLog(@"Wechat uid: %@", resp.uid);
      NSLog(@"Wechat openid: %@", resp.openid);
      NSLog(@"Wechat unionid: %@", resp.unionId);
      NSLog(@"Wechat accessToken: %@", resp.accessToken);
      NSLog(@"Wechat refreshToken: %@", resp.refreshToken);
      NSLog(@"Wechat expiration: %@", resp.expiration);
      
      // 用户信息
      NSLog(@"Wechat name: %@", resp.name);
      NSLog(@"Wechat iconurl: %@", resp.iconurl);
      NSLog(@"Wechat gender: %@", resp.unionGender);
      
      // 第三方平台SDK源数据
      NSLog(@"Wechat originalResponse: %@", resp.originalResponse);
    }
  }];
}
- (void)getAuthWithUserInfoFromFacebook
{
  [[UMSocialManager defaultManager] getUserInfoWithPlatform:UMSocialPlatformType_Facebook currentViewController:nil completion:^(id result, NSError *error) {
    if (error) {
      
    } else {
      UMSocialUserInfoResponse *resp = result;
      
      // 授权信息
      NSLog(@"Facebook uid: %@", resp.uid);
      NSLog(@"Facebook accessToken: %@", resp.accessToken);
      NSLog(@"Facebook expiration: %@", resp.expiration);
      
      // 用户信息
      NSLog(@"Facebook name: %@", resp.name);
      
      // 第三方平台SDK源数据
      NSLog(@"Facebook originalResponse: %@", resp.originalResponse);
    }
  }];
}

- (NSDictionary *)constantsToExport{
  return @{
           @"QQ":@(UMSocialPlatformType_QQ),
           @"Sina":@(UMSocialPlatformType_Sina),
           @"Qzone":@(UMSocialPlatformType_Qzone),
           @"WechatSession":@(UMSocialPlatformType_WechatSession),
           @"WechatFavorite":@(UMSocialPlatformType_WechatFavorite),
           @"WechatTimeLine":@(UMSocialPlatformType_WechatTimeLine)
           };
}
@end

