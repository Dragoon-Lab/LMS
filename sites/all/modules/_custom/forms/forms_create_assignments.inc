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
		'#id' => 'form_open_radios',
		'#type' => 'radios',
		'#required' => TRUE,
	);

	$mode_options = get_create_assignment_options();
	foreach($mode_options as $option => $value){
		$form['m'][$option] = $value;
	}

	if(has_system_descriptions()){
		$form['sd'] = array(
			'#id' => 'assignment_def_sd',
			'#type' => 'select',
			'#validated' => TRUE,
			'#title' => t('Choose System description'),
		);
	}

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

	$form['fp'] = array(
		'#type' => 'hidden',
		'#default_value' => 'off',
	);

	$form['ln_checkbox'] = array(
		'#type' => 'checkbox',
		'#title' => t('Lock Nodes'),
		'#id' => 'ln_checkbox',
		'#prefix' => '<div id="ln_checkbox_container" class="element-hide">',
		'#suffix' => '</div>'
	);
	$form['gp'] = array(
		'#type' => 'hidden',
		'#value' => 'off',
	);
	$form['gp_checkbox'] = array(
		'#type' => 'checkbox',
		'#title' => t('Give parameters'),
		'#id' => 'gp_checkbox',
		'#prefix' => '<div id="gp_checkbox_container" class="element-hide">',
		'#suffix' => '</div>'
	);
	$form['gs'] = array(
		'#type' => 'hidden',
		'#value' => 'off',
	);
	$form['gs_checkbox'] = array(
		'#type' => 'checkbox',
		'#title' => t('Give Schema(DRT)'),
		'#id' => 'gs_checkbox',
		'#prefix' => '<div id="gs_checkbox_container" class="element-hide">',
		'#suffix' => '</div>'
	);
	$form['submit_button'] = array(
		'#type' => 'submit',
		'#value' => t('Create Assignment'),
		'#id' => 'submit_button',
	);
	$tutor_name = get_tutor_name();
	$form['tutor_name'] = array(
		'#type' => 'hidden',
		'#value' =>	$tutor_name,
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
	unset($params['ln_checkbox']);
	$params['p'] = $form_state['values']['aname'];
	echo $form_state['values']['pname'];
	$params = json_encode($params);
	module_load_include('inc', 'forms', 'forms_utils');
	$code = get_code(12);
	if(!(strpos($form_state['values']['create_session'], "error" !== false))){
		$last_id = db_insert('assignments')
			->fields(array(
				'assignment_name' => $form_state['values']['aname'],
				'assignment_id' => $code,
				'class_code' => $form_state['values']['cc'],
				'problem' => $form_state['values']['aname'],
				'problem_properties' => $params
			))->execute();

		if(isset($form_state['values']['sd']) && $form_state['values']['sd'] != 0){
			db_insert('assignment_sds')
			->fields(array(
				'assignment_id' => $code,
				'sd_id' => $form_state['values']['sd']
			))->execute();
		}
	}
}
