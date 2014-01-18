require 'rubygems'
require 'data_mapper'
require 'sinatra'
require 'haml'
require 'json'
#require 'pry'

require '/flockers/models/init.rb'

enable :sessions

enable :sessions


enable :sessions

module Flockers
  class WebApp < Sinatra::Application

get '/' do
   @user = session['user'];
   @userid = session['userid'];
   haml:home
end

get '/events' do
  # this can be a lot
  events = Event.all
  content_type :json
  events.to_json;
end

get '/searchEventByVerb' do
   data = Event.all('verb.like' => params[:record])
   data = {:status => 'Failure'} if data.nil?
   content_type :json
   data.to_json
end

get '/searchEventByActivity' do
   data = Event.all('activity.like' => params[:record])
   data = {:status => 'Failure'} if data.nil?
   content_type :json
   data.to_json
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

get '/myEvents.json' do
  raise "Auth Failure" if session['user'].nil? or session['user'] == ''
  hm=Event.all(:account_id => session['userid'])
  content_type :json
  hm.to_json;
end

get '/publicEvents.json' do
  # TODO: Need to limit this to future events vs past events ? or may be all public events is fine.
  hm=Event.all
  content_type :json
  hm.to_json
end

get '/participationID.json' do
  raise "Auth Failure" if session['user'].nil? or session['user'] == ''
  hm=Participation.all(:account_id => session['userid'])
  content_type :json
  if hm.any?
    hm.to_json;
  else 
    {:status => 'Failure'}.to_json;
  end
end

get '/participationEvents.json' do
   array=params[:event]
   events = Array.new
   array.each do |i|
      events << Event.first(:id => i.to_i)
   end
   content_type :json
   events.to_json
end

get '/loggedIn' do
  raise "Auth Failure" if session['user'].nil? or session['user'] == ''
   @user = session['user'];
   @userid = session['userid'];
   haml :profile
end

post '/events' do

  raise "Auth Failure" if session['user'].nil? or session['user'] == ''
   event = params[:event];
   puts session['userid']

   #begin 
      Event.createEvent({ 
         :ename => event[:ename], 
         :date => event[:date],
         :time => event[:time],
         :place => event[:place],
         :account_id => session['userid'],
         :fees => event[:fees],
         :prize => event[:prize],
         :description =>event[:description]})

   #rescue => e
   #   response = {:error => {:message => e.message}}
   #end

   content_type :json
   response.to_json
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

get '/search' do
   @hs=Event.all('ename.like' => params[:record])
   if @hs.any?
      data = @hs.to_json;
   else
      data = {:status => 'Failure'}.to_json;
   end
   return data;
end

delete '/events' do
  # Only the organizer can do this
   zoo = Event.first(:id => params[:event_id].to_i)
   foo = Participation.all(:event_id => params[:event_id].to_i)
   unless foo.nil?
      foo.destroy
   end
   zoo.destroy
   if zoo.destroyed?
      return {:status => 'success'}.to_json;
   else
      return {:status => 'not_success'}.to_json; 
   end
end

delete '/participationEvent' do
   zoo = Participation.first(:event_id => params[:event_id].to_i)
   zoo.destroy
   if zoo.destroyed?
      return {:status => 'success'}.to_json;
   else
      return {:status => 'not_success'}.to_json; 
   end
end

post '/participate' do
   begin 
      raise "Auth Failure" if session['user'].nil? or session['user'] == ''
      puts params
      response = {}
      event = Event.first(:id => params[:event].to_i)
      account = Account.first(:id => params[:user_id].to_i)

      event.addAttendee(account)
   rescue => e
      response = {:error => {:message => e.message}}
   end

   content_type :json
   response.to_json
end

get '/verbs' do
    content_type :json
    Verb.all.to_json
end

post '/verbs' do
    raise "Incorrect Arguments" if params[:verb].nil?
    Verb.create(:verb => 'params[:verb]')
end

get '/activities' do
    puts params
    puts request
    puts request.body.read
    raise "Incorrect Arguments" if params[:verb].nil?
    v = Verb.first(:verb => params[:verb])
    content_type :json
    Activity.all(:verb => v).to_json
end

post '/activities' do
    raise "Incorrect Arguments" if params[:verb].nil? or params[:activity].nil?
    v = Verb.first(:verb => params[:verb])
    Activity.create(:verb => v, :activity => params[:activity])
end

end
end
