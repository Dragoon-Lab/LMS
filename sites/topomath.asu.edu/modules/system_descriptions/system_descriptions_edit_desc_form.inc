<?php
function system_descriptions_edit_desc_form($form, &$form_state){
	
	$sd_path = drupal_get_path('module', 'system_descriptions').'/uploads/'.$_REQUEST['sdp'];
	if(file_exists($sd_path)){
		$fc = file_get_contents($sd_path);

		$form['sd_edit_content'] = array(
			'#type' => 'textarea',
			'#title' => t('System Description'),
			'#required' => TRUE,
			'#prefix' => '<div id="form_desc_name" style="margin-bottom: 20px;">
						Update your system description here
						</div>
					<div id="form_sys_desc" style="margin-bottom: 20px;">',

			'#suffix' => '</div>',
			'#attributes' => array(
				'id' => 'sd_edit_content',
			),
		);

	$form['sub_but'] = array(
		'#type' => 'submit',
		'#value' => t('Update system description'),
		'#attributes' => array(
			'id' => 'update_desc_button',
		),
		'#validate' => array('system_descriptions_edit_desc_form_validate'),
		'#submit' => array('system_descriptions_edit_desc_form_submit'),

	);
					
	/* hidden elements */
	$form['problem_path'] = array(
		'#type' => 'hidden',
		'#attributes' => array(
			'id' => 'problem_path'
		)
	);

	$form['current_desc_content'] = array(
		'#type' => 'hidden',
		'#value' =>  $fc,
		'#attributes' => array(
			'id' => 'current_desc_content'
		)
	);
	return $form;
}
else{
	echo "The system description does not exists any more! ";
}
}

function system_descriptions_edit_desc_form_validate($form, &$form_state){
	$sd_path = $_REQUEST['sdp'];
	form_set_value($form['problem_path'], $sd_path, $form_state);
}

function system_descriptions_edit_desc_form_submit($form, &$form_state){
	/* update the description, this case only has the source in ckeditor
	   technically path does not changes, so no database update, rather just update
	   content in file */

	$content = $form_state['values']['sd_edit_content'];
	$path = $_REQUEST['sdp'];
	$file = drupal_get_path('module', 'system_descriptions').'/uploads/'.$path;
	file_put_contents($file, $content);
	$form_state['redirect'] = array(
				'sysdescs',
				array(
    				'query' => array(
      					'msg' => 'edited',
    				),
				),
			);	

}







