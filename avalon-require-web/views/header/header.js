/**
 * Created by flyjennyetn on 2016/1/12.
 */
define(['jquery','cookie','layer_'], function($,jQcookie,layer_) {
    var header = avalon.define({
        $id: "header",
        loginLayer:null,
        loginLayerObj:null
    });

    return avalon.controller(function($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function() {

        };
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {};
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [header];
    });
})
