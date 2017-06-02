jQuery(document).ready(function($){
	var uploaddir = 'sites/topomath.asu.edu/modules/system_descriptions/uploads';
	var cke_path = "sites/topomath.asu.edu/modules/system_descriptions/cke";
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
		listSystemDescriptions();
	});

	// list system descriptions function
	var listSystemDescriptions = function(){
		//get system descriptions latest data
		var a = updateDescList();
		console.log("a is", a);
		
	};

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
			var formData = new FormData();
			var fileName = ''; var pathName = '';
			var fileValid = true;
			var file = files[0];
			fileName = file.name;
			pathName = Date.now()+fileName;
			formData.append(0, file);
			var fileValid = basicFilechecks(file);
			if(fileValid){
			$.when(checkDuplication(file)).done(function(fileValid){
				console.log("filevalidity",fileValid);
				if(fileValid == '1'){
					$.ajax({
						url: 'sites/topomath.asu.edu/modules/system_descriptions/static/submit.php?files&path='+pathName,
						type: 'POST',
						data: formData,
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
									var percentComplete = evt.loaded / evt.total;
									percentComplete = parseInt(percentComplete * 100);
									// update the Bootstrap progress bar with the new percentage
									$('.progress-bar').show();
									$('.progress-bar').text(percentComplete + '%');
									$('.progress-bar').width(percentComplete + '%');
									// once the upload reaches 100%, set the progress bar text to done
									if (percentComplete === 100) {
										$('.progress-bar').html('Done');
										//$('.progress-bar').hide();
										$('#list-sys-descriptions').append("<div><a style='cursor: pointer' href='"+uploaddir+pathName+"' target='_blank' >"+fileName+"</a><span class='upload_glyph glyphicon glyphicon-remove delete-sys-desc-inline' data-syspath='"+pathName+"''></span></div><br/>");
										//this should also update the database in this case
										console.log(formData);
									}
								}
							}, false);
							return xhr;
						}
					});
					//add new description updates the database with the currently uploaded new description
					addNewDescription(fileName,pathName);
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
		window.open(cke_path+'?p='+prob_name+'&f='+folder+'&s='+sec+'&u='+user, '_blank');
	});


	/* updateDescList : updates the system description list by sending a query to db
	* one use of this function in updating the list of system descriptions once a new description is created via ck editor
	* uploading system descriptions updates the list without the help of this function
	*/
	var updateDescList = function(){
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
			req_type: "refreshList"
		}
		$.post('sites/topomath.asu.edu/modules/system_descriptions/static/sysDescUpdates.php', input)
			.success(function (datum) {
				console.log("received",datum);
				var sys_json = JSON.parse(datum);
				for(var sdName in sys_json){
					console.log(sdName, sys_json[sdName]["path"], sys_json[sdName]["type"]);
					var descName = sdName.trim();
					console.log("name", descName);
					if(descName!= ""){
						var descpath = sys_json[sdName]["path"].trim();
						var descLink = "sites/topomath.asu.edu/modules/system_descriptions/uploads/"+descpath;
						var descType = sys_json[sdName]["type"].trim();
						console.log(" descType is",descType);
						if(descType == "cketext")
							$('#list-sys-descriptions').append("<div><a href = '"+descLink+"' style='cursor: pointer' target='_blank'>"+descName+"</a><span class='upload_glyph glyphicon glyphicon-edit edit-sys-desc-inline' data-syspath='"+descpath+"'></span><span class='upload_glyph glyphicon glyphicon-remove delete-sys-desc-inline' data-syspath='"+descpath+"'></span></div><br/>");
						else if(descType == "upload")
							$('#list-sys-descriptions').append("<div><a href = '"+descLink+"' style='cursor: pointer' target='_blank'>"+descName+"</a><span class='upload_glyph glyphicon glyphicon-remove delete-sys-desc-inline' data-syspath='"+descpath+"'></span></div><br/>");
					}
				}
		});

	};

	/* add new description
	
	*/

	var addNewDescription = function(fileName,pathName){
		//step 1: collect data relevant to the operations of this module
		var form = document.forms['dragoon_problem_form'];
		var user = form["u"].value;
		var folder = form["f"].value;
		var problem = form["p"].value;
		var section = form["s"].value;
		var name = fileName;
		var path = pathName;
		var input = {
			u: user,
			f: folder,
			p: problem,
			s: section,
			n: name,
			path: path,
			req_type: "newDesc",
			desc_type: "upload"
		}
		$.post('sites/topomath.asu.edu/modules/system_descriptions/static/sysDescUpdates.php', input)
			.success(function (datum) {
				console.log("received",datum);
				//location.reload();
		});		
	};

	/*
		File name format, name duplication and file size errors
	*/
	var basicFilechecks = function(file){
		$('#sysDesc-error-box').html('');

		//special characters case
        var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
        if (pattern.test(file.name)) {
        	console.error("special characters not allowed in file name");
        	$('#sysDesc-error-box').html('File name cannot contain special characters');
        	$('.progress-bar').hide();
        	return false;
        }
		// file size error
		if( (file.size/(1024*1024)) > 25 ){
			console.error("please limit file upload size");
			$('#sysDesc-error-box').html('File upload size cannot exceed 25 mb');
			$('.progress-bar').hide();
			return false;
		}
		if(file.type !== "application/pdf"){
			console.error("file format not supported");
			$('#sysDesc-error-box').html('Only pdf files are allowed as uploads');
			$('.progress-bar').hide();
			return false;
		}
		return true;
	}
	var checkDuplication = function(file){
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
			req_type: "nameDuplication"
		}
		return $.post('sites/topomath.asu.edu/modules/system_descriptions/static/sysDescUpdates.php', input)
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
			req_type: "deleteSysDesc"
		}
		$.post('sites/topomath.asu.edu/modules/system_descriptions/static/sysDescUpdates.php', input)
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
		var cke_path = "http://client1.localhost/sites/topomath.asu.edu/modules/system_descriptions/cke";
		window.open(cke_path+'?sdp='+sd_path+'&edit='+true, '_blank');
	});

});