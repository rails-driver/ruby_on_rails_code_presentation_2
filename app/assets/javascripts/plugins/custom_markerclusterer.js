/**
 * locations:
 *     'title': (string) The location name.
 *     'coordinates':
 *         'lat': (number) The latitude of location.
 *         'lng': (number) The longitude of location.
 * opt_options:
 *     'minSize': (number) Min MarkersGroupIcon size.
 *     'maxSize': (number) Max MarkersGroupIcon size.
 *     'gridSize': (number) The grid size of a markersGroup in pixels.
 *     'zoomOnClick': (boolean) Whether the default behaviour of clicking on a
 *                    markersGroup is to zoom into it.
 *     'averageCenter': (boolean) Whether the center of each markersGroup should be
 *                      the average of all markers in the markersGroup.
 *     'styles': (object) An object that has style properties:
 *       'url': (string) The image url.
 *       'anchor': (Array) The anchor position of the label text.
 *       'textColor': (string) The text color.
 *       'textSize': (number) The text size.
 *       'backgroundPosition': (string) The position of the backgound x, y.
 *       'iconAnchor': (Array) The anchor position of the icon x, y.
 */
function GroupedMarkers(map, locations, opt_options) {
  this.extend(GroupedMarkers, google.maps.OverlayView);

  this.map_ = map;
  this.markers_ = [];
  this.markersGroups_ = [];
  this.ready_ = false;

  var options = opt_options || {};
  this.minSize_ = options['minSize'] || 20;
  this.maxSize_ = options['manSize'] || 100;
  this.gridSize_ = options['gridSize'] || 60;
  this.styles_ = options['styles'] || {};
  this.zoomOnClick_ = true;
  if (options['zoomOnClick'] != undefined) {
    this.zoomOnClick_ = options['zoomOnClick'];
  }
  this.averageCenter_ = false;
  if (options['averageCenter'] != undefined) {
    this.averageCenter_ = options['averageCenter'];
  }
  this.setMap(map);
  this.prevZoom_ = this.map_.getZoom();

  var groupedMarkers = this;
  google.maps.event.addListener(this.map_, 'zoom_changed', function() {
    var zoom = groupedMarkers.map_.getZoom();

    if (groupedMarkers.prevZoom_ != zoom) {
      groupedMarkers.prevZoom_ = zoom;
      groupedMarkers.resetViewport();
    }
  });

  google.maps.event.addListener(this.map_, 'idle', function() {
    groupedMarkers.redraw();
  });

  if (locations && locations.length) {
    this.addMarkers(locations, false);
  }
}

GroupedMarkers.prototype.extend = function(obj1, obj2) {
  return (function(object) {
    for (var property in object.prototype) {
      this.prototype[property] = object.prototype[property];
    }
    return this;
  }).apply(obj1, [obj2]);
};

GroupedMarkers.prototype.onAdd = function() {
  this.setReady_(true);
};

GroupedMarkers.prototype.draw = function() {};

GroupedMarkers.prototype.fitMapToMarkers = function() {
  var markers = this.getMarkers();
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0, marker; marker = markers[i]; i++) {
    bounds.extend(marker.getPosition());
  }

  this.map_.fitBounds(bounds);
};

GroupedMarkers.prototype.setStyles = function(styles) {
  this.styles_ = styles;
};

GroupedMarkers.prototype.getStyles = function() {
  return this.styles_;
};

GroupedMarkers.prototype.isZoomOnClick = function() {
  return this.zoomOnClick_;
};

GroupedMarkers.prototype.isAverageCenter = function() {
  return this.averageCenter_;
};

GroupedMarkers.prototype.getMarkers = function() {
  return this.markers_;
};

GroupedMarkers.prototype.calculator_ = function(markers, numStyles) {
  var index = 0;
  var count = markers.length;
  var dv = count;
  while (dv !== 0) {
    dv = parseInt(dv / 10, 10);
    index++;
  }

  index = Math.min(index, numStyles);
  return {
    text: count,
    index: index
  };
};

GroupedMarkers.prototype.setCalculator = function(calculator) {
  this.calculator_ = calculator;
};

GroupedMarkers.prototype.getCalculator = function() {
  return this.calculator_;
};

GroupedMarkers.prototype.addMarkers = function(locations, opt_nodraw) {
  for (var i = 0, location; location = locations[i]; i++) {
    this.pushMarkerTo_(location);
  }
  if (!opt_nodraw) {
    this.redraw();
  }
};

