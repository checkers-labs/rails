require "json"

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
    # si aucune invitation pour l'user en session on ajoute son invitation
    if ($redis.keys("invitation:from#{session[:user_id]}to*").any? == false)
      id = "invitation:from#{session[:user_id]}to#{params[:id]}"
      userJson = [session[:user_id], session[:user_name]].to_json
      $redis.set(id, userJson)
      render :nothing => true
    end
  end
  
  def cancelInvite
    key = $redis.keys("invitation:from#{params[:id]}to*")
    $redis.del(key)
    render :nothing => true
  end
  
  def isInvited
    isInvited = false
    key = $redis.keys("invitation:from*to#{session[:user_id]}")
      if (key.any? != false)
        isInvited = $redis.get(key)
      end      
    render :text => isInvited, :content_type => "text/plain"
  end

end