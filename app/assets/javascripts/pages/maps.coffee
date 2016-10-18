#= require DataTables/jquery.dataTables.min
#= require DataTables/dataTables.bootstrap.min

$(document).bind 'ready ajaxComplete', ->
  document.addEventListener 'turbolinks:load', ->
    if $('.js-maps-table').length && !$.fn.DataTable.isDataTable('.js-maps-table')
      table = $('.js-maps-table').DataTable(
        columnDefs: [
          { orderable: false, targets: -1 }
          { bSearchable: false, aTargets: -1 }
        ]
      )

      $('.js-maps-table tbody').on 'click', '[data-remove-map]', ->
        table.row($(this).parents('tr')).remove().draw('page')

$(document).ajaxComplete ->
  $('form[data-validate]').validate()
