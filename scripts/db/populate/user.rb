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

    a1= Account.create_account(:uname => 'gnolkha@gmail.com',
             :password => 'gaurav');
		a2 = Account.create_account(:uname => 'gnolkha2@gmail.com',
             :password => 'gaurav')
		a3 = Account.create_account(:uname => 'gnolkha3@gmail.com',
             :password => 'gaurav')
    a4 = Account.create_account(:uname => 'gnolkha4@gmail.com',
             :password => 'gaurav')
    a5 = Account.create_account(:uname => 'gnolkha5@gmail.com',
             :password => 'gaurav')
    a6 = Account.create_account(:uname => 'gnolkha6@gmail.com',
             :password => 'gaurav')
    a7 = Account.create_account(:uname => 'gnolkha7@gmail.com',
             :password => 'gaurav')
    a8 = Account.create_account(:uname => 'gnolkha8@gmail.com',
             :password => 'gaurav')
    a9 = Account.create_account(:uname => 'gnolkha9@gmail.com',
             :password => 'gaurav')
    a10 = Account.create_account(:uname => 'gnolkha10@gmail.com',
             :password => 'gaurav')
    b = Account.create_account(:uname => 'bansalp83@gmail.com',
             :password => 'pooja')
    c = Event.createEvent(:account_id => 1,
             :ename => 'Hong Kong Sixes 2',
             :date => '2014-05-14',
             :time => Time.now,
             :place => '6105 NE Alder Way',
             :organizer => 'gnolkha@gmail.com',
             :fees => 500,
             :description => "Cricket Match For MNIT Alumni",
             :category => "play",
             :activity => 'Cricket')
    d =  Event.createEvent(:account_id => 1,
             :ename => 'Exam Preparation 1 ',
             :date => '2014-02-24',
             :time => Time.now,
             :place => 'Library',
             :organizer => 'gnolkha@gmail.com',
             :fees => 0,
             :prize => 20000,
             :prize => 0,
             :description => "Group study for mid term examinations",
             :category => "study",
             :activity => 'Books')
		f =  Event.createEvent(:account_id => 1,
             :ename => 'Exam Preparation 1 ',
             :date => '2014-02-24',
             :time => Time.now,
             :place => 'Library',
             :organizer => 'gnolkha@gmail.com',
             :fees => 0,
             :prize => 0,
             :description => "Group study for mid term examinations",
             :category => "study",
             :activity => 'Books')
		g =  Event.createEvent(:account_id => 1,
             :ename => 'Exam Preparation 1 ',
             :date => '2014-02-24',
             :time => Time.now,
             :place => 'Library',
             :organizer => 'gnolkha@gmail.com',
             :fees => 0,
             :prize => 0,
             :description => "Group study for mid term examinations",
             :category => "study",
             :activity => 'Books')
		h =  Event.createEvent(:account_id => 1,
             :ename => 'Exam Preparation 1 ',
             :date => '2014-02-24',
             :time => Time.now,
             :place => 'Library',
             :organizer => 'gnolkha@gmail.com',
             :fees => 0,
             :prize => 0,
             :description => "Group study for mid term examinations",
             :category => "study",
             :activity => 'Books')
		i =  Event.createEvent(:account_id => 1,
             :ename => 'Exam Preparation 1 ',
             :date => '2014-02-24',
             :time => Time.now,
             :place => 'Library',
             :organizer => 'gnolkha@gmail.com',
             :fees => 0,
             :prize => 0,
             :description => "Group study for mid term examinations",
             :category => "study",
             :activity => 'Books')
		j =  Event.createEvent(:account_id => 1,
             :ename => 'Exam Preparation 1 ',
             :date => '2014-02-24',
             :time => Time.now,
             :place => 'Library',
             :organizer => 'gnolkha@gmail.com',
             :fees => 0,
             :prize => 0,
             :description => "Group study for mid term examinations",
             :category => "study",
             :activity => 'Books')
		k =  Event.createEvent(:account_id => 1,
             :ename => 'Exam Preparation 1 ',
             :date => '2014-02-24',
             :time => Time.now,
             :place => 'Library',
             :organizer => 'gnolkha@gmail.com',
             :fees => 0,
             :prize => 0,
             :description => "Group study for mid term examinations",
             :category => "study",
             :activity => 'Books')
		l =  Event.createEvent(:account_id => 1,
             :ename => 'Exam Preparation 1 ',
             :date => '2014-02-24',
             :time => Time.now,
             :place => 'Library',
             :organizer => 'gnolkha@gmail.com',
             :fees => 0,
             :prize => 0,
             :description => "Group study for mid term examinations",
             :category => "study",
             :activity => 'Books')
		m =  Event.createEvent(:account_id => 1,
             :ename => 'Exam Preparation 1 ',
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
             
             		
		d.addAttendee(b);
		j.addAttendee(b);	
    f.addAttendee(b);
    g.addAttendee(b);
    h.addAttendee(b);
    i.addAttendee(b);
    k.addAttendee(b);
    l.addAttendee(b);
    m.addAttendee(b);
    e.addAttendee(a1);
    c.addAttendee(b);
		c.addAttendee(a2);
		c.addAttendee(a3);
		c.addAttendee(a4);
		c.addAttendee(a5);
		c.addAttendee(a6);
		c.addAttendee(a7);
		c.addAttendee(a8);
		c.addAttendee(a9);
		c.addAttendee(a10);   
end
