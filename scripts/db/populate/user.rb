def populate_users!

    di = Verb.create(:verb => 'discuss')
    en = Verb.create(:verb => 'enjoy')
    pl = Verb.create(:verb => 'play')
    pr = Verb.create(:verb => 'practice')
    st = Verb.create(:verb => 'study')
    tr = Verb.create(:verb => 'travel')

    di.activities << Activity.create(:activity => 'politics')
    en.activities << Activity.create(:activity => 'movie')
    en.activities << Activity.create(:activity => 'laser-tag')
    pl.activities << Activity.create(:activity => 'basketball')
    pl.activities << Activity.create(:activity => 'cricket')
    pr.activities << Activity.create(:activity => 'guitar')
    pr.activities << Activity.create(:activity => 'dance')
    st.activities << Activity.create(:activity => 'physics')
    st.activities << Activity.create(:activity => 'engines')
    tr.activities << Activity.create(:activity => 'day-trip')
    tr.activities << Activity.create(:activity => 'weekend-trip')

    di.save
    en.save
    pl.save
    pr.save
    st.save
    tr.save

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

