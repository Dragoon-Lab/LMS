<?php
function system_descriptions_new_desc_form($form, &$form_state){
	
	$form['file_name_html'] = array(
		'#type' => 'textfield',
		'#title' => t('File Name'),
		'#required' => TRUE,
		'#prefix' => '<div id="form_desc_name" style="margin-bottom: 20px;">',
		'#suffix' => '</div>',
		'#attributes' => array(
			'id' => 'sys_desc_name',
		),
	);

	$form['editor_info'] = array(
		'#type' => 'textarea',
		'#title' => t('System Description'),
		'#required' => TRUE,
		'#prefix' => '<div id="form_sys_desc" style="margin-bottom: 20px;">',
		'#suffix' => '</div>',
		'#attributes' => array(
			'id' => 'editor_test',
		),
	);

	$form['sub_but'] = array(
		'#type' => 'submit',
		'#value' => t('Add system description'),
		'#attributes' => array(
			'id' => 'add_desc_button',
		),
		'#validate' => array('system_descriptions_new_desc_form_validate'),
		'#submit' => array('system_descriptions_new_desc_form_submit'),

	);

	/* hidden elements */
	$form['problem_name'] = array(
		'#type' => 'hidden',
		'#attributes' => array(
			'id' => 'problem_name'
		)
	);

	$form['folder_name'] = array(
		'#type' => 'hidden',
		'#attributes' => array(
			'id' => 'folder_name'
		)
	);

	$form['section_name'] = array(
		'#type' => 'hidden',
		'#attributes' => array(
			'id' => 'section_name'
		)
	);

	$form['user_name'] = array(
		'#type' => 'hidden',
		'#attributes' => array(
			'id' => 'user_name'
		)
	);

	return $form;
}

function system_descriptions_new_desc_form_validate($form, &$form_state){
	$pname = isset($_REQUEST['p'])?$_REQUEST['p']:null;
	$fname = isset($_REQUEST['f'])?$_REQUEST['f']:null;
	$sname = isset($_REQUEST['s'])?$_REQUEST['s']:null;
	$uname = isset($_REQUEST['u'])?$_REQUEST['u']:null;
	$name = $form_state['values']['file_name_html'];
	$cond = db_and()->condition('sd_folder',$fname)->condition('sd_name',$name)->condition('sd_section',$sname)->condition('sd_pname', $pname);
	$check_q = db_select('system_descriptions','sh')->fields('sh',array('sd_name'))->condition($cond)->execute();
	$row_count = $check_q->rowCount();
	if($row_count>0){
		//duplicate description has been identified
		form_set_error('file_name_html',"A system description with given name already exists");
		return;
	}
			
	form_set_value($form['problem_name'], $pname, $form_state);
	form_set_value($form['folder_name'], $fname, $form_state);
	form_set_value($form['section_name'], $sname, $form_state);			
	form_set_value($form['user_name'], $uname, $form_state);
}

function system_descriptions_new_desc_form_submit($form, &$form_state){
			//add the new description to data base from the input parameters
			$name = $form_state['values']['file_name_html'];
			$user = $form_state['values']['user_name'];
			$section = $form_state['values']['section_name'];
			$folder = $form_state['values']['folder_name'];
			$prob = $form_state['values']['problem_name'];
			$content = $form_state['values']['editor_info'];
			$path = (time()*1000).$name.".html";
			$type = "cketext";
			$save_file = true;
			$q_res = $query=db_insert('system_descriptions')
				->fields(array(
					'sd_name' => ''.$name,
					'sd_folder' => ''.$folder,
					'sd_uname' => ''.$user,
					'sd_pname' => ''.$prob,
					'sd_section' => ''.$section,
					'sd_path' => ''.$path,
					'sd_type' => ''.$type
				))->execute();
			if($save_file){

				$file = drupal_get_path('module', 'system_descriptions').'/uploads/'.$path;
				file_put_contents($file, $content, FILE_APPEND | LOCK_EX);
				echo "file save success!";
			}
			
			$form_state['redirect'] = array(
				'sysdescs',
				array(
					'query' => array(
						'msg' => 'added',
					),
				),
			);	
}





