import $ from 'jquery';
import {change_dealers, initauto, initdealerprovince, change_dealercitys, change_autos} from './dict_select';
import { dprovinces, dcitys } from './tb_dealer';

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    query = decodeURI(query)
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

// 监听select的change事件
function handleSelectChange() {

    // 性别单选事件
    $malecheck.on('click', (e) => {
        $malecheck.addClass('is-upgraded is-checked');
        $femalecheck.removeClass('is-upgraded is-checked');
    });
    $femalecheck.on('click', (e) => {
        $femalecheck.addClass('is-upgraded is-checked');
        $malecheck.removeClass('is-upgraded is-checked');
    });

    // 车型车系联动
    $carseries.on('change', (e) => {
        let now = $(e.currentTarget);
        if (!now.parent().hasClass("is-dirty")) {
            now.parent().addClass('is-upgraded is-dirty');
        }
        if ($carseries.val() == '') {
            now.parent().removeClass('is-dirty');
        }
        change_autos($cartypes, $carseries.val(), '');
        $intentBuyStyleMsg.html('')
    });

    $cartypes.on('change', (e) => {
        let now = $(e.currentTarget);
        if (!now.parent().hasClass("is-dirty")) {
            now.parent().addClass('is-upgraded is-dirty');
        }
        if ($cartypes.val() == '') {
            now.parent().removeClass('is-dirty');
        }
        $intentBuyModelMsg.html('')
    });

    // 省份城市经销商联动
    $dealerProvince.on('change', (e) => {
        let now = $(e.currentTarget);
        if (!now.parent().hasClass("is-dirty")) {
            now.parent().addClass('is-upgraded is-dirty');
        }
        if ($dealerProvince.val() == '') {
            now.parent().removeClass('is-dirty');
        }
        change_dealercitys($dealerCity, $dealerProvince.val(), '');
        change_dealers($dealer, '', '');
        $provinceMsg.html('')
    });
    $dealerCity.on('change', (e) => {
        let now = $(e.currentTarget);
        if (!now.parent().hasClass("is-dirty")) {
            now.parent().addClass('is-upgraded is-dirty');
        }
        if ($dealerCity.val() == '') {
            now.parent().removeClass('is-dirty');
        }
        change_dealers($dealer, $dealerCity.val(), '');
        $cityMsg.html('')
    });

    $dealer.on('change', (e) => {
        let now = $(e.currentTarget);
        if (!now.parent().hasClass("is-dirty")) {
            now.parent().addClass('is-upgraded is-dirty');
        }
        if ($dealer.val() == '') {
            now.parent().removeClass('is-dirty');
        }
        $dealerMsg.html('')
    });

    $datetime.on('change', (e) => {
        let now = $(e.currentTarget);
        if (!now.parent().hasClass("is-dirty")) {
            now.parent().addClass('is-upgraded is-dirty');
        }
        if ($datetime.val() == '') {
            now.parent().removeClass('is-dirty');
        }
        $timeMsg.html('')
    });

    // 隐私条款checkbox事件
    $opencheck.on('click', (e) => {
        // e.stopPropagation();
        // e.preventDefault();
        if ($opencheck.hasClass('is-checked')) {
            $opencheck.removeClass('is-upgraded is-checked');
        } else {
            $opencheck.addClass('is-upgraded is-checked');
        }
    });
}

function initSelectedByQuery() {
    let model = getQueryVariable('model');
    let bodyType = getQueryVariable('bodyType');

    const configDom = $('#formConfig')[0];
    if (configDom) {
        const configAttributeValue = configDom.getAttribute('data-config');
        const obj = JSON.parse(configAttributeValue);
    
        model = obj.model;
        bodyType = obj.bodyType;
        campaign = obj.campaign;
    }

    if (bodyType && model) {
        let options = $carseries.find('option');
        for (var i = 0; i < options.length; i++) {
            $(options[i]).removeAttr('selected')
            if ($(options[i]).html() == model) {
                $(options[i]).attr('selected', 'selected');
                $(options[i]).parent().parent().addClass('is-upgraded is-dirty');
            }
        }
        change_autos($cartypes, $carseries.val(), '');
        options = $cartypes.find('option');
        for (var i = 0; i < options.length; i++) {
            $(options[i]).removeAttr('selected')
            if ($(options[i]).html() == bodyType) {
                $(options[i]).attr('selected', 'selected');
                $(options[i]).parent().parent().addClass('is-upgraded is-dirty');
            }
        }
    } else if (model) {
        let options = $carseries.find('option');
        for (var i = 0; i < options.length; i++) {
            $(options[i]).removeAttr('selected')
            if ($(options[i]).html() == model) {
                $(options[i]).attr('selected', 'selected');
                $(options[i]).parent().parent().addClass('is-upgraded is-dirty');
            }
        }
    }
}

function initSelectOptions() {
    //下拉列表初始化
    initauto($carseries, '', $cartypes);
    initdealerprovince($dealerProvince, '');
    change_dealercitys($dealerCity, '', '');
    change_dealers($dealer, '', '');
}

