# This rakefile based heavily upon one I found here:
# https://github.com/zapnap/sinatra-template
# (MIT License)

require 'rubygems'
require 'bundler/setup'
#require 'rspec/core/rake_task' unless ENV['RACK_ENV'] == 'production'

task :default => :test
task :test => [:'set_env:test', :spec]


if !defined?(RSpec)
  puts "spec targets require RSpec"
else
  desc "Run all rspec tests (or provide a specific file as an argument)"
  RSpec::Core::RakeTask.new(:spec, :file) do |t, args|
    str = args[:file] || ''
    str += '*' unless str.empty?
    t.pattern = "test/**/*#{str}_spec.rb"
    puts t.pattern
    if RUBY_PLATFORM =~ /(win|w)32$/
       t.rspec_opts = ['-fs']
    else
       t.rspec_opts = ['-cfs']
    end
  end
end

desc 'Start an interactive test shell'
task :shell => [:'set_env:dev', :environment] do
  require 'pry'
  IRB = Pry
  ARGV.clear
  IRB.start
end

desc 'Launch a local demo'
task :demo do
    system 'rackup'
end

desc 'Start within rdebug'
task :debug do
    system 'rdebug rackup'
end

namespace :db do
  desc 'Auto-migrate the database (destroys data)'
  task :migrate => :environment do
    DataMapper.auto_migrate!
  end

  desc 'Auto-upgrade the database (preserves data)'
  task :upgrade => :environment do
    DataMapper.auto_upgrade!
  end

  desc 'Populate the database with fresh data!'
  task :populate => :environment do

    require_relative 'scripts/db/populate/user.rb'

    puts 'Populating the database...'
    populate_users!
    puts 'done!'
  end

end

# These are used to force a particular environment.  Default is development.
namespace :set_env do
  task :dev  do ENV['RACK_ENV'] = 'development' end
  task :prod do ENV['RACK_ENV'] = 'production' end
  task :test do ENV['RACK_ENV'] = 'testing' end
end


task :environment do
  require_relative 'environment'
end

