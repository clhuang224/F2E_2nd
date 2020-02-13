let vue = new Vue({
    el: '#vue',
    data: {
        loading: true,
        map: null,
        userMarker: null,
        stroeMarkers: null,
        /**
         * 地圖中心的緯經度
         */
        center: [23.6334772, 120.852944],
        zoom: 7,
        data: [],
        /**
         * @model 搜尋框輸入內容
         */
        searchInput: '',
        /**
         * @model filter: 顯示有成人口罩／孩童口罩的藥局
         */
        checkboxes: [false, false],
        /**
         * @model filter: 顯示多少距離以內的藥局清單
         */
        distance: 1000,
        searching: false,
        geolocation: false,
        menuHide: false,
        icon: {
            blue: L.icon({
                name: 'blue',
                iconUrl: `${window.location.href}/img/mark-blue.png`,
                shadowUrl: `${window.location.href}/img/shadow.png`,
                iconSize: [66, 90],
                shadowSize: [58.5, 30], // size of the shadow
                iconAnchor: [33, 90], // point of the icon which will correspond to marker's location
                shadowAnchor: [0, 28],  // the same for the shadow
                popupAnchor: [0, -80] // point from which the popup should open relative to the iconAnchor
            }),
            grey: L.icon({
                name: 'grey',
                iconUrl: `${window.location.href}/img/mark-grey.png`,
                shadowUrl: `${window.location.href}/img/shadow.png`,
                iconSize: [66, 90],
                shadowSize: [58.5, 30], // size of the shadow
                iconAnchor: [33, 90], // point of the icon which will correspond to marker's location
                shadowAnchor: [0, 28],  // the same for the shadow
                popupAnchor: [0, -80] // point from which the popup should open relative to the iconAnchor
            }),
            red: L.icon({
                name: 'red',
                iconUrl: `${window.location.href}/img/mark-red.png`,
                shadowUrl: `${window.location.href}/img/shadow.png`,
                iconSize: [66, 90],
                shadowSize: [58.5, 30], // size of the shadow
                iconAnchor: [33, 90], // point of the icon which will correspond to marker's location
                shadowAnchor: [0, 28],  // the same for the shadow
                popupAnchor: [0, -80] // point from which the popup should open relative to the iconAnchor
            }),
        },
    },
    filters: {
        /**
         * 做四捨五入
         * @param {Number} value 任何數值
         * @returns {Number} 四捨五入的數值
         */
        round: function (value) {
            return Math.round(value);
        }
    },
    computed: {
        /**
         * 以與中心的距離由小到大排序的藥局資料列表
         * （如果沒有中心點就不計算也不排序）
         * 1. 計算所有資料與中心的距離，並放入資料陣列中
         * 2. 將資料陣列以距離作升冪排序
         */
        sortedData: function () {
            if (this.userMarker !== null) {
                let result = this.data.slice();
                let resultLength = result.length;
                for (let i = 0; i < resultLength; i++) {
                    result[i].distance = this.computeDistance(this.center, result[i].geometry.coordinates);
                }
                result.sort(function (a, b) {
                    return a.distance - b.distance;
                });
                return result;
            }
            else {
                return this.data;
            }
        },
        /**
         * 「您的位置」及其他與搜尋字串相符的資料列表
         * 1. 比對 searchInput 是否存在於資料的名稱跟地址中
         * 2. 回傳「您的位置」及篩選後的結果
         */
        searchingList: function () {
            let result = [
                {
                    type: 'self',
                    properties: {
                        name: '您的位置',
                    },
                    geometry: {
                        coordinates: [null, null]
                    }
                }
            ];
            let that = this;
            return result.concat(this.sortedData.filter(
                item => (item.properties.name.indexOf(that.searchInput) >= 0 ||
                    item.properties.address.indexOf(that.searchInput) >= 0))
            );
        }
    },
    methods: {
        /**
         * 計算 a, b 兩點的距離
         * @param {Number[]} a a 點的緯經度
         * @param {Number[]} b b 點的緯經度
         * @returns {Number} a 、 b 兩點的距離（公尺）
         */
        computeDistance: function (a, b) {
            // 1 緯度 ≒ 11574 公尺
            // 1 經度 ≒ 111320 * cos(經度) 公尺
            return Math.sqrt(
                Math.pow(Math.abs((b[1] - a[0]) * 11574), 2)
                + Math.pow(Math.abs((b[0] - a[1]) * 111320 * Math.cos(Math.abs(b[0] + a[1]) / 2 / 180)), 2)
            );
        },
        /**
         * 1. 取得口罩地圖的資料
         * 2. 將藥局的位置標示在地圖中，並將標示的物件存在 data 陣列裡
         * @param {Number} a a 點的緯經度
         * @param {Number} b b 點的緯經度
         * @returns {Number} a 、 b 兩點的距離（公尺）
         */
        getData: function () {
            let that = this;
            let xhr = new XMLHttpRequest();
            xhr.open('get', 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json');
            xhr.onload = function () {
                that.data = JSON.parse(xhr.responseText).features;
                that.storeMarkers = new L.markerClusterGroup().addTo(that.map);
                for (let i = 0; i < that.data.length; i++) {
                    // 處理 popup的內容
                    let schedule = that.data[i].properties.available.split('、');
                    let string = `<table class="schedule">
                    <tr>
                        <th class="th"></th><th class="th">一</th><th class="th">二</th><th class="th">三</th><th class="th">四</th><th class="th">五</th><th class="th">六</th><th class="th">日</th>
                    </tr>`;
                    for (let j = 0; j < schedule.length; j++) {
                        switch (j) {
                            case 0:
                                string += `<tr><th class="th">早上</th>`;
                                break;
                            case 7:
                                string += `<tr><th class="th">下午</th>`;
                                break;
                            case 14:
                                string += `<tr><th class="th">晚上</th>`;
                                break;
                        }
                        if (schedule[j].indexOf('看診') >= 0) {
                            string += `<td class="td">◯</td>`;
                        }
                        else {
                            string += `<td class="td"></td>`;
                        }
                        if (j % 7 === 6) {
                            string += `</tr>`;
                        }
                    }
                    string += `</table>`;
                    let popupString = `
                    <h2 class="title">${that.data[i].properties.name}</h2>
                    <div class="address">${that.data[i].properties.address}</div>
                    <div class="phone"><a :href="tel:${that.data[i].properties.phone}">${that.data[i].properties.phone}</a></div>
                    ${string}
                    <div class="mask ${that.data[i].properties.mask_adult > 0}">
                        成人：<span>${that.data[i].properties.mask_adult}</span></div>
                    <div class="mask ${that.data[i].properties.mask_child > 0}">
                        兒童：<span>${that.data[i].properties.mask_child}</span></div>
                    `;
                    // 放入 marker
                    if (that.data[i].properties.mask_adult > 0 || that.data[i].properties.mask_child > 0) {
                        // 把 marker 的實體記在 data 裡
                        that.data[i].marker = L.marker(
                            [that.data[i].geometry.coordinates[1], that.data[i].geometry.coordinates[0]],
                            { icon: that.icon.blue }).bindPopup(popupString);
                        // 監聽 marker 雙擊
                        that.data[i].marker.on('dblclick', function (event) {
                            that.changePosition(
                                that.data[i].geometry.coordinates[1],
                                that.data[i].geometry.coordinates[0],
                                that.data[i]);
                        });

                        that.storeMarkers.addLayer(that.data[i].marker);
                    }
                    else {
                        // 把 marker 的實體記在 data 裡
                        that.data[i].marker = L.marker(
                            [that.data[i].geometry.coordinates[1], that.data[i].geometry.coordinates[0]],
                            { icon: that.icon.grey }).bindPopup(popupString);
                        // 監聽 marker 雙擊
                        that.data[i].marker.on('dblclick', () => {
                            if (window.innerWidth > 480)
                                that.changePosition(
                                    that.data[i].geometry.coordinates[1],
                                    that.data[i].geometry.coordinates[0],
                                    that.data[i]);
                        });
                        that.data[i].marker.on('click', () => {
                            if (window.innerWidth <= 480)
                                that.changePosition(
                                    that.data[i].geometry.coordinates[1],
                                    that.data[i].geometry.coordinates[0],
                                    that.data[i]);
                        });
                        that.storeMarkers.addLayer(that.data[i].marker);
                    }
                }
                that.map.addLayer(that.storeMarkers);
                that.loading = false;
            };
            xhr.send();
        },
        /**
         * 1. 宣告 Leaflet 的實體
         * 2. 放入 Open Street Map 的 tileLayer
         * 3. 要求使用者的位置資訊
         * 4. 有定位的話以定位位置為地圖中心，無則以整個台灣為起始畫面
         */
        openMap: function () {
            let that = this;
            // 設定地圖
            this.map = L.map('map', {
                center: this.center,
                zoom: this.zoom,
                maxBounds: L.latLngBounds(L.latLng(27, 115), L.latLng(20, 127)),
                minZoom: 7,
                zoomControl: false
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                { attribution: 'Map data &copy; <a target="_blank" href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a target="_blank" href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }).addTo(this.map);
            L.control.zoom({
                position: 'topright'
            }).addTo(this.map);
            // 定位
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    // 有使用者位置資訊就以定位為中心
                    function (position) {
                        that.geolocation = true;
                        that.center = [position.coords.latitude, position.coords.longitude];
                        that.zoom = 19;
                        that.map.setView(new L.LatLng(that.center[0], that.center[1]), that.zoom);
                        that.userMarker = L.marker([that.center[0], that.center[1]], { icon: that.icon.red });
                        that.map.addLayer(that.userMarker);
                    }
                );
            }
            // 電腦使用雙擊移動使用者位置
            that.map.on('dblclick', (event) => {
                that.changePosition(event.latlng.lat, event.latlng.lng);
            })
            // 手機使用單擊移動使用者位置
            that.map.on('click', (event) => {
                if (window.innerWidth <= 480) {
                    that.changePosition(event.latlng.lat, event.latlng.lng);
                }
            })
        },
        /**
         * 依據 checkbox 打勾的狀況，回傳以這個口罩數是否要顯示該筆資料
         * @param {Number} adult 成人口罩數
         * @param {Number} child 孩童口罩數
         * @returns {Boolean} T/F
         */
        isVisable: function (adult, child) {
            if (this.checkboxes[0] == true && this.checkboxes[1] == true) {
                return (adult > 0 && child > 0);
            }
            else if (this.checkboxes[0] == true) {
                return adult > 0;
            }
            else if (this.checkboxes[1] == true) {
                return child > 0;
            }
            else {
                return true;
            }
        },
        /**
         * 將地圖中心移到某個緯經度
         * @param {Number} la 緯度
         * @param {Number} lon 經度
         * @param {Object} item 如果該點是藥局，參數要加上藥局資料的物件
         */
        changePosition(la, lon, item) {
            // 移動到緯經度
            if (!item) {
                this.center = [la, lon];
                this.zoom = 19;
                this.map.setView(new L.LatLng(this.center[0], this.center[1]), this.zoom);
                if (this.userMarker !== null) {
                    this.map.removeLayer(this.userMarker);
                }
                this.userMarker = L.marker([this.center[0], this.center[1]], { icon: this.icon.red });
                this.map.addLayer(this.userMarker);
                this.searchInput = this.center;
            }
            // 移動到定位位置或藥局
            else {
                if (item.type === 'self') {
                    if (navigator.geolocation) {
                        let that = this;
                        navigator.geolocation.getCurrentPosition(
                            // 有使用者定位
                            function (position) {
                                that.center = [position.coords.latitude, position.coords.longitude];
                                that.zoom = 19;
                                that.map.setView(new L.LatLng(that.center[0], that.center[1]), that.zoom);
                                that.searchInput = item.properties.name;
                                if (that.userMarker !== null) {
                                    that.map.removeLayer(that.userMarker);
                                    that.userMarker = L.marker([that.center[0], that.center[1]], { icon: that.icon.red });
                                    that.map.addLayer(that.userMarker);
                                }
                            },
                            // 無使用者定位
                            function (err) {
                                if (err.code === 1) {
                                    alert('您未提供位置資訊的權限，請檢查您的瀏覽器設定。');
                                }
                            }
                        );
                    }
                }
                else {
                    this.center = [item.geometry.coordinates[1], item.geometry.coordinates[0]];
                    this.zoom = 19;
                    this.map.setView(new L.LatLng(this.center[0], this.center[1]), this.zoom);
                    this.searchInput = item.properties.name;
                    if (this.userMarker !== null) {
                        this.map.removeLayer(this.userMarker);
                    }
                    this.userMarker = L.marker([this.center[0], this.center[1]], { icon: this.icon.red }).bindPopup(item.marker._popup._content);
                    this.map.addLayer(this.userMarker);
                }
            }
        },
        /**
         * 依據 checkboxes 更新藥局標示的顏色
         * （例如只勾選成人口罩的話，只有有成人口罩的藥局才是藍色，其餘是灰色）
         */
        updateStoreMarkers() {
            this.map.removeLayer(this.storeMarkers);
            for (let i = 0; i < this.data.length; i++) {
                if (this.isVisable(this.data[i].properties.mask_adult, this.data[i].properties.mask_child)) {
                    if (this.data[i].marker.options.icon.options.name === 'grey') {
                        // 處理 popup的內容
                        let schedule = this.data[i].properties.available.split('、');
                        let string = `<table class="schedule">
                    <tr>
                        <th class="th"></th><th class="th">一</th><th class="th">二</th><th class="th">三</th><th class="th">四</th><th class="th">五</th><th class="th">六</th><th class="th">日</th>
                    </tr>`;
                        for (let j = 0; j < schedule.length; j++) {
                            switch (j) {
                                case 0:
                                    string += `<tr><th class="th">早上</th>`;
                                    break;
                                case 7:
                                    string += `<tr><th class="th">下午</th>`;
                                    break;
                                case 14:
                                    string += `<tr><th class="th">晚上</th>`;
                                    break;
                            }
                            if (schedule[j].indexOf('看診') >= 0) {
                                string += `<td class="td">◯</td>`;
                            }
                            else {
                                string += `<td class="td"></td>`;
                            }
                            if (j % 7 === 6) {
                                string += `</tr>`;
                            }
                        }
                        string += `</table>`;
                        let popupString = `
                    <h2 class="title">${this.data[i].properties.name}</h2>
                    <div class="address">${this.data[i].properties.address}</div>
                    <div class="phone"><a :href="tel:${this.data[i].properties.phone}">${this.data[i].properties.phone}</a></div>
                    ${string}
                    <div class="mask ${this.data[i].properties.mask_adult > 0}">
                        成人：<span>${this.data[i].properties.mask_adult}</span></div>
                    <div class="mask ${this.data[i].properties.mask_child > 0}">
                        兒童：<span>${this.data[i].properties.mask_child}</span></div>
                    `;
                        this.storeMarkers.removeLayer(this.data[i].marker);
                        this.data[i].marker = L.marker(
                            [this.data[i].geometry.coordinates[1], this.data[i].geometry.coordinates[0]],
                            { icon: this.icon.blue }).bindPopup(popupString);
                        this.storeMarkers.addLayer(this.data[i].marker);
                    }
                }
                else {
                    if (this.data[i].marker.options.icon.options.name === 'blue') {
                        // 處理 popup的內容
                        let schedule = this.data[i].properties.available.split('、');
                        let string = `<table class="schedule">
                    <tr>
                        <th class="th"></th><th class="th">一</th><th class="th">二</th><th class="th">三</th><th class="th">四</th><th class="th">五</th><th class="th">六</th><th class="th">日</th>
                    </tr>`;
                        for (let j = 0; j < schedule.length; j++) {
                            switch (j) {
                                case 0:
                                    string += `<tr><th class="th">早上</th>`;
                                    break;
                                case 7:
                                    string += `<tr><th class="th">下午</th>`;
                                    break;
                                case 14:
                                    string += `<tr><th class="th">晚上</th>`;
                                    break;
                            }
                            if (schedule[j].indexOf('看診') >= 0) {
                                string += `<td class="td">◯</td>`;
                            }
                            else {
                                string += `<td class="td"></td>`;
                            }
                            if (j % 7 === 6) {
                                string += `</tr>`;
                            }
                        }
                        string += `</table>`;
                        let popupString = `
                    <h2 class="title">${this.data[i].properties.name}</h2>
                    <div class="address">${this.data[i].properties.address}</div>
                    <div class="phone"><a :href="tel:${this.data[i].properties.phone}">${this.data[i].properties.phone}</a></div>
                    ${string}
                    <div class="mask ${this.data[i].properties.mask_adult > 0}">
                        成人：<span>${this.data[i].properties.mask_adult}</span></div>
                    <div class="mask ${this.data[i].properties.mask_child > 0}">
                        兒童：<span>${this.data[i].properties.mask_child}</span></div>
                    `;
                        this.storeMarkers.removeLayer(this.data[i].marker);
                        this.data[i].marker = L.marker(
                            [this.data[i].geometry.coordinates[1], this.data[i].geometry.coordinates[0]],
                            { icon: this.icon.grey }).bindPopup(popupString);
                        this.storeMarkers.addLayer(this.data[i].marker);
                    }
                }
                this.map.addLayer(this.storeMarkers);
                this.map.removeLayer(this.userMarker);
                this.map.addLayer(this.userMarker);
            }
        },
    },
    mounted() {
        this.openMap();
        this.getData();
        // 點選搜尋框以外的地方時，搜尋選項會隱藏
        let that = this;
        document.querySelector('body').addEventListener('click', function (event) {
            if (event.target.classList.contains('search-input') !== true) {
                that.searching = false;
            }
        });
    },
});