function onSubmit () {
    // 提交按钮点击事件
    var submitflag = true;
    $postbtn.on('click', (e) => {
        let utm = getQueryVariable('utm') ? getQueryVariable('utm') : '';
        let channel = getQueryVariable('channel') ? getQueryVariable('channel') : '';
        let epchannlkey = getQueryVariable('epchannlkey') ? getQueryVariable('epchannlkey') : '';

        let carseries = $carseries.val();
        let cartypes = $cartypes.val();
        let cnname = $inputname.val();
        let sex = '';
        if ($malecheck.hasClass('is-checked')) {
            sex = '男';
        } else {
            sex = '女';
        }
        let mobile = $inputmobile.val();
        let province = $dealerProvince.val();
        let city = $dealerCity.val();
        let dealer = $dealer.val();

        let errflag = true;

        if (!$opencheck.hasClass('is-checked')) {
            //Toast.show('请选择接收隐私条款', 'error', 3000);
            showMsg('请选择接受隐私条款');
            return;
        }

        if ($inputname.val() == null || $inputname.val() == '') {
            $nameMsg.html("*姓名为必填字段");
            errflag = false;
        }

        if (mobile == null || mobile == '') {
            $mobileMsg.html("*移动电话为必填字段");
            errflag = false;
        }

        if (province == null || province == '') {
            $provinceMsg.html("*省份为必填字段");
            errflag = false;
        }

        if (city == null || city == '') {
            $cityMsg.html("*城市为必填字段");
            errflag = false;
        }

        if (dealer == null || dealer == '') {
            $dealerMsg.html("*经销商为必填字段");
            errflag = false;
        }

        if (carseries == null || carseries == '') {
            $intentBuyStyleMsg.html("*意向车系为必填字段");
            errflag = false;
        }

        if (cartypes == null || cartypes == '') {
            $intentBuyModelMsg.html("*意向车型为必填字段");
            errflag = false;
        }

        if (!errflag) {
            return;
        }

        var telReg = /^1[3|4|5|6|7|8][0-9]\d{8}$/;
        if (cnname.toString().length > 60) {
            //Toast.show('您填写的姓名不正确', 'error', 2000);
            //showMsg('您填写的姓名不正确');
            $nameMsg.html('*您填写的姓名不正确');
            errflag = false;
        }

        if (mobile.toString().length > 20 || !telReg.test(mobile.toString())) {
            //Toast.show('您填写的移动电话不正确', 'error', 2000);
            //showMsg('您填写的移动电话不正确');
            $mobileMsg.html('*您填写的移动电话不正确');
            errflag = false;
        }

        if (errflag) {
            // $loading.show()

            let fm = new FormData();
            fm.append("epchannlkey",epchannlkey);
            fm.append("channel",channel);
            fm.append("utm_source",utm);
            fm.append("carseries",carseries);
            fm.append("cartype",cartypes);
            fm.append("cnname",cnname);
            fm.append("campaign", campaign);
            fm.append("mobile",mobile);
            fm.append("province",province);
            fm.append("city",city);
            fm.append("dealername",dealer);

            // AA Integration
            let aa_carseries = $carseries.find('option:selected').text()
            let aa_cartypes = $cartypes.find('option:selected').text()

            if (submitflag) {
                submitflag = false;
                $.ajax(
                    {
                        type: "POST",
                        url: "https://contact.audi.cn/contact/testdrive_addReleaseFtrueAppEP",
                        // url: "https://contact.audi.cn" + "/contact/testdrive_add.json",
                        data: fm,
                        // data: JSON.stringify(data),
                        // dataType : "json",
                        // contentType : "application/json",
                        contentType: false,
                        processData: false,
                        success: function(res){
                            try {
                                if(res.success){
                                    // $warningImg.hide()
                                    // $successImg.show()
                                    // $notificationsMsg.html("提交成功")
                                    // $notifications.addClass("is-open");
                                    // $notifications.parent().show();
                                    // window.setTimeout(function(){
                                    //     $notifications.removeClass("is-open");
                                    //     $notifications.parent().hide();
                                    // },2000);
                                    showMsg('提交成功', 'success');
                                }else{
                                    if(res.message == '重复提交'){
                                        // $warningImg.show()
                                        // $successImg.hide()
                                        // $notificationsMsg.html("重复提交")
                                        // $notifications.addClass("is-open");
                                        // window.setTimeout(function(){
                                        //     $notifications.removeClass("is-open");
                                        // },2000);
                                        showMsg('重复提交');
                                    }else{
                                        // $warningImg.show()
                                        // $successImg.hide()
                                        // $notificationsMsg.html("提交失败")
                                        showMsg('提交失败');
                                    }
                                }
                            }catch(e){

                            }
                        },
                        complete: function () {
                            submitflag = true;
                            $loading.hide()
                            window.sessionStorage.setItem("last_view_car", aa_cartypes);
                            window.sessionStorage.setItem("last_view_carseries", aa_carseries);
                        }
                    }
                );
                submitflag = true;
            }
        }
    });
}
function removeChars(str, charsToRemove) {
    // 将charsToRemove中的每个字符都转换成正则表达式中的字符类
    const charsToRemoveRegex = `[${charsToRemove}]`;
    // 使用正则表达式匹配所有需要删除的字符，并用空字符串替换
    const result = str.replace(new RegExp(charsToRemoveRegex, 'g'), '');
    return result;
}
function map_init(){
    console.log(dprovinces);
    // 创建地理定位实例
    var geolocation = new BMap.Geolocation();
    // 启用SDK辅助定位
    geolocation.enableSDKLocation();
    // 定位成功的回调函数
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            // 获取当前位置的经纬度
            var mk = new BMap.Marker(r.point);
            
            // 创建地址解析器实例
            var pt = new BMap.Point(r.point.lng, r.point.lat);
            var geoc = new BMap.Geocoder();
            geoc.getLocation(pt, function(rs){
                var addComp = rs.addressComponents;
                // 获取省市
                var province = addComp.province;
                var city = addComp.city;
                for (let index = 0; index < dprovinces.length; index++) {
                    const element = dprovinces[index];
                    if(element[1].indexOf(removeChars(province,'省市'))!==-1){
                        initdealerprovince($dealerProvince, element[0]);
                        const dprovincesId = element[0];
                        for (let index2 = 0; index2 < dcitys[dprovincesId].length; index2++) {
                            if(dcitys[dprovincesId][index2][1].indexOf(removeChars(city,'省市'))!==-1){
                                console.log(dcitys[dprovincesId][index2][0]);
                                change_dealercitys($dealerCity, element[0], dcitys[dprovincesId][index2][0]);
                            }
                        }
                    }
                }
            });
        }
        else {
            // 获取定位状态
            console.log('获取位置失败：' + this.getStatus());
        }        
    });
}
function map_load() {
    var load = document.createElement("script");
    load.src = "https://api.map.baidu.com/api?v=3.0&ak=sGmkcFHVDl5HM6lT99RVGKjXD9MISBVW&callback=map_init";
    document.body.appendChild(load);
}

