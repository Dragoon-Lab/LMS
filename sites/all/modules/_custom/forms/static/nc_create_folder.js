jQuery(document).ready(function($) {
	$('#create_nc_folder').click(function(e){
		e.preventDefault();
		// make sure folder name is not empty and also the folder with same name exists
		var folder_name = $('#create_folder_fname').val();
		var owner=$('#dragoon_ncCFolder_form input[name=owner]').val();
		console.log("form check parameters", folder_name, owner);
		checkValidity(folder_name,owner);
	});

	function checkValidity(folder_name,owner){
		//empty value case
		if(isNameEmpty(folder_name)){
			showErrorTextbox("create_folder_fname","Empty value");
			return;
		}

		//length exceeded case handled with maxlength attribute

		//special characters case
		if(checkSpecialChars(folder_name)){
			showErrorTextbox("create_folder_fname","special characters not allowed");
			return;
		}

		//duplicate folder case
		var folder_id = folder_name+"-"+owner;
		var req_type = 'check Folder';
		$.ajax({
			type: "POST",
			url: "sites/all/modules/_custom/NC_models/static/nonClassUpdates.php",
			data: {'folder_id': folder_id, 'req_type': req_type},
			success: function (data) {
				if(data==1) {
					console.log(data);
					createFolder();
				}
				else {
					console.log(data);
					showErrorTextbox("create_folder_fname","Folder with given name already exists, try a new one!");
				}
			},
			error: function (data) {
				console.log(data);
				console.log("fail");
			}
		});
	}

	function createFolder(){
		console.log("creating Folder");
		$.ajax({
			type: "POST",
			url: "sites/all/modules/_custom/NC_models/static/nonClassUpdates.php",
			data: $('#dragoon_ncCFolder_form').serialize(),
			success: function (data) {
				console.log(data);
				location.reload();
			},
			error: function (data) {
				console.log("fail");
			}
		});
	}

});
