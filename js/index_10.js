  
  let firstLayer = new ol.layer.Vector({
  	source:new ol.source.Vector(),
  	style:new ol.style.Style({
  		image:new ol.style.Circle({
  			radius:7,
  			fill:new ol.style.Fill({
  				color:"#f00"
  			})
  		}),
      fill:new ol.style.Fill({
        color:"#00f"
      }),
      stroke:new ol.style.Stroke({
        color:"#0ff",
        width:1
      })
  	})
  });

  let f_feature_1 = new ol.Feature({
  	geometry:new ol.geom.Point([104.132456,30.134567])
  });

  let f_feature_2 = new ol.Feature({
    geometry:new ol.geom.Point([104.232456,30.234567])
  });

  firstLayer.getSource().addFeature(f_feature_1);
  firstLayer.getSource().addFeature(f_feature_2);

  //console.log( firstLayer.getSource().getFeatures())
  //console.log( firstLayer.getSource().getFeatures()[0].getGeometry())



  let otherLayer = new ol.layer.Vector({
  	source:new ol.source.Vector()
  });
  let map = new ol.Map({
  		target:"map",//css中的id
  		layers:[
  			new ol.layer.Tile({
  				source:new ol.source.OSM()
  			}),
  			firstLayer,
  			otherLayer
  		],
  		view:new ol.View({
        projection:"EPSG:4326",
  			center:[104,30],
  			zoom:10
  		})
  });

  let select = new ol.interaction.Select({
    style:new ol.style.Style({
      image:new ol.style.Circle({
        radius:7,
        fill:new ol.style.Fill({
          color:"#f00"
        })
      }),
      fill:new ol.style.Fill({
        color:"#00f"
      }),
      stroke:new ol.style.Stroke({
        color:"#0ff",
        width:1
      })
    })
  });

  map.addInteraction(select);

  select.on("select",function(ev){
    //console.log(ev);
    //console.log(ev.selected.length)
    //console.log(ev.deselected.length)
    if(ev.selected.length == 1){
      //console.log(ev.selected)
      //console.log(ev.selected[0].getGeometry().getCoordinates())
      //此处是当连续点击多个点时，弹出当前点overlay需要删除之前的点弹出overlayer
      if(ev.deselected.length == 1){
        let overlay = map.getOverlayById("overlay_1");
        map.removeOverlay(overlay)
      }

      let point = ev.selected[0].getGeometry().getCoordinates();
      //把overlay添加到overwap里,注意包裹overlay的宽高要设置为0
      $("#overwap").html(`<div id="overlay">${"经度:"+point[0]+"<br />"+"维度:"+point[1]}</div>`);
      let overlay = new ol.Overlay({
        id:"overlay_1",//此处的id和css样式的id不是同一个
        position:point,
        element:document.getElementById("overlay"),
        positioning:"center-right", //被点击的点相对于弹框的位置,默认top-left(意思是点击的点在弹框的顶部左边),其他同理
        offset:[-20,0] //相对偏移
      });

      map.addOverlay(overlay);
      //interaction交互只能在map上添加，不能在overlay上添加
      
    }
    
    //点击地图的时候(没有选中),删除overlayer
    if(ev.deselected.length == 1 && ev.selected.length == 0){
      let overlay = map.getOverlayById("overlay_1");
      map.removeOverlay(overlay)
    }
  });
