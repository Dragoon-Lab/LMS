<?php
function forms_nc_rename_items($form, &$form_state){
	global $user;
	$name = 'anonymous';
	$rp = 'on';
	if($user->uid){
		$name = $user->name;
		$rp = 'off';
	}
	$user_det = array('uid' => $user->uid, 'uname' => $user->name);
	//call a function which returns all potential folders user model can be created in
	$user_folders = loadUserFolders($user_det);
	$user_folders2 = json_encode(loadUserFolders2($user_det));

	$form['choose_item_rename'] = array(
		'#type' => 'radios',
		'#title' => 'Choose a folder or model to edit',
		'#id' => 'item_selected',
		'#prefix' => '<div id="ren_feed"></div>',
		'#options' => array(
			"Folder" => t('Folder'),
			"Model" => t('Model')
		)
	);

	$form['select_folder_item'] = array(
		//pump folder options including the user personal folder
		'#type' => 'select',
		'#options' => $user_folders,
		'#id' => 'original_folder_name',
		'#prefix' => '<div id="ren_folder_div" class="element-hide"><b>Choose Folder</b>',
		'#suffix' => '</div>'
	);
	//data item which contains user owned folders
	$form['user_owned_folders'] = array(
		//pump folder options including the user personal folder
		'#type' => 'hidden',
		'#value' => json_encode($user_folders),
	);
	//data item which contains both folders user owns and the ones shared to him
	//this list actually is used to retrieve models from the folders user is shared
	//because user can also rename the models he is shared
	$form['user_shared_folders'] = array(
		//pump folder options including the user personal folder
		'#type' => 'hidden',
		'#value' => $user_folders2,
	);


	$form['select_model_item'] = array(
		//pump folder options including the user personal folder
		'#type' => 'select',
		'#options' => array('Loading Models...'),
		'#id' => 'original_model_name',
		'#prefix' => '<div id="ren_model_div" class="element-hide mt-10"><b>Choose Model</b>',
		'#suffix' => '</div>'
	);
	$form['select_new_name'] = array(
		//pump folder options including the user personal folder
		'#type' =>  'textfield',
		'#id' => 'new_item_name',
		'#prefix' => '<div id="new_name_div" class="element-hide mt-10"><b>Choose New Name</b>',
		'#suffix' => '</div>',
		'#maxlength' => 35
	);

	$form['u_ren'] = array(
		'#type' => 'hidden',
		'#value' => $name,
		'#id' => 'current_user_name'
	);

	$form['rename_button'] = array(
		'#type' => 'button',
		'#value' => t('Rename item'),
		'#id' => 'rename_item_button',
		'#prefix' => '<div id="rename_buttons_div" class="mt-10">',
		'#attributes' => array(
			'class' => array('btn btn-success element-hide')
		),
		'#ajax' => array(
			'callback' => 'ajax_rename_item_callback',
			'wrapper' => 'ren_feed',
			'method' => 'html',
			'effect' => 'fade',
			'event' => 'renameItemEvent'
		),
	);

	$form['cancel_button'] = array(
		'#type' => 'button',
		'#value' => t('Cancel'),
		'#suffix' => '</div>'
	);
	return $form;
}
