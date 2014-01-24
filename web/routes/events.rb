module Flockers
  class WebApp < Sinatra::Application

    get '/events' do                          #event_id from participation table
      # this can be a lot - we can atleast restrict it to future events
      events = Event.all
      content_type :json
      events.to_json;
    end

    post '/events' do

      raise "Auth Failure" unless loggedIn?
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

    delete '/events' do
      # Only the organizer can do this
      # Not allowed right now.. need to figure out policy to let the other users know
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

    # TODO: 
    get '/events/top' do                        #event_details of top events
      events = Event.all(:attendees.gt => 1)
      content_type :json
      events.to_json
    end

  end
end