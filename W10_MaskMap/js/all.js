let vue = new Vue({
    el: '#vue',
    data: {
        map: null,
        center: [23.6334772, 120.852944], // 緯度 經度
        zoom: 8.25,
        data: [],
        userInput: '您的位置',
        checkboxes: [false, false],
    },
    filters: {
        round: function (value) {
            return Math.round(value);
        }
    },
    computed: {
        sortedData: function () {
            // 篩選、計算所有資料與中心的距離並升冪排序
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
            };
            xhr.send();
        },
        openMap: function () {
            if (navigator.geolocation) {
                let that = this;
                navigator.geolocation.getCurrentPosition(
                    // 有使用者定位
                    function (position) {
                        that.center = [position.coords.latitude, position.coords.longitude];
                        that.zoom = 17;
                        that.map = L.map('map', {
                            center: that.center,
                            zoom: that.zoom
                        });
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            { attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }).addTo(that.map);
                        that.userInput = '您的位置';
                        let markers = new L.markerClusterGroup();
                        for (let i = 0; i < that.data.length; i++) {
                            markers.addLayer(L.marker(
                                [that.data[i].geometry.coordinates[1], that.data[i].geometry.coordinates[0]]));
                        }
                        that.map.addLayer(markers);
                    },
                    // 無使用者定位
                    function (err) {
                        if (err.code === 1) {
                            that.map = L.map('map', {
                                center: that.center,
                                zoom: that.zoom
                            });
                            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                                { attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }).addTo(that.map);
                        }
                        that.userInput = that.center;
                        let markers = new L.markerClusterGroup();
                        for (let i = 0; i < that.data.length; i++) {
                            markers.addLayer(L.marker(
                                [that.data[i].geometry.coordinates[1], that.data[i].geometry.coordinates[0]]));
                        }
                        that.map.addLayer(markers);
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

    },
    beforeMount() {
        this.getData();
    },
    mounted() {
        this.openMap();
    },
    created() {
    },
});

