jQuery(document).ready(function($){
	var upload_dir = '/dragoon/lms/topomath-sysdesc-uploads/';
	var cke_path = "/?q=sysdescs";
	var sd_update_handler = "sites/topomath.asu.edu/modules/system_descriptions/static/sysDescUpdates.php";
	//handle descriptions button
	$('#open_sysdescmodal').on("click",function(e){

		//avert the button submit
		e.preventDefault();
		//step 1: open the modal
		$('#handleSystemDesc').modal('show');
		$('#sysDesc-error-box').html('');
		//show descriptions for the problem as a list
		//each description should be viewable and have edit/delete options as well.
		console.log("loading system descriptions");
		update_desc_list();
	});

	//file upload ajax handler
	$('.upload-btn').on('click', function (){
		$('#upload-input').click();
		$('.progress-bar').text('0%');
		$('.progress-bar').width('0%');
	});

	$('#upload-input').on('change', function(){

		var files = $(this).get(0).files;
		console.log("files array is", files);
		if (files.length > 0){
			// create a FormData object which will be sent as the data payload in the
			// AJAX request
			var form_data = new FormData();
			var file_name = ''; var path_name = '';
			var file_valid = true;
			var file = files[0];
			file_name = file.name;
			path_name = Date.now()+file_name;
			form_data.append(0, file);
			file_valid = file_validations(file);
			if(file_valid){
			$.when(check_duplication(file)).done(function(dup_check){
				if(dup_check == '1'){
					$.ajax({
						url: 'sites/topomath.asu.edu/modules/system_descriptions/static/submit.php?files&path='+path_name,
						type: 'POST',
						data: form_data,
						processData: false,
						contentType: false,
						success: function(data){
							console.log('upload successful!\n' + data);
						},
						xhr: function(){
							// create an XMLHttpRequest
							var xhr = new XMLHttpRequest();

							// listen to the 'progress' event
							xhr.upload.addEventListener('progress', function(evt) {

								if (evt.lengthComputable) {	
									// calculate the percentage of upload completed
									var percent_complete = evt.loaded / evt.total;
									percent_complete = parseInt(percent_complete * 100);
									// update the Bootstrap progress bar with the new percentage
									$('.progress-bar').show();
									$('.progress-bar').text(percent_complete + '%');
									$('.progress-bar').width(percent_complete + '%');
									// once the upload reaches 100%, set the progress bar text to done
									if (percent_complete === 100) {
										$('.progress-bar').html('Done');
										//$('.progress-bar').hide();
										$('#list-sys-descriptions').append("<div><a style='cursor: pointer' href='"+upload_dir+path_name+"' target='_blank' >"+file_name+"</a><span class='upload_glyph glyphicon glyphicon-remove delete-sys-desc-inline' data-syspath='"+path_name+"''></span></div><br/>");
										//this should also update the database in this case
										console.log(form_data);
									}
								}
							}, false);
							return xhr;
						}
					});
					//add new description updates the database with the currently uploaded new description
					add_new_description(file_name,path_name);
				}
				else{
					$('#sysDesc-error-box').html('File with given name already exists');
				}
			});
		}
	}
	});

	//loading system descriptions inside


	$('#add-desc-text').on('click',function(){
		var form = document.forms['dragoon_problem_form'];
		var user = form["u"].value;
		var prob_name = form["p"].value;
		var folder = form["f"].value;
		var sec = form["s"].value;
		$('#handleSystemDesc').modal('hide');
		window.open(cke_path+'&p='+prob_name+'&f='+folder+'&s='+sec+'&u='+user, '_blank');
	});


	/* update_desc_list : updates the system description list by sending a query to db
	* one use of this function in updating the list of system descriptions once a new description is created via ck editor
	* uploading system descriptions updates the list without the help of this function
	*/
	var update_desc_list = function(){
		//fill the input data structure 
		//inputs are user name, folder and section
		//step 1: collect data relevant to the operations of this module
		$('#list-sys-descriptions').html('');
		var form = document.forms['dragoon_problem_form'];
		var folder = form["f"].value;
		var problem = form["p"].value;
		var section = form["s"].value;
		var input = {
			f: folder,
			p: problem,
			s: section,
			req_type: "refresh_list"
		}
		$.post(sd_update_handler, input)
			.success(function (datum) {
				console.log("received",datum);
				var sys_json = JSON.parse(datum);
				for(var sd_name in sys_json){
					var desc_name = sd_name.trim();
					console.log("name", desc_name);
					if(desc_name!= ""){
						var desc_path = sys_json[sd_name]["path"].trim();
						var desc_link = upload_dir+desc_path;
						var desc_type = sys_json[sd_name]["type"].trim();
						console.log(" desc_type is",desc_type);
						if(desc_type == "cketext")
							$('#list-sys-descriptions').append("<div><a href = '"+desc_link+"' style='cursor: pointer' target='_blank'>"+desc_name+"</a><span class='upload_glyph glyphicon glyphicon-edit edit-sys-desc-inline' data-syspath='"+desc_path+"'></span><span class='upload_glyph glyphicon glyphicon-remove delete-sys-desc-inline' data-syspath='"+desc_path+"'></span></div><br/>");
						else if(desc_type == "upload")
							$('#list-sys-descriptions').append("<div><a href = '"+desc_link+"' style='cursor: pointer' target='_blank'>"+desc_name+"</a><span class='upload_glyph glyphicon glyphicon-remove delete-sys-desc-inline' data-syspath='"+desc_path+"'></span></div><br/>");
					}
				}
		});

	};

	/* add new description
	
	*/

	var add_new_description = function(file_name,path_name){
		//step 1: collect data relevant to the operations of this module
		var form = document.forms['dragoon_problem_form'];
		var user = form["u"].value;
		var folder = form["f"].value;
		var problem = form["p"].value;
		var section = form["s"].value;
		var name = file_name;
		var path = path_name;
		var input = {
			u: user,
			f: folder,
			p: problem,
			s: section,
			n: name,
			path: path,
			req_type: "new_desc",
			desc_type: "upload"
		}
		$.post(sd_update_handler, input)
			.success(function (datum) {
				console.log("received",datum);
				//location.reload();
		});		
	};

	/*
		File name format, name duplication and file size errors
	*/
	var file_validations = function(file){
		$('#sysDesc-error-box').html('');

		if(file.type !== "application/pdf"){
			console.error("file format not supported");
			$('#sysDesc-error-box').html('Only pdf files are allowed as uploads');
			$('.progress-bar').hide();
			return false;
		}
		//special characters case
        var pattern = new RegExp(/[~`!#$%\^&*@+=\-\[\]\\';,/{}|\\":<>\?]/);
        if (pattern.test(file.name)) {
        	console.error("special characters not allowed in file name");
        	$('#sysDesc-error-box').html('File name cannot contain special characters');
        	$('.progress-bar').hide();
        	return false;
        }
		// file size error
		if( file.size && (file.size/(1024*1024)) > 25 ){
			console.error("please limit file upload size");
			$('#sysDesc-error-box').html('File upload size cannot exceed 25 mb');
			$('.progress-bar').hide();
			return false;
		}

		return true;
	}
	var check_duplication = function(file){
		$('#sysDesc-error-box').html('');
		var form = document.forms['dragoon_problem_form'];
		var folder = form["f"].value;
		var problem = form["p"].value;
		var section = form["s"].value;
		var name = file.name;
		var input = {
			p: problem,
			s: section,
			n: name,
			f: folder,
			req_type: "name_duplication"
		}
		return $.post(sd_update_handler, input)
			.success(function (datum) {
				console.log("received",datum);
		});
	};

	//event : deleting a system description
	//event delegation is used since entries are dynamic
	$('#handleSystemDesc').on("click", '.delete-sys-desc-inline',function(){
		var current_sys_desc = this;
		console.log("delete description clicked",this);
		$('#confirmRemoveSysDesc').modal('show');
		$('#removeSysDescConfirmed').click(function () {
		var sd_path = $(current_sys_desc).attr('data-syspath');
		//console.log("path",sd_path);
		//remove the sys desc entry from the list
		$(current_sys_desc).closest('div').remove();
		var input = {
			path: sd_path,
			req_type: "delete_sys_desc"
		}
		$.post(sd_update_handler, input)
			.success(function (datum) {
				console.log("received",datum);
				if(datum == "success"){
					$('#sysDesc-error-box').html('File deleted');
				}

		});
		});
	});

	//event : editing a system description
	$('#handleSystemDesc').on("click", '.edit-sys-desc-inline',function(){
		console.log("edit description clicked");
		var sd_path = $(this).attr('data-syspath');
		window.open(cke_path+'&sdp='+sd_path+'&edit='+true, '_blank');
	});

});