GroupedMarkers.prototype.pushMarkerTo_ = function(location) {
  var marker = new google.maps.Marker({
    position: location.coordinates,
    title: location.title
  });

  marker.isAdded = false;
  if (marker['draggable']) {
    var groupedMarkers = this;
    google.maps.event.addListener(marker, 'dragend', function() {
      marker.isAdded = false;
      groupedMarkers.repaint();
    });
  }
  this.markers_.push(marker);
};

GroupedMarkers.prototype.addMarker = function(marker, opt_nodraw) {
  this.pushMarkerTo_(marker);
  if (!opt_nodraw) {
    this.redraw();
  }
};

GroupedMarkers.prototype.removeMarker_ = function(marker) {
  var index = -1;
  if (this.markers_.indexOf) {
    index = this.markers_.indexOf(marker);
  } else {
    for (var i = 0, m; m = this.markers_[i]; i++) {
      if (m == marker) {
        index = i;
        break;
      }
    }
  }

  if (index == -1) {
    return false;
  }

  marker.setMap(null);

  this.markers_.splice(index, 1);

  return true;
};

GroupedMarkers.prototype.removeMarker = function(marker, opt_nodraw) {
  var removed = this.removeMarker_(marker);

  if (!opt_nodraw && removed) {
    this.resetViewport();
    this.redraw();
    return true;
  } else {
    return false;
  }
};

GroupedMarkers.prototype.removeMarkers = function(markers, opt_nodraw) {
  var removed = false;

  for (var i = 0, marker; marker = markers[i]; i++) {
    var r = this.removeMarker_(marker);
    removed = removed || r;
  }

  if (!opt_nodraw && removed) {
    this.resetViewport();
    this.redraw();
    return true;
  }
};

GroupedMarkers.prototype.setReady_ = function(ready) {
  if (!this.ready_) {
    this.ready_ = ready;
    this.createMarkersGroups_();
  }
};

GroupedMarkers.prototype.getMap = function() {
  return this.map_;
};

GroupedMarkers.prototype.setMap = function(map) {
  this.map_ = map;
};

GroupedMarkers.prototype.getGridSize = function() {
  return this.gridSize_;
};

GroupedMarkers.prototype.setGridSize = function(size) {
  this.gridSize_ = size;
};

GroupedMarkers.prototype.getExtendedBounds = function(bounds) {
  var projection = this.getProjection();

  // Turn the bounds into latlng.
  var tr = new google.maps.LatLng(bounds.getNorthEast().lat(),
    bounds.getNorthEast().lng());
  var bl = new google.maps.LatLng(bounds.getSouthWest().lat(),
    bounds.getSouthWest().lng());

  // Convert the points to pixels and the extend out by the grid size.
  var trPix = projection.fromLatLngToDivPixel(tr);
  trPix.x += this.gridSize_;
  trPix.y -= this.gridSize_;

  var blPix = projection.fromLatLngToDivPixel(bl);
  blPix.x -= this.gridSize_;
  blPix.y += this.gridSize_;

  // Convert the pixel points back to LatLng
  var ne = projection.fromDivPixelToLatLng(trPix);
  var sw = projection.fromDivPixelToLatLng(blPix);

  // Extend the bounds to contain the new bounds.
  bounds.extend(ne);
  bounds.extend(sw);

  return bounds;
};

GroupedMarkers.prototype.isMarkerInBounds_ = function(marker, bounds) {
  return bounds.contains(marker.getPosition());
};

GroupedMarkers.prototype.clearMarkers = function() {
  this.resetViewport(true);

  // Set the markers a empty array.
  this.markers_ = [];
};

GroupedMarkers.prototype.resetViewport = function(opt_hide) {
  // Remove all the markersGroups
  for (var i = 0, markersGroup; markersGroup = this.markersGroups_[i]; i++) {
    markersGroup.remove();
  }

  // Reset the markers to not be added and to be invisible.
  for (var i = 0, marker; marker = this.markers_[i]; i++) {
    marker.isAdded = false;
    if (opt_hide) {
      marker.setMap(null);
    }
  }

  this.markersGroups_ = [];
};

