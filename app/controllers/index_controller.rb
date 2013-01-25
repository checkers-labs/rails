class IndexController < ApplicationController
  
  before_filter :login_required
  
  def index
    render "index"
  end

end