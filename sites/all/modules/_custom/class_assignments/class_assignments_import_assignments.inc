<?php

function class_import_assignments_form($form, &$form_state){
	$form['aname'] = array(
		'#type' => 'textfield',
		'#title' => t('Class Code'),
		'#maxlength' => 4,
		'#id'=> 'importAssign_source_class',
		'#description' => t('Enter the class code to copy assignments from'),
		'#suffix' => '<span id="class_code_error_dp"></span>'
	);

	$form['submit_button'] = array(
		'#type' => 'submit',
		'#value' => t('Import'),
		'#id' => 'import_assignments_btn_2',
	);
	return $form;
}

function class_import_assignments_form_submit($form, &$form_state){
}
