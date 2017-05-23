<?php
function forms_nc_rename_items($form, &$form_state){
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

    $form['choose_item_rename'] = array(
        '#type' => 'radios',
        '#title' => 'Choose a folder or model to edit',
        '#id' => 'item_selected',
        '#options' => array(
            "Folder" => t('Folder'),
            "Model" => t('Model')
        )
    );

    $form['select_folder_item'] = array(
        //pump folder options including the user personal folder
        '#type' => 'select',
        '#options' => $user_folders,
        '#id' => 'original_folder_name',
        '#prefix' => '<div id="ren_folder_label"><b>Choose Folder</b></div>',
        '#attributes' => array(
            'class' => array('element-hide')
        )
    );
    //data item which contains user owned folders
    $form['user_owned_folders'] = array(
        //pump folder options including the user personal folder
        '#type' => 'hidden',
        '#value' => json_encode($user_folders),
    );
    //data item which contains both folders user owns and the ones shared to him
    //this list actually is used to retrieve models from the folders user is shared
    //because user can also rename the models he is shared
    $form['user_shared_folders'] = array(
        //pump folder options including the user personal folder
        '#type' => 'hidden',
        '#value' => $user_folders2,
    );


    $form['select_model_item'] = array(
        //pump folder options including the user personal folder
        '#type' => 'select',
        '#options' => array('Loading Models...'),
        '#id' => 'original_model_name',
        '#prefix' => '<div id="ren_model_label"><b>Choose Model</b></div>',
        '#attributes' => array(
            'class' => array('element-hide')
        )
    );
    $form['select_new_name'] = array(
        //pump folder options including the user personal folder
        '#type' =>  'textfield',
        '#options' => $user_folders,
        '#id' => 'new_item_name',
        '#prefix' => '<div id="rename_label"><b>Choose New Name</b></div>',
        '#attributes' => array(
            'class' => array('element-hide')
        )
    );

    $form['u_ren'] = array(
        '#type' => 'hidden',
        '#value' => $name,
        '#id' => 'current_user_name'
    );

    $form['rename_button'] = array(
        '#type' => 'button',
        '#value' => t('Rename item'),
        '#id' => 'rename_item_button',
        '#attributes' => array(
            'class' => array('btn btn-success element-hide')
        )
    );

    $form['cancel_button'] = array(
        '#type' => 'button',
        '#value' => t('Cancel'),
    );
    return $form;
}
