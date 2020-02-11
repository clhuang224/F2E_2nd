let vue = new Vue({
    el: '#vue',
    data: {
        map: null,
        center: [23.6334772, 120.852944], // 緯度 經度
        zoom: 8.25,
        data: [],
        searchInput: '',
        checkboxes: [false, false],
        distance: 1000,
        searching: false,
        geoloation: false,
        userMarker: null,
        stroeMarkers: null,
        icon: {
            blue: L.icon({
                name: 'blue',
                iconUrl: '../img/mark-blue.png',
                shadowUrl: '../img/shadow.png',
                iconSize: [66, 90],
                shadowSize: [58.5, 30], // size of the shadow
                iconAnchor: [33, 90], // point of the icon which will correspond to marker's location
                shadowAnchor: [0, 28],  // the same for the shadow
                popupAnchor: [0, -80] // point from which the popup should open relative to the iconAnchor
            }),
            grey: L.icon({
                name: 'grey',
                iconUrl: '../img/mark-grey.png',
                shadowUrl: '../img/shadow.png',
                iconSize: [66, 90],
                shadowSize: [58.5, 30], // size of the shadow
                iconAnchor: [33, 90], // point of the icon which will correspond to marker's location
                shadowAnchor: [0, 28],  // the same for the shadow
                popupAnchor: [0, -80] // point from which the popup should open relative to the iconAnchor
            }),
            red: L.icon({
                name: 'red',
                iconUrl: '../img/mark-red.png',
                shadowUrl: '../img/shadow.png',
                iconSize: [66, 90],
                shadowSize: [58.5, 30], // size of the shadow
                iconAnchor: [33, 90], // point of the icon which will correspond to marker's location
                shadowAnchor: [0, 28],  // the same for the shadow
                popupAnchor: [0, -80] // point from which the popup should open relative to the iconAnchor
            }),
        },
    },
    filters: {
        round: function (value) {
            return Math.round(value);
        }
    },
    computed: {
        sortedData: function () {
            // 計算所有資料與中心的距離並升冪排序
            let result = this.data.slice();
            let resultLength = result.length;
            for (let i = 0; i < resultLength; i++) {
                result[i].distance = this.computeDistance(this.center, result[i].geometry.coordinates);
            }
            result.sort(function (a, b) {
                return a.distance - b.distance;
            });
            return result;
        },
        searchingList: function () {
            let result = [
                {
                    properties: {
                        name: '您的位置',
                        address: '',
                        type: 'self',
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
        computeDistance: function (a, b) {
            // 1 緯度 ≒ 11574 公尺
            // 1 經度 ≒ 111320 * cos(經度) 公尺
            return Math.sqrt(
                Math.pow(Math.abs((b[1] - a[0]) * 11574), 2)
                + Math.pow(Math.abs((b[0] - a[1]) * 111320 * Math.cos(Math.abs(b[0] + a[1]) / 2 / 180)), 2)
            );
        },
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

                    // 放入 mark

                    if (that.data[i].properties.mask_adult > 0 || that.data[i].properties.mask_child > 0) {
                        // 把 mark 的物件記在 data 裡
                        that.data[i].marker = L.marker(
                            [that.data[i].geometry.coordinates[1], that.data[i].geometry.coordinates[0]],
                            { icon: that.icon.blue }).bindPopup(popupString);
                        that.storeMarkers.addLayer(that.data[i].marker);
                    }
                    else {
                        that.data[i].marker = L.marker(
                            [that.data[i].geometry.coordinates[1], that.data[i].geometry.coordinates[0]],
                            { icon: that.icon.grey }).bindPopup(popupString);
                        that.storeMarkers.addLayer(that.data[i].marker);
                    }

                }
                that.map.addLayer(that.storeMarkers);
            };
            xhr.send();
        },
        openMap: function () {
            // 設定地圖
            this.map = L.map('map', {
                center: this.center,
                zoom: this.zoom
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                { attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }).addTo(this.map);
            // 定位
            if (navigator.geolocation) {
                let that = this;
                navigator.geolocation.getCurrentPosition(
                    // 有使用者定位
                    function (position) {
                        // 設定 map
                        that.geoloation = true;
                        that.center = [position.coords.latitude, position.coords.longitude];
                        that.zoom = 17;
                        that.map.setView(new L.LatLng(that.center[0], that.center[1]), that.zoom);
                        that.userMarker = L.marker([that.center[0], that.center[1]], { icon: that.icon.red });
                        that.map.addLayer(that.userMarker);
                    }
                );
            }
        },
        // 依據 checkbox 回傳資料是否要顯示
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
        changePosition(item) {
            if (item.properties.type === 'self') {
                if (navigator.geolocation) {
                    let that = this;
                    navigator.geolocation.getCurrentPosition(
                        // 有使用者定位
                        function (position) {
                            that.center = [position.coords.latitude, position.coords.longitude];
                            that.zoom = 17;
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
                                alert('您未提供位置資訊，請檢查您的瀏覽器設定。');
                            }
                        }
                    );
                }
            }
            else {
                this.center = [item.geometry.coordinates[1], item.geometry.coordinates[0]];
                this.zoom = 17;
                this.map.setView(new L.LatLng(this.center[0], this.center[1]), this.zoom);
                this.searchInput = item.properties.name;
                if (this.userMarker !== null) {
                    this.map.removeLayer(this.userMarker);
                    this.userMarker = L.marker([this.center[0], this.center[1]], { icon: this.icon.red }).bindPopup(item.marker._popup._content);
                    this.map.addLayer(this.userMarker);
                }
            }
            
        },
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
        let that = this;
        document.querySelector('body').addEventListener('click', function (event) {
            if (event.target.classList.contains('search-input') !== true) {
                that.searching = false;
            }
        });
    },
});
