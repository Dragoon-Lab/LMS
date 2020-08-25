<?php

function class_import_assignments_form($form, &$form_state){
	$form['input_class_code'] = array(
		'#type' => 'textfield',
		'#title' => t('Class Code'),
		'#maxlength' => 4,
		'#id'=> 'importAssign_source_class',
		'#description' => t('Enter the class code to copy assignments from'),
		'#suffix' => '<span id="class_code_error_dp"></span><br/>'
	);
	$form['class_code_now'] = array(
		'#type' => 'hidden', 
		'#id' => 'current_class_code_name',
		'#value' => current_path()
	);

	$form['submit_button'] = array(
		'#type' => 'submit',
		'#value' => t('Import'),
		'#id' => 'import_assignments_btn_2',
		'#ajax' => array(
			'callback' => 'ajax_import_assignments_callback',
			'wrapper' => 'class_code_error_dp',
			'method' => 'append',
			'effect' => 'fade',
		),
	);
	return $form;
}
