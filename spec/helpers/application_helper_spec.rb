require 'rails_helper'

describe ApplicationHelper do
  it '#path_to_js_for_current_page returns path to javascript file for current page' do
    expect(helper.path_to_js_for_current_page).to eq 'pages/test'
  end

  it '#title return title for current controller' do
    expect(helper).to receive(:controller_name) { 'maps' }
    expect(helper.title).to eq 'Maps'
  end
end
