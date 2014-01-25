require_relative '../helpers/init.rb'

module Flockers
  class WebApp < Sinatra::Application

    get '/users/events' do
      raise "Auth Failure" unless loggedIn

      user = Account.first(:id => params[:user_id].to_i)
      events = user.events
      events << user.participatedEvents

      content_type :json
      events.to_json
    end

    post '/users/events' do
       begin 
          raise "Auth Failure" unless loggedIn
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

    put '/users/events' do
       begin 
          raise "Auth Failure" unless loggedIn
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

    delete '/users/events' do
       zoo = Event.first(:id => params[:event_id].to_i)
       zoo.destroy
       if zoo.destroyed?
          return {:status => 'success'}.to_json;
       else
          return {:status => 'not_success'}.to_json; 
       end
    end

end
end