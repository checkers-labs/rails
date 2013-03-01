class IndexController < ApplicationController
  
  before_filter :login_required
  
  def index
    @sessionRedis = Array.new;
    $redis.keys('session:*').each do |id|
      @sessionRedis.push(Marshal.load($redis.get(id)))
    end
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