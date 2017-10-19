var share = {
    init :function(event){

        var ua = utils.getBrowserUA();
        if(ua.isWechat){
            // document.write("<script src='" + config.wechat.sdkPath + "'><\/script>");
            browserShare.wechatShare.initWeiXin();
        }
        event.on('click',function(){
            share.showSharePanel();
        });
    },
    option :function(){

    },
    showSharePanel :function(){
        //判断ua初始化分享面板
        var ua = utils.getBrowserUA();
        
        var shareFunc = ua.isApp ? appShare : browserShare ;
        
        var sharePanelHtml ='<div class="sharePanel">'+
                            '   <section class="w-sharing j-share">'+
                            '       <div class="module">'+
                            '           <ul class="method">'+
                            '               <li>'+
                            '                   <a data-app="sinaWeibo" href="javascript:void(0)" class="share-weibo">'+
                            '                       <i class="icon-sharing icon-sharing-weibo"></i>'+
                            '                       <strong>新浪微博</strong>'+
                            '                   </a>'+
                            '               </li>'+
                            '               <li>'+
                            '                   <a data-app="QZone" href="javascript:void(0)" class="share-qzone">'+
                            '                       <i class="icon-sharing icon-sharing-qq-zone"></i>'+
                            '                       <strong>QQ空间</strong>'+
                            '                   </a>'+
                            '               </li>'+
                            '               <li>'+
                            '                   <a data-app="weixin" href="javascript:void(0)" class="share-wechat">'+
                            '                       <i class="icon-sharing icon-sharing-wechat-friend"></i>'+
                            '                       <strong>微信好友</strong>'+
                            '                   </a>'+
                            '               </li>'+
                            '               <li>'+
                            '                   <a data-app="weixinFriend" href="javascript:void(0)" class="share-wechat">'+
                            '                       <i class="icon-sharing icon-sharing-wechat-circle"></i>'+
                            '                       <strong>微信朋友圈</strong>'+
                            '                   </a>'+
                            '               </li>'+
                            '           </ul>'+
                            '           <div class="cancel">取消</div>'+
                            '       </div>'+
                            '       <div class="module-wechat fn-hide">'+
                            '           <div class="item friend">'+
                            '               <strong>发送给朋友</strong>'+
                            '           </div>'+
                            '           <div class="item circle">'+
                            '               <strong>分享到朋友圈</strong>'+
                            '           </div>'+
                            '       </div>'+
                            '       <div class="module-guide fn-hide">'+
                            '           <div class="guide"></div>'+
                            '           <div class="cancel">我知道了</div>'+
                            '       </div>'+
                            '       <div class="mask"></div>'+
                            '   </section>'+
                            '</div>';

        

        $('body').append(sharePanelHtml);

        var $sharePanel = $('.sharePanel section');
        var $cancelBtn = $('.j-share .module .cancel');
        var $shareWeiboBtn =  $('.share-weibo');
        var $shareQZoneBtn = $('.share-qzone');
        var $shareWechatBtn = $('.share-wechat');

        if(!ua.isWechat && !ua.isSafari && !ua.isApp){
            //safari下引导用户，除外浏览器隐藏微信分享
            $shareWechatBtn.parent().remove();
        }

        $cancelBtn.on('click',function(event){
            //取消按钮
            event.preventDefault();
            event.stopPropagation();
            share.cancelClick();
        });
        $shareWeiboBtn.on('click',function(){
            //微博分享
            shareFunc.weiboShare.init();
            
        });
        $shareQZoneBtn.on('click',function(){
            //分享QZone
            shareFunc.qzoneShare.init();
        });
        $shareWechatBtn.on('click',function(event){
            //微信分享
            shareFunc.wechatShare.init();
            
        })
    },
    cancelClick :function(){
        $('.sharePanel').remove();
    },
    
}


