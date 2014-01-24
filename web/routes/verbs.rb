module Flockers
  class WebApp < Sinatra::Application

    get '/verbs' do
        content_type :json
        Verb.all.to_json
    end

    post '/verbs' do
        raise "Incorrect Arguments" if params[:verb].nil?
        Verb.create(:verb => 'params[:verb]')
    end

    # PUT is not needed as of now

    delete '/verbs' do
        raise "Incorrect Arguments" if params[:verb].nil?
        Verb.delete(:verb => params[:verb])
    end

  end
end