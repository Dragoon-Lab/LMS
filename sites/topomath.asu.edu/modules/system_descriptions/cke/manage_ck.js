jQuery(document).ready(function($){

	$('#add_desc_button').on("click",function(e){
		console.log("submit button clicked");
		//avert the button submit
		e.preventDefault();
		$('#desc_name_error').hide();
		$('#desc_content_error').hide();
		var nameEmpty = $('#sys_desc_name').val();
		var descEmpty = $('#editor_test').val();
		if(nameEmpty === ""){
			$('#desc_name_error').show();
			return;
		}
		if(descEmpty === ""){
			$('#desc_content_error').show();
			return;
		}
		var user = $('#user_name').val();
		var folder = $('#folder_name').val();
		var problem = $('#problem_name').val();
		var section = $('#section_name').val()
		var name = $('#sys_desc_name').val();
		var input = {
			u: user,
			f: folder,
			p: problem,
			s: section,
			n: name,
			req_type: "newDesc",
			save_file: true,
			c: descEmpty,
			path: Date.now()+name+".html",
			desc_type: "cketext"
		}
		console.log("new desc data", input);
		$.ajax({
			type: 'POST',
			url: '../static/sysDescUpdates.php',
			data: input,
			success: function(datum){ 
				console.log("received", datum); 
				window.open('desc_done.php?sysupdate=created','_self');
			}
		});

	});

	$('#update_desc_button').on("click",function(e){
		e.preventDefault();
		$('#desc_content_error').hide();
		var descEmpty = $('#editor_test').val();
		if(descEmpty === ""){
			$('#desc_content_error').show();
			return;
		}
		var pname = $('#problem_path').val();
		console.log("problem path", pname);
		var input = {
			c: descEmpty,
			p: pname,
			req_type: "updateDesc"
		}
		console.log("input is", input);
		$.ajax({
			type: 'POST',
			url: '../static/sysDescUpdates.php',
			data: input,
			success: function(datum){ 
				console.log("received", datum); 
				window.open('desc_done.php?sysupdate=updated','_self');
			}
		});

	});

});