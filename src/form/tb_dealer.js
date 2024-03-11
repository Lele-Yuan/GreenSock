var dprovinces = [];
var dcitys = [];
var dealers = [];
dprovinces[0] = ['556', 'A 安徽'];
dprovinces[1] = ['81', 'B 北京'];
dprovinces[2] = ['490', 'C 重庆'];
dprovinces[3] = ['519', 'F 福建'];
dprovinces[4] = ['575', 'G 甘肃'];
dprovinces[5] = ['512', 'G 广东'];
dprovinces[6] = ['581', 'G 广西'];
dprovinces[7] = ['585', 'G 贵州'];
dprovinces[8] = ['591', 'H 海南'];
dprovinces[9] = ['559', 'H 河北'];
dprovinces[10] = ['566', 'H 河南'];
dprovinces[11] = ['553', 'H 黑龙江'];
dprovinces[12] = ['524', 'H 湖北'];
dprovinces[13] = ['527', 'H 湖南'];
dprovinces[14] = ['549', 'J 吉林'];
dprovinces[15] = ['491', 'J 江苏'];
dprovinces[16] = ['583', 'J 江西'];
dprovinces[17] = ['529', 'L 辽宁'];
dprovinces[18] = ['577', 'N 内蒙古'];
dprovinces[19] = ['587', 'N 宁夏'];
dprovinces[20] = ['589', 'Q 青海'];
dprovinces[21] = ['83', 'S 山东'];
dprovinces[22] = ['542', 'S 山西'];
dprovinces[23] = ['571', 'S 陕西'];
dprovinces[24] = ['489', 'S 上海'];
dprovinces[25] = ['546', 'S 四川'];
dprovinces[26] = ['488', 'T 天津'];
dprovinces[27] = ['1305', 'X 西藏'];
dprovinces[28] = ['573', 'X 新疆'];
dprovinces[29] = ['569', 'Y 云南'];
dprovinces[30] = ['500', 'Z 浙江'];
dcitys['556'] = [['1167', 'A 安庆'], ['1162', 'B 蚌埠'], ['1174', 'B 毫州'], ['1175', 'C 池州'], ['1169', 'C 滁州'], ['1170', 'F 阜阳'], ['557', 'H 合肥'], ['1165', 'H 淮北'], ['1163', 'H 淮南'], ['1168', 'H 黄山'], ['1173', 'L 六安'], ['1164', 'M 马鞍山'], ['1171', 'S 宿州'], ['1166', 'T 铜陵'], ['558', 'W 芜湖'], ['1176', 'X 宣城']];
dcitys['81'] = [['82', 'B 北京']];
dcitys['490'] = [['1044', 'C 重庆']];
dcitys['519'] = [['520', 'F 福州'], ['1078', 'L 龙岩'], ['1077', 'N 南平'], ['1079', 'N 宁德'], ['1074', 'P 莆田'], ['521', 'Q 泉州'], ['1075', 'S 三明'], ['522', 'X 厦门'], ['1076', 'Z 漳州']];
dcitys['575'] = [['1247', 'J 酒泉'], ['576', 'L 兰州'], ['1248', 'Q 庆阳'], ['1243', 'T 天水']];
dcitys['512'] = [['1071', 'C 潮州'], ['514', 'D 东莞'], ['516', 'F 佛山'], ['513', 'G 广州'], ['1065', 'H 惠州'], ['1061', 'J 江门'], ['1072', 'J 揭阳'], ['1063', 'M 茂名'], ['1066', 'M 梅州'], ['1070', 'Q 清远'], ['1059', 'S 汕头'], ['1060', 'S 韶关'], ['518', 'S 深圳'], ['1069', 'Y 阳江'], ['1062', 'Z 湛江'], ['1064', 'Z 肇庆'], ['517', 'Z 中山'], ['515', 'Z 珠海']];
dcitys['581'] = [['1265', 'B 北海'], ['1263', 'G 桂林'], ['1262', 'L 柳州'], ['582', 'N 南宁']];
dcitys['585'] = [['1287', 'A 安顺'], ['1289', 'B 毕节'], ['586', 'G 贵阳'], ['1285', 'L 六盘水'], ['1291', 'Q 黔东南苗族侗族自治州'], ['1292', 'Q 黔南布依族苗族自治州'], ['1290', 'Q 黔西南布依苗族自治州'], ['1288', 'T 铜仁'], ['1286', 'Z 遵义']];
dcitys['591'] = [['592', 'H 海口'], ['1304', 'S 三亚']];
dcitys['559'] = [['562', 'B 保定'], ['563', 'C 沧州'], ['1179', 'C 承德'], ['564', 'H 邯郸'], ['1181', 'H 衡水'], ['1180', 'L 廊坊'], ['565', 'Q 秦皇岛'], ['560', 'S 石家庄'], ['561', 'T 唐山'], ['1177', 'X 邢台'], ['1178', 'Z 张家口']];
dcitys['566'] = [['1187', 'A 安阳'], ['1184', 'J 焦作'], ['1182', 'K 开封'], ['568', 'L 洛阳'], ['1190', 'L 漯河'], ['1192', 'N 南阳'], ['1183', 'P 平顶山'], ['1188', 'P 濮阳'], ['1193', 'S 商丘'], ['1186', 'X 新乡'], ['1194', 'X 信阳'], ['1189', 'X 许昌'], ['567', 'Z 郑州'], ['1195', 'Z 周口'], ['1196', 'Z 驻马店']];
dcitys['553'] = [['555', 'D 大庆'], ['554', 'H 哈尔滨'], ['1156', 'J 佳木斯'], ['1158', 'M 牡丹江'], ['1151', 'Q 齐齐哈尔'], ['1160', 'S 绥化']];
dcitys['524'] = [['1090', 'E 恩施土家族苗族自治州'], ['1087', 'H 黄冈'], ['1080', 'H 黄石'], ['1084', 'J 荆门'], ['1083', 'J 荆州'], ['1082', 'S 十堰'], ['1089', 'S 随州'], ['525', 'W 武汉'], ['1081', 'X 襄樊'], ['526', 'Y 宜昌']];
dcitys['527'] = [['1100', 'C 常德'], ['528', 'C 长沙'], ['1103', 'C 郴州'], ['1097', 'H 衡阳'], ['1105', 'H 怀化'], ['1106', 'L 娄底'], ['1098', 'S 邵阳'], ['1096', 'X 湘潭'], ['1102', 'Y 益阳'], ['1104', 'Y 永州'], ['1099', 'Y 岳阳'], ['1101', 'Z 张家界'], ['1095', 'Z 株洲']];
dcitys['549'] = [['550', 'C 长春'], ['551', 'J 吉林'], ['1148', 'S 松原'], ['593', 'T 通化'], ['1150', 'Y 延边朝鲜族自治州']];
dcitys['491'] = [['493', 'C 常州'], ['1052', 'H 淮安'], ['1051', 'L 连云港'], ['492', 'N 南京'], ['494', 'N 南通'], ['499', 'S 苏州'], ['1055', 'S 宿迁'], ['1054', 'T 泰州'], ['496', 'W 无锡'], ['498', 'X 徐州'], ['1053', 'Y 盐城'], ['495', 'Y 扬州'], ['594', 'Z 镇江']];
dcitys['583'] = [['1283', 'F 抚州'], ['1280', 'G 赣州'], ['1281', 'J 吉安'], ['1275', 'J 景德镇'], ['1277', 'J 九江'], ['584', 'N 南昌'], ['1284', 'S 上饶'], ['1282', 'Y 宜春']];
dcitys['529'] = [['531', 'A 鞍山'], ['1116', 'C 朝阳'], ['1108', 'D 大连'], ['1111', 'D 丹东'], ['1112', 'F 阜新'], ['1117', 'H 葫芦岛'], ['532', 'J 锦州'], ['1113', 'L 辽阳'], ['1114', 'P 盘锦'], ['530', 'S 沈阳'], ['1115', 'T 铁岭'], ['533', 'Y 营口']];
dcitys['577'] = [['1257', 'B 巴彦淖尔'], ['579', 'B 包头'], ['1254', 'C 赤峰'], ['580', 'E 鄂尔多斯'], ['578', 'H 呼和浩特'], ['1256', 'H 呼伦贝尔'], ['1255', 'T 通辽'], ['1253', 'W 乌海'], ['1260', 'X 锡林郭勒盟'], ['1259', 'X 兴安盟']];
dcitys['587'] = [['588', 'Y 银川']];
dcitys['589'] = [['590', 'X 西宁']];
dcitys['83'] = [['1049', 'B 滨州'], ['541', 'D 德州'], ['540', 'D 东营'], ['1050', 'H 菏泽'], ['86', 'J 济南'], ['539', 'J 济宁'], ['1047', 'L 莱芜'], ['1048', 'L 聊城'], ['535', 'L 临沂'], ['84', 'Q 青岛'], ['1046', 'R 日照'], ['538', 'T 泰安'], ['537', 'W 威海'], ['534', 'W 潍坊'], ['85', 'Y 烟台'], ['1045', 'Z 枣庄'], ['536', 'Z 淄博']];
dcitys['542'] = [['1119', 'C 长治'], ['544', 'D 大同'], ['1120', 'J 晋城'], ['1122', 'J 晋中'], ['545', 'L 临汾'], ['1125', 'L 吕梁'], ['1121', 'S 朔州'], ['543', 'T 太原'], ['1124', 'X 忻州'], ['1118', 'Y 阳泉'], ['1123', 'Y 运城']];
dcitys['571'] = [['1220', 'A 安康'], ['1214', 'B 宝鸡'], ['1218', 'H 汉中'], ['1216', 'W 渭南'], ['572', 'X 西安'], ['1215', 'X 咸阳'], ['1217', 'Y 延安'], ['1219', 'Y 榆林']];
dcitys['489'] = [['1043', 'S 上海']];
dcitys['546'] = [['1140', 'B 巴中'], ['547', 'C 成都'], ['1137', 'D 达州'], ['1129', 'D 德阳'], ['1136', 'G 广安'], ['1130', 'G 广元'], ['1133', 'L 乐山'], ['1144', 'L 凉山彝族自治州'], ['1128', 'L 泸州'], ['1138', 'M 眉山'], ['548', 'M 绵阳'], ['1134', 'N 南充'], ['1127', 'P 攀枝花'], ['1131', 'S 遂宁'], ['1135', 'Y 宜宾'], ['1141', 'Z 资阳'], ['1126', 'Z 自贡']];
dcitys['488'] = [['1042', 'T 天津']];
dcitys['1305'] = [['1306', 'L 拉萨']];
dcitys['573'] = [['1227', 'A 阿克苏'], ['1230', 'B 巴音郭楞蒙古族自治州'], ['1231', 'C 昌吉回族自治州'], ['574', 'W 乌鲁木齐'], ['1233', 'Y 伊犁哈萨克族自治州']];
dcitys['569'] = [['1207', 'C 楚雄彝族自治州'], ['1208', 'D 大理白族自治州'], ['1205', 'H 红河哈尼族彝族自治州'], ['570', 'K 昆明'], ['1212', 'P 普洱'], ['1199', 'Y 玉溪']];
dcitys['500'] = [['501', 'H 杭州'], ['508', 'H 湖州'], ['502', 'J 嘉兴'], ['505', 'J 金华'], ['1058', 'L 丽水'], ['503', 'N 宁波'], ['1056', 'Q 衢州'], ['504', 'S 绍兴'], ['509', 'T 台州'], ['506', 'W 温州'], ['1057', 'Z 舟山']];
dealers['1167'] = [['312726', '安庆中奥汽车销售服务有限公司'], ['2839698', '桐城新迪汽车销售服务有限公司']];
dealers['1162'] = [['4583440', '蚌埠安迪汽车销售服务有限公司']];
dealers['1174'] = [['1750680', '亳州远景新元素汽车销售服务有限公司']];
dealers['1175'] = [['2614578', '池州中迪汽车销售服务有限公司']];
dealers['1169'] = [['1413938', '滁州亚夏迪奥汽车销售服务有限公司']];
dealers['1170'] = [['316478', '阜阳博融鑫奥汽车销售服务有限公司']];
dealers['557'] = [['2351000', '合肥恒信奥诚汽车销售服务有限公司'], ['2300348', '合肥恒信德龙奥龙汽车销售服务有限公司 ——二手车展厅'], ['1919520', '合肥奥之杰汽车销售服务有限公司'], ['3329334', '安徽星奥安迪汽车销售服务有限公司'], ['308036', '安徽安迪汽车有限公司'], ['309912', '安徽奥祥汽车销售服务有限公司'], ['313664', '合肥中升汇迪汽车销售服务有限公司'], ['314602', '合肥恒信德龙奥龙汽车销售服务有限公司'], ['4245760', '安徽繁华安迪汽车销售服务有限公司'], ['4283280', '安徽安迪汽车有限公司——二手车展厅']];
dealers['1165'] = [['1846356', '淮北市永奥汽车销售服务有限公司']];
dealers['1163'] = [['3158618', '淮南盛昇汽车销售服务有限公司']];
dealers['1168'] = [['2127756', '黄山中迪汽车销售服务有限公司']];
dealers['1173'] = [['315540', '六安奥通汽车销售服务有限公司']];
dealers['1164'] = [['310850', '马鞍山市康奥汽车销售服务有限公司']];
dealers['1171'] = [['1414876', '宿州德奥汽车销售服务有限公司']];
dealers['1166'] = [['1131600', '铜陵中迪汽车销售服务有限公司']];
dealers['558'] = [['308974', '安徽亚迪汽车销售服务有限公司'], ['2519840', '芜湖安迪汽车销售服务有限公司']];
dealers['1176'] = [['2641780', '宣城中迪汽车销售服务有限公司——二手车展厅'], ['1901698', '宣城中迪汽车销售服务有限公司']];
dealers['82'] = [['186096', '北京德奥达汽车销售有限公司'], ['187972', '北京运通博奥汽车销售服务有限公司'], ['188910', '北京百得利汽车贸易有限公司'], ['189848', '北京奥吉通汽车销售有限公司'], ['190786', '北京首汽腾迪汽车销售服务有限公司'], ['191724', '北京寰宇恒通汽车有限公司'], ['192662', '北京博瑞祥云汽车销售服务有限公司'], ['193600', '北京名尊奥翔汽车销售有限公司'], ['194538', '北京国服信奥兴汽车有限公司'], ['196414', '北京奥之旅汽车销售服务有限公司'], ['197352', '北京新丰泰博奥汽车销售服务有限公司'], ['198290', '北京华阳奥通汽车销售有限公司'], ['199228', '北京东方华奥汽车销售服务有限公司'], ['200166', '北京奥嘉世茂汽车销售服务有限公司'], ['220802', '北京博瑞祥星汽车销售有限公司'], ['221740', '北京国服信奥众汽车有限公司'], ['202042', '北京运通嘉奥汽车销售服务有限公司'], ['202980', '北京百得利国际商贸有限公司'], ['203918', '北京兴奥晟通汽车销售服务有限公司'], ['204856', '北京安洋伟业汽车销售服务有限公司'], ['2407280', '北京诚行万奥汽车贸易服务有限公司'], ['1648438', '北京奥吉通国门汽车销售有限公司'], ['2201858', '北京新丰泰博奥汽车销售服务有限公司——二手车展厅'], ['2145578', '北京国服信奥众汽车有限公司- 二手车展厅'], ['2275960', '北京百得利国际商贸有限公司——二手车展厅'], ['2277836', '北京国服信奥兴汽车有限公司——二手车展厅'], ['3251480', '北京中润发汽车销售有限公司'], ['3814280', '北京国服信众辰汽车销售有限公司（CBD展厅）'], ['2088360', '北京名尊奥翔汽车销售有限公司-二手车展厅'], ['2523592', '北京首汽腾迪汽车销售服务有限公司——二手车展厅']];
dealers['1044'] = [['847386', '重庆新元素雅和汽车销售服务有限公司'], ['84792', '重庆万家雅迪汽车销售服务有限公司'], ['85730', '重庆龙华实业集团龙奥汽车销售服务有限公司'], ['83854', '重庆商社德奥汽车有限公司'], ['2369760', '重庆百事达天威华奥汽车销售服务有限公司'], ['2370698', '重庆广新汇迪汽车销售服务有限公司'], ['1582778', '重庆长久世奥汽车销售服务有限公司'], ['1941094', '重庆运通晟迪汽车销售服务有限公司'], ['1563080', '重庆中升汇迪汽车销售服务有限公司'], ['3797396', '重庆万家正迪CBD展厅'], ['3945600', '重庆万友诚行汽车销售服务有限公司'], ['4546858', '重庆万家雅迪汽车销售服务有限公司—二手车展厅']];
dealers['520'] = [['17256', '福建原动力汽车销售服务有限公司'], ['21008', '福建华奥汽车有限公司'], ['318354', '福建省润通汽车销售服务有限责任公司'], ['3645440', '福州华奥汽车有限公司'], ['4227000', '福清华奥汽车有限公司'], ['3701720', '福建省星跃汽车销售服务有限责任公司'], ['4452120', '福州市君悦佳奥汽车有限公司'], ['3332148', '福州盈众至远汽车服务有限公司']];
dealers['1078'] = [['4639720', '龙岩盈众汽车有限公司']];
dealers['1077'] = [['3120160', '南平盈众至远汽车销售有限公司']];
dealers['1079'] = [['624142', '宁德市大邦太合汽车销售服务有限公司'], ['2372574', '宁德市大邦太合汽车销售服务有限公司——二手车展厅']];
dealers['1074'] = [['20070', '莆田市大邦太合汽车销售服务有限公司'], ['4264520', '莆田华奥汽车销售服务有限公司']];
dealers['521'] = [['18194', '福建大长江奥通汽车销售有限公司'], ['963698', '泉州市洛江华奥汽车有限公司'], ['319292', '泉州华奥汽车销售服务有限公司'], ['320230', '福建盈众汽车有限公司']];
dealers['1075'] = [['16318', '三明盈众致远汽车销售有限公司']];
dealers['522'] = [['21946', '厦门盈众至远汽车销售有限公司'], ['277082', '厦门嘉诚汽车销售服务有限公司'], ['2426040', '厦门奥成汽车销售有限公司'], ['317416', '厦门大邦通商汽车贸易有限公司'], ['3420320', '厦门太合美信汽车销售服务有限公司'], ['2644594', '厦门大邦通商汽车贸易有限公司——二手车展厅'], ['4622836', '厦门奥瀚汽车有限公司'], ['2763720', '厦门嘉诚汽车销售服务有限公司——二手车展厅'], ['3570400', '厦门信达南山汽车贸易有限公司']];
dealers['1076'] = [['19132', '漳州盈众致远汽车销售有限公司'], ['2285340', '漳州盈众致远汽车销售有限公司 ——二手车展厅']];
dealers['1247'] = [['1656880', '嘉峪关天汇华奥汽车销售服务有限公司']];
dealers['576'] = [['89482', '兰州新奥驰泰汽车销售服务有限公司'], ['90420', '兰州中盛奥泽汽车销售服务有限公司'], ['160770', '兰州兰奥汽车销售服务有限公司'], ['159832', '兰州金岛煜奥汽车销售服务有限公司'], ['4471818', '兰州中盛奥泽汽车销售服务有限公司——二手车展厅']];
dealers['1248'] = [['3326520', '甘肃中盛奥通汽车销售服务有限公司']];
dealers['1243'] = [['3403436', '甘肃中盛奥华汽车销售服务有限公司']];
dealers['1071'] = [['447798', '潮州市南菱汽车销售服务有限公司'], ['2502956', '潮州市南菱汽车销售服务有限公司——二手车展厅']];
dealers['514'] = [['51024', '东莞市奥利汽车销售服务有限公司'], ['2502018', '东莞市庆奥汽车销售服务有限公司——二手车展厅'], ['1649376', '东莞市庆奥汽车销售服务有限公司'], ['145762', '东莞市东奥汽车服务有限公司'], ['1038738', '东莞奥泽汽车销售服务有限公司'], ['1825720', '东莞市世奥汽车销售服务有限公司'], ['1564956', '东莞捷世丰汽车销售服务有限公司'], ['4395840', '东莞亚奥汽车销售服务有限公司'], ['3926840', '东莞市东奥汽车服务有限公司——二手车展厅'], ['2748712', '东莞市奥利汽车销售服务有限公司——二手车展厅']];
dealers['516'] = [['53838', '佛山市广物君奥汽车贸易有限公司'], ['98862', '佛山市顺德区世锦汽车销售服务有限公司'], ['104490', '佛山市合辉汽车销售服务有限公司'], ['1225400', '佛山市锦泰汽车销售服务有限公司'], ['3647316', '佛山市利奥汽车销售服务有限公司'], ['4020640', '佛山市穗奥汽车销售服务有限公司'], ['2111810', '佛山奥泽汽车销售服务有限公司']];
dealers['513'] = [['139196', '广东中奥汽车销售服务有限公司'], ['140134', '广东君奥汽车贸易有限公司'], ['141072', '广州市锦龙汽车发展有限公司'], ['503140', '广州兴迪汽车销售有限公司'], ['51962', '广州南菱奥申汽车有限公司'], ['52900', '广东锦泰汽车销售服务有限公司'], ['101676', '广东粤奥汽车销售服务有限公司'], ['105428', '广州市德迪汽车贸易有限公司'], ['107304', '广州和泰同辉汽车销售服务有限公司'], ['109180', '广州市晨峰贸易有限公司'], ['3313388', '广州市锦龙汽车发展有限公司销售展厅（Sport展厅）'], ['3317140', '广州中瑞汽车销售服务有限公司'], ['1488040', '广州广物君迪汽车贸易有限公司'], ['2126818', '广州兴迪汽车销售有限公司-二手车展厅'], ['3195200', '广州南菱奥欣汽车有限公司'], ['3796458', '广东中盈汽车销售服务有限公司（CBD展厅）'], ['3983120', '广东广物金盈汽车贸易有限公司'], ['4320800', '广州增奥汽车服务有限公司']];
dealers['1065'] = [['102614', '惠州市南菱汽车销售服务有限公司'], ['2298472', '惠州市南菱汽车销售服务有限公司——二手车展厅'], ['2182160', '惠州雄峰骏领汽车有限公司'], ['3532880', '惠州市南菱奥盛汽车销售服务有限公司']];
dealers['1061'] = [['103552', '江门大昌行合宏汽车销售服务有限公司'], ['3851800', '江门市大昌行盛奥汽车销售服务有限公司']];
dealers['1072'] = [['816432', '揭阳鼎杰汽车销售服务有限公司']];
dealers['1063'] = [['2050840', '茂名市广物粤奥汽车销售服务有限公司']];
dealers['1066'] = [['110118', '梅州华奥汽车销售服务有限公司']];
dealers['1070'] = [['2112748', '清远奥泽汽车销售服务有限公司']];
dealers['1059'] = [['144824', '汕头市宏祥物资有限公司'], ['3289000', '汕头市金辉达汽车销售有限公司']];
dealers['1060'] = [['3457840', '韶关市广物君奥汽车销售服务有限公司']];
dealers['518'] = [['143886', '深圳市增特汽车贸易有限公司'], ['50086', '深圳市奥羽汽车销售服务有限公司'], ['96048', '深圳市奥德汽车贸易有限公司'], ['100738', '深圳市锦龙汽车贸易有限公司'], ['106366', '深圳市鹏峰奥星汽车有限公司'], ['1584654', '深圳奥泽汽车销售服务有限公司'], ['1845418', '深圳中升汇迪汽车销售服务有限公司'], ['1865116', '深圳市新奥汽车贸易有限公司'], ['682298', '深圳市锦奥汽车贸易有限公司'], ['1244160', '深圳恒信奥龙汽车销售服务有限公司'], ['1431760', '深圳广物君奥汽车销售服务有限公司'], ['3476600', '深圳市增特巨晟汽车销售服务有限公司'], ['4114440', '深圳市增特汽车贸易有限公司福田分公司（CBD展厅）']];
dealers['1069'] = [['3331210', '阳江市广物君奥汽车销售服务有限公司']];
dealers['1062'] = [['774222', '湛江君奥汽车销售服务有限公司']];
dealers['1064'] = [['782664', '肇庆锦龙汽车贸易有限公司']];
dealers['517'] = [['97924', '中山市广物君奥汽车销售服务有限公司'], ['1188818', '中山小榄庆丰奥达汽车销售服务有限公司'], ['4620960', '中山市广物君奥汽车销售服务有限公司火炬开发区分公司（单一服务）'], ['4302040', '中山市金奥汽车销售服务有限公司']];
dealers['515'] = [['801424', '珠海利恒汽车销售服务有限公司'], ['142010', '珠海市珠光汽车贸易有限公司']];
dealers['1265'] = [['2634276', '北海合奥汽车销售服务有限公司']];
dealers['1263'] = [['57590', '桂林鑫广达世奥汽车销售服务有限公司']];
dealers['1262'] = [['55714', '柳州市合隆汽车销售服务有限公司']];
dealers['582'] = [['608196', '南宁恒信奥龙汽车销售服务有限公司'], ['54776', '广西钜荣汽车销售服务有限公司'], ['1581840', '广西晟奥汽车销售服务有限公司'], ['56652', '广西南奥汽车销售服务有限公司'], ['3008538', '广西钜荣粤桂汽车销售服务有限公司']];
dealers['1287'] = [['1791014', '安顺恒信奥龙汽车销售服务有限公司']];
dealers['1289'] = [['1094080', '贵州佰润黔之奥汽车销售服务有限公司']];
dealers['586'] = [['14442', '贵州乾通德奥汽车销售服务有限公司'], ['15380', '贵州四扬兴奥汽车销售服务有限公司'], ['76350', '贵州君奥汽车贸易有限公司'], ['2148392', '贵州君奥汽车贸易有限公司- 二手车展厅'], ['3213960', '贵州通奥汽车销售服务有限公司'], ['4490578', '贵州通源通奥汽车销售服务有限公司']];
dealers['1285'] = [['596002', '六盘水恒信奥龙汽车销售服务有限公司']];
dealers['1291'] = [['2070538', '凯里恒信奥龙汽车销售服务有限公司']];
dealers['1292'] = [['2113686', '都匀市恒信奥龙汽车销售服务有限公司']];
dealers['1290'] = [['2594880', '贵州林荣金奥汽车销售服务有限公司']];
dealers['1288'] = [['2689618', '铜仁恒信奥龙汽车销售服务有限公司']];
dealers['1286'] = [['2746836', '遵义驰奥达汽车销售服务有限公司'], ['75412', '遵义驰奥汽车销售服务有限公司']];
dealers['592'] = [['58528', '海南世博汽车服务有限公司'], ['1790076', '海口东奥汽车销售服务有限公司']];
dealers['1304'] = [['2632400', '三亚世奥汽车服务有限公司']];
dealers['562'] = [['410278', '保定驰奥汽车销售有限公司'], ['213298', '保定轩宇鑫悦汽车有限公司'], ['4527160', '保定东澜睿泽汽车销售服务有限公司']];
dealers['563'] = [['225492', '沧州轩宇鑫奥汽车销售有限公司'], ['215174', '沧州市东盛汽车销售服务有限公司'], ['4470880', '沧州东盛汽车销售服务有限公司——二手车展厅']];
dealers['1179'] = [['113870', '承德庞大奥兴汽车销售有限公司']];
dealers['564'] = [['216112', '邯郸市奥华汽车销售服务有限公司'], ['3495360', '邯郸国服信汽车销售有限公司']];
dealers['1181'] = [['222678', '衡水联奥汽车贸易有限公司'], ['2613640', '衡水联奥汽车贸易有限公司——二手车展厅']];
dealers['1180'] = [['580994', '廊坊华星名仕汽车销售服务有限公司'], ['3590098', '三河华星名仕汽车销售服务有限公司']];
dealers['565'] = [['217050', '秦皇岛新源奥丕汽车销售服务有限公司']];
dealers['560'] = [['890534', '河北奥吉通汽车销售有限公司'], ['114808', '河北冀迪汽车销售服务有限公司'], ['212360', '河北联拓汽车贸易有限公司'], ['217988', '河北联润美迪汽车贸易有限公司'], ['223616', '河北德联开新汽车贸易有限公司'], ['3552578', '石家庄蓝池胜龙汽车销售有限公司'], ['2071476', '河北冀迪汽车销售服务有限公司-二手车展厅']];
dealers['561'] = [['214236', '唐山市冀东乐业汽车销售服务有限公司'], ['219864', '唐山盛奥汽车销售服务有限公司'], ['218926', '唐山市奥铄汽车销售服务有限公司'], ['2524530', '唐山盛奥汽车销售服务有限公司——二手车展厅']];
dealers['1177'] = [['227368', '邢台奥邢汽车贸易有限公司']];
dealers['1178'] = [['226430', '张家口联润美迪汽车销售有限公司']];
dealers['1187'] = [['255508', '安阳中升汇迪汽车销售服务有限公司']];
dealers['1184'] = [['2091174', '焦作豫海新迪汽车销售服务有限公司']];
dealers['1182'] = [['2690556', '开封市金奥汽车销售服务有限公司']];
dealers['568'] = [['247066', '洛阳海灵汽车销售服务有限公司'], ['2200920', '洛阳新荣嘉汽车销售服务有限公司']];
dealers['1190'] = [['2688680', '漯河漯德奥汽车销售服务有限公司']];
dealers['1192'] = [['249880', '南阳赢嘉汽车销售服务有限公司'], ['1975800', '南阳市威佳奥昌汽车销售服务有限公司']];
dealers['1183'] = [['248004', '平顶山市中瑞汽车销售服务有限公司']];
dealers['1188'] = [['1882938', '濮阳市德嘉汽车销售服务有限公司']];
dealers['1193'] = [['4621898', '商丘市金奥汽车销售服务有限公司']];
dealers['1186'] = [['248942', '新乡东新汽车有限责任公司'], ['2749650', '新乡东新汽车有限公司——二手车展厅']];
dealers['1194'] = [['251756', '信阳中升汇迪汽车销售服务有限公司']];
dealers['1189'] = [['1564018', '许昌市中瑞汽车销售服务有限公司']];
dealers['567'] = [['74474', '河南豫海汽车销售有限公司'], ['246128', '河南丰之元汽车销售服务有限公司'], ['254570', '郑州中升汇迪汽车销售服务有限公司'], ['3314326', '河南奥吉通汽车销售有限公司'], ['1942032', '郑州中升裕迪汽车销售服务有限公司'], ['1263858', '郑州奥泽汽车销售服务有限公司'], ['2144640', '河南志达汽车销售服务有限公司'], ['2276898', '郑州威佳兴迪汽车销售服务有限公司'], ['3964360', '河南豫海新迪汽车销售服务有限公司'], ['4001880', '河南丰之德汽车销售服务有限公司']];
dealers['1195'] = [['2239378', '周口威佳盛迪汽车销售服务有限公司']];
dealers['1196'] = [['253632', '驻马店胜龙汽车销售服务有限公司']];
dealers['555'] = [['162646', '大庆运通俊盈汽车销售有限公司'], ['2299410', '大庆运通俊盈汽车销售有限公司 —— 二手车展厅']];
dealers['554'] = [['507830', '哈尔滨中升汇迪汽车销售服务有限公司'], ['167336', '哈尔滨运通俊晟汽车销售服务有限公司'], ['245190', '哈尔滨运通汽车销售服务有限公司'], ['161708', '哈尔滨市广申汽车销售服务有限责任公司'], ['163584', '黑龙江龙奥达汽车销售服务有限公司']];
dealers['1156'] = [['166398', '佳木斯市华强汽车销售服务有限公司']];
dealers['1158'] = [['165460', '牡丹江中信恒业汽车销售服务有限公司']];
dealers['1151'] = [['164522', '齐齐哈尔粤华奥通汽车销售有限公司']];
dealers['1160'] = [['1206640', '绥化龙奥达汽车销售服务有限公司']];
dealers['1090'] = [['268640', '恩施恒信奥龙汽车销售服务有限公司']];
dealers['1087'] = [['267702', '黄冈恒信奥龙汽车销售服务有限公司']];
dealers['1080'] = [['263950', '黄石恒信奥龙汽车销售服务有限公司']];
dealers['1084'] = [['570676', '荆门中基汽车销售服务有限公司']];
dealers['1083'] = [['571614', '荆州市奥捷汽车销售服务有限公司'], ['2279712', '荆州市奥捷汽车销售服务有限公司——二手车展厅']];
dealers['1082'] = [['264888', '十堰恒信奥龙汽车销售服务有限公司']];
dealers['1089'] = [['2090236', '随州中基汽车销售服务有限公司']];
dealers['525'] = [['261136', '湖北中基汽车销售服务有限公司'], ['263012', '湖北奥泽汽车销售服务有限公司'], ['265826', '武汉恒信奥龙汽车销售服务有限公司'], ['258322', '武汉恒信汉迪汽车销售服务有限公司'], ['2482320', '湖北中基汽车销售服务有限公司——二手车展厅'], ['1170058', '武汉运通益迪汽车销售服务有限公司'], ['1262920', '武汉恒信奥诚汽车销售服务有限公司'], ['3664200', '武汉恒信奥通汽车销售服务有限公司'], ['2089298', '武汉恒信奥龙汽车销售服务有限公司-二手车展厅']];
dealers['1081'] = [['262074', '襄阳东富汽车销售服务有限公司'], ['2538600', '襄阳中基汽车销售服务有限公司']];
dealers['526'] = [['260198', '宜昌奥龙汽车销售服务有限公司'], ['2109934', '宜昌恒信奥诚汽车销售服务有限公司']];
dealers['1100'] = [['137320', '常德华奥汽车销售服务有限公司']];
dealers['528'] = [['132630', '湖南华运通星城汽车销售服务有限公司'], ['133568', '长沙恒信奥龙汽车销售服务有限公司'], ['135444', '湖南华洋奥通汽车销售服务有限公司'], ['2751526', '湖南永通中南汽车销售有限公司'], ['269578', '湖南华运通汽车销售有限公司'], ['271454', '湖南世茂汽车销售服务有限公司'], ['270516', '湖南华洋华迪汽车销售服务有限公司'], ['2281588', '长沙恒信奥龙汽车销售服务有限公司 ——二手车展厅'], ['3272116', '浏阳兰天东奥汽车销售有限公司'], ['3626680', '湖南华洋阳光汽车销售服务有限公司']];
dealers['1103'] = [['273330', '郴州市奥峰汽车销售有限责任公司']];
dealers['1097'] = [['272392', '衡阳华源汽车销售服务有限公司'], ['2147454', '衡阳华源汽车销售服务有限公司- 二手车展厅']];
dealers['1105'] = [['136382', '怀化恒信奥龙汽车销售服务有限公司']];
dealers['1106'] = [['1900760', '娄底奥德汽车有限公司']];
dealers['1098'] = [['1583716', '邵阳新奥汽车销售有限公司']];
dealers['1096'] = [['134506', '湘潭鑫奥汽车销售服务有限公司']];
dealers['1102'] = [['2750588', '益阳兰天天奥汽车销售有限公司']];
dealers['1104'] = [['3310574', '永州永通华奥汽车销售服务有限公司']];
dealers['1099'] = [['138258', '岳阳驰泰汽车销售服务有限公司']];
dealers['1101'] = [['3440956', '张家界华奥汽车销售服务有限公司']];
dealers['1095'] = [['274268', '株洲湘奥汽车销售服务有限公司']];
dealers['550'] = [['257384', '长春市华阳汽车贸易有限责任公司'], ['238624', '长春通立汽车服务有限责任公司'], ['240500', '长春昌融汽车销售服务有限公司'], ['243314', '吉林省国兴汽车贸易有限公司'], ['1939218', '长春市华阳奥通汽车服务有限公司']];
dealers['551'] = [['256446', '吉林市神华汽车销售服务有限责任公司'], ['244252', '吉林市神洲华奥汽车销售服务有限公司']];
dealers['1148'] = [['241438', '松原汇迪汽车销售服务有限公司'], ['4658480', '松原汇迪汽车销售服务有限公司(延展服务维修)']];
dealers['593'] = [['242376', '通化市融晟汽车销售服务有限公司']];
dealers['1150'] = [['239562', '延吉市新里程汽车销售服务有限公司']];
dealers['493'] = [['2744960', '常州奥保行汽车销售服务有限公司'], ['147638', '常州市凯歌汽车销售有限公司'], ['3045120', '常州览之奥汽车销售服务有限公司'], ['332424', '常州新奥汽车销售有限公司']];
dealers['1052'] = [['1940156', '淮安益欣汽车销售服务有限公司'], ['330548', '淮安宝瑞祥泰汽车销售服务有限公司']];
dealers['1051'] = [['346494', '连云港德兰汽车有限公司']];
dealers['492'] = [['146700', '江苏华兴深蓝汽车有限公司'], ['944000', '南京永达奥诚汽车销售服务有限公司'], ['184220', '南京朗驰集团苏奥汽车销售服务有限公司'], ['2783418', '江苏万帮外汽汽车有限公司'], ['1056560', '南京协奥汽车销售服务有限公司'], ['322106', '江苏天奥汽车销售服务有限公司'], ['331486', '南京中升恒岳汽车销售服务有限公司'], ['3852738', '南京天盈汽车有限公司'], ['2747774', '南京天诚汽车销售服务有限公司']];
dealers['494'] = [['148576', '南通银奥汽车销售服务有限公司'], ['2332240', '南通银奥汽车销售服务有限公司——二手车展厅'], ['1356720', '南通新瑞奥汽车销售服务有限公司'], ['2595818', '南通益昌汽车销售服务有限公司——二手车展厅'], ['3328396', '如皋通奥汽车销售服务有限公司'], ['327734', '南通益昌汽车销售服务有限公司'], ['2257200', '启东益昌汽车销售服务有限公司'], ['2114624', '海安德正汽车有限公司']];
dealers['499'] = [['150452', '常熟德臣汽车销售服务有限公司'], ['152328', '第一汽车(苏州)服务贸易有限公司'], ['698244', '苏州和奥汽车销售服务有限公司'], ['338052', '苏州国兴汽车服务有限公司'], ['338990', '太仓德尚汽车有限公司'], ['342742', '苏州奥保行汽车销售服务有限公司'], ['2782480', '昆山国兴汽车贸易有限公司'], ['2301286', '苏州中迪汽车销售服务有限公司——二手车展厅'], ['2643656', '第一汽车（苏州）服务贸易有限公司——二手车展厅'], ['323044', '昆山国亚达汽车服务有限公司'], ['323982', '张家港德和汽车有限公司'], ['324920', '苏州中迪汽车销售服务有限公司'], ['333362', '苏州奥润汽车销售服务有限公司'], ['2184036', '苏州新迪汽车销售服务有限公司'], ['3889320', '苏州奥友汽车销售服务有限公司（CBD展厅）'], ['2107120', '苏州和迪汽车销售服务有限公司']];
dealers['1055'] = [['4358320', '江苏天泓华奥汽车销售服务有限公司奥诚分公司'], ['2521716', '江苏天泓华奥汽车销售服务有限公司']];
dealers['1054'] = [['344618', '靖江德融汽车有限公司'], ['1882000', '泰州金迪汽车销售服务有限公司'], ['2165276', '泰兴德融汽车有限公司'], ['329610', '泰州奥正冠通汽车销售服务有限公司'], ['2278774', '泰州奥正冠通汽车销售服务有限公司——二手车展厅']];
dealers['496'] = [['888658', '无锡中升汇迪汽车销售服务有限公司'], ['183282', '无锡德尔汽车有限公司'], ['343680', '江阴雷驰汽车销售服务有限公司'], ['345556', '无锡奥保行汽车销售服务有限公司'], ['347432', '无锡奥骐汽车销售服务有限公司'], ['1565894', '无锡奥通汽车销售有限公司'], ['325858', '江阴奔跃汽车有限公司'], ['337114', '无锡德孚汽车有限公司'], ['328672', '宜兴德同汽车有限公司']];
dealers['498'] = [['151390', '徐州沪彭奥通汽车销售服务有限公司'], ['3047934', '徐州奥览汽车销售服务有限公司'], ['3327458', '徐州星奥汽车有限公司'], ['334300', '徐州沪彭东源汽车销售服务有限公司']];
dealers['1053'] = [['348370', '森风集团盐城怀德汽车有限公司'], ['3309636', '森风集团盐城诚德汽车有限公司'], ['1450520', '盐城德肯汽车有限公司']];
dealers['495'] = [['339928', '扬州新丰泰博奥汽车销售服务有限公司'], ['2295658', '扬州中堃汽车销售服务有限公司'], ['4021578', '扬州捷翔汽车销售服务有限公司']];
dealers['594'] = [['3439080', '丹阳奥达汽车销售服务有限公司'], ['153266', '镇江奥达汽车销售服务有限公司'], ['3084516', '镇江扬中奥达汽车销售服务有限公司']];
dealers['1283'] = [['1731920', '抚州华宏汽车有限公司']];
dealers['1280'] = [['24760', '赣州华宏汽车有限公司'], ['3009476', '赣州华宏奥汽车有限公司']];
dealers['1281'] = [['2857520', '吉安华宏汽车销售服务有限公司——二手车展厅'], ['1526498', '吉安华宏名奥汽车有限公司']];
dealers['1275'] = [['2166214', '景德镇德汇行汽车销售服务有限公司']];
dealers['1277'] = [['3402498', '九江华宏奥汽车有限公司']];
dealers['584'] = [['26636', '江西和诚洪奥汽车有限公司'], ['27574', '南昌恒信奥龙汽车销售服务有限公司'], ['3312450', '江西长久广奥汽车销售服务有限公司'], ['22884', '江西德奥汽车销售服务有限公司'], ['2282526', '南昌中升汇迪汽车销售服务有限公司'], ['4208240', '江西华宏奥汽车有限公司']];
dealers['1284'] = [['2284402', '上饶市君悦佳奥汽车有限公司 —— 二手车展厅'], ['1995498', '上饶市君悦佳奥汽车有限公司']];
dealers['1282'] = [['3063880', '宜春华宏汽车有限公司——二手车展厅'], ['2069600', '宜春华宏汽车有限公司']];
dealers['531'] = [['127940', '鞍山和佳汽车销售服务有限公司'], ['119498', '鞍山衡业汽车销售服务有限公司']];
dealers['1116'] = [['446860', '朝阳川达捷昇汽车销售有限公司']];
dealers['1108'] = [['122312', '大连新盛荣汽车销售服务有限公司'], ['123250', '大连中升汇迪汽车销售服务有限公司'], ['125126', '大连裕迪汽车销售服务有限公司'], ['236748', '大连弘泰汽车销售服务有限公司']];
dealers['1111'] = [['130754', '丹东惠华新业汽车销售服务有限公司']];
dealers['1112'] = [['487194', '阜新通立裕腾汽车销售服务有限公司']];
dealers['1117'] = [['908356', '葫芦岛鑫悦汽车销售服务有限公司']];
dealers['532'] = [['124188', '锦州立达汽车销售服务有限公司'], ['2527344', '锦州立达汽车销售服务有限公司——二手车展厅']];
dealers['1113'] = [['235810', '辽阳惠华新业汽车销售服务有限公司']];
dealers['1114'] = [['121374', '盘锦盛迪汽车销售服务有限公司']];
dealers['530'] = [['118560', '辽宁奥通汽车销售服务有限公司'], ['120436', '辽宁鑫迪汽车销售服务有限公司'], ['126064', '沈阳市奥尊汽车销售服务有限公司'], ['128878', '沈阳业乔新业汽车销售服务有限公司'], ['237686', '沈阳业乔龙业汽车销售服务有限公司'], ['2444800', '辽宁奥通汽车销售服务有限公司——二手车展厅'], ['2296596', '沈阳业乔新业汽车销售服务有限公司——二手车展厅'], ['1337960', '辽宁鑫迪汽车销售服务有限公司-二手车展厅']];
dealers['1115'] = [['1844480', '铁岭业乔龙业汽车销售服务有限公司']];
dealers['533'] = [['127002', '营口中升华盛汽车销售服务有限公司']];
dealers['1257'] = [['1525560', '内蒙古奥灵汽车销售有限公司']];
dealers['579'] = [['117622', '包头市庞大乐业汽车销售服务有限公司'], ['321168', '内蒙古新奥捷汽车销售服务有限公司']];
dealers['1254'] = [['111994', '赤峰奥邦汽车服务有限公司']];
dealers['580'] = [['614762', '内蒙古润锋汽车销售服务有限公司'], ['111056', '鄂尔多斯市德奥鑫汽车销售有限责任公司'], ['4170720', '鄂尔多斯市德奥鑫汽车销售有限责任公司二手车展厅']];
dealers['578'] = [['925240', '内蒙古汇迪汽车销售服务有限公司'], ['112932', '内蒙古世嘉汽车销售服务有限公司'], ['234872', '内蒙古奥捷汽车销售有限公司']];
dealers['1256'] = [['533156', '呼伦贝尔市众捷汽车销售服务有限公司']];
dealers['1255'] = [['116684', '通辽市奥邦汽车销售有限公司']];
dealers['1253'] = [['115746', '内蒙古奥立升汽车销售服务有限公司']];
dealers['1260'] = [['1644686', '锡林郭勒盟庞大奥兴汽车销售服务有限公司']];
dealers['1259'] = [['3271178', '兴安盟华奥汽车销售服务有限公司']];
dealers['588'] = [['92296', '宁夏奥立升汽车销售服务有限公司'], ['1544320', '宁夏天汇金奥汽车销售服务有限公司']];
dealers['590'] = [['2672734', '青海金岛金奥汽车服务有限公司（二手车+单一服务）'], ['1019040', '青海嘉奥盛汽车销售服务有限公司'], ['2115562', '青海金岛汽车销售有限公司']];
dealers['1049'] = [['45396', '滨州瑞迪汽车销售服务有限公司'], ['3330272', '滨州瑞奥汽车销售服务有限公司'], ['4340498', '滨州瑞迪汽车销售服务有限公司——二手车展厅']];
dealers['541'] = [['470310', '德州瑞华汽车销售服务有限公司']];
dealers['540'] = [['36016', '东营市奥润汽车销售服务有限公司'], ['1506800', '东营金奥汽车销售服务有限公司']];
dealers['1050'] = [['49148', '菏泽世泰汽车销售服务有限公司'], ['4339560', '菏泽世泰汽车销售服务有限公司——二手车展厅'], ['3382800', '菏泽世强汽车销售服务有限公司']];
dealers['86'] = [['37892', '山东银座天尊汽车有限公司'], ['41644', '山东润华天信汽车销售服务有限公司'], ['647592', '山东庞大兴业汽车销售服务有限公司'], ['3083578', '山东鑫龙奥汽车销售服务有限公司'], ['2013320', '济南润华天泽汽车销售服务有限公司'], ['4151960', '济南银座悦奥行汽车有限公司'], ['3551640', '山东顺诚奥泰汽车服务有限公司']];
dealers['539'] = [['71660', '济宁广华汽车销售服务有限公司'], ['1938280', '济宁盛乾汽车销售服务有限公司']];
dealers['1047'] = [['70722', '莱芜奥通汽车销售服务有限公司'], ['3833040', '莱芜奥通汽车销售服务有限公司-二手车展厅']];
dealers['1048'] = [['43520', '聊城广华汽车销售服务有限公司']];
dealers['535'] = [['2954134', '临沂奥海汽车销售服务有限公司'], ['2955072', '临沂览奥汽车销售服务有限公司'], ['889596', '山东华德联新汽车销售服务有限公司'], ['3138920', '临沂润华天润汽车销售服务有限公司'], ['4545920', '临沂润华天润汽车销售服务有限公司—二手车展厅'], ['3159556', '临沂奥通达汽车销售服务有限公司']];
dealers['84'] = [['33202', '青岛华世通汽车销售服务有限公司'], ['2953196', '青岛广裕汽车销售有限公司'], ['73536', '青岛奥鑫汽车销售服务有限公司'], ['42582', '青岛同德汽车销售服务有限公司'], ['1488978', '青岛奥泽汽车销售服务有限公司'], ['2826566', '青岛金阳光润奥汽车销售服务有限公司'], ['4095680', '青岛奥瑞汽车销售服务有限公司'], ['4076920', '青岛奥嘉汽车销售服务有限公司（CBD展厅）']];
dealers['1046'] = [['39768', '日照市晟祥汽车销售服务有限公司']];
dealers['538'] = [['34140', '泰安广通汽车销售服务有限公司'], ['69784', '泰安广晟汽车销售服务有限公司']];
dealers['537'] = [['36954', '威海中升威达汽车销售服务有限公司']];
dealers['534'] = [['30388', '潍坊广华汽车销售服务有限公司'], ['44458', '潍坊瑞德汽车销售服务有限公司'], ['48210', '潍坊广宇汽车销售服务有限公司'], ['2784356', '寿光广华汽车销售服务有限公司'], ['3315264', '青州广潍华宇汽车销售服务有限公司'], ['1226338', '潍坊顺诚奥泰汽车销售服务有限公司']];
dealers['85'] = [['38830', '烟台中升汇迪汽车销售服务有限公司'], ['2745898', '莱州中升汇迪汽车销售服务有限公司'], ['72598', '烟台中升裕迪汽车销售服务有限公司'], ['3589160', '烟台银座悦奥行汽车有限公司']];
dealers['1045'] = [['2952258', '枣庄览奥汽车销售服务有限公司']];
dealers['536'] = [['32264', '淄博奥维汽车销售服务有限公司'], ['46334', '淄博金奥汽车销售服务有限公司'], ['3514120', '淄博鑫奥汽车销售服务有限公司']];
dealers['1119'] = [['843634', '长治市圆通汽车销售服务有限公司']];
dealers['544'] = [['2670858', '大同风华新元素汽车服务有限公司']];
dealers['1120'] = [['2164338', '晋城市汇源宝迪汽车销售服务有限公司']];
dealers['1122'] = [['232996', '山西大昌华源汽车销售服务有限公司']];
dealers['545'] = [['591312', '临汾银光德奥汽车销售服务有限公司'], ['3311512', '山西大昌鑫源汽车销售服务有限公司']];
dealers['1125'] = [['232058', '山西大昌瑞升汽车销售服务有限公司']];
dealers['1121'] = [['3720480', '朔州神迪汽车销售服务有限公司']];
dealers['543'] = [['228306', '山西大昌汽车服务有限公司'], ['229244', '山西神迪汽车销售有限公司'], ['231120', '山西君和汽车销售服务有限公司'], ['1789138', '山西大昌信源汽车销售服务有限公司'], ['2294720', '山西大昌汽车服务有限公司——二手车展厅'], ['2146516', '山西君和汽车销售服务有限公司- 二手车展厅']];
dealers['1124'] = [['3007600', '忻州奥源奥众汽车销售有限公司']];
dealers['1118'] = [['1375480', '山西神华汽车销售有限公司']];
dealers['1123'] = [['233934', '运城大昌汽车服务有限公司']];
dealers['1220'] = [['2956010', '安康泽泰瑞通汽车销售服务有限公司']];
dealers['1214'] = [['409340', '宝鸡德奥达汽车销售有限公司']];
dealers['1218'] = [['514396', '汉中益昌鼎鑫汽车销售服务有限公司']];
dealers['1216'] = [['158894', '渭南新丰泰博奥汽车销售服务有限公司']];
dealers['572'] = [['86668', '陕西新丰泰汽车有限责任公司'], ['157018', '西安恒信奥龙汽车销售服务有限公司'], ['87606', '陕西奥诚汽车销售服务有限公司'], ['2639904', '陕西新丰泰汽车有限责任公司——二手车展厅'], ['154204', '陕西庞大乐业汽车销售服务有限公司'], ['155142', '陕西新丰泰博奥汽车有限责任公司'], ['850200', '西安沣东奥诚汽车销售服务有限公司'], ['2932560', '陕西庞大乐业汽车销售服务有限公司——二手车展厅'], ['1527436', '陕西运通瑞迪汽车销售服务有限公司'], ['4377080', '陕西锦奥汽车销售服务有限公司']];
dealers['1215'] = [['157956', '陕西联强汽车贸易有限公司']];
dealers['1217'] = [['156080', '延安新丰泰博奥汽车有限责任公司']];
dealers['1219'] = [['88544', '榆林市奥森汽贸有限责任公司']];
dealers['1043'] = [['2671796', '上海沪奥汽车销售服务有限公司（二手车+单一服务）'], ['168274', '上海永达汽车浦东销售服务有限公司'], ['169212', '上海开隆汽车贸易有限公司'], ['170150', '上海东联沪港汽车销售有限公司'], ['171088', '上海一汽沪奥汽车销售有限公司'], ['172026', '上海东昌汽车嘉定销售服务有限公司'], ['175778', '上海东昌金桥豪迪汽车服务有限公司'], ['176716', '上海德辰汽车销售有限公司'], ['179530', '上海东联松奥汽车销售服务有限公司'], ['180468', '上海永达奥诚中环汽车销售服务有限公司'], ['181406', '上海骐润茂汽车销售有限公司'], ['182344', '上海永达弘杰汽车销售服务有限公司'], ['172964', '上海西上海奥杰汽车销售服务有限公司'], ['2764658', '上海益申汽车销售服务有限公司'], ['1340774', '上海东昌汽车嘉定销售服务有限公司-二手车展厅 '], ['2388520', '上海德旋汽车发展有限公司'], ['177654', '上海交运起腾汽车销售服务有限公司'], ['178592', '上海永达奥诚汽车销售服务有限公司'], ['2032080', '上海冠松华奥汽车销售服务有限公司'], ['2125880', '上海骐润茂汽车销售有限公司- 二手车展厅'], ['2149330', '上海东联沪港汽车销售有限公司- 二手车展厅'], ['2283464', '上海西上海奥杰汽车销售服务有限公司 ——二手车展厅'], ['4133200', '上海中迪汽车销售服务有限公司'], ['3346218', '上海龙奥汽车销售服务有限公司']];
dealers['1140'] = [['3318078', '巴中禾林汽车销售服务有限公司']];
dealers['547'] = [['11628', '成都新元素雅麓汽车销售服务有限公司'], ['59466', '成都三和汽车服务有限公司'], ['60404', '四川华星名仕汽车销售服务有限公司'], ['62280', '成都新元素兴业汽车服务有限公司'], ['63218', '成都运通博奥汽车销售服务有限公司'], ['64156', '成都中升汇迪汽车销售服务有限公司'], ['66032', '成都兴三和汽车服务有限公司'], ['68846', '成都华运汽车销售服务有限公司'], ['10690', '成都华星名仕汽车销售服务有限公司'], ['3121098', '成都奥达通汽车销售服务有限公司'], ['868960', '成都新都华星名仕汽车销售服务有限公司'], ['4433360', '成都新元素雅睿汽车销售服务有限公司（CBD展厅）'], ['3364040', '成都温江华星名仕汽车销售服务有限公司']];
dealers['1137'] = [['12566', '达州鑫奥汽车销售服务有限公司']];
dealers['1129'] = [['6938', '德阳华星万路汽车销售服务有限公司'], ['2640842', '德阳华星万路汽车销售服务有限公司——二手车展厅']];
dealers['1136'] = [['1807898', '广安华星名仕汽车销售服务有限公司']];
dealers['1130'] = [['3307760', '广元市迪顺汽车销售有限公司']];
dealers['1133'] = [['65094', '乐山安捷奥信汽车销售服务有限公司']];
dealers['1144'] = [['3682960', '西昌铭笛汽车销售服务有限公司']];
dealers['1128'] = [['8814', '泸州华星名仕汽车销售服务有限公司']];
dealers['1138'] = [['981520', '眉山华星名仕汽车销售服务有限公司']];
dealers['548'] = [['61342', '绵阳市新川西物汽车销售服务有限公司'], ['3308698', '绵阳铭远汽车服务有限公司']];
dealers['1134'] = [['66970', '南充华星名仕汽车销售服务有限公司'], ['3401560', '南充高坪华星名仕汽车销售服务有限公司']];
dealers['1127'] = [['7876', '攀枝花三和铭笛汽车销售服务有限公司'], ['3048872', '攀枝花三和铭笛汽车销售服务有限公司——二手车展厅']];
dealers['1131'] = [['13504', '遂宁市奥龙汽车销售有限公司']];
dealers['1135'] = [['9752', '宜宾奥吉通汽车销售有限公司']];
dealers['1141'] = [['3345280', '资阳市清巍奥美汽车销售服务有限公司']];
dealers['1126'] = [['1957040', '自贡新元素汽车销售服务有限公司']];
dealers['1042'] = [['205794', '天津港保税区捷丰国际贸易有限公司'], ['206732', '天津市中乒北奥汽车销售服务有限公司'], ['207670', '天津中升汇迪汽车销售有限公司'], ['208608', '天津市永濠奥达汽车销售服务有限公司'], ['209546', '天津捷世丰汽车销售服务有限公司'], ['211422', '天津市华奥兴业汽车销售服务有限公司'], ['1647500', '天津奥信通汽车销售服务有限公司'], ['2895040', '天津蓝池奥龙汽车销售有限公司'], ['3157680', '天津中升裕迪汽车销售服务有限公司'], ['3758000', '天津市永濠奥通汽车销售服务有限公司（二手车+单一服务）']];
dealers['1306'] = [['575366', '拉萨康奥汽车销售服务有限公司']];
dealers['1227'] = [['2858458', '阿克苏天汇华荣汽车销售服务有限公司']];
dealers['1230'] = [['2520778', '库尔勒安驰汽车销售服务有限公司']];
dealers['1231'] = [['4602200', '昌吉和奥汽车销售服务有限公司']];
dealers['574'] = [['94172', '新疆华奥汽车销售服务有限责任公司'], ['95110', '新疆新奥汽车销售服务有限公司'], ['2503894', '新疆华奥汽车销售服务有限责任公司——二手车展厅'], ['3607920', '新疆天汇华迪汽车销售服务有限公司'], ['4508400', '新疆中盛国奥汽车销售服务有限公司']];
dealers['1233'] = [['2707440', '新疆华康龙汽车销售服务有限公司']];
dealers['1207'] = [['3316202', '楚雄大昌行联迪汽车销售服务有限公司']];
dealers['1208'] = [['2110872', '大理雅迪汽车销售服务有限公司']];
dealers['1205'] = [['532218', '红河辰泰汽车销售服务有限公司']];
dealers['570'] = [['77288', '云南联迪汽车服务有限公司'], ['78226', '云南驰泰汽车销售服务有限公司'], ['2669920', '云南驰泰汽车销售服务有限公司——二手车展厅'], ['79164', '云南雅迪汽车销售服务有限公司'], ['1395178', '云南汇奥汽车销售服务有限公司'], ['4039400', '云南华星名仕汽车销售服务有限公司'], ['4564680', '云南奥捷通汽车销售服务有限公司']];
dealers['1212'] = [['3273054', '普洱奥达汽车销售有限公司']];
dealers['1199'] = [['81978', '玉溪汇成汽车销售服务有限公司']];
dealers['501'] = [['518148', '杭州运通和晟汽车销售服务有限公司'], ['2313480', '浙江利华汽车销售有限公司——二手车展厅'], ['349308', '浙江奥通汽车有限公司'], ['353060', '浙江利华汽车销售有限公司'], ['2426978', '浙江中升锦澳汽车销售服务有限公司——二手车展厅'], ['357750', '杭州德奥汽车有限公司'], ['362440', '浙江元通滨奥汽车有限公司'], ['284586', '浙江奥达通汽车销售有限公司'], ['292090', '浙江中升锦澳汽车销售服务有限公司'], ['296780', '杭州富阳奥达汽车销售服务有限公司'], ['299594', '杭州奥保行汽车销售服务有限公司'], ['303346', '杭州德奥城西汽车有限公司'], ['3739240', '杭州桐庐凤奥汽车有限公司'], ['3908080', '杭州元通奥通汽车有限公司'], ['2108996', '浙江中升裕迪汽车销售服务有限公司']];
dealers['508'] = [['2373512', '湖州奥通汽车有限公司——二手车展厅'], ['293966', '湖州永达奥诚汽车销售有限公司'], ['297718', '长兴奥长汽车销售服务有限公司'], ['356812', '湖州奥通汽车有限公司']];
dealers['502'] = [['278958', '嘉兴市永奥汽车销售服务有限公司'], ['2576120', '嘉兴金奥兰汽车销售服务有限公司——二手车展厅'], ['354936', '嘉兴市金奥兰汽车销售服务有限公司'], ['1000280', '桐乡德奥汽车有限公司'], ['3026360', '嘉兴衡丰汽车销售服务有限公司'], ['301470', '海宁新奥汽车销售服务有限公司']];
dealers['505'] = [['2642718', '金华东奥汽车贸易有限公司——二手车展厅'], ['352122', '金华博奥汽车贸易有限公司'], ['355874', '义乌市奥龙汽车销售有限公司'], ['280834', '浙江永奥汽车销售有限公司'], ['287400', '义乌市博奥汽车销售服务有限公司'], ['288338', '金华东奥汽车贸易有限公司'], ['295842', '东阳市德奥汽车有限公司'], ['4489640', '义乌市正奥汽车销售服务有限公司'], ['4414600', '浦江县正奥汽车销售服务有限公司']];
dealers['1058'] = [['279896', '丽水市嘉诚汽车销售有限公司']];
dealers['503'] = [['3440018', '象山恒捷汽车销售服务有限公司'], ['2673672', '宁波恒迪汽车销售服务有限公司江东分公司（Sport展厅）'], ['350246', '宁波润达汽车销售服务有限公司'], ['358688', '浙江中升汇迪汽车销售服务有限公司'], ['360564', '宁波中基汽车销售服务有限公司'], ['363378', '慈溪大昌行驰奥汽车销售服务有限公司'], ['1769440', '宁波中基国宏汽车销售服务有限公司'], ['283648', '宁波运通国奥汽车销售有限公司'], ['291152', '宁波恒迪汽车销售服务有限公司'], ['1075320', '宁波国奥达汽车销售有限公司'], ['302408', '浙江中升康桥汽车销售服务有限公司'], ['304284', '余姚物产元通汽车有限公司'], ['2150268', '浙江中升汇迪汽车销售服务有限公司- 二手车展厅'], ['2615516', '慈溪大昌行驰奥汽车销售服务有限公司——二手车展厅'], ['2219680', '宁波恒凯汽车销售服务有限公司（微型服务店）']];
dealers['1056'] = [['286462', '衢州君悦佳奥汽车有限公司'], ['2913800', '衢州君悦佳奥汽车有限公司——二手车展厅'], ['3232720', '江山市君悦佳奥汽车有限公司']];
dealers['504'] = [['361502', '绍兴宝利德汽车有限公司'], ['353998', '浙江绍兴联奥汽车销售服务有限公司'], ['1646562', '绍兴宏奥汽车销售服务有限公司'], ['285524', '绍兴市汇奥汽车销售服务有限公司'], ['1187880', '绍兴兴奥汽车销售服务有限公司']];
dealers['509'] = [['701996', '台州和奥汽车销售服务有限公司'], ['2371636', '台州市奥曦汽车销售服务有限公司——二手车展厅'], ['282710', '台州市奥曦汽车销售服务有限公司'], ['290214', '台州临奥汽车有限公司'], ['2302224', '台州中升晨隆汽车销售服务有限公司 —— 二手车展厅'], ['306160', '台州中升晨隆汽车销售服务有限公司'], ['2183098', '台州临奥汽车有限公司——二手车展厅'], ['3776760', '台州中升汇迪汽车销售服务有限公司']];
dealers['506'] = [['275206', '温州联奥汽车销售服务有限公司'], ['278020', '乐清市红源汽车销售服务有限公司'], ['351184', '温州瓯通汽车有限公司'], ['1675640', '温州欣奥汽车销售服务有限公司'], ['289276', '温州红源汽车销售服务有限公司'], ['298656', '苍南奥通汽车有限公司'], ['305222', '温州中升华奥汽车销售服务有限公司']];
dealers['1057'] = [['293028', '舟山轿辰润达汽车销售服务有限公司']];

export {
    dprovinces,
    dcitys,
    dealers,
}