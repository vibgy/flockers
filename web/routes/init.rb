require 'rubygems'
require 'data_mapper'
require 'sinatra'
require 'haml'
require 'json'
#require 'pry'

enable :sessions

get '/' do
"Hello World"
end

get '/bar' do
  haml :ar
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

get '/publicEvents.json' do
    @hm=Event.all
    @hm.to_json;
end

get '/participationID.json' do
    @hm=Participation.all(:user_id => session['user'],:fields => [:id,:event_id])
    if @hm.any?
    @hm.to_json;
    else 
    {:status => 'Failure'}.to_json;
    end
    #binding.pry
end

post '/participationEvents.json' do
    array=params[:event]
    events = Array.new
    array.each do |i|
	  events << Event.first(:id => i.to_i)
          #binding.pry
    end
    return events.to_json;
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

post '/search' do
    @hs=Event.all(:ename => params[:record])

    if @hs.any?
        data = @hs.to_json;
    else
        data = {:status => 'Failure'}.to_json;
    end
    return data;
end

post '/delete' do
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

post '/deleteParticipationEvent' do
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
 zoo = Participation.new
 zoo.attributes = { :event_id => params[:event],:user_id => params[:user_name] }
 zoo.save
end
