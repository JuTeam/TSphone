var Wsupermap = Wsupermap || {};
var Wsupermap2 = Wsupermap2 || {};
/*
1   109.05940300380507  35.653358237747945  1   0   16
2   109.07456171147686  35.648565300603678  1   0   16
3   109.07842116033173  35.638030404801896  1   0   16
4   109.082001897084    35.641377053304794  1   0   16
5   109.06440465817069  35.65568915916657   1   0   16
6   109.07403095371735  35.634674090878605  1   0   16
7   109.05997622889942  35.623708781641866  1   0   16
8   109.06625728050048  35.62708849595063   1   0   16
9   109.08349882277224  35.633445831031381  1   0   16
10  109.08569255182333  35.634648048431472  1   0   16
*/


(function() {
    var map, layer, vectorLayer, vectorLayerline, vectorLayerregion, selectFeature, wlayer, drawPointlj, markers;
    //储存路径规划途径点
    var nodeArray = [];
    //站点内容集合
    var buspoint = [{
        "lat": 109.05940300380507,
        "lng": 35.653358237747945,
        "num": 1,
        "name": "站1"
    }, {
        "lat": 109.07456171147686,
        "lng": 35.648565300603678,
        "num": 2,
        "name": "站2"
    }, {
        "lat": 109.07842116033173,
        "lng": 35.638030404801896,
        "num": 3,
        "name": "站3"
    }, {
        "lat": 109.082001897084,
        "lng": 35.641377053304794,
        "num": 4,
        "name": "站4"
    }, {
        "lat": 109.06440465817069,
        "lng": 35.65568915916657,
        "num": 5,
        "name": "站5"
    }, {
        "lat": 109.07403095371735,
        "lng": 35.634674090878605,
        "num": 6,
        "name": "站6"
    }, {

        "lat": 109.05997622889942,
        "lng": 35.623708781641866,
        "num": 7,
        "name": "站7"
    }, {

        "lat": 109.06625728050048,
        "lng": 35.62708849595063,
        "num": 8,
        "name": "站8"
    }, {

        "lat": 109.08349882277224,
        "lng": 35.633445831031381,
        "num": 9,
        "name": "站9"
    }, {

        "lat": 109.08569255182333,
        "lng": 35.634648048431472,
        "num": 10,
        "name": "站10"
    }];

    style = {
        strokeColor: "#FFFF37",
        strokeWidth: 5,
        pointerEvents: "visiblePainted",
        fill: false
    };
    var styleGuidePoint = {
        pointRadius: 15,
        externalGraphic: "images/walk.png"
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
    var infowin = null;
    var defaults = {
        //urldt: "http://192.168.1.55:8090/iserver/services/map-dtspace/rest/maps/dtmap",
        urldt: "http://192.168.1.55:8090/iserver/services/map-diantoudata/rest/maps/dtmaptest",
        urldt25: "http://192.168.1.55:8090/iserver/services/map-dtspace/rest/maps/dtimgmap",
        urldata: "http://192.168.1.55:8090/iserver/services/data-dtmaps/rest/data",
        urldtlw: "http://192.168.1.55:8090/iserver/services/transportationAnalyst-diantoudata/rest/networkanalyst/BuildNetwork@dtdata",
        urlword: "http://192.168.1.55:8090/iserver/services/map-world/rest/maps/World",
        urlchina: "http://192.168.1.55:8090/iserver/services/map-china400/rest/maps/China",
        callbackfuc: function() {}
    };
    Wsupermap.map = {
        //加载地图
        init: function(options) {
            var opts = $.extend(defaults, options || {});
            vectorLayer = new SuperMap.Layer.Vector("Vector Layer");
            vectorLayerregion = new SuperMap.Layer.Vector("Vector1 Layer1");
            vectorLayerline = new SuperMap.Layer.Vector("Vector2 Layer2");
            drawPointlj = new SuperMap.Control.DrawFeature(vectorLayer, SuperMap.Handler.Point);
            selectFeature = new SuperMap.Control.SelectFeature(vectorLayer, {
                onSelect: Wsupermap.draw.onFeatureSelect,
                onUnselect: Wsupermap.draw.onFeatureUnselect
            });
            drawPointlj.events.on({
                "featureadded": Wsupermap.draw.drawCompleted
            });
            map = new SuperMap.Map(opts.container, {
                controls: [
                    new SuperMap.Control.LayerSwitcher(),
                    new SuperMap.Control.MousePosition(),
                    new SuperMap.Control.Navigation({
                        dragPanOptions: {
                            enableKinetic: true
                        }
                    }), drawPointlj, selectFeature
                ],
                allOverlays: true,
                units: "m"
            });
            //map = mapt;
            /*map = new SuperMap.Map("mapo", {
                controls: [
                    new SuperMap.Control.Navigation({
                        dragPanOptions: {
                            enableKinetic: true
                        }
                    }),
                    drawPointlj, selectFeature
                ],allOverlays: true,
                units: "m"
            });*/
            /*map.events.on({
                "moveend": this.movefun
                    });*/
            //添加click事件
            map.events.on({
                "click": this.callbackFunction
            });
            wlayer = new SuperMap.Layer.TiledDynamicRESTLayer("Map", opts.urlword, {
                transparent: true,
                cacheEnabled: true
            }, {
                maxResolution: "auto"
            });
            layer25 = new SuperMap.Layer.TiledDynamicRESTLayer("Map", opts.urldt25, {
                transparent: true,
                cacheEnabled: true
            }, {
                maxResolution: "auto"
            });
            wlayer.events.on({
                "layerInitialized": Wsupermap.map.addLayer
            });

            //初始化标记图层类
            markers = new SuperMap.Layer.Markers("Markers");


        },
        addLayer: function(options) {
            var opts = $.extend(defaults, options || {});

            layer = new SuperMap.Layer.TiledDynamicRESTLayer("Map", opts.urldt, {
                transparent: true,
                cacheEnabled: true
            }, {
                maxResolution: "auto"
            });

            layer.events.on({
                "layerInitialized": Wsupermap.map.addLayerdt
            });
        },
        addLayerdt: function() {
            map.addLayers([wlayer, layer, vectorLayer, vectorLayerline, vectorLayerregion, markers]);
            Wsupermap.map.setZoomAndCenter({
                "lat": 109.07593852795,
                "lng": 35.630478192408,
                "level": 13
            });
        },
        panTo: function(options) {
            var opts = $.extend(defaults, options || {});
            map.setCenter(new SuperMap.LonLat(opts.lat, opts.lng), map.zoom);
        },
        getZoomLevel: function() {
            return map.zoom;
        },
        setZoomAndCenter: function(options) {
            var opts = $.extend(defaults, options || {});
            map.setCenter(new SuperMap.LonLat(opts.lat, opts.lng), opts.level);
        },
        fitmap: function() {
            var maplayer = map.getLayersByName("Markers");
            //计算所有的标记的最大范围
            var bounds = maplayer[0].getDataExtent();
            if (bounds) {
                //传入一个合适的bounds 会缩放的合适等级的bounds
                map.zoomToExtent(bounds, true);
            }

        },
        callbackFunction: function(e) {
            var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
            console.log("位置坐标：lng=" + lonlat.lon.toFixed(5) + ", lat=" + lonlat.lat.toFixed(5));
            //document.getElementById("mousePositionDiv").innerHTML=newHtml;
        },
        movefun: function() {
            //先清除上次的显示结果
            vectorLayer.removeAllFeatures();
            markers.clearMarkers();
            Wsupermap.draw.drawBounds();
            vectorLayer.refresh();
        }
    };
    //地图绘制方法包括，根据传入ID集合创建MARKER,与根据集合对象查询所属的点信息，路径分析
    Wsupermap.draw = {
        drawPoint: function(options) {
            var opts = $.extend(defaults, options || {});
            defaults.callbackfuc = opts.callbackfuc;
            vectorLayer.removeAllFeatures();
            var queryBySQLParams, queryService, queryParam;
            queryParam = new SuperMap.REST.FilterParameter({
                name: "T_Point@dtdata",
                attributeFilter: "SmUserID in (" + options.ids + ")"
            });
            queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
                queryParams: [queryParam],
                spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT
            });
            queryService = new SuperMap.REST.QueryBySQLService(opts.urldt, {
                eventListeners: {
                    "processCompleted": Wsupermap.draw.processCompleted,
                    "processFailed": Wsupermap.draw.processFailed
                }
            });
            queryService.processAsync(queryBySQLParams);
        },
        drawRegion: function(options) {
            var opts = $.extend(defaults, options || {});
            defaults.callbackfuc = opts.callbackfuc;
            vectorLayer.removeAllFeatures();
            var queryBySQLParams, queryService, queryParam;
            queryParam = new SuperMap.REST.FilterParameter({
                name: "T_Region@dtdata",
                attributeFilter: "SmUserID in (" + options.ids + ")"
            });
            queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
                queryParams: [queryParam],
                spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT
            });
            queryService = new SuperMap.REST.QueryBySQLService(opts.urldt, {
                eventListeners: {
                    "processCompleted": Wsupermap.draw.processCompletedregion,
                    "processFailed": Wsupermap.draw.processFailed
                }
            });
            queryService.processAsync(queryBySQLParams);
        },
        drawLine: function(options) {
            var opts = $.extend(defaults, options || {});
            vectorLayer.removeAllFeatures();
            var queryBySQLParams, queryService, queryParam;
            queryParam = new SuperMap.REST.FilterParameter({
                name: "T_Line@dtdata",
                attributeFilter: "SmUserID in (" + options.ids + ")"
            });
            queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
                queryParams: [queryParam],
                spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT
            });
            queryService = new SuperMap.REST.QueryBySQLService(opts.urldt, {
                eventListeners: {
                    "processCompleted": Wsupermap.draw.processCompletedline,
                    "processFailed": Wsupermap.draw.processFailed
                }
            });
            queryService.processAsync(queryBySQLParams);
        },
        processCompleted: function(queryEventArgs) {


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
                            /*marker.events.on({
                                "click": Wsupermap.draw.mouseClickHandler,
                                "scope": marker,
                                "touchstart": Wsupermap.draw.mouseClickHandler
                            });*/
                            //在DIV上增加dataID
                            $(marker.icon.imageDiv).attr('data-id', feature.data.SmUserID).attr('data-lat', point.y).attr('data-lng', point.x).addClass('marker-' + j).addClass('gsmarker');

                            markers.addMarker(marker);

                            defaults.callbackfuc($(marker.icon.imageDiv));
                        }
                    }
                }

            }
        },
        processCompletedregion: function(queryEventArgs) {
            var i, j, feature,
                result = queryEventArgs.result;
            if (result && result.recordsets) {
                for (i = 0; i < result.recordsets.length; i++) {
                    if (result.recordsets[i].features) {
                        for (j = 0; j < result.recordsets[i].features.length; j++) {
                            feature = result.recordsets[i].features[j];
                            var findid = feature.geometry.components[0].id;
                            findid = findid.replace(/\./g, "\\.");
                            //feature.style = styleregion;
                            vectorLayerregion.addFeatures(feature);
                            var obj = $("#" + findid + "");
                            defaults.callbackfuc(obj);

                        }
                    }
                }
            }
        },
        processCompletedline: function(queryEventArgs) {
            var i, j, feature,
                result = queryEventArgs.result;
            if (result && result.recordsets) {
                for (i = 0; i < result.recordsets.length; i++) {
                    if (result.recordsets[i].features) {
                        for (j = 0; j < result.recordsets[i].features.length; j++) {
                            feature = result.recordsets[i].features[j];
                            console.log(feature);
                            //console.log(feature.data.Field_SmUserName);
                            
                            var findid = feature.geometry.id;
                            findid = findid.replace(/\./g, "\\.");
                            console.log(findid);
                            feature.style = styleGuideLine;
                            
                            vectorLayerline.addFeatures(feature);
                            

                            var obj = $("#" + findid + "");
                            defaults.callbackfuc(obj);
                        }
                    }
                }
            }
        },
        //传入要查询属性的类型，如果不传则不查询
        drawBounds: function(options) {
            var opts = $.extend(defaults, options || {});
            var viewBounds = map.getExtent();
            var points = [new SuperMap.Geometry.Point(viewBounds.left, viewBounds.top),
                new SuperMap.Geometry.Point(viewBounds.right, viewBounds.top),
                new SuperMap.Geometry.Point(viewBounds.right, viewBounds.bottom),
                new SuperMap.Geometry.Point(viewBounds.left, viewBounds.bottom)
            ];
            var linearRings = new SuperMap.Geometry.LinearRing(points);
            var region = new SuperMap.Geometry.Polygon([linearRings]);
            var queryByGeometryParameters, queryService, queryParam;
            queryParam = new SuperMap.REST.FilterParameter({
                name: "T_Point@dtdata"
            });
            queryByGeometryParameters = new SuperMap.REST.QueryByGeometryParameters({
                queryParams: [queryParam],
                spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
                geometry: region,
                startRecord: 0,
                expectCount: 500
            });
            queryService = new SuperMap.REST.QueryByGeometryService(opts.urldt, {
                eventListeners: {
                    "processCompleted": this.processCompletedthree,
                    "processFailed": this.processFailed
                }
            });
            queryService.processAsync(queryByGeometryParameters);
        },
        processCompletedthree: function(queryEventArgs) {
            var i, len, features, result = queryEventArgs.result;
            if (result.currentCount > 0) {
                for (i = 0, recordsets = result.recordsets, len = recordsets.length; i < len; i++) {
                    if (recordsets[i].features) {
                        for (j = 0; j < recordsets[i].features.length; j++) {
                            //console.log(feature);
                            var feature = recordsets[i].features[j];
                            var point = feature.geometry;
                            var size = new SuperMap.Size(21, 25),
                                offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                                icon = new SuperMap.Icon("images/cluster2.png", size, offset);
                            marker = new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon);
                            marker.events.on({
                                "click": Wsupermap.draw.mouseClickHandler,
                                "scope": marker,
                                "touchstart": Wsupermap.draw.mouseClickHandler
                            });
                            //在DIV上增加dataID
                            $(marker.icon.imageDiv).attr('data-id', feature.data.SmID);
                            //console.log($(marker.icon.imageDiv));
                            //$(marker.icon.imageDiv).appendTo('div');
                            //console.log($(marker.icon.imageDiv));
                            //$(marker.icon.imageDiv).before('<div id = "tttt"></div>');
                            markers.addMarker(marker);
                        }

                    }
                }
                var mypoint = new SuperMap.Geometry.Point(109.07593852795, 35.630478192408);
                var minDisPoint = Wsupermap.draw.findMinDisPoint(mypoint, result.recordsets[0].features);
                var objs = [];
                for (var i = 0; i < minDisPoint.length; i++) {
                    var datas = {};
                    datas.id = minDisPoint[i][0].dataid;
                    datas.lat = minDisPoint[i][0].y;
                    datas.lng = minDisPoint[i][0].x;
                    datas.distance = minDisPoint[i][0].distance;
                    datas.name = minDisPoint[i][0].dataname;
                    objs.push(datas);
                }
                console.log(objs);
            }
        },

        findMinDisPoint: function(cp, parr) {
            var objs = [];
            for (var i = 0; i < parr.length; i++) {

                var point = parr[i].geometry;
                var d = Wsupermap.draw.getFlatternDistance(point.y, point.x, cp.y, cp.x);
                point.dataid = parr[i].data.SmID;
                point.dataname = parr[i].data.CAPITAL;
                point.distance = d;

                var obj = [point, d];
                objs.push(obj);
            }
            //排序->排序后数组第一个元素就是距离最近的点
            for (var i = 0; i < objs.length; i++) {
                for (var j = 0; j < objs.length - i - 1; j++) {
                    if (objs[j][1] > objs[j + 1][1]) {
                        var temp = objs[j];
                        objs[j] = objs[j + 1];
                        objs[j + 1] = temp;
                    }
                }
            }
            return objs;
        },
        //查找传入点最近的公交站点
        findMinPoint: function(cp, parr) {
            var objs = [];
            for (var i = 0; i < parr.length; i++) {

                var point = parr[i];
                var d = Wsupermap.draw.getFlatternDistance(point.lat, point.lng, cp.x, cp.y);
                point.dataid = parr[i].num;
                point.dataname = parr[i].name;
                point.distance = d;

                var obj = [point, d];
                objs.push(obj);
            }
            //排序->排序后数组第一个元素就是距离最近的点
            for (var i = 0; i < objs.length; i++) {
                for (var j = 0; j < objs.length - i - 1; j++) {
                    if (objs[j][1] > objs[j + 1][1]) {
                        var temp = objs[j];
                        objs[j] = objs[j + 1];
                        objs[j + 1] = temp;
                    }
                }
            }
            return objs[0];
        },

        /**
         * 计算两个点之间的距离
         * approx distance between two points on earth ellipsoid
         * @param {Object} lat1 第一点纬度
         * @param {Object} lng1 第一点经度
         * @param {Object} lat2 第二点纬度
         * @param {Object} lng2 第二点经度
         */
        getFlatternDistance: function(lat1, lng1, lat2, lng2) {
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
        },
        processFailed: function(e) {
            alert(e.error.errorMsg);
        },
        clearFeatures: function() {
            //先清除上次的显示结果
            vectorLayer.removeAllFeatures();
            vectorLayerregion.removeAllFeatures();
            vectorLayerline.removeAllFeatures();
            markers.clearMarkers();
            vectorLayer.refresh();
            vectorLayerregion.refresh();
            vectorLayerline.refresh();
        },
        //定义mouseClickHandler函数，触发click事件会调用此函数
        mouseClickHandler: function() {
            var marker = this;
            var lonlat = marker.getLonLat();
            var contentHTML = "<div style='font-size:.8em; opacity: 0.8; overflow-y:hidden;'>";
            contentHTML += "<div>" + marker.lonlat + "</div></div>";
            var popup = new SuperMap.Popup.FramedCloud("popwin", new SuperMap.LonLat(lonlat.lon, lonlat.lat), null, contentHTML, null, true);
            map.addPopup(popup);
        },
        closeInfoWin: function() {
            if (infowin) {
                try {
                    infowin.hide();
                    infowin.destroy();
                } catch (e) {}
            }
        },
        //创建点
        drawCompleted: function(drawGeometryArgs) {
            var point = drawGeometryArgs.feature.geometry,
                size = new SuperMap.Size(37, 38),
                offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                icon = new SuperMap.Icon("images/cluster3.png", size, offset);
            markers.addMarker(new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon));
            nodeArray.push(point);

            //console.log(nodeArray);

        },
        selectPoints: function() {
            Wsupermap.draw.clearElements();
            drawPointlj.activate();
        },
        //选中时显示路径指引信息
        onFeatureSelect: function(feature) {
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
        },
        //清除要素时调用此函数
        onFeatureUnselect: function(feature) {
            map.removePopup(feature.popup);
            feature.popup.destroy();
            feature.popup = null;
            if (feature.geometry.CLASS_NAME != "SuperMap.Geometry.Point") {
                feature.style = style;
            }
            vectorLayer.redraw();
        },
        findPath: function(options) {
            var nodebus = [];
            for (var i = 0; i < nodeArray.length; i++) {
                //nodebus.push(nodeArray[i]);
                var newpoint = Wsupermap.draw.findMinPoint(nodeArray[i], buspoint)[0];
                var point = new SuperMap.Geometry.Point(newpoint.lat, newpoint.lng);
                nodebus.push(point);
            }
            console.log(nodebus);

            var opts = $.extend(defaults, options || {});
            drawPointlj.deactivate();
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
            if (nodeArray.length <= 1) {
                alert("站点数目有误");
            }
            findPathService = new SuperMap.REST.FindPathService(opts.urldtlw, {
                eventListeners: {
                    "processCompleted": Wsupermap.draw.processCompletedly
                }
            });
            findPathService.processAsync(parameter);
        },
        processCompletedly: function(findPathEventArgs) {
            var result = findPathEventArgs.result;
            Wsupermap.draw.allScheme(result);
        },
        allScheme: function(result) {
            if (pathListIndex < result.pathList.length) {
                Wsupermap.draw.addPath(result);
                console.log(result);
            } else {
                pathListIndex = 0;
                //线绘制完成后会绘制关于路径指引点的信息
                Wsupermap.draw.addPathGuideItems(result);
            }
        },
        //以动画效果显示分析结果
        addPath: function(result) {
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
                pathFeature.style = style;
                vectorLayer.addFeatures(pathFeature);
                //每隔1毫秒加载一条弧段
                pathTime = setTimeout(function() {
                    Wsupermap.draw.addPath(result);
                }, 1);
                routeCompsIndex++;
            } else {
                clearTimeout(pathTime);
                routeCompsIndex = 0;
                pathListIndex++;
                Wsupermap.draw.allScheme(result);
            }
        },
        addPathGuideItems: function(result) {
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
                        guideFeature.style = style;
                    }
                    vectorLayer.addFeatures(guideFeature);
                }
            }
            selectFeature.activate();
        },
        clearElements: function() {
            pathListIndex = 0;
            routeCompsIndex = 0;
            nodeArray = [];
            selectFeature.deactivate();
            if (vectorLayer.selectedFeatures.length > 0) {
                map.removePopup(vectorLayer.selectedFeatures[0].popup);
            }
            vectorLayer.removeAllFeatures();
            markers.clearMarkers();
        }
    };
})(this);

