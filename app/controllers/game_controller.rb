class GameController < ApplicationController
  
  def index
    render 'index'
  end 
  
  def acceptInvite     
    key = $redis.keys("invitation:from#{params[:id]}to*")
    $redis.del(key)   
    game = "game:from#{params[:id]}to#{session[:user_id]}"   
    userGame = [session[:user_id], Integer(params[:id])].to_json
    session[:game]=game
    $redis.set(game,userGame)
    render :text => true, :content_type => "text/plain"
  end
    
  def getMove
    logger.debug('hello')
    moves = JSON.parse($redis.get(session[:game]))
    render :text => false, :content_type => "text/plain"
  end
  
  def setMove
    user = JSON.parse($redis.get(session[:game]))
    user[2]=[Integer(params[:pawnBefore][0]),Integer(params[:pawnBefore][1])]
    user[3]=[Integer(params[:pawnAfter][0]),Integer(params[:pawnAfter][1])]
    if(params[:take].nil?)
      user = user.slice(0,4)      
    elsif
      user[4]=[Integer(params[:take][0]),Integer(params[:take][1])]
    end
    $redis.set(session[:game],user.to_json)
    render :text => true, :content_type => "text/plain"
  end

end
