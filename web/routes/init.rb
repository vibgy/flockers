require 'rubygems'
require 'data_mapper'
require 'sinatra'
require 'haml'
require 'json'
require 'pry'

enable :sessions

enable :sessions


enable :sessions

get '/' do
"Hello World"
end

get '/home' do
   @he=Event.all
   haml:home
end

get '/events' do
   @events = Event.all
   @events.to_json;
end

get '/searchEventByCategory' do
   @hs=Event.all(:category => params[:record])
   if @hs.any?
      data = @hs.to_json;
   else
      data = {:status => 'Failure'}.to_json;
   end
   return data;
end

get '/login' do 
   
 begin 
   
   @he =Account.first(:uname => params[:user_name], :password => params[:pass]); 
   raise "Invalid Username or Password" if @he.nil?
   session['user']=params[:user_name];
   session['userid'] = @he.id;
   response = @he;

   rescue => e
        response = {:error => {:message => e.message}}
   end

   content_type :json
   response.to_json
end

get '/signout' do
   session['user']='';
   session['userid'] = '';
   @he=Event.all
   unless @he.nil?
      return {:status => 'success'}.to_json;
   else
      return {:status => 'not success'}.to_json;
   end
end

get '/myEvents.json' do
   @user = session['user'];
   @hm=Event.all(:account_id => session['userid'])
   @hm.to_json;
end

get '/publicEvents.json' do
   @hm=Event.all
   @hm.to_json;
end

get '/participationID.json' do
   @hm=Participation.all(:account_id => session['userid'],:fields => [:id,:event_id])
   if @hm.any?
      @hm.to_json;
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
   return events.to_json;
end

get '/loggedIn' do
   @user = session['user'];
   @userid = session['userid'];
   haml :profile
end

post '/createEvent' do

   event = params[:event];
   begin 
   zoo = Event.new
   zoo.attributes = { :ename => event[:ename],:date => event[:date],:time => event[:time],:place => event[:place],:account_id => session['userid'],:fees => event[:fees],:prize => event[:prize],:description =>event[:description] }
   if zoo.save
    response = "Success"
   else
    raise "Unable to Create Event"
   end

   rescue => e
   response = {:error => {:message => e.message}}

   end
   content_type :json
   response.to_json
end

post '/signup' do

   begin
   zoo = Account.new
   zoo.attributes = { :uname => params[:user_name],:password => params[:pass] }
 
   if zoo.save
      
   response = "Success"

   else
   raise "Unable to create account" 
   end

  rescue => e
        response = {:error => {:message => e.message}}
   end

   content_type :json
   response.to_json
end

get '/search' do
   @hs=Event.all(:ename => params[:record])
   if @hs.any?
      data = @hs.to_json;
   else
      data = {:status => 'Failure'}.to_json;
   end
   return data;
end

get '/delete' do
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

get '/deleteParticipationEvent' do
   zoo = Participation.first(:event_id => params[:event_id].to_i)
   zoo.destroy
   if zoo.destroyed?
      return {:status => 'success'}.to_json;
   else
      return {:status => 'not_success'}.to_json; 
   end
end

post '/participate' do
   #Participation.create(:event_id => params[:event],:user_id => params[:user_name]);
   begin 
   zoo = Participation.new
   zoo.attributes = { :event_id => params[:event],:account_id => params[:user_id] }
   if zoo.save
    response = "Success"
   else
    raise "Unable to Participate"
   end

   rescue => e
   response = {:error => {:message => e.message}}

   end
   content_type :json
   response.to_json


end
