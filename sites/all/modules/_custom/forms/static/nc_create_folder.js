(function ($) {
	Drupal.behaviors.validateCFForm = { 
		attach: function (context ,settings) { 
			var form = $('#dragoon_ncCFolder_form', context);
			var current_modal = $('#createFolderModal');
			form.on('submit', function(e){
					e.preventDefault();
					// Run js based validations 
					var folder_name = $('#create_folder_fname').val();
					
					// folder name empty case
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

					// If success, trigger event on button
					// this trigger makes an ajax call, verifies duplicate case and finally creates folder
					$('#create_nc_folder').trigger('createFolderEvent');
				});

			current_modal.on('shown.bs.modal', function(){
				//empty the create folder textbox
				console.log('create folder modal opened')
				emptyTextbox('create_folder_fname', 'Enter the folder name here');
			});
		}
	}

	//commands can be returned back from drupal code
	Drupal.ajax.prototype.commands.reloadPage = function(){
		//Print success message and reload page
		$('#block-forms-create-non-class-folder').html('<b>Success!</b>');
		setTimeout(function(){
			location.reload();
		},2000); 
	}
})(jQuery);
