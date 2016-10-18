#= require plugins/custom_markerclusterer

@Locations = React.createClass
  getInitialState: ->
    locations: @props.data

  getDefaultProps: ->
    locations: []

  setLocationsToMap: (locations) ->
    map = new (google.maps.Map)(
      $('.js-map')[0]
      zoom: 3
      center: @props.map_coordinates
    )

    locations_for_map = locations.map (location) ->
      title: location.name
      coordinates:
        lat: location.latitude
        lng: location.longitude

    new GroupedMarkers(map, locations_for_map)

  addLocation: (location) ->
    locations = React.addons.update(@state.locations, { $push: [location] })
    @setState locations: locations
    @setLocationsToMap locations

  deleteLocation: (location) ->
    index = @state.locations.indexOf location
    locations = React.addons.update(@state.locations, { $splice: [[index, 1]] })
    @replaceState locations: locations
    @setLocationsToMap locations

  updateLocation: (location, data) ->
    index = @state.locations.indexOf location
    locations = React.addons.update(@state.locations, { $splice: [[index, 1, data]] })
    @replaceState locations: locations
    @setLocationsToMap locations

  componentDidMount: ->
    @setLocationsToMap @state.locations

  render: ->
    React.DOM.div
      className: 'locations'
      React.createElement LocationForm,
        handleNewLocation: @addLocation,
        mapId: @props.map_id,
        map: @state.map,
        locations: @state.locations
      React.DOM.hr null
      React.DOM.div
        className: 'js-map'
      React.DOM.hr null
      if @state.locations.length
        React.DOM.div
          id: 'locations-table'
          React.DOM.table
            className: 'locations-table table table-bordered'
            React.DOM.thead null,
              React.DOM.tr null,
                React.DOM.th null, I18n.t('js.locations.name')
                React.DOM.th null, I18n.t('js.locations.address')
                React.DOM.th null, I18n.t('js.locations.lat')
                React.DOM.th null, I18n.t('js.locations.lng')
                React.DOM.th null, I18n.t('js.locations.actions')
            React.DOM.tbody null,
              for location in @state.locations
                React.createElement Location,
                  mapId: @props.map_id
                  key: location.id
                  location: location
                  handleDeleteLocation: @deleteLocation
                  handleEditLocation: @updateLocation
