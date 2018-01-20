/**
 * Created by RiteshSamala on 7/1/16.
 */
jQuery(document).ready(function($) {
	$('#deleteFolderModal').on('shown.bs.modal', function () {
		// do something…
		console.log("now I can show the expanded private and shared list");
		$("h2[data-folder='private']").next().slideDown();
		$("h2[data-folder='private']").addClass("current");
		$("h2[data-folder='shared']").next().slideDown();
		$("h2[data-folder='shared']").addClass("current");
	});


	$('#delete_nc_folder').click(function(e) {
		e.preventDefault();
		//program to decode the deleted checks and sending
		var folders = [];
		var models = {};
		var owner=$('#dragoon_ncDelFolder_form input[name=owner]').val();
		$("#dragoon_ncDelFolder_form input:checkbox:checked").each(function(key,value) {
			var str = value.name;
			//console.log(str);
			var str_array=str.split('-');
			if(str_array[0]=="fo"){
				//push intlo folder array
				 var filter = str_array[1];
				if(filter == "private")
					filter = owner+"-private";
				else
					filter = filter+"-"+owner;
				folders.push(filter);
			}
			else if(str_array[0]=="mo"){
				var filter = str_array[3];
				if(filter == "private")
					filter = owner+"-private";
				else
					filter = filter+"-"+owner;

				models[str_array[1]]=filter;
			}
		});

		var flen = Object.keys(folders).length;
		var mlen = Object.keys(models).length;
		
		if( (flen == 0) && (mlen == 0) ){
			console.log("no selection");
			//no selection
			handleDeleteErrBox('Please select items for deletion');
			return;
		}
		

		if(flen>0){
			$('#dragoon_ncDelFolder_form input[name=selected_folders]').val(folders);
		}
		if(mlen>0){
			//remove models whose folders already have been selected
			$.each(models, function(key, value){
				//value is the folder name
				//if folder name already exists in folders array delete from models
				// as this would result in futher redundant data while deleting
				//console.log("k,v",key,value)
				if(folders.includes(value)){
					//console.log("deleting", key, value);
					delete models[key];
				}
			});
			//console.log("final models", models);
			var models_string = JSON.stringify(models);
			
			if(models_string != ""){
				$('#dragoon_ncDelFolder_form input[name=selected_models]').val(models_string);
			}
			else{
				handleDeleteErrBox("something went wrong, please try deleting again");
				return;
			}
		}

		//Show confirmation
		$('#confirmDeleteModal').modal('show');

		$('#deleteConfirm').on("click", function(){
			console.log("delete confirmed");
			$('#delete_nc_folder').trigger('delete_items_auth');
		});

	});

	var handleDeleteErrBox = function(/*String*/ message){
		if(message == "")
			$('#deleteFolderModal #del_err_msg').removeClass('alert alert-info');
		else
			$('#deleteFolderModal #del_err_msg').addClass('alert alert-info');

		$('#deleteFolderModal #del_err_msg').html(message);
		//$("#deleteFolderModal").scrollTop(0);
	}

	$('#deleteFolderModal').on('shown.bs.modal', function(){
		//empty the create folder textbox
		console.log('delete items modal opened');
		handleDeleteErrBox('');
		$(this).focus();
	});
});