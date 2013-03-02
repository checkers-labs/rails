class IndexController < ApplicationController
  
  before_filter :login_required
  
  def index
    @sessionRedis = Array.new;
    $redis.keys('session:*').each do |id|
      @sessionRedis.push(Marshal.load($redis.get(id)))
    end
    render "index"
  end
  
  def sendInvite
    id = "invitation:#{params[:id]}"
    $redis.set(id,session[:user_name])
    render :text => 'ok', :content_type => "text/plain"
  end
  
  def cancelInvite
    id = "invitation:#{params[:id]}"
    $redis.del(id)
    render :text => 'ok', :content_type => "text/plain"
  end
  
  def isInvited
    isInvited=false
    result = $redis.get("invitation:#{session[:user_id]}")
      if (result != nil)
        isInvited=result
      end               
    render :text => isInvited, :content_type => "text/plain"
  end

end