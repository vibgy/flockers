Bundler.require

Root = ::File.dirname(__FILE__) unless defined?(Root)
require ::File.join( Root, 'environment.rb')
require ::File.join( Root, 'web/app.rb' ) unless defined?(Flockers::WebApp)
#require ::File.join( Root, 'http_api/app.rb' ) unless defined?(Flockers::HttpAPI)

# A shared session/memcache for all Sinatra::Applications running in
# this instance.  This is a type of server-side session.

class Sinatra::Application
  #require "dalli"
  #require "rack/session/dalli"

  #use Rack::Session::Dalli
end

run Rack::URLMap.new({
  #"/api/v1"   => Swiftday::HttpAPI,
  "/"         => Flockers::WebApp
})


