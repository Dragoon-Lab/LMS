<?php
function forms_nc_move_models($form, &$form_state){
    global $user;
    $name = 'anonymous';
    $rp = 'on';
    if($user->uid){
        $name = $user->name;
        $rp = 'off';
    }

    //call a function which returns all potential folders user model can be created in
    $user_folders = loadUserFolders($name);
    $user_folders2 = json_encode(loadUserFolders2($name));
    $form['source_folder'] = array(
        //pump folder options including the user personal folder
        '#type' => 'select',
        '#options' => $user_folders,
        '#id' => 'select_source_folder',
        '#title' => t('Choose Folder')
    );
    //make an alternative source folder for copy option
    $form['source_folder_data'] = array(
        //pump folder options including the user personal folder
        '#type' => 'hidden',
        '#value' => json_encode($user_folders),
    );
    $form['source_folder_data2'] = array(
        //pump folder options including the user personal folder
        '#type' => 'hidden',
        '#value' => $user_folders2,
    );


    $form['source_model'] = array(
        //pump folder options including the user personal folder
        '#type' => 'select',
        '#options' => array('Loading Models...'),
        '#id' => 'select_source_model',
        '#title' => t('Choose Model')
    );
    $form['destination_folder'] = array(
        //pump folder options including the user personal folder
        '#type' =>  'select',
        '#options' => $user_folders,
        '#id' => 'select_destination_folder',
        '#title' => t('Choose Destination Folder')
    );

    $form['u'] = array(
        '#type' => 'hidden',
        '#value' => $name,
        '#id' => 'current_user_name'
    );

    $form['copy_button'] = array(
        '#type' => 'button',
        '#value' => t('Copy model'),
        '#id' => 'copy_model'
    );
    $form['move_button'] = array(
        '#type' => 'button',
        '#value' => t('Move model'),
        '#id' => 'move_model',
    );

    $form['cancel_button'] = array(
        '#type' => 'button',
        '#value' => t('Cancel'),
    );
    return $form;
}
