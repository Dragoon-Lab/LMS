<?php
function forms_nc_class_folder_form($form, &$form_state){
	global $user;
	$user_name = 'anonymous';
	if($user->uid){
		$user_name = $user->name;
	}

	$form['folder_name'] = array(
		'#type' => 'textfield',
		'#title' => t('New Folder Name'),
        '#required' => TRUE,
        '#id' => 'create_folder_fname'
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
	);
    $form['cancel_button'] = array(
        '#type' => 'button',
        '#value' => t('Cancel'),
    );

	return $form;
}