GroupedMarkers.prototype.repaint = function() {
  var oldMarkersGroups = this.markersGroups_.slice();
  this.markersGroups_.length = 0;
  this.resetViewport();
  this.redraw();

  // Remove the old markersGroups.
  // Do it in a timeout so the other markersGroups have been drawn first.
  window.setTimeout(function() {
    for (var i = 0, markersGroup; markersGroup = oldMarkersGroups[i]; i++) {
      markersGroup.remove();
    }
  }, 0);
};

GroupedMarkers.prototype.redraw = function() {
  this.createMarkersGroups_();
};

GroupedMarkers.prototype.distanceBetweenPoints_ = function(p1, p2) {
  if (!p1 || !p2) {
    return 0;
  }

  var R = 6371; // Radius of the Earth in km
  var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
  var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};

GroupedMarkers.prototype.addToClosestMarkersGroup_ = function(marker) {
  var distance = 40000; // Some large number
  var markersGroupToAddTo = null;
  var pos = marker.getPosition();

  for (var i = 0, markersGroup; markersGroup = this.markersGroups_[i]; i++) {
    var center = markersGroup.getCenter();
    if (center) {
      var d = this.distanceBetweenPoints_(center, marker.getPosition());
      if (d < distance) {
        distance = d;
        markersGroupToAddTo = markersGroup;
      }
    }
  }

  if (markersGroupToAddTo && markersGroupToAddTo.isMarkerInMarkersGroupBounds(marker)) {
    markersGroupToAddTo.addMarker(marker);
  } else {
    var markersGroup = new MarkersGroup(this);
    markersGroup.addMarker(marker);
    this.markersGroups_.push(markersGroup);
  }
};

GroupedMarkers.prototype.createMarkersGroups_ = function() {
  if (!this.ready_) {
    return;
  }

  var mapBounds = new google.maps.LatLngBounds(this.getMap().getBounds().getSouthWest(),
    this.getMap().getBounds().getNorthEast());
  var bounds = this.getExtendedBounds(mapBounds);

  for (var i = 0, marker; marker = this.markers_[i]; i++) {
    if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
      this.addToClosestMarkersGroup_(marker);
    }
  }

  var maxMarkersCount = 0;
  var markersCount = null;
  for (var i = 0, markersGroup; markersGroup = this.markersGroups_[i]; i++) {
    markersCount = markersGroup.markers_.length;
    if (markersCount > maxMarkersCount) {
      maxMarkersCount = markersCount
    }
  }

  var groupedMarkers = null;
  var markersCount = null;
  var markersInPixel = null;
  var pixels = null;
  var styles = null;
  for (var i = 0, markersGroup; markersGroup = this.markersGroups_[i]; i++) {
    groupedMarkers = markersGroup.groupedMarkers_;
    markersCount = markersGroup.markers_.length;
    markersInPixel = maxMarkersCount / this.maxSize_;
    pixels = markersCount / markersInPixel;
    styles = groupedMarkers.getStyles();
    if (pixels < this.minSize_) {
      pixels = this.minSize_
    };
    Object.assign(styles, {
      height: pixels,
      width: pixels,
      textSize: pixels / 3
    });
    groupedMarkers.setStyles(styles);
    markersGroup.updateIcon();
  }
};

function MarkersGroup(groupedMarkers) {
  this.groupedMarkers_ = groupedMarkers;
  this.map_ = groupedMarkers.getMap();
  this.gridSize_ = groupedMarkers.getGridSize();
  this.averageCenter_ = groupedMarkers.isAverageCenter();
  this.center_ = null;
  this.markers_ = [];
  this.bounds_ = null;
  this.markersGroupIcon_ = new MarkersGroupIcon(
    this, groupedMarkers.getStyles(), groupedMarkers.getGridSize()
  );
}

MarkersGroup.prototype.isMarkerAlreadyAdded = function(marker) {
  if (this.markers_.indexOf) {
    return this.markers_.indexOf(marker) != -1;
  } else {
    for (var i = 0, m; m = this.markers_[i]; i++) {
      if (m == marker) {
        return true;
      }
    }
  }
  return false;
};

MarkersGroup.prototype.addMarker = function(marker) {
  if (this.isMarkerAlreadyAdded(marker)) {
    return false;
  }

  if (!this.center_) {
    this.center_ = marker.getPosition();
    this.calculateBounds_();
  } else {
    if (this.averageCenter_) {
      var l = this.markers_.length + 1;
      var lat = (this.center_.lat() * (l-1) + marker.getPosition().lat()) / l;
      var lng = (this.center_.lng() * (l-1) + marker.getPosition().lng()) / l;
      this.center_ = new google.maps.LatLng(lat, lng);
      this.calculateBounds_();
    }
  }

  marker.isAdded = true;
  this.markers_.push(marker);
  this.updateIcon();

  return true;
};

