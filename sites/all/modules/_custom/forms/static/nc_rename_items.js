jQuery(document).ready(function($) {
	//create variables for input items to be modified via jQuery selectors
	var item_to_rename = $('#item_selected');
	var original_folder = $('#original_folder_name');
	var original_model = $('#original_model_name');
	var new_name = $('#new_item_name');
	var rename_button = $('#rename_item_button');
	var form = document.forms['dragoon_nc_rename_items'];
	var user_name = form["u_ren"].value;
	var max_model_name_len = 50;
	var max_folder_name_len = 33;

	//helper functions
	var refresh_select = function(current_select, new_options){
				
		//enable in case disabled
		current_select.attr("disabled", false);
		//remove any options from current select, before replenishing
		current_select.find('option').remove();
		//replace options from new_options
		for(var key in new_options){
			var temp_option = new Option(new_options[key],key);
			current_select.append($(temp_option));
		}
	};

	// updates the model and destination selects when no data received
	// either because the current folder has no models or query has failed
	var no_data_received = function(message){
		//update model select and disable
		refresh_select(original_model, message);
		original_model.attr("disabled",true);
				
		new_name.attr("placeholder","model has to be selected to rename");
		new_name.attr("disabled",true);
		//disable copy/move button
		rename_button.attr("disabled", true);
	};


	//changeRenameOption handles functionality corresponding to user's choice:
	//to rename a folder or model
	var changeRenameOption = function(){
		//irrespective of option chose, show folder div, new name div and rename button
		$('#ren_folder_div').show(); 
		$('#new_name_div').show();
		rename_button.show();
		var inp = $("input[name='choose_item_rename']:checked").val();
		if(inp == "Folder"){
			var own_folders = form["user_owned_folders"].value;
			own_folders = $.parseJSON(own_folders);
			refresh_select(original_folder, own_folders);
			//user private folder can't be renamed, so remove the option
			var user_priv = user_name+"-private";
			original_folder.find('option[value='+user_priv+']').remove();
			new_name.attr("disabled",false);
			new_name.attr("placeholder","");
			//hide model div
			$('#ren_model_div').hide();
			new_name.attr('maxlength',max_folder_name_len);
		}
		else if(inp == "Model"){
			var shared_folders = form["user_shared_folders"].value;
			shared_folders = jQuery.parseJSON(shared_folders);
			refresh_select(original_folder, shared_folders);
			retrieveModels();
			new_name.show();
			//show model div
			$('#ren_model_div').show();
			new_name.attr('maxlength',max_model_name_len);
		}
		rename_button.attr("disabled", false);
	};


	//retrieve models helper function
	var retrieveModels = function() {
		var current_folder = original_folder.val();
		//make a call to Dragoon API to get models for the current folder
		$.ajax({
			type: "POST",
			url: $("#dragoon_url").val()+"global.php",
			data: {
				"t": "reqNonClassProblems",
				"g": current_folder
			},
			async: false,
			success: function (data) {
				var model_data = $.parseJSON(data);
				if (model_data["error"] !== undefined) {
					var empty_option = {"none": "Selected folder is empty"};
					no_data_received(empty_option);
				}
				else {
					refresh_select(original_model, model_data);
					rename_button.attr("disabled", false);
					new_name.attr("placeholder","Enter new name here");
					new_name.attr("disabled",false);
				}
			},
			error: function (data) {
				console.log(data, "failed");
				var failed_option = {"none": "Something went wrong! try again later"};
				no_data_received(failed_option);
			}

		});
	}

	//event 2 , on change of folder
	original_folder.on("change",function(){
		var inp = $("input[name='choose_item_rename']:checked").val();
		if(inp == "Model"){
			retrieveModels();
		}
	});

	//event 3 , on clicking the rename button
	/*
	rename_button.on("click",function(e){
		e.preventDefault();
		var new_val = new_name.val();

		//check if the new name is empty and if so alert
		if(isNameEmpty(new_val)){
			showErrorTextbox("new_item_name","Empty value");
			return;
		}
		//lengths limit handled with maxlength attr
		
		//special characters case
		if(checkSpecialChars(new_val)){
			showErrorTextbox("new_item_name","special characters not allowed");
			return;
		}

		var inp = $("input[name='choose_item_rename']:checked").val();
		var redundant_check = "";
		if(inp == "Model"){
			redundant_check = original_model.val().trim();
		}
		if(inp == "Folder"){
			redundant_check = original_folder.val().trim();
		}

		if(redundant_check == new_name.val().trim()){
			showErrorTextbox("new_item_name", "Please do not use the same name again");
			return;
		}

		rename_button.trigger("renameItemEvent");
	}); */

	item_to_rename.change(changeRenameOption);

	rename_button.on("click", function(e) {
    e.preventDefault();
    $("#loadMe").modal({
      backdrop: "static", //remove ability to close modal with click
      keyboard: false, //remove option to close with keyboard
      show: true //Display loader!
    });
    setTimeout(function() {
      $("#loadMe").modal("hide");
    }, 3500);
  });
	
});
