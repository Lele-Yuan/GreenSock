(function (window, document) {
    const dataList = [
        {
            sectionTitle: '总览',
            series: [{
                title: '奥迪车型',
                href: 'https://www.audi.cn/zh/models.html',
                list: [
                    {name: '全部车型', href: 'https://www.audi.cn/zh/models.html'},
                    {name: 'A4L', href: 'https://www.audi.cn/zh/models/a/a4/a4l.html'},
                    {name: 'A6L', href: 'https://www.audi.cn/zh/models/a/a6/a6l.html'},
                    {name: 'Q5L', href: 'https://https://www.audi.cn/zh/models/q/q5/q5l.html'},
                    {name: 'Q4 e-tron', href: 'https://www.audi.cn/zh/models/e-tron/e-tron/q4_e-tron.html'},
                    {name: 'e-tron GT', href: 'https://www.audi.cn/zh/models/e-tron-gt/e-tron-gt/e-tron_gt.html'},
                ]
            }, {
                title: '奥迪纯电',
                href: 'https://www.audi.cn/zh/e-mobility.html',
                list: [
                    {name: '纯电车型', href: 'https://www.audi.cn/zh/e-mobility/e-mobility-model.html'},
                    {name: '纯电权益', href: 'https://www.audi.cn/zh/e-mobility/e-mobility-rights.html'},
                    {name: '纯电服务', href: 'https://www.audi.cn/zh/e-mobility/e-mobility-service.html'},
                    {name: '纯电资讯', href: 'https://www.audi.cn/zh/e-mobility/e-mobility-news.html'},
                ]
            }, {
                title: '奥迪高性能车',
                href: 'https://www.audi.cn/zh/rs.html',
                list: [
                    {name: 'RS 系列车型', href: 'https://www.audi.cn/zh/rs/audisport_r-rs.html'},
                    {name: 'S 系列车型', href: 'https://www.audi.cn/zh/rs/audisport_s.html'},
                    {name: '探索 RS 历史', href: 'https://www.audi.cn/zh/rs/audi_history.html'},
                    {name: '奥迪运动基因', href: 'https://www.audi.cn/zh/rs/audi_sport_dna.html'},
                    {name: '奥迪赛事传奇', href: 'https://www.audi-motorsport-asia.com/cn'},
                ]
            }, {
                title: '购车工具',
                href: 'https://www.audi.cn/zh/audi_tools.html',
                list: [
                    {name: '个性化定制', href: 'https://diy.audi.cn/audi-pc/?sourceType=6'},
                    {name: '金融购车方案', href: 'https://www.audi.cn/zh/audi_tools/new_financial_project.html'},
                    {name: '老用户购车', href: 'https://www.audi.cn/zh/audi_tools/old_user.html'},
                    {name: '大用户购车', href: 'https://www.audi.cn/zh/audi_tools/corporate_clients_student.html'},
                    {name: '留学生免税车', href: 'https://www.audi.cn/zh/audi_tools/overseas_students.html'},
                    {name: '南方车型', href: 'https://www.audi.cn/zh/audi_tools/southern_carline.html'},
                    {name: '官方认证二手车', href: 'https://www.audi.cn/zh/audi_used_car.html'},
                    {name: '官方商城', href: 'https://www.audi.cn/zh/audi_tools/online_business.html'},
                ]
            }, {
                title: '用户服务',
                href: 'https://www.audi.cn/zh/after_sales_service.html',
                list: [
                    {name: '维修保养服务', href: 'https://www.audi.cn/zh/after_sales_service/maintenance.html'},
                    {name: '24 小时道路救援', href: 'https://www.audi.cn/zh/after_sales_service/24hour_assist.html'},
                    {name: '保险服务', href: 'https://www.audi.cn/zh/audi_tools/financial_insurance.html'},
                    {name: '延长保修服务', href: 'https://www.audi.cn/zh/audi_tools/extented_warranty_service.html'},
                    {name: '奥迪服务承诺', href: 'https://www.audi.cn/zh/after_sales_service/service_commitment.html'},
                    {name: '奥迪卓·悦服务', href: 'https://www.audi.cn/zh/after_sales_service/latest_activity.html'},
                    {name: '原厂备件附件', href: 'https://www.audi.cn/zh/after_sales_service/original_spare_parts_accessories.html'},
                    {name: '移动出行', href: 'https://www.audi.cn/zh/audi_brand/audi_on_demand.html'},
                    {name: '奥迪车主俱乐部', href: 'https://www.audi.cn/zh/after_sales_service/audi_club.html'},
                ] 
            }, {
                title: '奥迪品牌',
                href: 'https://www.audi.cn/zh/audi_brand.html',
                list: [
                    {name: '关于奥迪', href: 'https://www.audi.cn/zh/audi_brand/audi_about.html'},
                    {name: '奥迪新闻', href: 'https://www.audi.cn/zh/audi_brand/news_experience.html'},
                    {name: '奥迪体验活动', href: 'https://www.audi.cn/zh/audi_brand/audi_experience_activities.html'},
                    {name: '创新科技', href: 'https://www.audi.cn/zh/technology.html'},
                    {name: '奥迪概念车', href: 'https://www.audi.cn/zh/audi_brand/concept_car.html'},
                ]
            }, {
                title: '信息公开',
                href: 'https://www.audi.cn/zh/xxgk.html',
                list: [
                    {name: '新能源售后服务承诺', href: 'https://www.audi.cn/zh/e-mobility/e-mobility-rights/e-mobility-commitment-of-nev.html'},
                    {name: '责任与贡献', href: 'https://www.audi.cn/zh/audi_brand/responsibility_contribution.html'},
                    {name: '合作伙伴招募', href: 'https://www.audi.cn/zh/audi_brand/partner_recruit.html'},
                    {name: '加入我们', href: 'https://faw-zhaopin.hotjob.cn/SU616d95e3bef57c1af3dc6bbb/pb/index.html#/'},                
                ]
            },{
                title: '联系奥迪',
                href: 'https://www.audi.cn/zh/audi_contact.html',
                list: [
                    {name: '联系我们', href: 'https://www.audi.cn/zh/audi_contact/contact_us.html'},
                    {name: '预约试驾', href: 'https://www.audi.cn/zh/testdrive.html'},
                    {name: '联系经销商', href: 'https://www.audi.cn/zh/dealerprocity.html'},
                    {name: '索取产品手册', href: 'https://www.audi.cn/zh/catalogue.html'},
                    {name: '订阅奥迪新闻专递', href: 'https://www.audi.cn/zh/enewsletter.html'},
                    {name: '咨询/投诉/建议', href: 'https://www.audi.cn/zh/communicate.html'},
                ]
            },{
                title: '相关网站链接',
                href: 'https://www.audi.cn/zh.html',
                list: [
                    {name: '一汽集团', href: 'https://www.faw.com.cn/?source=faw-audi-website'},
                    {name: '一汽—大众', href: 'https://www.faw-vw.com/?source=faw-audi-website'},
                    {name: '奥迪全球', href: 'https://www.audi.com/en/company.html?source=faw-audi-website'},
                    {name: '奥迪品牌', href: 'https://www.audibrand.cn/zh.html?source=faw-audi-website'},
                    {name: '奥迪官方知乎', href: 'https://www.zhihu.com/people/77c23a7fe89c87cc7ddbc3b7f9e7e6d3?source=faw-adui-website'},
                    {name: '奥迪官方小红书', href: 'https://www.xiaohongshu.com/user/profile/5a1933fddb2e60610ccd3e70?source=faw-audi-website'},
                ]
            }],
        },
        {
            sectionTitle: 'A 系列',
            series: [{
                title: 'A3',
                href: 'https://www.audi.cn',
                list: [
                    {name: 'A3 Sportback', href: 'https://www.audi.cn/zh/models/a/a3/a3_sportback.html'},
                    {name: 'A3L limousine', href: 'https://www.audi.cn/zh/models/a/a3/a3l_limousine.html'},
                ]
            }, {
                title: 'A4',
                href: 'https://www.audi.cn',
                list: [
                    {name: 'A4L', href: 'https://www.audi.cn/zh/models/a/a4/a4l.html'},
                    {name: 'A4 Avant', href: 'https://www.audi.cn/zh/models/a/a4/a4_avant.html'},
                    {name: 'A4 allroad quattro', href: 'https://www.audi.cn/zh/models/a/a4/a4_allroad_quattro.html'},
                    {name: 'S4 Limousine', href: 'https://www.audi.cn/zh/models/a/a4/s4_limousine.html'},
                    {name: 'S4 Avant', href: 'https://www.audi.cn/zh/models/a/a4/s4_avant.html'},
                    {name: 'RS 4 Avant', href: 'https://www.audi.cn/zh/models/a/a4/rs4_avant.html'},
                ]
            }, {
                title: 'A5',
                href: 'https://www.audi.cn',
                list: [
                    {name: 'A5 Sportback', href: 'https://www.audi.cn'},
                    {name: 'A5 Coupe', href: 'https://www.audi.cn'},
                    {name: 'A5 Cabriolet', href: 'https://www.audi.cn'},
                    {name: 'S5 Sportback', href: 'https://www.audi.cn'},
                    {name: 'S5 Coupe', href: 'https://www.audi.cn'},
                    {name: 'S5 Cabriolet', href: 'https://www.audi.cn'},
                    {name: 'RS 5 Sportback', href: 'https://www.audi.cn'},
                    {name: 'RS 5 Coupe', href: 'https://www.audi.cn'},

                ]
            },{
                title: 'A6',
                href: 'https://www.audi.cn',
                list: [
                    {name: 'A6L', href: 'https://www.audi.cn'},
                    {name: 'A6 Avant', href: 'https://www.audi.cn'},
                    {name: 'A6 allroad quattro', href: 'https://www.audi.cn'},
                    {name: 'S6 limousine', href: 'https://www.audi.cn'},
                    {name: 'RS 6 Avant', href: 'https://www.audi.cn'},
                ]
            }, {
                title: 'A7',
                href: 'https://www.audi.cn',
                list: [
                    {name: 'A7 Sportback', href: 'https://www.audi.cn'},
                    {name: 'S7 Sportback', href: 'https://www.audi.cn'},
                    {name: 'RS 7 Sportback', href: 'https://www.audi.cn'},
                ]
            }, {
                title: 'A8',
                href: 'https://www.audi.cn',
                list: [
                    {name: 'A8L', href: 'https://www.audi.cn'},
                    {name: 'A8L Horch 创始人版', href: 'https://www.audi.cn'},
                    {name: 'S8L', href: 'https://www.audi.cn'},
                ]
            }]
        },
        {
            sectionTitle: 'Q 系列',
            series: [{
                title: 'Q2',
                href: 'https://www.audi.cn',
                list: [
                    {name: 'Q2L', href: 'https://www.audi.cn/zh/models/a/a4/a4l.html'},
                    {name: 'Q2L e-tron', href: 'https://www.audi.cn/zh/models/a/a4/a4_avant.html'},
                ]
            },{
                title: 'Q3',
                href: 'https://www.audi.cn',
                list: [
                    {name: 'Q3', href: 'https://www.audi.cn/zh/models/a/a4/a4l.html'},
                    {name: 'Q3 Sportback', href: 'https://www.audi.cn/zh/models/a/a4/a4_avant.html'},
                ]
            },{
                title: 'Q4',
                href: 'https://www.audi.cn',
                list: [
                    {name: 'Q4 e-tron', href: 'https://www.audi.cn/zh/models/a/a4/a4l.html'},
                ]
            },{
                title: 'Q5',
                href: 'https://www.audi.cn',
                list: [
                    {name: 'Q5L', href: 'https://www.audi.cn/zh/models/a/a4/a4l.html'},
                    {name: 'Q5L Sportback', href: 'https://www.audi.cn/zh/models/a/a4/a4_avant.html'},
                    {name: 'SQ5', href: 'https://www.audi.cn/zh/models/a/a4/a4_allroad_quattro.html'},
                    {name: 'SQ5 Sportback', href: 'https://www.audi.cn/zh/models/a/a4/s4_limousine.html'},
                ]
            },{
                title: 'Q7',
                href: 'https://www.audi.cn',
                list: [
                    {name: 'Q7', href: 'https://www.audi.cn/zh/models/a/a4/a4l.html'},
                    {name: 'SQ7 Sportback', href: 'https://www.audi.cn/zh/models/a/a4/a4_avant.html'},
                ]
            },{
                title: 'Q8',
                href: 'https://www.audi.cn',
                list: [
                    {name: 'Q8', href: 'https://www.audi.cn'},
                    {name: 'RS Q8 Avant', href: 'https://www.audi.cn'},
                ]
            }]
        }
    ];

    dataList.forEach(section => {
        // <div class="websit-map-section">
        const $section = document.createElement('div');
        $section.className = 'websit-map-section';
        // <div class="title">总览</div>
        const $sectionTitle = document.createElement('div');
        $sectionTitle.textContent = section.sectionTitle;
        $sectionTitle.className = 'title';
        // <div class="series">
        const $series = document.createElement('div');
        $series.className = 'series';

        section.series.forEach(seriesItem => {
            // <div class="series-contianer">
            const $seriesContainer = document.createElement('div');
            $seriesContainer.className = 'series-contianer';
            // <div class="series-name">奥迪纯电</div>
            const $seriesTitle = document.createElement('a');
            $seriesTitle.textContent = seriesItem.title;
            $seriesTitle.href = seriesItem.href; // 添加你需要的链接地址
            $seriesTitle.target = '_blank';
            $seriesTitle.className = 'series-name';
            // <div class="series-list">
            const $seriesList = document.createElement('div');
            $seriesList.className = 'series-list';
            
            seriesItem.list.forEach(item => {
                // <div><a class="series-item" href="https://www.audi.cn">纯电车型</a></div>
                const $linkContainer = document.createElement('div');
                const $link = document.createElement('a');
                $link.textContent = item.name;
                $link.href = item.href; // 添加你需要的链接地址
                $link.target = '_blank';
                $link.className = 'series-item';
                $linkContainer.appendChild($link);
                $seriesList.appendChild($linkContainer);
            })
            $seriesContainer.appendChild($seriesTitle);
            $seriesContainer.appendChild($seriesList);
            $series.appendChild($seriesContainer);
        })
        
        $section.appendChild($sectionTitle);
        $section.appendChild($series);
        document.getElementsByClassName("websit-map")[0].appendChild($section);
    });
})(window, document);