// 声明对象
let $testdriver = null;
let $malecheck = null;
let $femalecheck = null;
let $inputname = null;
let $inputmobile = null;
let $carseries = null;
let $cartypes = null;
let $dealerProvince = null;
let $dealerCity = null;
let $dealer = null;
let $opencheck = null;
let $privacy = null;
let $postbtn = null;
let $errdiv = null;
let $errmsg = null;
let $successdiv = null;
let $loading = null;
let $datetime = null;

let $intentBuyStyleMsg = null;
let $intentBuyModelMsg = null;
let $provinceMsg = null;
let $cityMsg = null;
let $dealerMsg = null;
let $nameMsg = null;
let $mobileMsg = null;
let $timeMsg = null;
let $img = null;

let $lastViewCar = null;
let $lastViewCarMob = null;

let ts = new Date().getTime();
let campaign = '';

//顶部消息toast
let showMsg = (msg, type = 'warn') => {
    $errmsg.html(msg);
    $errdiv.find('img').hide();
    $errdiv.find(`img.${type}`).show();
    $errdiv.show();
    setTimeout(function () {
        $errdiv.hide();
    }, 3000)
}
let showSuccess = () => {
    $successdiv.show();
    setTimeout(function () {
        $successdiv.hide();
    }, 3000)
}
$(function() {
    // 声明对象
    $testdriver = $('#testdrive');
    $malecheck = $testdriver.find("#male");
    $femalecheck = $testdriver.find("#female");
    $inputname = $testdriver.find("#inputname");
    $inputmobile = $testdriver.find("#inputmobile");
    $carseries = $testdriver.find("#atd_atdIntentCar");
    $cartypes = $testdriver.find("#atd_atdIntentModel");
    $dealerProvince = $testdriver.find("#dealerProvince");
    $dealerCity = $testdriver.find("#dealerCity");
    $dealer = $testdriver.find("#dealer");
    $opencheck = $testdriver.find("#open");
    $privacy = $testdriver.find(".privacy");
    $postbtn = $testdriver.find("#postbtn");
    $errdiv = $testdriver.find(".window-warn");
    $errmsg = $errdiv.find(".message");
    $successdiv = $testdriver.find(".successed");
    $loading = $testdriver.find(".loading");
    $datetime = $testdriver.find("#datetime");

    $intentBuyStyleMsg = $testdriver.find("#intentBuyStyleMsg");
    $intentBuyModelMsg = $testdriver.find("#intentBuyModelMsg");
    $provinceMsg = $testdriver.find("#provinceMsg");
    $cityMsg = $testdriver.find("#cityMsg");
    $dealerMsg = $testdriver.find("#dealerMsg");
    $nameMsg = $testdriver.find("#nameMsg");
    $mobileMsg = $testdriver.find("#mobileMsg");
    $timeMsg = $testdriver.find("#timeMsg");
    $img = $testdriver.find(".img");

    $lastViewCar = $testdriver.find("#last-view-car");
    $lastViewCarMob = $testdriver.find("#last-view-car-mob");

    ts = new Date().getTime();

    // map_load();
    map_init();

    initSelectOptions();
    handleSelectChange();
    initSelectedByQuery();

    onSubmit();
})