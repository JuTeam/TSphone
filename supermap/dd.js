var wmaps = function() {
    var map, 
    //唐山地图所属的layer
    layer, 
    //线路所属的layer
    vectorLayer, 
    //线所属的layer
    vectorLayerline,
    //面所属的layer
    vectorLayerregion, 
    selectFeature, 
    //底图所属的layer
    wlayer, 
    drawPointlj, 
    //标记点的markers
    markers, 
    //线路上标记点的markers
    markerspath;
    //储存路径规划途径点
    var nodeArray = [];
    //站点内容集合
    var buspoint = [{
        "lng": 109.05940300380507,
        "lat": 35.653358237747945,
        "num": 0,
        "name": "站1"
    }, {
        "lng": 109.07456171147686,
        "lat": 35.648565300603678,
        "num": 1,
        "name": "站2"
    }, {
        "lng": 109.07842116033173,
        "lat": 35.638030404801896,
        "num": 2,
        "name": "站3"
    }, {
        "lng": 109.082001897084,
        "lat": 35.641377053304794,
        "num": 3,
        "name": "站4"
    }, {
        "lng": 109.06440465817069,
        "lat": 35.65568915916657,
        "num": 4,
        "name": "站5"
    }, {
        "lng": 109.07403095371735,
        "lat": 35.634674090878605,
        "num": 5,
        "name": "站6"
    }, {

        "lng": 109.05997622889942,
        "lat": 35.623708781641866,
        "num": 6,
        "name": "站7"
    }, {

        "lng": 109.06625728050048,
        "lat": 35.62708849595063,
        "num": 7,
        "name": "站8"
    }, {

        "lng": 109.08349882277224,
        "lat": 35.633445831031381,
        "num": 8,
        "name": "站9"
    }, {

        "lng": 109.08569255182333,
        "lat": 35.634648048431472,
        "num": 9,
        "name": "站10"
    }];

    style = {
        strokeColor: "#FFFF37",
        strokeWidth: 1,
        pointerEvents: "visiblePainted",
        fillColor: "red",
        fillOpacity: 0.5,
        marginTop: "100px"
    };
    var styleGuidePoint = {
        pointRadius: 0,
        externalGraphic: ""
    };
    var styleGuideLine = {
        strokeColor: "#D94600",
        
        strokeWidth: 5,
        fill: false
    };
    var styleregion = {
        strokeColor: "#304DBE",
        strokeWidth: 1,
        fillColor: "#304DBE",
        fillOpacity: "0.8"
    };
    var defaults = {
        urldt: "http://192.168.1.55:8090/iserver/services/map-diantoudata/rest/maps/dtmaptest",
        //urldt: "http://192.168.1.55:8090/iserver/services/map-phonetsdemowork/rest/maps/phonedemomap",
        urldtlw: "http://192.168.1.55:8090/iserver/services/transportationAnalyst-diantoudata/rest/networkanalyst/BuildNetwork@dtdata",
        //urldtlw: "http://192.168.1.55:8090/iserver/services/transportationAnalyst-phonetsdemowork/rest/networkanalyst/BuildNetwork@phonetsdemo",
        urldtlwtwo: "http://192.168.1.55:8090/iserver/services/transportationAnalyst-phonetsdemowork2/rest/networkanalyst/BuildNetwork1@phonetsdemo",
        urlword: "http://192.168.1.55:8090/iserver/services/map-world/rest/maps/World",
        callbackfuc: function() {}
    };

    //用于存储面对象的自定义样式
    var myClassregion = [];
    //用户存储线对象的自定义样式
    var myClassline = [];

    function init(options) {
        var opts = $.extend(defaults, options || {});
        vectorLayer = new SuperMap.Layer.Vector("Vector Layer");
        vectorLayerregion = new SuperMap.Layer.Vector("Vector1 Layer1");
        vectorLayerline = new SuperMap.Layer.Vector("Vector2 Layer2");
        //
        //初始化标记图层类
        markers = new SuperMap.Layer.Markers("Markers");
        markerspath = new SuperMap.Layer.Markers("Markerspath");
        
        //初始化地图
        map = new SuperMap.Map(opts.container, {
            controls: [
                new SuperMap.Control.LayerSwitcher(),
                new SuperMap.Control.MousePosition(),
                new SuperMap.Control.Navigation({
                    dragPanOptions: {
                        enableKinetic: true
                    }
                }),
            ],
            allOverlays: true,
            units: "m"
        });

        //添加全局click事件，在控制台获取坐标数据
        map.events.on({
            "click": callbackFunction
        });
        
        //恢复自定义的样式到新生成的线或面对象上，在地图移动结束后
        map.events.on({
            "moveend": function() {

                /*console.log(myClassregion, myClassline, "<--start");*/

                $.each(myClassregion, function(index, val) {
                    var findidregion = val.regionid;
                    var objregion = $("#" + findidregion + "");
                    objregion.attr("data-id", val.regionDataid).attr("class", val.regionClass).attr("wfcfindtype", "region");
                });
                $.each(myClassline, function(index, val) {
                    var findidline = val.lineid;
                    var objline = $("#" + findidline + "");
                    objline.attr("data-id", val.lineDataid).attr("class", val.lineClass).attr("wfcfindtype", "line");
                });
            }
        });
        /*获取在最初绘制面或线时增加的自定义属性，在绘制时自定义了 class，data-id，wfcfindtype
        在获取后进行比较，如果自定义的属性值有变化则记录最新的变化，否则保持原有状态*/
        map.events.on({
            "movestart": function() {
                $.each(myClassregion, function(indexz, valz) {
                    $("[wfcfindtype=region]").each(function(indexr, valr) {
                        if (valz.regionDataid == $(valr).attr("data-id") && valz.regionClass != $(valr).attr("class")) {
                            myClassregion[indexz].regionClass = $(valr).attr("class");
                        }
                    });
                });

                $.each(myClassline, function(indexz, valz) {
                    $("[wfcfindtype=line]").each(function(indexr, valr) {
                        if (valz.lineDataid == $(valr).attr("data-id") && valz.lineClass != $(valr).attr("class")) {
                            myClassline[indexz].lineClass = $(valr).attr("class");
                        }
                    });
                });
                /*console.log(myClassregion, "<--end");*/
            }
        });

        //初始化底图图层，如百度地图或天地图等
        wlayer = new SuperMap.Layer.TiledDynamicRESTLayer("Map", opts.urlword, {
            transparent: true,
            cacheEnabled: true
        }, {
            maxResolution: "auto"
        });

        //监听图层信息加载完成事件
        wlayer.events.on({
            "layerInitialized": addLayer
        });

    }

    function addLayer() {
        layer = new SuperMap.Layer.TiledDynamicRESTLayer("Map", defaults.urldt, {
            transparent: true,
            cacheEnabled: true
        }, {
            maxResolution: "auto"
        }); 
        //加载第二层地图，就是唐山的地图
        layer.events.on({
            "layerInitialized": addLayerts
        });
    }

    function addLayerts() {
        map.addLayers([wlayer, layer, vectorLayer, vectorLayerline, vectorLayerregion, markers, markerspath]);
        map.setCenter(new SuperMap.LonLat(109.07593852795, 35.630478192408), 11);
        //map.setCenter(new SuperMap.LonLat(105.400046872595, 27.191345926152), 1);
    }
    //移动地图到指定的坐标
    function panTo(options) {
        var opts = $.extend(defaults, options || {});
        map.setCenter(new SuperMap.LonLat(opts.lng, opts.lat), map.zoom);
    }
    //返回地图的等级
    function ZoomLevel() {
        return map.zoom;
    }
    //重新定位地图中心点及对应的级别
    function ZoomAndCenter(options) {
        var opts = $.extend(defaults, options || {});
        map.setCenter(new SuperMap.LonLat(opts.lng, opts.lat), opts.level);
    }
    //将地图调整到合适等级
    function fitmap() {
        var maplayer = map.getLayersByName("Markers");
        if (maplayer[0].markers.length > 1) {
            //计算所有的标记的最大范围
            var bounds = maplayer[0].getDataExtent();
            if (bounds) {
                map.zoomToExtent(bounds, false);
            }
        } else if (maplayer[0].markers.length > 0) {
            panTo(maplayer[0].markers[0].lonlat.lon, maplayer[0].markers[0].lonlat.lat);
        }
    }
    //地图点击事件回调
    function callbackFunction(e) {
        var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
        console.log('位置坐标："lng":' + lonlat.lon.toFixed(5) + ', "lat":' + lonlat.lat.toFixed(5));

    }

    //根据一组ID获取对应坐标集合
    function idTolatlng(options) {
        var opts = $.extend(defaults, options || {});
        var queryBySQLParams, queryService, queryParam;

        queryParam = new SuperMap.REST.FilterParameter({
            name: "T_Point@dtdata",
            attributeFilter: "SmUserID in (" + opts.ids + ")"
        });
        queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
            queryParams: [queryParam],
            spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT
        });
        queryService = new SuperMap.REST.QueryBySQLService(opts.urldt, {
            eventListeners: {
                "processCompleted": function(res) {
                    processCompletedid(res, opts);
                },
                "processFailed": processFailed
            }
        });
        queryService.processAsync(queryBySQLParams);
    }

    function processCompletedid(queryEventArgs, opts) {
        var i, len, features, result = queryEventArgs.result;
        var points = [];
        if (result.currentCount > 0) {
            for (i = 0, recordsets = result.recordsets, len = recordsets.length; i < len; i++) {
                if (recordsets[i].features) {
                    for (j = 0; j < recordsets[i].features.length; j++) {
                        var feature = recordsets[i].features[j];
                        var point = feature.geometry;
                        points.push(point);

                    }
                    opts.callbackfuc(points);
                }
            }
        }
    }

    //画点根据ID
    function drawPoint(options) {
        var opts = $.extend(defaults, options || {});
        var queryBySQLParams, queryService, queryParam;
        queryParam = new SuperMap.REST.FilterParameter({
            name: "T_Point@dtdata",
            attributeFilter: "SmUserID in (" + opts.ids + ")"
        });
        queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
            queryParams: [queryParam],
            spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT
        });
        queryService = new SuperMap.REST.QueryBySQLService(opts.urldt, {
            eventListeners: {
                "processCompleted": function(res) {
                    processCompleted(res, opts);
                },
                "processFailed": processFailed
            }
        });
        queryService.processAsync(queryBySQLParams, opts);
    }

    //画点根据坐标
    function drawPointlatlng(options) {
        var opts = $.extend(defaults, options || {});
        /*判断传入的一组坐标是否为超图的坐标对象，如果是责采用a方式进行取值画点。如果不是则说明是由页面
        传入的一组坐标使用b方式进行画点*/
        if (opts.latlngPile[0].x) {
            
            for (var i = 0; i < opts.latlngPile.length; i++) {

                var size = new SuperMap.Size(21, 25),
                    offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                    icon = new SuperMap.Icon("images/cluster2.png", size, offset);
                marker = new SuperMap.Marker(new SuperMap.LonLat(opts.latlngPile[i].x, opts.latlngPile[i].y), icon);
                if (opts.latlngPile.length == 1) {
                    $(marker.icon.imageDiv).attr('data-id', opts.ids[i]).attr('data-lat', opts.latlngPile[i].y).attr('data-lng', opts.latlngPile[i].x).addClass('gsmarker');
                } else {
                    $(marker.icon.imageDiv).attr('data-id', opts.ids[i]).attr('data-lat', opts.latlngPile[i].y).attr('data-lng', opts.latlngPile[i].x).addClass('gsmarker').addClass('marker-' + i);
                }

                markers.addMarker(marker);
            }
        } else {

            for (var i = 0; i < opts.latlngPile.length; i++) {
                var size = new SuperMap.Size(21, 25),
                    offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                    icon = new SuperMap.Icon("images/cluster2.png", size, offset);
                marker = new SuperMap.Marker(new SuperMap.LonLat(opts.latlngPile[i].lng, opts.latlngPile[i].lat), icon);
                if (opts.latlngPile.length == 1) {
                    $(marker.icon.imageDiv).attr('w-id', opts.latlngPile[i].wid).attr('data-lat', opts.latlngPile[i].lat).attr('data-lng', opts.latlngPile[i].lng).addClass('gsmarker');
                } else {
                    $(marker.icon.imageDiv).attr('w-id', opts.latlngPile[i].wid).attr('data-lat', opts.latlngPile[i].lat).attr('data-lng', opts.latlngPile[i].lng).addClass('gsmarker').addClass('marker-' + i);
                }
                markers.addMarker(marker);
            }
        }

    }
    
    function processCompleted(queryEventArgs, opts) {
        var i, len, features, result = queryEventArgs.result;
        if (result.currentCount > 0) {
            for (i = 0, recordsets = result.recordsets, len = recordsets.length; i < len; i++) {
                if (recordsets[i].features) {
                    for (j = 0; j < recordsets[i].features.length; j++) {
                        var feature = recordsets[i].features[j];
                        var point = feature.geometry;
                        var size = new SuperMap.Size(21, 25),
                            offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                            icon = new SuperMap.Icon("images/cluster2.png", size, offset);
                        marker = new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon);
                        //在DIV上增加dataID
                        if (recordsets[i].features.length == 1) {
                            $(marker.icon.imageDiv).attr('data-id', feature.data.SmUserID).attr('data-lat', point.y).attr('data-lng', point.x).addClass('gsmarker');
                        } else {
                            $(marker.icon.imageDiv).attr('data-id', feature.data.SmUserID).attr('data-lat', point.y).attr('data-lng', point.x).addClass('marker-' + j).addClass('gsmarker');
                        }

                        markers.addMarker(marker);

                    }
                }
            }
            opts.callbackfuc(result);
        }
    }
    //根据id画面
    function drawRegion(options) {
        var opts = $.extend(defaults, options || {});
        vectorLayerregion.removeAllFeatures();
        var queryBySQLParams, queryService, queryParam;
        queryParam = new SuperMap.REST.FilterParameter({
            name: "T_Region@dtdata",
            attributeFilter: "SmUserID in (" + opts.ids + ")"
        });
        queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
            queryParams: [queryParam],
            spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT
        });
        queryService = new SuperMap.REST.QueryBySQLService(opts.urldt, {
            eventListeners: {
                "processCompleted": function(res) {
                    processCompletedregion(res, opts);
                },
                "processFailed": processFailed
            }
        });
        queryService.processAsync(queryBySQLParams);
    }

    function processCompletedregion(queryEventArgs, opts) {
        var i, j, feature,
            result = queryEventArgs.result;
        if (result && result.recordsets) {
            for (i = 0; i < result.recordsets.length; i++) {
                if (result.recordsets[i].features) {
                    for (j = 0; j < result.recordsets[i].features.length; j++) {
                        feature = result.recordsets[i].features[j];
                        //获取面对应的dom对象id
                        var findid = feature.geometry.components[0].id;
                        document.getElementById("" + findid + "");
                        findid = findid.replace(/\./g, "\\.");
                        vectorLayerregion.addFeatures(feature);
                        //把dom对象转为jquery对象
                        var obj = $("#" + findid + "");
                        //向对象中增加自定义属性
                        obj.attr("data-id", feature.data.SmUserID).attr("class", "gsregion").attr("wfcfindtype", "region");
                        //在初始化时向公共变量传入要保持的自定义属性
                        var myClassObjectreiong = {};
                        myClassObjectreiong.regionid = findid;
                        myClassObjectreiong.regionClass = "gsregion";
                        myClassObjectreiong.regionDataid = feature.data.SmUserID;
                        myClassregion.push(myClassObjectreiong);
                    }
                }
            }
            //执行传入的回调方法
            opts.callbackfuc(result);
        }
    }

    //根据id画线
    function drawLine(options) {
        var opts = $.extend(defaults, options || {});

        vectorLayerline.removeAllFeatures();
        var queryBySQLParams, queryService, queryParam;
        queryParam = new SuperMap.REST.FilterParameter({
            name: "T_Line@dtdata",
            attributeFilter: "SmUserID in (" + opts.ids + ")"
        });
        queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
            queryParams: [queryParam],
            spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT
        });
        queryService = new SuperMap.REST.QueryBySQLService(opts.urldt, {
            eventListeners: {
                "processCompleted": function(res) {
                    processCompletedline(res, opts);
                },
                "processFailed": processFailed
            }
        });
        queryService.processAsync(queryBySQLParams);
    }

    function processCompletedline(queryEventArgs, opts) {
        var i, j, feature,
            result = queryEventArgs.result;
        if (result && result.recordsets) {
            for (i = 0; i < result.recordsets.length; i++) {
                if (result.recordsets[i].features) {
                    for (j = 0; j < result.recordsets[i].features.length; j++) {
                        feature = result.recordsets[i].features[j];
                        //获取面对应的dom对象id
                        var findid = feature.geometry.id;
                        //因为获取的id中有特殊符号需要转译
                        findid = findid.replace(/\./g, "\\.");
                        vectorLayerline.addFeatures(feature);
                        //把dom对象转为jquery对象
                        var obj = $("#" + findid + "");
                        //向对象中增加自定义属性
                        obj.attr("data-id", feature.data.SmUserID).attr("class", "gsline").attr("wfcfindtype", "line");
                        //在初始化时向公共变量传入要保持的自定义属性
                        var myClassObjectline = {};
                        myClassObjectline.lineid = findid;
                        myClassObjectline.lineClass = "gsline";
                        myClassObjectline.lineDataid = feature.data.SmUserID;
                        myClassline.push(myClassObjectline);
                    }
                }
            }
            opts.callbackfuc(result);
        }
    }
    //根据传入的点，与一组点返回传入点与一组点之间的距离，根据距离远近排序
    function findMinDisPoint(cp, parr) {
        var objs = [];
        for (var i = 0; i < parr.length; i++) {
            var point = parr[i].geometry;
            var d = getFlatternDistance(point.y, point.x, cp.y, cp.x);
            point.dataid = parr[i].data.SmID;
            point.dataname = parr[i].data.CAPITAL;
            point.distance = d;

            var obj = [point, d];
            objs.push(obj);
        }
        //排序->排序后数组第一个元素就是距离最近的点
        for (var k = 0; k < objs.length; k++) {
            for (var j = 0; j < objs.length - k - 1; j++) {
                if (objs[j][1] > objs[j + 1][1]) {
                    var temp = objs[j];
                    objs[j] = objs[j + 1];
                    objs[j + 1] = temp;
                }
            }
        }
        return objs;
    }

    //查找传入点最近的公交站点
    function findMinPoint(cp, parr) {
        var objs = [];
        for (var i = 0; i < parr.length; i++) {
            var point = parr[i];
            var d = getFlatternDistance(point.lat, point.lng, cp.lat, cp.lng);
            point.dataid = parr[i].num;
            point.dataname = parr[i].name;
            point.distance = d;
            var obj = [point, d];
            objs.push(obj);
        }
        //排序->排序后数组第一个元素就是距离最近的点
        for (var k = 0; k < objs.length; k++) {
            for (var j = 0; j < objs.length - k - 1; j++) {
                if (objs[j][1] > objs[j + 1][1]) {
                    var temp = objs[j];
                    objs[j] = objs[j + 1];
                    objs[j + 1] = temp;
                }
            }
        }
        return objs[0];
    }


    function findMinPoint2(cp, parr) {
        var objs = [];
        for (var i = 0; i < parr.length; i++) {

            var point = parr[i];
            var d = getFlatternDistance(point.lat, point.lng, cp.y, cp.x);
            point.dataid = parr[i].num;
            point.dataname = parr[i].name;
            point.distance = d;

            var obj = [point, d];
            objs.push(obj);
        }
        //排序->排序后数组第一个元素就是距离最近的点
        for (var k = 0; k < objs.length; k++) {
            for (var j = 0; j < objs.length - k - 1; j++) {
                if (objs[j][1] > objs[j + 1][1]) {
                    var temp = objs[j];
                    objs[j] = objs[j + 1];
                    objs[j + 1] = temp;
                }
            }
        }
        return objs[0];
    }


    /**
     * 计算两个点之间的距离
     * approx distance between two points on earth ellipsoid
     * @param {Object} lat1 第一点纬度
     * @param {Object} lng1 第一点经度
     * @param {Object} lat2 第二点纬度
     * @param {Object} lng2 第二点经度
     */
    function getFlatternDistance(lat1, lng1, lat2, lng2) {

        //地球半径
        var EARTH_RADIUS = 6378137.0; //单位M
        var PI = Math.PI;
        var f = ((lat1 + lat2) * PI / 180.0) / 2;
        var g = ((lat1 - lat2) * PI / 180.0) / 2;
        var l = ((lng1 - lng2) * PI / 180.0) / 2;
        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);
        var s, c, w, r, d, h1, h2;
        var a = EARTH_RADIUS;
        var fl = 1 / 298.257;
        sg = sg * sg;
        sl = sl * sl;
        sf = sf * sf;
        s = sg * (1 - sl) + (1 - sf) * sl;
        c = (1 - sg) * (1 - sl) + sf * sl;
        w = Math.atan(Math.sqrt(s / c));
        r = Math.sqrt(s * c) / w;
        d = 2 * w * a;
        h1 = (3 * r - 1) / 2 / c;
        h2 = (3 * r + 1) / 2 / s;
        return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));

    }
    //清除所有
    function clearFeatures() {
        vectorLayer.removeAllFeatures();
        vectorLayerregion.removeAllFeatures();
        vectorLayerline.removeAllFeatures();
        markers.clearMarkers();
        markerspath.clearMarkers();
        vectorLayer.refresh();
        vectorLayerregion.refresh();
        vectorLayerline.refresh();
    }
    //清除所有标记点
    function clearmarkers() {
        markers.clearMarkers();
    }
    //清除所有线
    function clearline() {
        vectorLayerline.removeAllFeatures();
        vectorLayerline.refresh();
    }
    //清除所有面
    function clearregion() {
        vectorLayerregion.removeAllFeatures();
        vectorLayerregion.refresh();
    }

    function clearpath() {
        markerspath.clearMarkers();
        vectorLayer.removeAllFeatures();
        vectorLayer.refresh();
    }

    //公交线路分析
    function findbusPath(options) {
        var opts = $.extend(defaults, options || {});
        clearElements();
        if (opts.StartEndlatlng.length <= 1) {
            alert("选择正确起始点!");
            return false;
        }
        //最终的途径的公交站点
        var nodebus = [];
        //起始于结束的公交站点
        var nodebusse = [];
        for (var i = 0; i < opts.StartEndlatlng.length; i++) {
            var newpoint = findMinPoint(opts.StartEndlatlng[i], buspoint)[0];
            var point = new SuperMap.Geometry.Point(newpoint.lng, newpoint.lat);
            var sizes = new SuperMap.Size(21, 25),
                offsets = new SuperMap.Pixel(-(sizes.w / 2), -sizes.h),
                icons = new SuperMap.Icon("images/cluster1.png", sizes, offset);
            marker = new SuperMap.Marker(new SuperMap.LonLat(opts.StartEndlatlng[i].lng, opts.StartEndlatlng[i].lat), icons);
            if (i < 1) {
                $(marker.icon.imageDiv).addClass('gsmarker-from');
            } else {
                $(marker.icon.imageDiv).addClass('gsmarker-to');
            }
            markerspath.addMarker(marker);
            nodebusse.push(newpoint.num);

        }

        //返回的途径公交站编号
        var allbusnode = returnBusPointNum(nodebusse[0], nodebusse[1]);
        if (allbusnode.length === 0) {
            findPath(opts.StartEndlatlng);
        } else {

            for (var k = 0; k < allbusnode.length; k++) {
                var zsdpoint = new SuperMap.Geometry.Point(buspoint[allbusnode[k]].lng, buspoint[allbusnode[k]].lat);

                nodebus.push(zsdpoint);
            }

            //画出公交起点终点开始位置
            for (var j = 0; j < nodebus.length; j++) {
                var pointbus = nodebus[j];
                var size = new SuperMap.Size(21, 25),
                    offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                    icon = new SuperMap.Icon("images/cluster2.png", size, offset);
                marker = new SuperMap.Marker(new SuperMap.LonLat(pointbus.x, pointbus.y), icon);
                $(marker.icon.imageDiv).addClass('gsmarker-via');
                markerspath.addMarker(marker);
            }

            var findPathService, parameter, analystParameter, resultSetting;
            resultSetting = new SuperMap.REST.TransportationAnalystResultSetting({
                returnEdgeFeatures: true,
                returnEdgeGeometry: true,
                returnEdgeIDs: true,
                returnNodeFeatures: true,
                returnNodeGeometry: true,
                returnNodeIDs: true,
                returnPathGuides: true,
                returnRoutes: true
            });
            analystParameter = new SuperMap.REST.TransportationAnalystParameter({
                resultSetting: resultSetting,
                weightFieldName: "Smlength"
            });
            parameter = new SuperMap.REST.FindPathParameters({
                isAnalyzeById: false,
                nodes: nodebus,
                hasLeastEdgeCount: false,
                parameter: analystParameter
            });
            if (opts.StartEndlatlng.length <= 1) {
                alert("站点数目有误");
            }

            findPathService = new SuperMap.REST.FindPathService(opts.urldtlw, {
                eventListeners: {
                    "processCompleted": processCompletedly
                }
            });
            findPathService.processAsync(parameter);
        }
    }
    //步行线路分析
    function findPath(options) {
        var opts = $.extend(defaults, options || {});
        clearElements();
        var nodegoto = [];
        var pointstart = new SuperMap.Geometry.Point(opts.StartEndlatlng[0].lng, opts.StartEndlatlng[0].lat);
        var pointend = new SuperMap.Geometry.Point(opts.StartEndlatlng[1].lng, opts.StartEndlatlng[1].lat);
        nodegoto[0] = pointstart;
        nodegoto[1] = pointend;

        //画出起点终点开始位置
        for (var i = 0; i < nodegoto.length; i++) {
            var point = nodegoto[i];
            var size = new SuperMap.Size(21, 25),
                offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                icon = new SuperMap.Icon("images/cluster2.png", size, offset);
            marker = new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon);
            if (i < 1) {
                $(marker.icon.imageDiv).addClass('gsmarker-from');
            } else {
                $(marker.icon.imageDiv).addClass('gsmarker-to');
            }

            markerspath.addMarker(marker);
        }

        var findPathService, parameter, analystParameter, resultSetting;
        resultSetting = new SuperMap.REST.TransportationAnalystResultSetting({
            returnEdgeFeatures: true,
            returnEdgeGeometry: true,
            returnEdgeIDs: true,
            returnNodeFeatures: true,
            returnNodeGeometry: true,
            returnNodeIDs: true,
            returnPathGuides: true,
            returnRoutes: true
        });
        analystParameter = new SuperMap.REST.TransportationAnalystParameter({
            resultSetting: resultSetting,
            weightFieldName: "Smlength"

        });
        parameter = new SuperMap.REST.FindPathParameters({
            isAnalyzeById: false,
            nodes: nodegoto,
            hasLeastEdgeCount: false,
            parameter: analystParameter
        });
        if (nodegoto.length <= 1) {
            alert("站点数目有误");
        }
        findPathService = new SuperMap.REST.FindPathService(opts.urldtlw, {
            eventListeners: {
                "processCompleted": processCompletedly
            }
        });
        findPathService.processAsync(parameter);
    }




    function processCompletedly(findPathEventArgs) {
        var result = findPathEventArgs.result;
        allScheme(result);
    }

    function allScheme(result) {
        if (pathListIndex < result.pathList.length) {
            addPath(result);

        } else {
            pathListIndex = 0;
            //线绘制完成后会绘制关于路径指引点的信息
            addPathGuideItems(result);
        }
    }

    //以动画效果显示分析结果
    function addPath(result) {

        if (routeCompsIndex < result.pathList[pathListIndex].route.components.length) {
            var pathFeature = new SuperMap.Feature.Vector();
            var points = [];
            for (var k = 0; k < 2; k++) {
                if (result.pathList[pathListIndex].route.components[routeCompsIndex + k]) {
                    points.push(new SuperMap.Geometry.Point(result.pathList[pathListIndex].route.components[routeCompsIndex + k].x, result.pathList[pathListIndex].route.components[routeCompsIndex + k].y));
                }
            }
            var curLine = new SuperMap.Geometry.LinearRing(points);
            pathFeature.geometry = curLine;
            pathFeature.style = styleGuideLine;
            vectorLayer.addFeatures(pathFeature);
            //每隔1毫秒加载一条弧段
            pathTime = setTimeout(function() {
                addPath(result);
            }, 1);
            routeCompsIndex++;
        } else {
            clearTimeout(pathTime);
            routeCompsIndex = 0;
            pathListIndex++;
            allScheme(result);
        }
    }

    function addPathGuideItems(result) {
        vectorLayer.removeAllFeatures();
        //显示每个pathGuideItem和对应的描述信息
        for (var k = 0; k < result.pathList.length; k++) {
            var pathGuideItems = result.pathList[pathListIndex].pathGuideItems,
                len = pathGuideItems.length;
            for (var m = 0; m < len; m++) {
                var guideFeature = new SuperMap.Feature.Vector();
                guideFeature.geometry = pathGuideItems[m].geometry;
                guideFeature.attributes = {
                    description: pathGuideItems[m].description
                };
                if (guideFeature.geometry.CLASS_NAME === "SuperMap.Geometry.Point") {
                    guideFeature.style = styleGuidePoint;
                } else {
                    guideFeature.style = styleGuideLine;
                }
                vectorLayer.addFeatures(guideFeature);
            }
        }

        var maplayerline = map.getLayersByName("Markerspath");
        var boundsline = maplayerline[0].getDataExtent();
        map.zoomToExtent(boundsline, false);

        
    }

    function clearElements() {
        pathListIndex = 0;
        routeCompsIndex = 0;
        vectorLayer.removeAllFeatures();
        markerspath.clearMarkers();
    }
    //判断一个点是否在某个面中，用来完成实时定位分析功能
    function pointIntersectsRegion(options) {
        var opts = $.extend(defaults, options || {});
       
        var point = new SuperMap.Geometry.Point(109.06109, 35.65500);
        var queryBySQLParams, queryService, queryParam;
        queryParam = new SuperMap.REST.FilterParameter({
            name: "T_Region@dtdata"
        });
        queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
            queryParams: [queryParam],
            spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT
        });
        queryService = new SuperMap.REST.QueryBySQLService(opts.urldt, {
            eventListeners: {
                "processCompleted": function(res) {
                    processCompletedregionnr(res, point, opts.func);
                },
                "processFailed": processFailed
            }
        });
        queryService.processAsync(queryBySQLParams);

    }

    function processCompletedregionnr(queryEventArgs, p, f) {
        var i, j, feature,
            result = queryEventArgs.result;
        if (result && result.recordsets) {
            for (i = 0; i < result.recordsets.length; i++) {
                if (result.recordsets[i].features) {
                    for (j = 0; j < result.recordsets[i].features.length; j++) {
                        feature = result.recordsets[i].features[j];

                        if (p.intersects(feature.geometry)) {
                            feature.style = style;
                            //vectorLayerregion.redraw();
                        }
                        vectorLayerregion.addFeatures(feature);
                    }
                }
            }

        }
    }

    function processFailed(e) {
        alert(e.error.errorMsg);
    }

    ////计算公交途径站与判断是否需要乘坐公交车的方法///////
    function oneBusPoint(qd, zd) {
        var xsnodes = [];
        //公交线路的长度
        var sj = [0, 1, 2, 3, 4];
        //var sj = [0, 1, 2, 3, 4, 5, 6];
        //总站数
        var sjlength = sj.length;
        var xszs;
        if ((zd - qd) > 0) {
            xszs = zd - qd;
        } else if ((zd - qd) < 0) {
            xszs = sjlength + (zd - qd);
        }
        //起点站下标+行驶站数
        var end = qd + xszs;

        for (var i = qd; i <= end; i++) {
            //如果当前站下标大于或等于总站长度则说明一圈已经走完需要下一圈开始
            if (i >= sjlength) {
                xsnodes.push(sj[i - sjlength]);
            } else {
                xsnodes.push(sj[i]);
            }
        }
        return xsnodes;
    }

    function twoBusPoint(qd, zd) {
        var xsnodes = [];
        //公交线路的长度
        var sj = [5, 6, 7, 8, 9];
        
        //总站数
        var sjlength = sj.length;
        var xszs;
        if ((zd - qd) > 0) {
            xszs = zd - qd;
        } else if ((zd - qd) < 0) {
            xszs = sjlength + (zd - qd);
        }
        //起点站下标+行驶站数＝结束站
        var end = qd + xszs;
        for (var i = (qd - 5); i <= (end - 5); i++) {
            //如果当前站下标大于或等于总站长度则说明一圈已经走完需要下一圈开始
            if (i >= sjlength) {
                xsnodes.push(sj[i - sjlength]);
            } else {
                xsnodes.push(sj[i]);
            }
        }
        return xsnodes;
    }

    function returnBusPointNum(qd, zd) {
        //线路一规划出的线路
        var node1 = [];
        //线路二规划出的线路
        var node2 = [];
        //最终规划出的线路
        var allnodes = [];
        //第一条线路的长度
        var line1 = 5;
        //第二条线路的长度
        var line2 = 5;
        var qd1, zd1, qd2, zd2;
        //在这里我们设定换乘站为 换乘站应该使用变量定义
        var x = 0;
        var hc1=2,hc2=5;
        if (zd >= line1 && qd < line1) {
            qd1 = qd;
            //换乘站1
            zd1 = hc1;
            //换乘站2
            qd2 = hc2;
            zd2 = zd;
            node1 = oneBusPoint(qd1, zd1);
            node2 = twoBusPoint(qd2, zd2);
            allnodes = $.merge(node1, node2);
            return allnodes;
        } else if (qd >= line1 && zd < line1) {
            qd1 = hc1;
            zd1 = zd;
            qd2 = qd;
            zd2 = hc2;
            node1 = oneBusPoint(qd1, zd1);
            node2 = twoBusPoint(qd2, zd2);
            allnodes = $.merge(node2, node1);
            return allnodes;
        } else if (qd + zd < (line1 * 2)) {
            allnodes = oneBusPoint(qd, zd);
            return allnodes;
        } else if (qd >= line1 && zd >= line1) {
            allnodes = twoBusPoint(qd, zd);
            return allnodes;
        }
    }
    //////////////////////////////////////////////////////

    return {
        //加载地图
        initmap: function(mapkey) {
            init(mapkey);
        },
        //画点
        drawPoint: function(options) {
            drawPoint(options);
        },
        //画线
        drawLine: function(options) {
            drawLine(options);
        },
        //画面
        drawRegion: function(options) {
            drawRegion(options);
        },
        //移动地图并重新指定缩放级别
        setZoomAndCenter: function(options) {
            ZoomAndCenter(options);
        },
        //移动地图
        panTo: function(options) {
            panTo(options);
        },
        //调整合适等级地图
        fitmap: function() {
            fitmap();
        },
        //清除所有
        clearAll: function() {
            clearFeatures();
        },
        selectPoints: function() {
            selectPoints();
        },
        //步行线路规划
        findPath: function(options) {
            findPath(options);
        },
        //根据ID获取坐标
        getlatlng: function(options) {
            idTolatlng(options);
        },
        //公交线路规划
        findbusPath: function(options) {
            findbusPath(options);
        },
        //根据坐标画点
        drawPointlatlng: function(options) {
            drawPointlatlng(options);
        },
        //根据传入点查找其所在的面
        pointIntersectsRegion: function(options) {
            pointIntersectsRegion(options);
        },
        //清除线路
        clearPath: function() {
            clearElements();
        },
        //清除线
        clearLine: function() {
            clearline();
        },
        //清除面
        clearRegion: function() {
            clearregion();
        },
        clearMarkers: function() {
            clearmarkers();
        }

    };
};

