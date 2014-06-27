require_relative '../helpers/init.rb'
require 'pry'

module Flockers
  class WebApp < Sinatra::Application
  
    before do
      if request.request_method == "POST" and (request.content_type || '').include? "application/json" 
        # NOTE: By Gaurav - this is critical, otherwise for some reason request.body.read gets a nil string
        request.body.rewind
        body_parameters = request.body.read
        parsed = body_parameters && body_parameters.length >= 2 ? JSON.parse(body_parameters, :symbolize_names => true) : nil
        params.merge!(parsed)
      end
    end

    get '/' do
      @user = session['user']
      @userid = session['userid']
      haml :home
    end
		
		get '/me' do
      @user = session['user']
      @userid = session['userid']
      haml :gameprofile
		end  
		
    get '/myevents' do
      authenticate!
      @user = session['user']
      @userid = session['userid']	
      haml :userEvents
    end

    post '/login' do 
      begin 
        @he =Account.first(:uname => params[:user_name], :password => params[:pass]); 
        raise "Invalid Username or Password" if @he.nil?
        session['user']=params[:user_name];
        session['userid'] = @he.id;
        response = @he;
        #redirect('/loggedIn')

      rescue => e
        response = {:error => {:message => e.message}}
      end
      
      content_type :json
      response.to_json
    end

    post '/signout' do
      session['user']=''
      session['userid'] = ''
      content_type :json
      {:status => 'success'}.to_json
    end


    get '/loggedIn' do
      authenticate!
      @user = session['user'];
      @userid = session['userid'];
      haml :profile
    end

    post '/signup' do
      begin
        zoo = Account.create_account(
          :uname => params[:user_name], 
          :password => params[:pass] )
      rescue => e
        response = {:error => {:message => e.message}}
      end
      content_type :json
      response.to_json
    end

  end 
end

