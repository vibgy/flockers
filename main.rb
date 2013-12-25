require 'rubygems'
require 'data_mapper'
require 'sinatra'
require 'haml'
require 'json'
require 'pry-debugger'

DataMapper::Logger.new($stdout, :debug)

DataMapper.setup :default,
                 :adapter => "mysql",
                 :host => "127.0.0.1",
                 :database => 'cf_db_test',
                 :username => "root",
                 :password => ""

DataMapper::Property.auto_validation(false)
DataMapper::Property.required(false)

DataMapper.auto_upgrade!

DataMapper.finalize
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
