# db_connect.rb
# This file manages your connection to the database

#
# This function is used to setup the database a certain way depending upon 
# platform as well as the RACK_ENV environment variable.
#
def db_setup!

  case ENV['RACK_ENV']
  when 'production'
    # Lets just finish here if production
    require 'dm-postgres-adapter'

    puts "!!!CONNECTING TO PRODUCTION DATABASE!!!"
    puts "URL: #{ENV['DATABASE_URL']}"
    DataMapper::setup :default, "#{ENV['DATABASE_URL']}"

    return

  when /test/
    ext = 'test'
  when 'development'
    ext = 'dev'
    DataMapper::Logger.new($stdout, :debug)
  else
    puts 'Defaulting to dev db'
    ext = 'dev'
    DataMapper::Logger.new($stdout, :debug)
  end

  #
  # A small attempt at making this cross platform where we assume Windows uses
  # MySQLite3, which is just a file you can drop inside system32.  The setup
  #

  # if RUBY_PLATFORM =~ /(win|w)32$/
  if true

    #require 'dm-sqlite-adapter'

    #DataMapper.setup(:default, (ENV["DATABASE_URL"] || "sqlite3:///#{File.expand_path(File.dirname(__FILE__))}/#{ext}.db"))

    #this is what worked on windows for MySQL
    #http://blog.mmediasys.com/2011/07/07/installing-mysql-on-windows-7-x64-and-using-ruby-with-it/
    require 'dm-mysql-adapter'

    puts "connecting to mysql database cf_db_#{ext}"

    DataMapper.setup :default,
                     :adapter => "mysql",
                     :host => "127.0.0.1",
                     :database => 'cf_db_'+ext,
                     :username => "root",
                     :password => ""

    return
  end

  if RUBY_PLATFORM =~ /(win|w)32$/
    require 'dm-postgres-adapter'

    puts "connecting to postgres database cf_db_#{ext}"

    DataMapper.setup :default,
                     :adapter => "postgres",
                     :host => "127.0.0.1",
                     :database => 'cf_db_'+ext,
                     :username => "postgres",
                     :password => ""

  else


    # If the user is :)
    if ENV['USER'] == 'Maximus' || ENV['USER'] == 'maxims'

      require 'dm-mysql-adapter'
      DataMapper.setup :default,
                       :adapter => "mysql",
                       :host => "localhost",
                       :database => 'test_'+ext,
                       :username => "",
                       :password => ""

    else

      require 'dm-mysql-adapter'
      puts "connecting to mysql database cf_db_#{ext}"

      DataMapper.setup :default,
                       :adapter => "mysql",
                       :host => "localhost",
                       :database => "cf_db_"+ext,
                       :username => "da",
                       :password => ""
    end
  end

end

