var config = {
    
    api :{
        wechat : '',
        weibo : ''
    },
   
    wechat: {
        sdkPath : 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js',
        wxAppId : '',
        wxshareurl: location.href,//朋友圈
        friendsUrl: location.href,//微信朋友
        wxTitle: "",  //微信分享标题
        wxDesc: "",   //微信分享描述
        wximgurl: "", //微信分享小图标
    },

    sina: {
        targetUrl : 'http://service.weibo.com/share/share.php?',
        weiboAuthUrl: "",//获取新浪微博授权地址
        wbAppkey : '',
        shareurl: '',
        title : "",
        pic : "",
    },

    qzone: {
        targetUrl : 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?',
        url : "",
        showcount : '0',/*是否显示分享总数,显示：'1'，不显示：'0' */
        desc : '',/*默认分享理由(可选)*/
        summary : '',/*分享摘要(可选)*/
        title : '',/*分享标题(可选)*/
        site : '',/*分享来源 如：腾讯网(可选)*/
        pics : '',/*分享图片的路径(可选)*/
        style : '203',
        width : 98,
        height : 22
    }

}
