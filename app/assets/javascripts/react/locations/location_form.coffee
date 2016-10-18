@LocationForm = React.createClass
  getInitialState: ->
    name: ''
    address: ''

  valid: ->
    @state.name && @state.address

  handleChange: (e) ->
    name = e.target.name
    @setState "#{ name }": e.target.value

  handleSubmit: (e) ->
    e.preventDefault()
    url = '/maps/' + @props.mapId + '/locations'
    $.post url, { location: @state }, (data) =>
      @props.handleNewLocation data
      @setState @getInitialState()
    , 'JSON'

  render: ->
    React.DOM.div
      className: 'row'
      React.DOM.form
        className: 'new_location'
        onSubmit: @handleSubmit
        React.DOM.div
          className: 'location-input'
          React.DOM.input
            id: 'location_name'
            type: 'text'
            className: 'form-control'
            placeholder: I18n.t('js.locations.placeholders.name')
            name: 'name'
            value: @state.name
            onChange: @handleChange
        React.DOM.div
          className: 'location-input'
          React.DOM.div
            className: 'form-group'
            React.DOM.input
              id: 'location_address'
              type: 'text'
              className: 'form-control'
              placeholder: I18n.t('js.locations.placeholders.address')
              name: 'address'
              value: @state.address
              onChange: @handleChange
        React.DOM.div
          className: 'location-buttons'
          React.DOM.button
            type: 'submit'
            className: 'btn btn-primary btn-block'
            disabled: !@valid()
            I18n.t('js.locations.buttons.create')
