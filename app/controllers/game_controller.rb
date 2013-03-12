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
    render :text => true, :content_type => "text/plain"
  end
  
  def setMove
    logger.debug('hello set move')
    if(params[:take].nil?)     
      user = JSON.parse($redis.get(session[:game]))
      user[2]=[Integer(params[:pawnBefore][0]),Integer(params[:pawnBefore][1])]
      user[3]=[Integer(params[:pawnAfter][0]),Integer(params[:pawnAfter][1])]
      $redis.set(session[:game],user.to_json)
      logger.debug(user)
    elsif
      logger.debug('taken')
    end
    render :text => true, :content_type => "text/plain"
  end

end
