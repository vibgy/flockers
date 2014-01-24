require 'pry'
require 'sinatra'
require_relative '../helpers/init.rb'

module Flockers
  class WebApp < Sinatra::Application

    get '/users/top' do                        #account_details of top participants
      accounts = Account.all
      content_type :json
      accounts.to_json
    end

    get '/users/events' do
      raise "Auth Failure" unless loggedIn
      hm=Event.all(:account_id => session['userid'])
      content_type :json
      hm.to_json;
    end

end
end