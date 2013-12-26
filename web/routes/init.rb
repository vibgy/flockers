require 'rubygems'
require 'data_mapper'
require 'sinatra'
require 'haml'
require 'json'
require 'pry-debugger'

enable :sessions

get '/home' do
   @he=Event.all
    haml:home
end

post '/login' do 
    @he =Account.first(:uname => params[:user_name], :password => params[:pass]); 
    session['user']=params[:user_name];
    if @he.nil?
     return {:status => 'not success'}.to_json;
    else
    @he.to_json;
    end
end

post '/signout' do
    session['user']='';
    @he=Event.all
    unless @he.nil?
        return {:status => 'success'}.to_json;
    else
        return {:status => 'not success'}.to_json;
    end
end

get '/myEvents.json' do
    @user = session['user'];
    @hm=Event.all(:organizer => session['user'])
    @hm.to_json;
end

get '/loggedIn' do
  @user = session['user'];
  haml :profile
end

post '/createEvent' do
  event = params[:event];
  status = Event.create(:ename => event[:ename],:date => event[:date],:time => event[:time],:place => event[:place],:organizer => session['user'],:fees => event[:fees],:prize => event[:prize],:description =>event[:description]);
 return status;
end

post '/signup' do
     Account.create(:uname => params[:user_name],:password => params[:pass])
end

post '/delete' do
     zoo = Event.first(:id => params[:event_id])
     zoo.destroy
     if zoo.destroyed?
     return {:status => 'success'}.to_json;
     else
     return {:status => 'not_success'}.to_json; 
     end
end
