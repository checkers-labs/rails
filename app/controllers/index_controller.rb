class IndexController < ApplicationController
  
  before_filter :login_required
  
  def index
    render "index"
  end
  
  
  def test
    render :text => "Hello, world!", :content_type => "text/plain"
  end
  
  def createGame
      #params['id']
      $redis.set('chunky', 'bacon')
     render :text => $redis.keys('session:*'), :content_type => "text/plain"
  end

end