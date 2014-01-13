def populate_users!


    a = Account.create_account(:uname => 'gnolkha@gmail.com',
             :password => 'gaurav')


     b = Account.create_account(:uname => 'bansalp83@gmail.com',
             :password => 'pooja')


    c = Event.createEvent(:account_id => 1,
             :ename => 'Hong Kong Sixes',
             :date => '2014-05-14',
             :time => Time.now,
             :place => '6105 NE Alder Way',
             :organizer => 'gnolkha@gmail.com',
             :fees => 500,
             :prize => 20000,
             :description => "Cricket Match For MNIT Alumni",
             :category => "play",
             :activity => 'Cricket')
    d =  Event.createEvent(:account_id => 1,
             :ename => 'Exam Preparation',
             :date => '2014-02-24',
             :time => Time.now,
             :place => 'Library',
             :organizer => 'gnolkha@gmail.com',
             :fees => 0,
             :prize => 0,
             :description => "Group study for mid term examinations",
             :category => "study",
             :activity => 'Books')

    e =  Event.createEvent(:account_id => 2,
             :ename => 'MNIT Marathon',
             :date => '2014-01-26',
             :time => Time.now,
             :place => 'Jaipur',
             :organizer => 'bansalp83@gmail.com',
             :fees => 0,
             :prize => 1000,
             :description => "Marathon for MNIT on Republic Day",
             :category => "enjoy",
             :activity => 'Marathon')


    e.addAttendee(a)
   
end

