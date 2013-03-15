require "json"

class IndexController < ApplicationController
  
  before_filter :login_required
  
  def index    
    @sessionRedis = Array.new;
    $redis.keys('session:*').each do |id|
      user = Marshal.load($redis.get(id))
      if(user['user_id'])
        @sessionRedis.push(user)
      end
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
  
  def acceptInvite     
    key = $redis.keys("invitation:from#{params[:id]}to*")
    $redis.del(key)   
    game = "game:from#{params[:id]}to#{session[:user_id]}"   
    userGame = [session[:user_id], Integer(params[:id])].to_json
    session[:game]=game
    cookies[:player] = {
      :value => 0,
      :expires => 2.hour.from_now
    }
    $redis.set(game,userGame)
    render :text => true, :content_type => "text/plain"
  end
  
  def wait
    result = false
    key = $redis.keys("invitation:from*to#{session[:user_id]}")
      if (key.any? != false)
        redis = JSON.parse($redis.get(key))
        result = ['invite', redis[0], redis[1]]
      else
        key = $redis.keys("game:from#{session[:user_id]}to*")
      end
      
      if (result == false && key.any? != false)
        redis = JSON.parse($redis.get(key))
        result = ['game', redis[0], redis[1]].to_json
        session[:game] = key
        cookies[:player] = {
          :value => 1,
          :expires => 2.hour.from_now
        }
      end
    render :text => result, :content_type => "text/plain"
  end

end