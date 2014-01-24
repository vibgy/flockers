
module Flockers
  class WebApp < Sinatra::Application

    get '/activities' do
        raise "Incorrect Arguments" if params[:verb].nil?
        v = Verb.first(:verb => params[:verb])
        content_type :json
        Activity.all(:verb => v).to_json
    end

    post '/activities' do
        raise "Incorrect Arguments" if params[:verb].nil? or params[:activity].nil?
        v = Verb.first(:verb => params[:verb])
        Activity.create(:verb => v, :activity => params[:activity])
    end

    # PUT is not needed as of now

    delete '/activities' do
        raise "Incorrect Arguments" if params[:activity].nil?
        Activity.delete(:activity => params[:activity])
    end

  end
end
