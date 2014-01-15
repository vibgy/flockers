require 'sinatra'

module Flockers
  class WebApp < Sinatra::Application
  helpers do

    #
    # Renders a haml partial
    #
    def haml_partial(template, locals = {})
      haml(('_' + template.to_s).to_sym, :locals => locals)
    end

    #
    # Retrieves haml plaintext from partials folder
    #
    def get_haml file
        f = ::File.join( Root, '/web/views/'+file+'.haml')
        file = File.open(f, "rb")
        haml = file.read
        file.close
        haml
    end

    #
    # This method generates the proper HAML with the correct active components
    #
    def haml_activate text, *active
    
        return haml_partial text if active.empty? or active.nil?
    
        h = get_haml(text.to_s).split("\n")
    
        #
        # We need to search for the 'active' terms by line and
        # make them active via CSS
        #
        h.count.times do |n|
            active.each do |a|
                if h[n].include? a.to_s
    
                    #
                    # Try to make prev list item active
                    #
                    
                    success = false
    
                    (n-1).times do |x|
                        m = (n-1) - x
                        if h[m].include? '%li' 
                            h[m].gsub! /%li/, '%li.active'
                            success = true
                            break
                        end
                    end
    
                    if success == false
                        puts "Failed to activate element #{a.to_s}!"
                    else
                        next
                    end
                end
            end
        end
        haml h.join("\n").to_s
    end

    def loggedIn
      @user = session['user'];
      @userid = session['userid'];
      return false if session['user'].nil? or session['user'] == ''
      return true
    end

  end
  end
end

