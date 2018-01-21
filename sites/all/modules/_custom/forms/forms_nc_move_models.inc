<?php
function forms_nc_move_models($form, &$form_state){
	global $user;
	$name = 'anonymous';
	if($user->uid){
		$name = $user->name;
	}

	//call a function which returns all potential folders user model can be created in
	$user_det = array('uid' => $user->uid, 'uname' => $user->name);
	$user_folders = json_encode(loadUserFolders($user_det));

	$user_folders2 = json_encode(loadUserFolders2($user_det));
	
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

	$form['rename_check'] = array(
		'#type' => 'checkbox',
		'#title' => t('Use new name'),
		'#id' => 'rename_model_check',
		'#prefix' => '<div id="rename_model_check_div" class="element-hide">',
		'#suffix' => '</div>'
	);

	$form['model_newname'] = array(
		'#type' => 'textfield',
		'#title' => t('Enter the new name of copy'),
		'#id' => 'model_newname',
		'#maxlength' => 50,
		'#prefix' => '<div id="model_newname_div" class="element-hide">',
		'#suffix' => '</div>'
	);

	$form['cp_button'] = array(
		'#type' => 'submit',
		'#value' => t('Copy Model'),
		'#id' => 'cp_model_but',
		'#ajax' => array(
			'callback' => 'ajax_copy_model_callback',
			'wrapper' => 'message_div',
			'method' => 'html',
			'effect' => 'fade',
			'event' => 'copy_authenticated',
			'wrapper' => 'message_div',
		)
	);

	$form['mv_button'] = array(
		'#type' => 'submit',
		'#value' => t('Move Model'),
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
