jQuery(document).ready(function($){
	
	//.ckeditor function adds ckeditor capabilities to text areas
	//There are two such text areas which use ckeditor features, one while adding
	//a new system description and the other while editing an existing description
	$( "textarea" ).ckeditor();


	//Check whether the current_desc_content element exists
	//if it exists, read the value which gives the existing system description content 
	//and load the ck editor instance with it
	if($('#current_desc_content').length > 0){
		var current_desc_content = $('#current_desc_content').val();
		CKEDITOR.instances["sd_edit_content"].setData(current_desc_content);	
	} 

});