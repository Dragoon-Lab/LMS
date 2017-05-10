<?php

function create_assignment_form($form, &$form_state){
	$form['aname'] = array(
		'#type' => 'textfield',
		'#title' => t('Assignment Name'),
		'#maxlength' => 50,
		'#description' => t('Enter name of the assignment, so that you can remember the assignment.'),
	);

	$form['problem'] = array(
		'#type' => 'textfield',
		'#title' => t('Problem'),
		'#disabled' => TRUE,
	);

	$form['pname'] = array(
		'#type' => 'hidden'
	);

	$form['cc'] = array(
		'#type' => 'hidden',
	);

	$form['m'] = array(
		'#type' => 'radios',
		'#options' => array(
			'STUDENT|executionDemo' => t('Step through running the model'),
			'STUDENT|execution' => t('Run the model manually'),
			'COACHED|construction' => t('Reconstruct the model - Feedback on everything'),
			'STUDENT|construction' => t('Reconstruct the model - Feedback on entries and graphs'),
			'TEST|construction' => t('Reconstruct the model - Feedback on graphs only'),
			'EDITOR|construction' => t('Reconstruct the model - No feedback'),
			'AUTHOR|construction' => t('Edit the model'),
		),
		'#title' => t('Select a method to start Dragoon problem'),
		'#required' => TRUE,
		'#default_value' => 'COACHED|construction',
	);

	$form['p'] = array(
		'#type' => 'hidden',
	);

	$form['sm'] = array(
		'#type' => 'hidden',
		'#value' => 'feedback',
	);

	$form['is'] = array(
		'#type' => 'hidden',
		'#value' => 'algebraic',
	);

	$form['s'] = array(
		'#type' => 'hidden',
	);

	$form['create_session'] = array(
		'#type' => 'hidden',
		'#value' => 'FALSE',
	);

	$form['g'] = array(
		'#type' => 'hidden',
	);

	$form['submit_button'] = array(
		'#type' => 'submit',
		'#value' => t('Create Assignment'),
		'#id' => 'submit_button',
	);

	return $form;
}

function create_assignment_form_submit($form, &$form_state){
	//preprocessing the params values to hold only the ones that are needed.
	$params = $form_state['values'];
	echo $form_state['values']['pname'];
	$temp = explode("|", $form_state['values']['m']);
	$params['m'] = $temp[0];
	$params['a'] = $temp[1];
	unset($params['pname']);
	unset($params['aname']);
	unset($params['problem']);
	unset($params['cc']);
	unset($params['create_session']);
	unset($params['submit_button']);
	unset($params['form_build_id']);
	unset($params['form_token']);
	unset($params['form_id']);
	unset($params['op']);

	echo $form_state['values']['pname'];
	$params = json_encode($params);
	echo $params;
	module_load_include('inc', 'forms', 'forms_utils');
	$code = get_code(12);
	if(!(strpos($form_state['values']['create_session'], "error" !== false))){
		db_insert('assignments')
			->fields(array(
				'assignment_name' => $form_state['values']['aname'],
				'assignment_id' => $code,
				'class_code' => $form_state['values']['cc'],
				'problem' => $form_state['values']['pname'],
				'problem_properties' => $params
			))->execute();
	}
}
