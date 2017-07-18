jQuery(document).ready(function($) {
	Drupal.ajax.prototype.commands.reloadPage = function(){
		//Print success message
		$('#block-forms-create-non-class-folder').html('<b>Success!</b>');
		setTimeout(function(){
			location.reload();
		},1000); 
	}
});