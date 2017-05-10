jQuery(document).ready(function($) {

    $('#create_nc_model').click(function(e){
        e.preventDefault();
        // make sure folder name is not empty and also the folder with same name exists
        var model_name = $('#create_model_pname').val();
        var owner=$('#dragoon_ncCModel_form input[name=u]').val();
        console.log("form check parameters", model_name, owner);
        checkValidity(model_name,owner);
    });




    function checkValidity(model_name,owner){
        //empty case
        if(model_name == ''){
            //
            console.log("problem name is empty");
            $('#create_model_pname').addClass('focusedtextselect');
            $('#create_model_pname').attr("placeholder","Model Name can not be empty");
            return;
        }

        //duplicate model case
        var existing_models=$('#dragoon_ncCModel_form input[name=z]').val();
        var folder_name = $('#create_model_folder_name').val().split("-");
        if(folder_name[1] != "private")
            folder_name = folder_name[0];
        else
            folder_name = "private";

        //console.log("existing models",existing_models,folder_name,model_name);
        var toCheck=JSON.parse(existing_models);
        if(folder_name != ""){
            $.each(toCheck.private,function(key,val){
                console.log(key,val,model_name,typeof val)
                if(typeof val == "string" &&  key == model_name){
                    reportDupModels(model_name);
                    return;
                }
                else if(typeof val == "object"){
                    $.each(val,function(mname,mvalue){
                        if(typeof mvalue == "string" && mname == model_name){
                            reportDupModels(model_name);
                        }
                    });
                }
            });
        }
        console.log("creating Model");
        createModel();
    }

    var createModel = function(){
        var form = document.forms['dragoon_ncCModel_form'];
        $('#create_model_pname').removeClass("focusedtextselect");
        $('#createModelModal').modal('hide');
        var url = $("#dragoon_url").val()+"index.php";
        form.setAttribute("action", url);
        form.setAttribute("target", "_blank");
        form.setAttribute("method", "POST");
        form["g"].value = $('#create_model_folder_name').val();
        form.submit();
        setTimeout(function(){
            location.reload();
        },2000);
    }

    var reportDupModels = function(model_name){
        console.log("problem name is duplicate");
        $('#create_model_pname').addClass('focusedtextselect');
        $('#create_model_pname').val('');
        $('#create_model_pname').attr("placeholder",model_name+" already exists");
        throw new duplicateModelException("duplicate model");

    }

    function duplicateModelException(message) {
        this.message = message;
        this.name = "UserException";
    }
});
