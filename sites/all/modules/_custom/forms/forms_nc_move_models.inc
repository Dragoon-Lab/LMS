<?php
function forms_nc_move_models($form, &$form_state){
	global $user;
	$name = 'anonymous';
	if($user->uid){
		$name = $user->name;
	}

	//call a function which returns all potential folders user model can be created in
	$user_folders = json_encode(loadUserFolders($name));
	$user_folders2 = json_encode(loadUserFolders2($name));
	
	$form['source_folder'] = array(
		'#type' => 'select',
		'#options' => array('loading..'),
		'#validated' => TRUE,
		'#id' => 'select_source_folder',
		'#title' => t('Choose Folder'),
		'#prefix' => '<div id="message_div"></div>',
	);

	//source folder data loads user owned folders (which can be used for move operation)
	$form['source_folder_data'] = array(
		//pump folder options including the user personal folder
		'#type' => 'hidden',
		'#value' => $user_folders,
	);

	//source folder data2 loads user owned and those shared to him (which can be used for copy operation)
	$form['source_folder_data2'] = array(
		//pump folder options including the user personal folder
		'#type' => 'hidden',
		'#value' => $user_folders2,
	);

	$form['source_model'] = array(
		'#type' => 'select',
		'#options' => array('Loading ..'),
		'#validated' => TRUE,
		'#id' => 'select_source_model',
		'#title' => t('Choose Model'),
	);

	$form['destination_folder'] = array(
		'#type' =>  'select',
		'#options' => array('Loading ..'),
		'#validated' => TRUE,
		'#id' => 'select_destination_folder',
		'#title' => t('Choose Destination Folder'),
	);

	$form['u'] = array(
		'#type' => 'hidden',
		'#value' => $name,
		'#id' => 'current_user_name'
	);

	$form['cp_button'] = array(
		'#type' => 'submit',
		'#value' => t('copyModel'),
		'#id' => 'cp_model_but',
		'#ajax' => array(
			'callback' => 'ajax_copy_model_callback',
			'wrapper' => 'message_div',
			'method' => 'html',
			'effect' => 'fade'
		)
	);

	$form['mv_button'] = array(
		'#type' => 'submit',
		'#value' => t('moveModel'),
		'#id' => 'mv_model_but',
		'#ajax' => array(
			'callback' => 'ajax_move_model_callback',
			'wrapper' => 'message_div',
			'method' => 'html',
			'effect' => 'fade'
		)
	);

	$form['cancel_button'] = array(
		'#type' => 'button',
		'#value' => t('Cancel'),
	);
	return $form;
}
