function insert12(user,pas)
  {
  $.post("/login1",{user_name:user,pass:pas},function(data){
  if(data==""){
  alert("unsuccesful login");
  }
  else{
  $.post("/login12",{user_name:user,pass:pas},function(data){
  demoVisibility1();
  $("#show12").html('<button class="btn btn-primary btn-lg" id="show12" onclick = "logout()">Sign OUT</button>');
  $("#show1").html("");
  $("#show1").html($("#show1").html()+'<div class="row">');
  for (var i=0, len=data.length; i < len; i++){
  $("#show1").html($("#show1").html()+'<div class="col-md-4">'+
  '<h2>'+data[i].ename+'</h2>'+
  '<p>'+data[i].description+'</p>'+
  '<p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>'+
  '</div>');
  }
  $("#show1").html($("#show1").html()+'</div>'+
  '<hr>');
  $("#show1").html($("#show1").html()+'<footer>'+
  '<p>&copy; Company 2013</p>'+
  '</footer>');
  },"json");
  return false;
  }
  //here data is variable that is coming from back   
  },"json");
  return false;
  }
function logout()
  {
  $.post("/logout",function(data){
  $("#show12").html('<button class="btn btn-primary btn-lg" id="show"  data-toggle="modal" data-target="#myModal">Sign In</button>');
  $("#show1").html("");
  demoVisibility4();
  })	
  }
function demoVisibility1()
  {
  document.getElementById("show1").style.visibility="visible";
  demoVisibility3();
  }
function demoVisibility3()
  {
  document.getElementById("b1").style.visibility="visible";
  }
function demoVisibility4()
  {
  document.getElementById("b1").style.visibility="hidden";
  }
  
