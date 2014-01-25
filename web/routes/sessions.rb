require_relative '../helpers/init.rb'
require 'pry'

module Flockers
  class WebApp < Sinatra::Application
  
before do
  if request.request_method == "POST" and request.content_type=="application/json"
    body_parameters = request.body.read
    parsed = body_parameters && body_parameters.length >= 2 ? JSON.parse(body_parameters) : nil
    params.merge!(parsed)
  end
end

get '/' do
   @user = session['user']
   @userid = session['userid']
   haml :home
end

get '/myevents' do
  raise "Auth Failure" unless loggedIn
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
  raise "Auth Failure" unless loggedIn
   @user = session['user'];
   @userid = session['userid'];
   haml :profile
end

post '/signup' do

   begin
      zoo = Account.new(
         :uname => params[:user_name], 
         :password => params[:pass] )

      if zoo.save
         response = "Success"
      else
         response = "Failure"
         raise "Unable to create account" 
      end

   rescue => e
      response = {:error => {:message => e.message}}
   end

   content_type :json
   response.to_json
end

end 
end

