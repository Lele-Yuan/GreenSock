/** 初始化 */

import { autos, autosmodel } from './dict_autos';
import { dprovinces, dcitys, dealers } from './tb_dealer';

function initdict(obj, dicts, def, deftext, obj2) {
    //var obj = document.getElementById(id);
    obj.empty();
    var opts = obj.find("option");
    if (!deftext) deftext = '请选择';
    obj.append('<option value="88888" >' + deftext + '</option>');
    if (dicts && dicts.length > 0)
        for (var i = 0; i < dicts.length; i++) {
            var opt = '';
            if (dicts[i][0] == '99999') {
                opt = '<option value="' + dicts[i][0] + '" selected>' + dicts[i][1] + '</option>';

                change_autos(obj2, '99999', '9999');

            } else if (dicts[i][0] == def) {
                opt = '<option value="' + dicts[i][0] + '" selected>' + dicts[i][1] + '</option>';
            } else {
                opt = '<option value="' + dicts[i][0] + '">' + dicts[i][1] + '</option>';
            }
            obj.append(opt);
        }
    obj.trigger("chosen:updated");
    obj.change();
}

/**
* @param obj 元素ID
* @param dicts 需要遍历的数组
* @param def 默认值
* @return
*/
function initaddress(obj, dicts, def) {
    var opts = obj.options;
    opts.length = 0;
    opts.add(new Option('省', ''));
    if (dicts && dicts.length > 0)
        for (var i = 0; i < dicts.length; i++) {
            //alert(dicts[i][1]);	//名称
            //alert(dicts[i][0]); 	//id
            if (dicts[i][1] != '台湾' && dicts[i][1] != '香港' && dicts[i][1] != '澳门') {
                var opt = new Option(dicts[i][1], dicts[i][0]);
                if (dicts[i][0] == def) {
                    opt.selected = true;
                }
                $(opt).attr('title', dicts[i][1]);
                opts.add(opt);
                obj.trigger("chosen:updated");
            }
        }
}

/** 初始化经销商省 */
function initdealerprovince(dpid, def, deftext) {
    if (!deftext) {
        deftext = '请选择省份';
    }
    initdict(dpid, dprovinces, def, deftext);
}

//获取省下的经销商
function getprovincedealer(province) {
    var provincedealers = [];
    var pcitys = dcitys[province];
    for (var i = 0; i < pcitys.length; i++) {
        var dealer = dealers[pcitys[i][0]];
        provincedealers = provincedealers.concat(dealer);
    }
    return provincedealers;
}

/** 经销商城市选择 */
function change_dealercitys(dcid, dpid, def, deftext) {
    if (!deftext) {
        deftext = '请选择城市';
    }
    var pcitys = dcitys[dpid];
    initdict(dcid, pcitys, def, deftext);
}

//获取城市下的经销商
function getcitydealer(city) {
    var citydealer = dealers[city];
    return citydealer;
}

/** 经销商选择 */
function change_dealers(did, dcid, def) {
    var dealer = dealers[dcid];
    initdict_ryyj(did, dealer, def);
}
function initdict_ryyj(obj, dicts, def) {
    obj.empty();
    // obj.append('<option value="" >经销商</option>');	
    // if(def == '-1'){
    //     obj.append('<option value="-1" selected>任意一家</option>');	
    // }else{
    // 	obj.append('<option value="-1" >任意一款</option>');
    // }
    if (dicts && dicts.length > 0)
        for (var i = 0; i < dicts.length; i++) {
            var opt = '';
            if (dicts[i][0] == def) {
                opt = '<option value="' + dicts[i][0] + '" selected>' + dicts[i][1] + '</option>';
            } else if (i == 0) {
                opt = '<option value="' + dicts[i][0] + '" selected>' + dicts[i][1] + '</option>';
            } else {
                opt = '<option value="' + dicts[i][0] + '">' + dicts[i][1] + '</option>';
            }
            obj.append(opt);
        } else {
        obj.append('<option value="88888" >请选择经销商</option>');
    }
    obj.trigger("chosen:updated");
    obj.change();
}


/** 初始化车系 */
function initauto(aid, def, obj2) {
    initdict(aid, autos, def, '车系', obj2);
}
/** 车型选择 */
function change_autos(mid, aid, def) {
    var bmodels = autosmodel[aid];
    initdict_ryyk(mid, bmodels, def, '车型');
}

/** 初始化意向车型*/
function initdict_ryyk(obj, dicts, def, deftext) {
    obj.empty();
    if (!deftext) deftext = '请选择';
    obj.append('<option value="" >' + deftext + '</option>');
    if (dicts && dicts.length > 0)
        for (var i = 0; i < dicts.length; i++) {
            var opt = '';

            if (dicts[i][0] == '9999') {
                opt = '<option value="' + dicts[i][0] + '" selected>' + dicts[i][1] + '</option>';
            } else if (dicts[i][0] == def) {
                opt = '<option value="' + dicts[i][0] + '" selected>' + dicts[i][1] + '</option>';
            } else {
                opt = '<option value="' + dicts[i][0] + '">' + dicts[i][1] + '</option>';
            }
            obj.append(opt);
        }
    if (def == '-1') {
        obj.append('<option value="-1" selected>任意一款</option>');
    } else {
        obj.append('<option value="-1" >任意一款</option>');
    }

    obj.trigger("chosen:updated");
}

export {
    initdealerprovince,
    getprovincedealer,
    change_dealercitys,
    getcitydealer,
    change_dealers,
    initauto,
    change_autos,
}