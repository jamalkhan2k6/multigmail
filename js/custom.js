const remote = require('electron').remote;
const Store = require('electron-store');
const store = new Store();


var email_list = {};

if(store.has('email_list')){
	email_list = store.get('email_list');
}

var email_total = Object.keys(email_list).length;

console.log(email_total);
console.log(email_list);


$(document).ready(function(){

	if(email_total == 0){
		$("#blank").show();
	}

	var context_menu_selected = $("body");

	for(var k in email_list) {
	   console.log(email_list[k]);

		$("#tabs").find("a").removeClass("active");
		$("#tabs").append("<a href='#' class='active' data-tab='"+email_list[k].id+"'>"+email_list[k].name+"</a>");

		let url = "<webview id='"+email_list[k].id+"' class='webview' src='https://accounts.google.com/ServiceLogin?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail' partition='persist:"+email_list[k].id+"' allowpopups></webview>";

		$("#gmail_wrapper").append(url);
		$("#blank").hide();

	}



	$("#tabs").on("click", "a", function(e){
		e.preventDefault();
		let tab = $(this).attr("data-tab");


		$("#tabs").find("a").removeClass("active");
		$(this).addClass("active");

		$("#gmail_wrapper").find(".webview").hide();
		$("#gmail_wrapper").find("#" + tab).show();
	

		// console.log(1111);
	});



	// const webview = document.querySelector('webview');
	//   webview.addEventListener('page-title-updated', (e) => {
	//     console.log('Guest page logged a message:', e.title);
	//   });

	$("webview").on('page-title-updated', function(e){
		console.log('Guest page logged a message:', e.originalEvent.title);
		let id = $(this).attr("id");
		
		if(e.originalEvent.title != "Gmail"){
			$("#tabs").find("[data-tab='" + id + "']").html(e.originalEvent.title);
		}
		
	});



	$( "#tabs" ).on( "contextmenu", "a", function(e) {
		  $("#context_menu").css({"top": e.pageY, "left" : e.pageX}).show();
		  context_menu_selected = $(this);
	});


	$('body').click(function(evt){ 

	       if(evt.target.id == "context_menu"){
	          return;
	       }
	       
	       if($(evt.target).closest('#context_menu').length){
	          return;             
	       }

	   	$("#context_menu").hide();

	});


	$("#context_menu").on("click", "a.cont_delete", function(e){

		e.preventDefault();
		var r = confirm("Are you sure?");
		if (r == true) {
			var tab = context_menu_selected.attr("data-tab");
			$("#" + tab).remove();
			context_menu_selected.remove();
			console.log(tab);
		}

		//returns array after traversing through all json
		for (key in email_list) {
		    if (email_list.hasOwnProperty(key) && email_list[key].id == tab) {
		        delete email_list[key];
		    }
		}

		// email_list = filtered;
		console.log(email_list);
		store.set('email_list', email_list);
		$("#context_menu").hide();

	});



	$("#context_menu").on("click", "a.cont_edit", function(e){

		e.preventDefault();
		var old_name = context_menu_selected.html();

		vex.dialog.prompt({
		    message: 'Enter a name for this tab?',
		    placeholder: old_name,
		    callback: function (new_name) {

		        		if (new_name != "") {

							for (key in email_list) {
							    if (email_list.hasOwnProperty(key) && email_list[key].name == old_name) {
							         email_list[key].name = new_name;
							    }
							}
						    store.set('email_list', email_list);
						    context_menu_selected.html(new_name);	
						}//end if

		    }//ends callback
		});

		console.log(email_list);
		$("#context_menu").hide();

	});





	$("#blank").on("click", "a", function(e){
		addNewEmail($, email_total);
	});


	$("#tabs").on("click", ".plus", function(e){
		addNewEmail($, email_total);
	});


});



//total is the existing number of emails, just for unique ids
function addNewEmail($, total){
		
		if(store.has('email_list')){
			var data = store.get('email_list');
		}else{
			var data = {};	
		}

		//unique random number
		var ts = Math.round((new Date()).getTime() / 1000);

		data[total] = {"name" : "email" + total, "id" : "webview" + ts};
		store.set('email_list', data);

		$("#tabs").find("a").removeClass("active");
		$("#tabs").append("<a href='#' class='active' data-tab='"+data[total].id+"'>"+data[total].name+"</a>");

		let url = "<webview id='"+data[total].id+"' class='webview' src='https://accounts.google.com/ServiceLogin?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail' partition='persist:"+data[total].id+"' allowpopups></webview>";

		$("#gmail_wrapper").append(url);
		$("#blank").hide();





}