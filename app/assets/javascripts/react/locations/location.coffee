@Location = React.createClass
  getInitialState: ->
    edit: false
    url: "/maps/#{ @props.mapId }/locations/#{ @props.location.id }"

  handleToggle: (e) ->
    e.preventDefault()
    @setState edit: !@state.edit

  handleDelete: (e) ->
    e.preventDefault()
    # yeah... jQuery doesn't have a $.delete shortcut method
    $.ajax
      method: 'DELETE'
      url: @state.url
      dataType: 'JSON'
      success: () =>
        @props.handleDeleteLocation @props.location

  handleEdit: (e) ->
    e.preventDefault()
    data =
      name: ReactDOM.findDOMNode(@refs.name).value
      address: ReactDOM.findDOMNode(@refs.address).value
    $.ajax
      method: 'PUT'
      url: @state.url
      dataType: 'JSON'
      data:
        location: data
      success: (data) =>
        @setState edit: false
        @props.handleEditLocation @props.location, data

  locationRow: ->
    React.DOM.tr null,
      React.DOM.td null, @props.location.name
      React.DOM.td null, @props.location.address
      React.DOM.td null, @props.location.latitude
      React.DOM.td null, @props.location.longitude
      React.DOM.td null,
        React.DOM.a
          className: 'btn btn-default'
          onClick: @handleToggle
          I18n.t('js.buttons.edit')
        React.DOM.a
          className: 'btn btn-danger'
          onClick: @handleDelete
          I18n.t('js.buttons.delete')

  locationForm: ->
    React.DOM.tr null,
      React.DOM.td null,
        React.DOM.input
          id: @props.location.id + '-location_name'
          className: 'form-control'
          type: 'text'
          defaultValue: @props.location.name
          ref: 'name'
      React.DOM.td null,
        React.DOM.input
          id: @props.location.id + '-location_address'
          className: 'form-control'
          type: 'text'
          defaultValue: @props.location.address
          ref: 'address'
      React.DOM.td null, @props.location.latitude
      React.DOM.td null, @props.location.longitude
      React.DOM.td null,
        React.DOM.a
          className: 'btn btn-default'
          onClick: @handleEdit
          I18n.t('js.buttons.update')
        React.DOM.a
          className: 'btn btn-danger'
          onClick: @handleToggle
          I18n.t('js.buttons.cancel')

  render: ->
    if @state.edit
      @locationForm()
    else
      @locationRow()
