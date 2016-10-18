module ApplicationHelper
  def path_to_js_for_current_page
    current_path = "pages/#{controller_name}/#{action_name}"
    Rails.application.assets.resolve(current_path).blank? ? "pages/#{controller_name}" : current_path
  end

  def title
    t "#{controller_name}.title"
  end

  def flash_messages
    message_classes = {
      notice: 'alert-info',
      success: 'alert-success',
      alert: 'alert-warning',
      error: 'alert-danger'
    }

    flash.each do |type, message|
      message_class = message_classes[type.to_sym] || type.to_s
      concat(
        content_tag(:div, message, class: "alert #{message_class} fade in") do
          concat content_tag(:button, '×', class: 'close', data: { dismiss: 'alert' })
          concat message
        end
      )
    end

    nil
  end
end
