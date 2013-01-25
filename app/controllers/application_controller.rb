class ApplicationController < ActionController::Base
  protect_from_forgery
  
  def login_required
    if session[:user_id]
      return true
    else
      redirect_to :controller => "users", :action => "index"
    end
  end
  
end