MarkersGroup.prototype.getGroupedMarkers = function() {
  return this.groupedMarkers_;
};

MarkersGroup.prototype.getBounds = function() {
  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
  var markers = this.getMarkers();
  for (var i = 0, marker; marker = markers[i]; i++) {
    bounds.extend(marker.getPosition());
  }
  return bounds;
};

MarkersGroup.prototype.remove = function() {
  this.markersGroupIcon_.remove();
  this.markers_.length = 0;
  delete this.markers_;
};

MarkersGroup.prototype.getSize = function() {
  return this.markers_.length;
};

MarkersGroup.prototype.getMarkers = function() {
  return this.markers_;
};

MarkersGroup.prototype.getCenter = function() {
  return this.center_;
};

MarkersGroup.prototype.calculateBounds_ = function() {
  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
  this.bounds_ = this.groupedMarkers_.getExtendedBounds(bounds);
};

MarkersGroup.prototype.isMarkerInMarkersGroupBounds = function(marker) {
  return this.bounds_.contains(marker.getPosition());
};

MarkersGroup.prototype.getMap = function() {
  return this.map_;
};

MarkersGroup.prototype.updateIcon = function() {
  var numStyles = this.groupedMarkers_.getStyles().length;
  var sums = this.groupedMarkers_.getCalculator()(this.markers_, numStyles);
  this.markersGroupIcon_.setCenter(this.center_);
  this.markersGroupIcon_.setSums(sums);
  this.markersGroupIcon_.show();
};

function MarkersGroupIcon(markersGroup, styles, opt_padding) {
  markersGroup.getGroupedMarkers().extend(MarkersGroupIcon, google.maps.OverlayView);

  this.styles_ = styles;
  this.padding_ = opt_padding || 0;
  this.markersGroup_ = markersGroup;
  this.center_ = null;
  this.map_ = markersGroup.getMap();
  this.div_ = null;
  this.sums_ = null;
  this.visible_ = false;
  this.infoWindow_ = null;
  this.markers_ = markersGroup.markers_

  this.setMap(this.map_);
}

MarkersGroupIcon.prototype.triggerMarkersGroupClick = function(event) {
  var GroupedMarkers = this.markersGroup_.getGroupedMarkers();

  google.maps.event.trigger(GroupedMarkers, 'markersGroupclick', this.markersGroup_, event);

  if (GroupedMarkers.isZoomOnClick()) {
    this.map_.fitBounds(this.markersGroup_.getBounds());
  }
};


MarkersGroupIcon.prototype.setInfoWindow = function() {
  var markerTitles = [];
  var uniqueTitles = {};
  var markerTitle = null;
  var markersCount = null;

  for (var i = 0, l = this.markers_.length; i < l; i++){
    markerTitle = this.markers_[i].title;
    if (!uniqueTitles.hasOwnProperty(markerTitle) && markerTitle != null) {
      markersCount = markerTitles.length;
      if (markersCount) {
        markerTitles.push((markersCount % 2) ? markerTitle : '</br>' + markerTitle)
      } else {
        markerTitles.push(markerTitle)
      }
      uniqueTitles[markerTitle] = 1;
    }
  }

  this.infoWindow_ = new google.maps.InfoWindow({
    map: markerTitles.length ? this.map_ : null,
    position: this.center_,
    content: markerTitles.toString()
  })
};

MarkersGroupIcon.prototype.onAdd = function() {
  this.div_ = document.createElement('DIV');
  if (this.visible_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.cssText = this.createCss(pos);
    this.div_.innerHTML = this.sums_.text;
  }

  var panes = this.getPanes();
  panes.overlayMouseTarget.appendChild(this.div_);

  var that = this;
  var isDragging = false;
  google.maps.event.addDomListener(this.div_, 'click', function(event) {
    if (!isDragging) {
      that.triggerMarkersGroupClick(event);
    }
  });
  google.maps.event.addDomListener(this.div_, 'mousedown', function() {
    isDragging = false;
  });
  google.maps.event.addDomListener(this.div_, 'mousemove', function() {
    isDragging = true;
  });

  this.setInfoWindow()
};