///////////////////////////////////////////////////////////////////////////map2/////////////////////////////////////////////////////////////////////

(function() {
    var map, layer, vectorLayer, vectorLayerline, vectorLayerregion, selectFeature, wlayer, drawPointlj, markers;
    //储存路径规划途径点
    var nodeArray = [];
    //站点内容集合
    var buspoint1 = [{
        "lat": 35.654658245739775,
        "lng": 35.654658245739775,
        "num": 1,
        "name": "站1"
    }, {
        "lat": 35.654658245739775,
        "lng": 35.654658245739775,
        "num": 2,
        "name": "站2"
    }, {
        "lat": 35.654658245739775,
        "lng": 35.654658245739775,
        "num": 3,
        "name": "站3"
    }, {
        "lat": 35.654658245739775,
        "lng": 35.654658245739775,
        "num": 4,
        "name": "站4"
    }, {
        "lat": 35.654658245739775,
        "lng": 35.654658245739775,
        "num": 5,
        "name": "站5"
    }];

    style = {
        strokeColor: "#FFFF37",
        strokeWidth: 5,
        pointerEvents: "visiblePainted",
        fill: false
    };
    var styleGuidePoint = {
        pointRadius: 15,
        externalGraphic: "images/walk.png"
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
    var infowin = null;
    var defaults = {
        //urldt: "http://192.168.1.55:8090/iserver/services/map-dtspace/rest/maps/dtmap",
        urldt: "http://192.168.1.55:8090/iserver/services/map-diantoudata/rest/maps/dtmaptest",
        urldt25: "http://192.168.1.55:8090/iserver/services/map-dtspace/rest/maps/dtimgmap",
        urldata: "http://192.168.1.55:8090/iserver/services/data-dtmaps/rest/data",
        urldtlw: "http://192.168.1.55:8090/iserver/services/transportationAnalyst-diantoudata/rest/networkanalyst/BuildNetwork@dtdata",
        urlword: "http://192.168.1.55:8090/iserver/services/map-world/rest/maps/World",
        urlchina: "http://192.168.1.55:8090/iserver/services/map-china400/rest/maps/China",
        callbackfuc: function() {}
    };
    Wsupermap2.map = {
        //加载地图
        init: function(options) {
            var opts = $.extend(defaults, options || {});
            vectorLayer = new SuperMap.Layer.Vector("Vector Layer");
            vectorLayerregion = new SuperMap.Layer.Vector("Vector1 Layer1");
            vectorLayerline = new SuperMap.Layer.Vector("Vector2 Layer2");
            drawPointlj = new SuperMap.Control.DrawFeature(vectorLayer, SuperMap.Handler.Point);
            selectFeature = new SuperMap.Control.SelectFeature(vectorLayer, {
                onSelect: Wsupermap2.draw.onFeatureSelect,
                onUnselect: Wsupermap2.draw.onFeatureUnselect
            });
            drawPointlj.events.on({
                "featureadded": Wsupermap2.draw.drawCompleted
            });
            map = new SuperMap.Map(opts.container, {
                controls: [
                    new SuperMap.Control.MousePosition(),
                    new SuperMap.Control.Navigation({
                        dragPanOptions: {
                            enableKinetic: true
                        }
                    }), drawPointlj, selectFeature
                ],
                allOverlays: true,
                units: "m"
            });

            //添加click事件
            map.events.on({
                "click": this.callbackFunction
            });
            wlayer = new SuperMap.Layer.TiledDynamicRESTLayer("Map", opts.urlword, {
                transparent: true,
                cacheEnabled: true
            }, {
                maxResolution: "auto"
            });
            layer25 = new SuperMap.Layer.TiledDynamicRESTLayer("Map", opts.urldt25, {
                transparent: true,
                cacheEnabled: true
            }, {
                maxResolution: "auto"
            });
            wlayer.events.on({
                "layerInitialized": Wsupermap2.map.addLayer
            });

            //初始化标记图层类
            markers = new SuperMap.Layer.Markers("Markers");


        },
        addLayer: function(options) {
            var opts = $.extend(defaults, options || {});

            layer = new SuperMap.Layer.TiledDynamicRESTLayer("Map", opts.urldt, {
                transparent: true,
                cacheEnabled: true
            }, {
                maxResolution: "auto"
            });

            layer.events.on({
                "layerInitialized": Wsupermap2.map.addLayerdt
            });
        },
        addLayerdt: function() {
            map.addLayers([wlayer, layer, vectorLayer, vectorLayerline, vectorLayerregion, markers]);
            Wsupermap2.map.setZoomAndCenter({
                "lat": 109.07593852795,
                "lng": 35.630478192408,
                "level": 13
            });
        },
        panTo: function(options) {
            var opts = $.extend(defaults, options || {});
            map.setCenter(new SuperMap.LonLat(opts.lat, opts.lng), map.zoom);
        },
        getZoomLevel: function() {
            return map.zoom;
        },
        setZoomAndCenter: function(options) {
            var opts = $.extend(defaults, options || {});
            map.setCenter(new SuperMap.LonLat(opts.lat, opts.lng), opts.level);
        },
        fitmap: function(options) {
            var maplayer = map.getLayersByName("Markers");
            //计算所有的标记的最大范围
            var bounds = maplayer[0].getDataExtent();
            if (bounds) {
                //传入一个合适的bounds 会缩放的合适等级的bounds
                map.zoomToExtent(bounds, true);
            }
        },
        callbackFunction: function(e) {
            var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
            console.log("位置坐标：lng=" + lonlat.lon.toFixed(5) + ", lat=" + lonlat.lat.toFixed(5));

        },
        movefun: function() {
            //先清除上次的显示结果
            vectorLayer.removeAllFeatures();
            markers.clearMarkers();
            Wsupermap2.draw.drawBounds();
            vectorLayer.refresh();
        }
    };
    //地图绘制方法包括，根据传入ID集合创建MARKER,与根据集合对象查询所属的点信息，路径分析
    Wsupermap2.draw = {
        drawPoint: function(options) {
            var opts = $.extend(defaults, options || {});
            defaults.callbackfuc = opts.callbackfuc;
            vectorLayer.removeAllFeatures();
            var queryBySQLParams, queryService, queryParam;
            queryParam = new SuperMap.REST.FilterParameter({
                name: "T_Point@dtdata",
                attributeFilter: "SmUserID in (" + options.ids + ")"
            });
            queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
                queryParams: [queryParam],
                spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT
            });
            queryService = new SuperMap.REST.QueryBySQLService(opts.urldt, {
                eventListeners: {
                    "processCompleted": Wsupermap2.draw.processCompleted,
                    "processFailed": Wsupermap2.draw.processFailed
                }
            });
            queryService.processAsync(queryBySQLParams);
        },
        drawRegion: function(options) {
            var opts = $.extend(defaults, options || {});
            vectorLayer.removeAllFeatures();
            var queryBySQLParams, queryService, queryParam;
            queryParam = new SuperMap.REST.FilterParameter({
                name: "T_Region@dtdata",
                attributeFilter: "SmUserID in (" + options.ids + ")"
            });
            queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
                queryParams: [queryParam],
                spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT
            });
            queryService = new SuperMap.REST.QueryBySQLService(opts.urldt, {
                eventListeners: {
                    "processCompleted": Wsupermap2.draw.processCompletedregion,
                    "processFailed": Wsupermap2.draw.processFailed
                }
            });
            queryService.processAsync(queryBySQLParams);
        },
        drawLine: function(options) {
            var opts = $.extend(defaults, options || {});
            vectorLayer.removeAllFeatures();
            var queryBySQLParams, queryService, queryParam;
            queryParam = new SuperMap.REST.FilterParameter({
                name: "T_Line@dtdata",
                attributeFilter: "SmUserID in (" + options.ids + ")"
            });
            queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
                queryParams: [queryParam],
                spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT
            });
            queryService = new SuperMap.REST.QueryBySQLService(opts.urldt, {
                eventListeners: {
                    "processCompleted": Wsupermap2.draw.processCompletedline,
                    "processFailed": Wsupermap2.draw.processFailed
                }
            });
            queryService.processAsync(queryBySQLParams);
        },
        processCompleted: function(queryEventArgs) {

            defaults.callbackfuc();
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
                            /*marker.events.on({
                                "click": Wsupermap2.draw.mouseClickHandler,
                                "scope": marker,
                                "touchstart": Wsupermap2.draw.mouseClickHandler
                            });*/
                            //在DIV上增加dataID
                            $(marker.icon.imageDiv).attr('data-id', feature.data.SmUserID).attr('data-lat', point.y).attr('data-lng', point.x).addClass('marker-' + j).addClass('gsmarker');

                            markers.addMarker(marker);
                        }
                    }
                }

            }
        },
        processCompletedregion: function(queryEventArgs) {
            var i, j, feature,
                result = queryEventArgs.result;
            if (result && result.recordsets) {
                for (i = 0; i < result.recordsets.length; i++) {
                    if (result.recordsets[i].features) {
                        for (j = 0; j < result.recordsets[i].features.length; j++) {

                            feature = result.recordsets[i].features[j];
                            console.log(feature);

                            feature.style = styleregion;
                            vectorLayerregion.addFeatures(feature);
                        }
                    }
                }
            }
        },
        processCompletedline: function(queryEventArgs) {
            var i, j, feature,
                result = queryEventArgs.result;
            if (result && result.recordsets) {
                for (i = 0; i < result.recordsets.length; i++) {
                    if (result.recordsets[i].features) {
                        for (j = 0; j < result.recordsets[i].features.length; j++) {
                            feature = result.recordsets[i].features[j];
                            console.log(feature);
                            //console.log(feature.data.Field_SmUserName);
                            feature.style = styleGuideLine;
                            vectorLayerline.addFeatures(feature);
                        }
                    }
                }
            }
        },
        //传入要查询属性的类型，如果不传则不查询
        drawBounds: function(options) {
            var opts = $.extend(defaults, options || {});
            var viewBounds = map.getExtent();
            var points = [new SuperMap.Geometry.Point(viewBounds.left, viewBounds.top),
                new SuperMap.Geometry.Point(viewBounds.right, viewBounds.top),
                new SuperMap.Geometry.Point(viewBounds.right, viewBounds.bottom),
                new SuperMap.Geometry.Point(viewBounds.left, viewBounds.bottom)
            ];
            var linearRings = new SuperMap.Geometry.LinearRing(points);
            var region = new SuperMap.Geometry.Polygon([linearRings]);
            var queryByGeometryParameters, queryService, queryParam;
            queryParam = new SuperMap.REST.FilterParameter({
                name: "T_Point@dtdata"
            });
            queryByGeometryParameters = new SuperMap.REST.QueryByGeometryParameters({
                queryParams: [queryParam],
                spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
                geometry: region,
                startRecord: 0,
                expectCount: 500
            });
            queryService = new SuperMap.REST.QueryByGeometryService(opts.urldt, {
                eventListeners: {
                    "processCompleted": this.processCompletedthree,
                    "processFailed": this.processFailed
                }
            });
            queryService.processAsync(queryByGeometryParameters);
        },
        processCompletedthree: function(queryEventArgs) {
            var i, len, features, result = queryEventArgs.result;
            if (result.currentCount > 0) {
                for (i = 0, recordsets = result.recordsets, len = recordsets.length; i < len; i++) {
                    if (recordsets[i].features) {
                        for (j = 0; j < recordsets[i].features.length; j++) {
                            //console.log(feature);
                            var feature = recordsets[i].features[j];
                            var point = feature.geometry;
                            var size = new SuperMap.Size(21, 25),
                                offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                                icon = new SuperMap.Icon("images/cluster2.png", size, offset);
                            marker = new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon);
                            marker.events.on({
                                "click": Wsupermap2.draw.mouseClickHandler,
                                "scope": marker,
                                "touchstart": Wsupermap2.draw.mouseClickHandler
                            });
                            //在DIV上增加dataID
                            $(marker.icon.imageDiv).attr('data-id', feature.data.SmID);

                            markers.addMarker(marker);
                        }

                    }
                }

                var mypoint = new SuperMap.Geometry.Point(109.07593852795, 35.630478192408);

                var minDisPoint = Wsupermap2.draw.findMinDisPoint(mypoint, result.recordsets[0].features);
                var objs = [];
                for (var i = 0; i < minDisPoint.length; i++) {
                    var datas = {};
                    datas.id = minDisPoint[i][0].dataid;
                    datas.lat = minDisPoint[i][0].y;
                    datas.lng = minDisPoint[i][0].x;
                    datas.distance = minDisPoint[i][0].distance;
                    datas.name = minDisPoint[i][0].dataname;
                    objs.push(datas);
                }
                console.log(objs);
            }
        },
        //pArr中距离点cP最近的一个点  
        findMinDisPoint: function(cp, parr) {
            var objs = [];
            for (var i = 0; i < parr.length; i++) {
                //console.log(parr[i].data.SmID,parr[i].data.CAPITAL);
                var point = parr[i].geometry;
                var d = Wsupermap2.draw.getFlatternDistance(point.y, point.x, cp.y, cp.x);
                point.dataid = parr[i].data.SmID;
                point.dataname = parr[i].data.CAPITAL;
                point.distance = d;
                //var d = Wsupermap2.draw.getFlatternDistance(point.x,point.y,cp.x,cp.y);
                var obj = [point, d];
                objs.push(obj);
            }
            //排序->排序后数组第一个元素就是距离最近的点
            for (var i = 0; i < objs.length; i++) {
                for (var j = 0; j < objs.length - i - 1; j++) {
                    if (objs[j][1] > objs[j + 1][1]) {
                        var temp = objs[j];
                        objs[j] = objs[j + 1];
                        objs[j + 1] = temp;
                    }
                }
            }
            return objs;
        },
        /**
         * 计算两个点之间的距离
         * approx distance between two points on earth ellipsoid
         * @param {Object} lat1 第一点纬度
         * @param {Object} lng1 第一点经度
         * @param {Object} lat2 第二点纬度
         * @param {Object} lng2 第二点经度
         */
        getFlatternDistance: function(lat1, lng1, lat2, lng2) {
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
        },
        processFailed: function(e) {
            alert(e.error.errorMsg);
        },
        clearFeatures: function() {
            //先清除上次的显示结果
            vectorLayer.removeAllFeatures();
            vectorLayerregion.removeAllFeatures();
            vectorLayerline.removeAllFeatures();
            markers.clearMarkers();
            vectorLayer.refresh();
            vectorLayerregion.refresh();
            vectorLayerline.refresh();
        },
        //定义mouseClickHandler函数，触发click事件会调用此函数
        mouseClickHandler: function() {
            var marker = this;
            var lonlat = marker.getLonLat();
            var contentHTML = "<div style='font-size:.8em; opacity: 0.8; overflow-y:hidden;'>";
            contentHTML += "<div>" + marker.lonlat + "</div></div>";
            var popup = new SuperMap.Popup.FramedCloud("popwin", new SuperMap.LonLat(lonlat.lon, lonlat.lat), null, contentHTML, null, true);
            map.addPopup(popup);
        },
        closeInfoWin: function() {
            if (infowin) {
                try {
                    infowin.hide();
                    infowin.destroy();
                } catch (e) {}
            }
        },
        //创建点
        drawCompleted: function(drawGeometryArgs) {
            var point = drawGeometryArgs.feature.geometry,
                size = new SuperMap.Size(37, 38),
                offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                icon = new SuperMap.Icon("images/cluster3.png", size, offset);
            markers.addMarker(new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon));
            nodeArray.push(point);






        },
        selectPoints: function() {
            Wsupermap2.draw.clearElements();
            drawPointlj.activate();
        },
        //选中时显示路径指引信息
        onFeatureSelect: function(feature) {
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
        },
        //清除要素时调用此函数
        onFeatureUnselect: function(feature) {
            map.removePopup(feature.popup);
            feature.popup.destroy();
            feature.popup = null;
            if (feature.geometry.CLASS_NAME != "SuperMap.Geometry.Point") {
                feature.style = style;
            }
            vectorLayer.redraw();
        },
        findPath: function(options) {
            var opts = $.extend(defaults, options || {});
            drawPointlj.deactivate();
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
                nodes: nodeArray,
                hasLeastEdgeCount: false,
                parameter: analystParameter
            });
            if (nodeArray.length <= 1) {
                alert("站点数目有误");
            }
            findPathService = new SuperMap.REST.FindPathService(opts.urldtlw, {
                eventListeners: {
                    "processCompleted": Wsupermap2.draw.processCompletedly
                }
            });
            findPathService.processAsync(parameter);
        },
        processCompletedly: function(findPathEventArgs) {
            var result = findPathEventArgs.result;
            Wsupermap2.draw.allScheme(result);
        },
        allScheme: function(result) {
            if (pathListIndex < result.pathList.length) {
                Wsupermap2.draw.addPath(result);
            } else {
                pathListIndex = 0;
                //线绘制完成后会绘制关于路径指引点的信息
                Wsupermap2.draw.addPathGuideItems(result);
            }
        },
        //以动画效果显示分析结果
        addPath: function(result) {
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
                pathFeature.style = style;
                vectorLayer.addFeatures(pathFeature);
                //每隔1毫秒加载一条弧段
                pathTime = setTimeout(function() {
                    Wsupermap2.draw.addPath(result);
                }, 1);
                routeCompsIndex++;
            } else {
                clearTimeout(pathTime);
                routeCompsIndex = 0;
                pathListIndex++;
                Wsupermap2.draw.allScheme(result);
            }
        },
        addPathGuideItems: function(result) {
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
                        guideFeature.style = style;
                    }
                    vectorLayer.addFeatures(guideFeature);
                }
            }
            selectFeature.activate();
        },
        clearElements: function() {
            pathListIndex = 0;
            routeCompsIndex = 0;
            nodeArray = [];
            selectFeature.deactivate();
            if (vectorLayer.selectedFeatures.length > 0) {
                map.removePopup(vectorLayer.selectedFeatures[0].popup);
            }
            vectorLayer.removeAllFeatures();
            markers.clearMarkers();
        }
    };
})(this);
