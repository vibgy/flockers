# This is based upon the template I found here:
# https://github.com/zapnap/sinatra-template/blob/master/environment.rb
# (MIT License)

require 'rubygems'
require 'bundler/setup'
require 'dm-core'
require 'dm-validations'
require 'dm-aggregates'
require 'dm-migrations'
require 'dm-types'
require 'dm-timestamps'
require 'dm-zone-types'
require 'dm-transactions'
require 'haml'
require 'ostruct'
require 'rack'
#require 'rack/recaptcha'
#require 'pry' unless ENV['RACK_ENV'] == 'production'
#require 'mail'

require_relative 'scripts/db/connect.rb'
#require_relative 'scripts/mail/service_email.rb'

require 'sinatra' unless defined?(Sinatra)

Root = ::File.dirname(__FILE__) unless defined?(Root)

configure do

  # NOTE: This is the timezone of the server.  It must match the timezone
  # defined for the ZonedTime DataMapper type.  It's simplest to not change
  # this value.  Thinking about time is hard; let's pretend we live in Grenich!
  ENV['TZ'] = 'UTC'

  SiteConfig = OpenStruct.new(
                 :title => 'Flockers',
                 :author => 'SwiftDay LLC',
                 :url_base => 'http://flockers-staging.herokuapp.com/',
                 :email_base => '@mail.swiftday.com',
                 :maintainer_email => "david.antler@gmail.com"
               )

  # load models
  require_relative 'models/init.rb'

  ext = 'test' unless ENV['RACK_ENV']

  db_setup!

  # Start mail script
  # TODO: Start mail script from procfile
  # require_relative 'scripts/mail/receive.rb' if production?
end

