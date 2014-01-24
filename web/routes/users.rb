module Flockers
  class WebApp < Sinatra::Application

    get '/users/top' do                        #account_details of top participants
      raise "Auth Failure" unless loggedIn?
      events = Account.all(:)
      content_type :json
      participants.to_json
    end

    get '/users/events' do
      raise "Auth Failure" if session['user'].nil? or session['user'] == ''
      hm=Event.all(:account_id => session['userid'])
      content_type :json
      hm.to_json;
    end

end
end