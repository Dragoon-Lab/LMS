<?php
function create_class_form($form, &$form_state){
	$form['class_name'] = array(
		'#type' => 'textfield',
		'#title' => t('Class Name'),
		'#description' => t('Enter name of the class, try to keep it unique by entering year or other distinguishing text'),
		'#required' => TRUE,
		'#maxlength' => 46,
	);

	$form['submit_button'] = array(
		'#type' => 'submit',
		'#value' => 'Create Class',
		'#submit' => array('create_class_form_submit'),
	);

	return $form;
}

function create_class_form_submit($form, &$form_state){
	global $user;
	module_load_include('inc', 'forms', 'forms_utils');
	$flag = true;
	$code = "";

	//checking uniqueness of the class code due to case insensitive values in mysql
	while($flag){
		$code = get_code();
		$query = 'SELECT * FROM classes WHERE code = :code';
		$result = db_query($query, array(':code' => $code));
		if($result->rowCount() == 0)
			$flag = false;
	}

	db_insert('classes')
		-> fields(array(
			'created_by' => $user->uid,
			'code' => $code,
			'name' => $form_state['values']['class_name'],
			'section' => create_class_section($form_state['values']['class_name']),
			'is_active' => TRUE,
		))->execute();
	drupal_set_message(t("Your class has been successfully created. The class join code is ".$code));
	$block = module_invoke('classes', 'classes_block_view', 'classes_created');
	print render($block['content']);
}

function create_class_form_validate($form, &$form_state){
	global $user;
	$data = array(
		':name' => $form_state['values']['class_name'],
		':section' => create_class_section($form_state['values']['class_name'])
	);

	$result = "";
	if(strpos($form_state['values']['class_name'], "_")){
		$data[':name2'] = create_class_name($form_state['values']['class_name']);
		$result = db_query('SELECT code FROM {classes} WHERE name = :name OR name = :name2 OR section = :section', $data);
	} else {
		$result = db_query('SELECT code FROM {classes} WHERE name = :name OR section = :section', $data);
	}

	if($result->rowCount() > 0){
		form_set_error('class_name', t('Class name is already in use.'));
	}
}

function create_class_section($name){
	return 'lms-'.str_replace(" ", "_", $name);
}

function create_class_name($name){
	return str_replace("_", " ", $name);
}
