source 'https://rubygems.org'

gem 'data_mapper'
gem 'sinatra'
gem 'rack'
gem 'rake'
gem 'haml'
gem 'json'
gem 'thin'
#gem 'dalli'
gem 'dm-zone-types'
gem 'dm-mysql-adapter'
#gem 'newrelic_rpm'

group :development, :test do
  gem 'pry-debugger'
  #gem 'pry-stack_explorer'
  gem 'pry'
end

group :test do
  gem 'rack-test'
  gem 'rspec'
end

# This is required for heroku deployment; postgresql
group :production do
  gem 'pg'
  gem 'dm-postgres-adapter'
end
