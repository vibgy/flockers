# makemyday.rb
# The main function.  This is required for use by rackup for full deployment.

require 'sinatra'
require 'newrelic_rpm' if production?

module Flockers
  class WebApp < Sinatra::Application

    set :root, ::File.join(Root, 'web')

    configure :production do
      # Force SSL in this app at all times.
      #require 'rack/ssl-enforcer'
      #use Rack::SslEnforcer

      set :logging, true
    end

    configure :development do
      set :logging, true
      set :dump_errors, true
    end

    configure :test do
      set :logging, false
      set :dump_errors, true
    end

    helpers do
      include Rack::Utils
      alias_method :h, :escape_html
    end

  end
end

require_relative 'helpers/init.rb'
require_relative 'routes/init.rb'
