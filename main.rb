require 'rubygems'
require 'data_mapper'
require 'dm-sqlite-adapter'
require 'sinatra'
require 'haml'

DataMapper::Logger.new($stdout, :debug)

DataMapper.setup(:default, "mysql://root:pooja@localhost/flockers")

DataMapper::Property.auto_validation(false)
DataMapper::Property.required(false)

class Account 
	include DataMapper::Resource
	property :id, 	Serial 	# Required in all DM classes coming from d
	property :uname, String, :required => true
	property :password, String, :required => true
        
end

class Event
       include DataMapper::Resource
       property :id, 	Serial 	# Required in all DM classes coming from d
       property :ename, String, :required => true
       property :date, Date
       property :time, Time
       property :place, String
       property :organizer, String
       property :fees,Integer
       property :prize, Integer
       property :description,String
end
DataMapper.auto_upgrade!

DataMapper.finalize
enable :sessions

get '/main' do
@he=Event.all
haml:main
end

post '/insert' do
Account.create(:uname => params[:ffname],:password => params[:ppwd])
end

post '/login1' do 
    @he =Account.first(:uname => params[:user_name], :password => params[:pass]); 
    session['user']=@he.uname;
    @he.to_json;
end

post '/logout' do
    session['user'] = ''
end	
post '/login12' do 
    @he =Account.first(:uname => params[:user_name], :password => params[:pass]).uname;
    session['user']=@he;
    @he=Event.all(:organizer => session['user']);
    @he.to_json;
end

post '/insrt' do
Event.create(:ename => params[:eename],:date => params[:ddat],:time => params[:ttim],:place => params[:pplac],:organizer => session['user'],:fees => params[:ffees],:prize => params[:pprze],:description =>params[:ddescrption])
end

post '/check' do
@check=Account.first[:uname => params[:uunme],:password => params[:ppass]]
end
