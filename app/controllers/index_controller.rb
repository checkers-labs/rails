class IndexController < ApplicationController
  
  before_filter :login_required
  
  def index
    render "index"
  end
  
  
  def test
  render :text => "Hello, world!",
         :content_type => "application/json"
  end

end