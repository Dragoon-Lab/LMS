<?php
function forms_nc_class_folder_form($form, &$form_state){
	global $user;
	$user_name = 'anonymous';
	if($user->uid){
		$user_name = $user->name;
	}

	
	$form['folder_name'] = array(
		'#type' => 'textfield',
		'#prefix' => '<div class="alert alert-info" id="form_valid_ack">Maximum 33 characters, Allowed special chars: underscore, dot and single quote</div>',
		'#title' => t('New Folder Name'),
		'#id' => 'create_folder_fname',
		'#maxlength' => 33,
	);

	$form['owner'] = array(
		'#type' => 'hidden',
		'#value' => $user_name,
		'#id' => 'create_folder_owner'
	);

	$form['class-id'] = array(
		'#type' => 'hidden',
		'#value' => '0000',
	);

	$form['req_type'] = array(
		'#type' => 'hidden',
		'#value' => 'create Folder',
	);

	$form['sharing_status'] = array(
		'#type' => 'hidden',
		'#value' => 0
	);

	$form['submit_button'] = array(
		'#type' => 'submit',
		'#value' => t('Create folder'),
		'#id' => 'create_nc_folder',
		'#ajax' => array(
			'callback' => 'ajax_create_folder_callback',
			'wrapper' => 'form_valid_ack',
			'method' => 'append',
			'effect' => 'fade',
			'event' => 'createFolderEvent'
		),
	);
	$form['cancel_button'] = array(
		'#type' => 'button',
		'#value' => t('Cancel'),
	);

	return $form;
}