var wmaps = function() {
    var map, layer, vectorLayer, vectorLayerline, vectorLayerregion, selectFeature, wlayer, drawPointlj, markers, markerspath;
    //储存路径规划途径点
    var nodeArray = [];
    //站点内容集合 
    /*var buspoint = [{

        "lng": 105.39961111447532,
        "lat": 27.19139475853698,
        "num": 0,
        "name": "站1"
    }, {
        "lng": 105.39968066113993,
        "lat": 27.191459298914314,
        "num": 1,
        "name": "站2"
    }, {

        "lng": 105.39982592692373,
        "lat": 27.191487940745933,
        "num": 2,
        "name": "站3"
    }, {

        "lng": 105.40004687259545,
        "lat": 27.191345926152,
        "num": 3,
        "name": "站4"
    }, {

        "lng": 105.39990122860354,
        "lat": 27.19120426927282,
        "num": 4,
        "name": "站5"
    }, {

        "lng": 105.39961942488763,
        "lat": 27.191252640440752,
        "num": 5,
        "name": "站6"
    }, {

        "lng": 105.3996110344963,
        "lat": 27.191394636563309,
        "num": 6,
        "name": "站7"
    }, {

        "lng": 105.40062140612662,
        "lat": 27.192524057619341,
        "num": 7,
        "name": "站8"
    }, {

        "lng": 105.4004181119974,
        "lat": 27.191939382394281,
        "num": 8,
        "name": "站9"
    }, {

        "lng": 105.40022570992932,
        "lat": 27.191386032807159,
        "num": 9,
        "name": "站10"
    }, {

        "lng": 105.40009650024739,
        "lat": 27.1915304445673,
        "num": 10,
        "name": "站11"
    }, {

        "lng": 105.39989600703702,
        "lat": 27.191559843495209,
        "num": 11,
        "name": "站12"
    }, {

        "lng": 105.39972824899976,
        "lat": 27.191750171434784,
        "num": 12,
        "name": "站13"
    }, {

        "lng": 105.40008020339452,
        "lat": 27.191982081561576,
        "num": 13,
        "name": "站14"
    }, {

        "lng": 105.40032862981468,
        "lat": 27.192413173337453,
        "num": 14,
        "name": "站15"
    }, {

        "lng": 105.40062147677709,
        "lat": 27.192524260810554,
        "num": 15,
        "name": "站16"
    }];*/
    
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
        dataid: 99,
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


    var myClassregion = [];
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
        /*
        drawPointlj = new SuperMap.Control.DrawFeature(vectorLayer, SuperMap.Handler.Point);
        selectFeature = new SuperMap.Control.SelectFeature(vectorLayer, {
            onSelect: onFeatureSelect,
            onUnselect: onFeatureUnselect
        });
        drawPointlj.events.on({
            "featureadded": drawCompleted
        });*/
        //初始化地图
        map = new SuperMap.Map(opts.container, {
            controls: [
                new SuperMap.Control.LayerSwitcher(),
                new SuperMap.Control.MousePosition(),
                new SuperMap.Control.Navigation({
                    dragPanOptions: {
                        enableKinetic: true
                    }
                }), //selectFeature, drawPointlj
            ],
            allOverlays: true,
            units: "m"
        });

        //添加click事件
        map.events.on({
            "click": callbackFunction
        });
        //全局变量，用于记录每次线面重构之前的样式对象
        /*var myClassregion = [{
            "regionId": 0,
            "data-id": 0,
            "class": "gsregion"
        }];
        var myClassline = [{
            "lineid": 0,
            "data-id": 0,
            "class": "gsline"
        }];*/

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

        //初始化图层
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

        layer.events.on({
            "layerInitialized": addLayerdt
        });
    }

    function addLayerdt() {
        map.addLayers([wlayer, layer, vectorLayer, vectorLayerline, vectorLayerregion, markers, markerspath]);
        map.setCenter(new SuperMap.LonLat(109.07593852795, 35.630478192408), 11);
        //map.setCenter(new SuperMap.LonLat(105.400046872595, 27.191345926152), 1);

    }

    function panTo(options) {
        var opts = $.extend(defaults, options || {});
        map.setCenter(new SuperMap.LonLat(opts.lng, opts.lat), map.zoom);
    }

    function ZoomLevel() {
        return map.zoom;
    }

    function ZoomAndCenter(options) {
        var opts = $.extend(defaults, options || {});
        map.setCenter(new SuperMap.LonLat(opts.lng, opts.lat), opts.level);
    }

    function fitmap() {
        var maplayer = map.getLayersByName("Markers");
        if (maplayer[0].markers.length > 1) {
            //计算所有的标记的最大范围
            var bounds = maplayer[0].getDataExtent();
            if (bounds) {
                console.log(bounds.left+","+bounds.bottom+","+bounds.right+","+bounds.top);
                //传入一个合适的bounds 会缩放的合适等级的bounds
                //var newbounds = new SuperMap.Bounds(bounds.left*1.0001,bounds.bottom*1.0001,bounds.right*1.0001,bounds.top*1.0001); 
                console.log(map.zoom+"<--start");
                map.zoomToExtent(bounds, false);
                console.log(map.zoom+"<--end");
            }
        } else if (maplayer[0].markers.length > 0) {
            panTo(maplayer[0].markers[0].lonlat.lon, maplayer[0].markers[0].lonlat.lat);
        }
    }

    function callbackFunction(e) {
        var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
        console.log("位置坐标：lng=" + lonlat.lon.toFixed(5) + ", lat=" + lonlat.lat.toFixed(5));

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
        for (var i = 0; i < opts.latlngPile.length; i++) {
          
            var size = new SuperMap.Size(21, 25),
                offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                icon = new SuperMap.Icon("images/cluster2.png", size, offset);
            marker = new SuperMap.Marker(new SuperMap.LonLat(opts.latlngPile[i].x, opts.latlngPile[i].y), icon);
            if (opts.latlngPile.length == 1) {
                $(marker.icon.imageDiv).attr('data-id',opts.ids[i]).attr('data-lat', opts.latlngPile[i].y).attr('data-lng', opts.latlngPile[i].x).addClass('gsmarker');
            } else {
                $(marker.icon.imageDiv).attr('data-id',opts.ids[i]).attr('data-lat', opts.latlngPile[i].y).attr('data-lng', opts.latlngPile[i].x).addClass('gsmarker').addClass('marker-' + i);
            }

            markers.addMarker(marker);
        }
    }
    //画点回调
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
                        var findid = feature.geometry.components[0].id;
                        document.getElementById("" + findid + "");
                        findid = findid.replace(/\./g, "\\.");
                        vectorLayerregion.addFeatures(feature);
                        var obj = $("#" + findid + "");
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
            opts.callbackfuc(result);
        }
    }


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

                        var findid = feature.geometry.id;
                        
                        findid = findid.replace(/\./g, "\\.");
                        feature.style = styleGuideLine;
                        vectorLayerline.addFeatures(feature);
                        var obj = $("#" + findid + "");
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

    function clearmarkers() {
        markers.clearMarkers();
    }

    function clearline() {
        vectorLayerline.removeAllFeatures();
        vectorLayerline.refresh();
    }

    function clearregion() {
        vectorLayerregion.removeAllFeatures();
        vectorLayerregion.refresh();
    }

    function clearpath() {
        markerspath.clearMarkers();
        vectorLayer.removeAllFeatures();
        vectorLayer.refresh();
    }

    /*//创建点
    function drawCompleted(drawGeometryArgs) {
        var point = drawGeometryArgs.feature.geometry,
            size = new SuperMap.Size(37, 38),
            offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
            icon = new SuperMap.Icon("images/cluster3.png", size, offset);
        markers.addMarker(new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon));
        nodeArray.push(point);
    }

    function selectPoints() {
        clearElements();
        drawPointlj.activate();
    }
    //选中时显示路径指引信息
    function onFeatureSelect(feature) {
        if (feature.attributes.description) {
            popup = new SuperMap.Popup("chicken",
                feature.geometry.getBounds().getCenterLonLat(),
                new SuperMap.Size(200, 30),
                "<div style='font-size:.8em; opacity: 0.8'>" + feature.attributes.description + "</div>",
                null, false);
            feature.popup = popup;
            map.addPopup(popup);
        }
        if (feature.geometry.CLASS_NAME != "SuperMap.Geometry.Point") {
            feature.style = styleGuideLine;
            vectorLayer.redraw();
        }
    }
    //清除要素时调用此函数
    function onFeatureUnselect(feature) {
        map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
        if (feature.geometry.CLASS_NAME != "SuperMap.Geometry.Point") {
            feature.style = style;
        }
        vectorLayer.redraw();
    }*/


    function findbusPath(options) {
        var opts = $.extend(defaults, options || {});
        clearElements();
        if (opts.StartEndlatlng.length <= 1) {
            alert("选择正确起始点!");
            return false;
        }
        //gsmarker-from   gsmarker-to   gsmarker-via

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
        if (allbusnode.length == 0) {
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
      
        //selectFeature.activate();
    }

    function clearElements() {
        pathListIndex = 0;
        routeCompsIndex = 0;

        /*selectFeature.deactivate();
        if (vectorLayer.selectedFeatures.length > 0) {
            map.removePopup(vectorLayer.selectedFeatures[0].popup);
        }*/
        vectorLayer.removeAllFeatures();
        markerspath.clearMarkers();
    }

    function pointIntersectsRegion(options) {
        var opts = $.extend(defaults, options || {});
        //lng=109.06109, lat=35.65500
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
        var sj = [5, 6, 7, 8, 9];
        //var sj = [7, 8, 9, 10, 11, 12, 13, 14, 15];
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
        var x = 0 ;
        if (zd >= line1 && qd < line1) {
            qd1 = qd;
            //换乘站1
            zd1 = 2;
            //换乘站2
            qd2 = 5;
            zd2 = zd;
            node1 = oneBusPoint(qd1, zd1);
            node2 = twoBusPoint(qd2, zd2);
            allnodes = $.merge(node1, node2);
            return allnodes;
        } else if (qd >= line1 && zd < line1) {
            qd1 = 2;
            zd1 = zd;
            qd2 = qd;
            zd2 = 5;
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


/*

1   105.39961111447532  27.19139475853698   1   1   16
2   105.3996110344963   27.191394636563309  1   7   16
3   105.39968066113993  27.191459298914314  1   2   16 
4   105.39982592692373  27.191487940745933  1   3   16 换乘
5   105.40004687259545  27.191345926152     1   4   16
6   105.39990122860354  27.19120426927282   1   5   16
7   105.39961942488763  27.191252640440752  1   6   16
8   105.40062140612662  27.192524057619341  1   7   16
9   105.40062147677709  27.192524260810554  1   15  16
10  105.4004181119974   27.191939382394281  1   8   16
11  105.40022570992932  27.191386032807159  1   9   16
12  105.40009650024739  27.1915304445673    1   10  16
13  105.39989600703702  27.191559843495209  1   11  16 换乘
14  105.39972824899976  27.191750171434784  1   12  16
15  105.40008020339452  27.191982081561576  1   13  16
16  105.40032862981468  27.192413173337453  1   14  16

105.400046872595 27.191345926152

*/