MarkersGroupIcon.prototype.getPosFromLatLng_ = function(latlng) {
  var pos = this.getProjection().fromLatLngToDivPixel(latlng);

  if (typeof this.iconAnchor_ === 'object' && this.iconAnchor_.length === 2) {
    pos.x -= this.iconAnchor_[0];
    pos.y -= this.iconAnchor_[1];
  } else {
    pos.x -= parseInt(this.width_ / 2, 10);
    pos.y -= parseInt(this.height_ / 2, 10);
  }
  return pos;
};

MarkersGroupIcon.prototype.draw = function() {
  if (this.visible_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.top = pos.y + 'px';
    this.div_.style.left = pos.x + 'px';
  }
};

MarkersGroupIcon.prototype.hide = function() {
  if (this.div_) {
    this.div_.style.display = 'none';
  }
  this.visible_ = false;
};

MarkersGroupIcon.prototype.show = function() {
  if (this.div_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.cssText = this.createCss(pos);
    this.div_.style.display = '';
  }
  this.visible_ = true;
};

MarkersGroupIcon.prototype.remove = function() {
  this.setMap(null);
  this.infoWindow_.setMap(null);
};

MarkersGroupIcon.prototype.onRemove = function() {
  if (this.div_ && this.div_.parentNode) {
    this.hide();
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};

MarkersGroupIcon.prototype.setSums = function(sums) {
  this.sums_ = sums;
  this.text_ = sums.text;
  this.index_ = sums.index;
  if (this.div_) {
    this.div_.innerHTML = sums.text;
  }

  this.useStyle();
};

MarkersGroupIcon.prototype.useStyle = function() {
  var styles = this.styles_;
  this.url_ = styles['url'] || '/assets/grouped-markers-circle.png';
  this.height_ = styles['height'];
  this.width_ = styles['width'];
  this.textColor_ = styles['textColor'];
  this.anchor_ = styles['anchor'];
  this.textSize_ = styles['textSize'];
  this.backgroundPosition_ = styles['backgroundPosition'];
  this.iconAnchor_ = styles['iconAnchor'];
};

MarkersGroupIcon.prototype.setCenter = function(center) {
  this.center_ = center;
};

MarkersGroupIcon.prototype.createCss = function(pos) {
  var style = [];
  style.push('background: url(' + this.url_ + ');');
  style.push('background-size: ' + this.width_ + 'px '+ this.height_ +'px;');
  style.push('background-repeat: no-repeat;');
  var backgroundPosition = this.backgroundPosition_ ? this.backgroundPosition_ : '0 0';
  style.push('background-position:' + backgroundPosition + ';');

  if (typeof this.anchor_ === 'object') {
    if (typeof this.anchor_[0] === 'number' && this.anchor_[0] > 0 &&
      this.anchor_[0] < this.height_) {
      style.push('height:' + (this.height_ - this.anchor_[0]) +
        'px; padding-top:' + this.anchor_[0] + 'px;');
    } else if (typeof this.anchor_[0] === 'number' && this.anchor_[0] < 0 &&
      -this.anchor_[0] < this.height_) {
      style.push('height:' + this.height_ + 'px; line-height:' + (this.height_ + this.anchor_[0]) +
        'px;');
    } else {
      style.push('height:' + this.height_ + 'px; line-height:' + this.height_ +
        'px;');
    }
    if (typeof this.anchor_[1] === 'number' && this.anchor_[1] > 0 &&
      this.anchor_[1] < this.width_) {
      style.push('width:' + (this.width_ - this.anchor_[1]) +
        'px; padding-left:' + this.anchor_[1] + 'px;');
    } else {
      style.push('width:' + this.width_ + 'px; text-align:center;');
    }
  } else {
    style.push('height:' + this.height_ + 'px; line-height:' +
      this.height_ + 'px; width:' + this.width_ + 'px; text-align:center;');
  }

  var txtColor = this.textColor_ ? this.textColor_ : 'black';
  var txtSize = this.textSize_ ? this.textSize_ : 11;

  style.push('cursor:pointer; top:' + pos.y + 'px; left:' +
    pos.x + 'px; color:' + txtColor + '; position:absolute; font-size:' +
    txtSize + 'px; font-family:Arial,sans-serif; font-weight:bold');
  return style.join('');
};