var browserShare = {

    wechatShare :{
        init :function(){
            var ua = utils.getBrowserUA();
            if (!ua.isWechat && ua.isSafari){
                //如果不是微信环境
                $('.j-share .module').hide();
                browserShare.wechatShare.showGuidePic();
                return;
            }

            browserShare.wechatShare.showWechatGuidShadow($('.sharePanel section'));
        },
        initWeiXin: function () {
            $.ajax({
                type : 'GET',
                url : config.api.wechat,
                success : function(res){
                    if (res.code != 0 || res.result == null) {
                        console.log('获取微信配置信息接口异常')
                        return false;
                    } else {
                        var data = res.result;
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: data.appId, // 必填，公众号的唯一标识
                            timestamp: data.timestamp, // 必填，生成签名的时间戳
                            nonceStr: data.nonceStr, // 必填，生成签名的随机串
                            signature: data.signature,// 必填，签名，见附录1
                            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                        wx.ready(function () {
                            // 分享到朋友圈
                            wx.onMenuShareTimeline({
                                title: config.wechat.wxTitle,
                                desc: config.wechat.wxDesc,
                                link: config.wechat.wxshareurl,
                                imgUrl: config.wechat.wximgurl,
                                success: function () {
                                    browserShare.wechatShare.shareCallback();
                                },
                                cancel: function () {
                                    browserShare.wechatShare.shareCallback();
                                    //alertlayer({w: "分享失败！"});
                                }
                            });
                            // 分享给微信朋友
                            wx.onMenuShareAppMessage({
                                title: config.wechat.wxTitle,
                                desc: config.wechat.wxDesc,
                                link: config.wechat.friendsUrl,
                                imgUrl: config.wechat.wximgurl,
                                success: function () {
                                    browserShare.wechatShare.shareCallback();
                                },
                                cancel: function () {
                                    browserShare.wechatShare.shareCallback();
                                    //alertlayer({w: "分享失败！"});
                                }
                            });
                        });
                    }
                }
            });
        },
        // 分享后的回调
        shareCallback: function (type) {
            $('.sharePanel').remove();
        },
        showGuidePic :function(){
            //浏览器点击微信分享操作引导图
            $('.module-guide').removeClass('fn-hide');
            $('.j-share .module-guide .cancel').on('click',function(){
                $('.j-share .module').show();
                $('.module-guide').addClass('fn-hide');
            })
        },
        showWechatGuidShadow :function(){
            //微信分享操作引导图
            $('.module-wechat').removeClass('fn-hide');
            $('.sharePanel .j-share .module').addClass('fn-hide');
            $('.module-wechat').on('click',function(){
                $('.sharePanel .j-share .module').removeClass('fn-hide');
                $('.module-wechat').addClass('fn-hide');
            });
            $('.sharePanel .j-share .mask').on('click',function(){
                $('.sharePanel').remove();
            });
        },
    },
    weiboShare :{
        init : function(){
            var shareConfig = {
                url : config.sina.shareurl,
                title : config.sina.title,
                pic : config.sina.pic,
                appkey : config.wbAppkey,
            };
            var params = [];
            for(var i in shareConfig){
                params.push(i + '=' + encodeURIComponent(shareConfig[i]||''));
            }

            browserShare.weiboShare.share(params.join('&'));
            
        },
        share : function(param){
            var shareUrl = config.sina.targetUrl + param ;
            window.location.href = shareUrl;
        } 
    },
    qzoneShare :{
        init : function(){
            var shareConfig = {
                url : config.qzone.url,
                showcount : config.qzone.showcount,
                desc : config.qzone.desc,
                summary : config.qzone.summary,
                title : config.qzone.title,
                site : config.qzone.site,
                pics : config.qzone.pics,
                style : config.qzone.style,
                width : config.qzone.width,
                height : config.height
            };
            var params = [];
            for(var i in shareConfig){
                params.push(i + '=' + encodeURIComponent(shareConfig[i]||''));
            }

            browserShare.qzoneShare.share(params.join('&'));
            
        },
        share : function(param){
            var shareUrl = config.qzone.targetUrl + param ;
            window.location.href = shareUrl;
        } 
        
    }
}


var appShare = {
    wechatShare : {
        init : function(){
            console.log(1)
        }
    },
    qzoneShare : {
        init : function(){
            console.log(2)
        }
    },
    weiboShare : {
        init : function(){
            console.log(3)
        }
    }
}

var utils = {
    getBrowserUA : function(){
        var ua = window.navigator.userAgent.toLowerCase();
        var uaResult = {
            isWechat : ua.match(/MicroMessenger/i) != null,
            isSafari : ua.match(/version\/([\d.]+).*safari/) !=null,
            isChrome : ua.match(/chrome\/([\d.]+)/) != null,
            isApp : false,
        };

        return uaResult;
    }
}
