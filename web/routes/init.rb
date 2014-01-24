require 'rubygems'
require 'data_mapper'
require 'sinatra'
require 'haml'
require 'json'
#require 'pry'

enable :sessions

require_relative 'sessions.rb'
require_relative 'users.rb'
require_relative 'events.rb'
require_relative 'usersEvents.rb'
require_relative 'verbs.rb'
require_relative 'activities.rb'