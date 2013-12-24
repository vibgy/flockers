function login(user,pas)
{
    document.getElementById("InvalidUser").style.visibility="hidden";
    document.getElementById("Welcome").style.visibility="hidden";
    $.post("/login",
          {user_name : user, pass : pas},
          function(data)
          {
             data = JSON.parse(data);
             if(data.status == 'not success')
             {
                 document.getElementById("InvalidUser").style.visibility="visible";
             }
             else
             {
                 $.get('/loggedIn');
             }
	  }
          );  
    return false;
}

