(function ($){
	$(document).ready(function(){
		$('.dragoon_problem').click(showForm);
		$('.dragoon_nc_problem').click(showForm);
		$('#submit_button').click(function(event){
			event.preventDefault();
			submitForm();
		});
	});

	var submitForm = function(){
		var form = document.forms['create_assignment_form'];
		if(form.create_session.value){
			var g = form.g && form.g.value ? form.g.value : "";
			var result = createSession(form.p.value, form.s.value, g);
			form.create_session.value += result;
		}

		form.submit();
	};

	var showForm = function(event){
		var form = document.forms['create_assignment_form'];
		form.s.value = $("#section").val();
		var id = "#" + event.target.id;
		form.problem.value = $(id).attr('key');
		form.pname.value = $(id).attr('key');

		form.p.value =$(id).attr('value');
		form.cc.value = $('#code').val();
		if($(event.target).attr("class").indexOf("nc") > -1){
			updateGroup(event);
			form.create_session.value = true;
		} else {
			form.create_session.value = false;
		}
	};

	var createSession = function(p, s, g){
		var u = $("#userName").val();
		//var url = "http://localhost/code/global.php";
		var url = $("#dragoon_url").val()+"global.php";
		$.ajax({
			type: "POST",
			url: url,
			data: {
				'u': u,
				'p': p,
				's': s,
				'g': g,
				't': "copyNCModelToSection"
			},
			async: false,
			success: function(data){
				if(data.error){
					console.log(data);
					alert("Something went wrong we are trying to fix it");
				}
				return data;
			},
			error: function(data){
				console.log(data);
				return data;
			}

		});
	};

	var updateGroup = function(event){
		var form = document.forms['create_assignment_form'];
		var id = "#" + event.target.id;
		var user = $("#userName").val();

		var group_name = $(id).closest('.accordion').find('h2:first').text();
		if(group_name == "private"){
			group_name = user+"-private";
		} else {
			var group_owner = group_name.split('by');
			if(group_owner.length>1){
				group_name = group_owner[0].trim()+"-"+group_owner[1].trim();
			} else {
				group_name = group_name + "-" + user;
			}
		}
		form.g.value = group_name;
	};
})(jQuery);
