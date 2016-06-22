/**
 * Created by hejing on 15/11/25.
 */

function getOpenId(options){
    var option = {
        IPLocation:options.IPLocation,
        inlet:options.inlet,
        jackU : getUrlPara('jack'),
        codes : getUrlPara('code'),
        openid:localStorage.getItem('openid'),
        appid:options.appid,
        redirect_uri:options.redirect_uri
    }

    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)!="micromessenger") {
        localStorage.setItem('jack',option.jackU);
        specify();
        return false;
    }

    if(isObj(option.jackU)){
        localStorage.setItem('jack',option.jackU);
        localStorage.removeItem('code');
        //localStorage.removeItem('openid');
        if(isObj(option.openid)){
            specify();
        }
    }

    if(!isObj(option.openid) && !isObj(option.codes)){
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
            "appid="+option.appid+"&"+
            "redirect_uri="+option.redirect_uri+
            "&response_type=code" +
            "&scope=snsapi_base" +
            "&state=1" +
            "&connect_redirect=1#wechat_redirect";
    }else if(!isObj(option.openid) && isObj(option.codes)){
        ga_ajax({
            "async" : true,
            "method" : "get",
            "url" : option.IPLocation,
            "data":{
                "code":option.codes
            },
            "success" : function(data){
                var obj = eval('(' + data + ')');
                option.openid = obj.openid;
                localStorage.setItem('openid',obj.openid);
                specify();
            },
            "Error": function(text){
                alert(text);
            }
        });
    }

    function getUrlPara(strName){
        var strHref =  location.href;
        var intPos = strHref.indexOf("?");
        var strRight = strHref.substr(intPos + 1);
        var arrTmp = strRight.split("&");
        for(var i = 0; i < arrTmp.length; i++) {
            var arrTemp = arrTmp[i].split("=");
            if(arrTemp[0].toUpperCase() == strName.toUpperCase()) {
                if(arrTemp[1].indexOf('#') > 0){
                    arrTemp[1] = arrTemp[1].substring(0,arrTemp[1].length-1);
                }else{
                    return arrTemp[1];
                }
            }
        }
        return null;
    }

    function specify(){
        var jack = localStorage.getItem('jack');
        window.location.href = option.inlet[jack];
    }

    function isObj(str){
        var state = true;
        if(str == null){
            state = false;
        }
        if(str == undefined){
            state = false;
        }
        if(str == 'undefined'){
            state = false;
        }
        if(str == ""){
            state = false;
        }
        if(str == "null"){
            state = false;
        }
        return state;
    }

    function writeObj(obj){
        var description = "";
        for(var i in obj){
            var property=obj[i];
            description+=i+" = "+property+"\n";
        }
        alert(description);
    }


    // ����xhr����
    function createXHR(){
        if(typeof XMLHttpRequest != "undefined"){ // ��IE6�����
            return new XMLHttpRequest();
        }else if(typeof ActiveXObject != "undefined"){   // IE6�����
            var version = [
                "MSXML2.XMLHttp.6.0",
                "MSXML2.XMLHttp.3.0",
                "MSXML2.XMLHttp",
            ];
            for(var i = 0; i < version.length; i++){
                try{
                    return new ActiveXObject(version[i]);
                }catch(e){
                    //����
                }
            }
        }else{
            throw new Error("����ϵͳ���������֧��XHR����");
        }
    }
    // ת���ַ�
    function params(data){
        var arr = [];
        for(var i in data){
            arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]));
        }
        return arr.join("&");
    }
    // ��װajax
    function ga_ajax(obj){
        var xhr = createXHR();
        obj.url = obj.url + "?rand=" + Math.random(); // �������
        obj.data = params(obj.data);      // ת���ַ���
        if(obj.method === "get"){      // �ж�ʹ�õ��Ƿ���get��ʽ����
            obj.url += obj.url.indexOf("?") == "-1" ? "?" + obj.data : "&" + obj.data;
        }
        // �첽
        if(obj.async === true){
            // �첽��ʱ����Ҫ����onreadystatechange�¼�
            xhr.onreadystatechange = function(){
                // ִ�����
                if(xhr.readyState == 4){
                    callBack();
                }
            }
        }
        xhr.open(obj.method,obj.url,obj.async);  // false��ͬ�� true���첽 // "demo.php?rand="+Math.random()+"&name=ga&ga",
        if(obj.method === "post"){
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xhr.send(obj.data);
        }else{
            xhr.send(null);
        }
        // xhr.abort(); // ȡ���첽����
        // ͬ��
        if(obj.async === false){
            callBack();
        }
        // ��������
        function callBack(){
            // �ж��Ƿ񷵻���ȷ
            if(xhr.status == 200){
                obj.success(xhr.responseText);
            }else{
                obj.Error("��ȡ����ʧ�ܣ��������Ϊ��"+xhr.status+"������ϢΪ��"+xhr.statusText);
            }
        }
    }
}