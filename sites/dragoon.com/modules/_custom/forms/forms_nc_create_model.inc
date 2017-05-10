<?php
function forms_nc_create_model_form($form, &$form_state){
    global $user;
    $name = 'anonymous';
    $rp = 'on';
    if($user->uid){
        $name = $user->name;
        $rp = 'off';
    }

    //call a function which returns all potential folders user model can be created in
    $user_folders = loadUserFolders($name);
    $json = loadNCModels($name,1);


    $form['select_folder'] = array(
        //pump folder options including the user personal folder
        '#type' => 'select',
        '#options' => $user_folders,
        '#id' => 'create_model_folder_name',
        '#title' => t('Choose Folder')
    );

    $form['p'] = array(
        '#type' => 'textfield',
        '#title' => t('Model Name'),
        '#id' => 'create_model_pname'
    );

    $form['m'] = array(
        '#type' => 'hidden',
        '#value' => 'AUTHOR'
    );

    $form['a'] = array(
        '#type' => 'hidden',
        '#value' => 'construction'
    );

    $form['u'] = array(
        '#type' => 'hidden',
        '#value' => $name,
    );

    $form['s'] = array(
        '#type' => 'hidden',
        '#value' => "non-class-models",
    );

    $form['g'] = array(
        '#type' => 'hidden',
        '#value' => $name."-private",
    );

    $form['rp'] = array(
        '#type' => 'hidden',
        '#value' => $rp,
    );

    $form['sm'] = array(
        '#type' => 'hidden',
        '#value' => 'feedback',
    );
    $form['c'] = array(
        '#type' => 'hidden',
        '#value' => 'continue',
    );

    $form['is'] = array(
        '#type' => 'hidden',
        '#value' => 'algebraic',
    );
    $form['submit_button'] = array(
        '#type' => 'submit',
        '#value' => t('Create Model'),
        '#id' => 'create_nc_model'
    );
    $form['z'] = array(
        //stores existing models
        '#type' => 'hidden',
        '#value' => $json,
    );
    $form['cancel_button'] = array(
        '#type' => 'button',
        '#value' => t('Cancel'),
    );
    return $form;
}
