<?php
// You need to add server side validation and better error handling here

$data = array();

if(isset($_GET['files']))
{  
    $error = false;
    $files = array();
    $path = $_GET["path"];
    $uploaddir = '/dragoon/lms/topomath-sysdesc-uploads/';
    print_r($_FILES);
    foreach($_FILES as $file)
    {
        if(move_uploaded_file($file['tmp_name'], $uploaddir .basename($path)))
        {
            $files[] = $uploaddir .$file['name'];
        }
        else
        {
            $error = true;
        }
    }
    $data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files);
}
else
{
    $data = array('success' => 'Form was submitted', 'formData' => $_POST);
}

echo json_encode($data);