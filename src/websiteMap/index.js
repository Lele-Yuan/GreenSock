(function (window, document) {
    const dataList = [
        {
            sectionTitle: '总览',
            series: [{
                title: '奥迪纯电',
                list: [
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                ]
            }, {
                title: '奥迪高性能车',
                list: [
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                ]
            }, {
                title: '购车工具',
                list: [
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                ]
            }, {
                title: '用户服务',
                list: [
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                ]
            }, {
                title: '奥迪品牌',
                list: [
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                    {name: '纯电车型', href: 'https://www.audi.cn'},
                ]
            }]
        },
        {
            sectionTitle: 'A 系列轿车',
            series: [{
                title: 'A4 系列',
                list: [
                    {name: 'A4L', href: 'https://www.audi.cn'},
                    {name: 'A4 Avant', href: 'https://www.audi.cn'},
                    {name: 'S4 Limousine', href: 'https://www.audi.cn'},
                ]
            }, {
                title: 'A5 系列',
                list: [
                    {name: 'A4L', href: 'https://www.audi.cn'},
                    {name: 'A4 Avant', href: 'https://www.audi.cn'},
                    {name: 'S4 Limousine', href: 'https://www.audi.cn'},
                ]
            }, {
                title: 'A6 系列',
                list: [
                    {name: 'A4L', href: 'https://www.audi.cn'},
                    {name: 'A4 Avant', href: 'https://www.audi.cn'},
                    {name: 'S4 Limousine', href: 'https://www.audi.cn'},
                ]
            }, {
                title: 'A7 系列',
                list: [
                    {name: 'A4L', href: 'https://www.audi.cn'},
                    {name: 'A4 Avant', href: 'https://www.audi.cn'},
                    {name: 'S4 Limousine', href: 'https://www.audi.cn'},
                ]
            }]
        },
        {
            sectionTitle: 'Q 系列轿车',
            series: [{
                title: 'Q5 系列',
                list: [
                    {name: 'A4L', href: 'https://www.audi.cn'},
                    {name: 'A4 Avant', href: 'https://www.audi.cn'},
                    {name: 'S4 Limousine', href: 'https://www.audi.cn'},
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
            const $seriesTitle = document.createElement('div');
            $seriesTitle.textContent = seriesItem.title;
            $seriesTitle.className = 'series-name';
            // <div class="series-list">
            const $seriesList = document.createElement('div');
            $seriesList.className = 'series-list';
            
            seriesItem.list.forEach(item => {
                // <a class="series-item" href="https://www.audi.cn">纯电车型</div>
                const $link = document.createElement('a');
                $link.textContent = item.name;
                $link.href = item.href; // 添加你需要的链接地址
                $link.target = '_blank';
                $link.className = 'series-item';
                $seriesList.appendChild($link);
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