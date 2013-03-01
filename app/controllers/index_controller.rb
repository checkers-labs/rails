class IndexController < ApplicationController
  
  before_filter :login_required
  
  def index
    render "index"
  end
  
  
  def test
    render :text => "Hello, world!", :content_type => "text/plain"
  end
  
  def createGame
      id = "invitation:#{params[:id]}"
      $redis.set(id,session[:user_name])
     render :text => 'work', :content_type => "text/plain"
  end
  
  def waitForInvite  
    isInvited = false 
    for i in 0..50

        result = $redis.get("invitation:#{session[:user_id]}")
        if (result!=nil)
          isInvited=true
          break
        end               
        sleep 1        
     end
     
       render :text => isInvited, :content_type => "text/plain"
  end

end