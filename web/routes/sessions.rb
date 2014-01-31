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
  binding.pry
   @user = session['user']
   @userid = session['userid']
   haml :home
end

# Usage - 
#   Once user logs in - call /auth to get the session token
#   For other future requests - put token in the header along with the requests
#   Android should ask user to login only when /auth returns failure
get '/auth' do
  raise "Auth Failure" unless loggedIn
  sessionToken = request.cookies["rack.session"]
  content_type :json
  sessionToken.to_json
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

