<?php
function forms_nc_delete_folder_form($form, &$form_state){
	global $user;
	$user_name = 'anonymous';
	if($user->uid){
		$user_name = $user->name;
	}
    //load private and shared folders

    $json = loadNCModels($user_name,1);
    $data = json_decode($json, true);

    forms_show_del_tree($data,$form, 'none');

    //following element separates out delete button
    if(isset($data["shared"])){
        $form['finish'] = array(
            '#markup' => '</div>'
        );
    }
    $form['owner'] = array(
		'#type' => 'hidden',
        '#value' => $user_name,
        '#id' => "folder_owner"
	);
    $form['req_type'] = array(
        '#type' => 'hidden',
        '#value' => 'delete Folder',
    );
	$form['submit_button'] = array(
		'#type' => 'submit',
		'#value' => t('Delete folder'),
		'#id' => 'delete_nc_folder',
	);

    $form['cancel_button'] = array(
        '#type' => 'button',
        '#value' => t('Cancel'),
    );

	return $form;
}


function forms_show_del_tree($data, &$form, $parent){
    foreach ($data as $a => $b) {

        if (is_array($b)) {
            if (!($a == "private" || $a == "shared")) {
                $form['fo'.'-'.$a .'-'. uniqid()] = array(
                    '#prefix' => '<div class="accordion"><h2>',
                    '#type' => "checkbox",
                    '#title' => t($a),
                    '#suffix' => '</h2><div class="pane">',
                    '#tree' =>true
                );
            } else {
                $form[$a .'-'. uniqid()] = array(
                    '#prefix' => '<div class="accordion"><h2 data-folder='.$a.'>',
                    '#markup' => t($a),
                    '#suffix' => '</h2><div class="pane">',
                    '#tree' =>true
                );
            }
            forms_show_del_tree($b, $form,$a);
        } else {

            $ls = '';
            $las_elem = end($data);
            if ($las_elem == $b) {
                $ls = '</div></div>';
            }
            if(trim($a) !== trim("No models ")) {
                $form['mo'.'-'.$a .'-'. uniqid().'-'.$parent] = array(
                    '#prefix' => '<p>',
                    '#type' => 'checkbox',
                    '#title' => t($a),
                    '#suffix' => '</p>' . $ls,
                    '#tree' =>true
                );
            }
            else{
                $form[$a .'-'. uniqid()] = array(
                    '#prefix' => '<p style="color: #de151f">',
                    '#markup' => 'No Models Present',
                    '#suffix' => '</p>' . $ls,
                    '#tree' =>true
                );
            }
        }

    }
}


