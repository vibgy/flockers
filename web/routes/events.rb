require_relative '../helpers/init.rb'

module Flockers
  class WebApp < Sinatra::Application

    get '/events' do                          #event_id from participation table
      # this can be a lot - we can atleast restrict it to future events
      events = Event.all
      content_type :json
      events.to_json
    end

    get '/events/searchByVerb' do
       data = Event.all('verb.like' => params[:record])
       data = {:status => 'Failure'} if data.nil?
       content_type :json
       data.to_json
    end

    get '/events/searchByActivity' do
       data = Event.all('activity.like' => params[:record])
       data = {:status => 'Failure'} if data.nil?
       content_type :json
       data.to_json
    end

    get '/events/searchByName' do
       data = Event.all('ename.like' => params[:record])
       data = {:status => 'Failure'} if data.nil?
       content_type :json
       data.to_json
    end

    get '/events/public' do
      # TODO: Need to limit this to future events vs past events ? or may be all public events is fine.
      hm=Event.all
      content_type :json
      hm.to_json
    end
    
    get '/event/participants' do
	   begin
	   	   response={}
		   event = Event.first(:id => params[:event_id])
		   participantId = event.participations
		   participant=[]
		   participantId.each do |i|
		   		account=Account.first(:id => i.account_id)
		   		participant.push(account.uname)
	   	   end
	   	   response["uname"]=participant
	   	   raise "No Participants" if response["uname"].empty?
	   rescue => e
          response = {:error => {:message => e.message}}
       end
       content_type :json
	   response.to_json
    end

    # TODO: 
    get '/events/top' do                        #event_details of top events
      events = Event.all
      content_type :json
      events.to_json
    end

    # BIG NOTE - this should always be the last route
    # otherwise any other /events/xyz route will not work
    # Sinatra always matches routes serially
    get '/events/:id' do                          #event_id from participation table
      # this can be a lot - we can atleast restrict it to future events
      events = Event.first(:id => params[:id])
      content_type :json
      events.to_json
    end

  end
end
