jQuery(document).ready(function($) {

    var model_select = $('#select_source_model');
    var dest_select = $('#select_destination_folder');
    var src_select = $('#select_source_folder');
    var move_button = $('#move_model');
    var copy_button = $('#copy_model');

    $('.modAction').on("click",function(){
       console.log($(this).html());
        var form = document.forms['dragoon_nc_move_models'];
        if($(this).html()=="Copy Models"){
           move_button.hide();
           copy_button.show();
           src_select.find('option').remove();
           var new_folders2 = form["source_folder_data2"].value;
           new_folders2 = jQuery.parseJSON(new_folders2);
           for(var key in new_folders2){
               var temp_option2 = new Option(new_folders2[key],key);
               src_select.append($(temp_option2));
           }
        }
        else{
           copy_button.hide();
           move_button.show();
           src_select.find('option').remove();
           var new_folders = form["source_folder_data"].value;
           new_folders = jQuery.parseJSON(new_folders);
           for(var key in new_folders){
               var temp_option = new Option(new_folders[key],key);
               src_select.append($(temp_option));
           }
        }
        //call adjustModels initially to load models corresponding to the folders
        adjustModels();
    });


    //function 1 Adjust Models function loads models to select models section based on the current folder
    var adjustModels = function(){
        var current_folder = src_select.val();
        //console.log("current folder",current_folder);
        //make a call to Dragoon API to get models for the current folder
        $.ajax({
            type: "POST",
            url: $("#dragoon_url").val()+"global.php",
            data: {
                "t": "reqNonClassProblems",
                "g" : current_folder
            },
            success: function (data) {
                console.log("success");
                var model_data = jQuery.parseJSON(data);
                console.log(model_data)
                if(model_data["error"] !== undefined){
                    var option1 = new Option("No modes found in current folder", "None");
                    var option2 = new Option("Select a model to move or copy","None");
                    model_select.append($(option1));
                    dest_select.append($(option2));
                    model_select.val("None");
                    dest_select.val("None");
                    model_select.attr("disabled",true);
                    dest_select.attr("disabled",true);
                    buttonHandler(true);
                }
                else{
                    model_select.attr("disabled",false);
                    model_select.find('option').each(function(){ $(this).remove();});
                    for(var key in model_data){
                        var temp_option = new Option(key,model_data[key]);
                        model_select.append($(temp_option));
                    }
                    //if a model is available to copy/move to a destination
                    //Enable the select destination box removing the source folder from list
                    dest_select.attr("disabled",false);
                    //remove all current options
                    dest_select.find('option').remove();
                    //add all options from source except the current one
                    src_select.find('option').each(function(){
                        if($(this).val() !== src_select.val()) {
                            var temp_option = $(this).clone();
                            dest_select.append(temp_option);
                        }
                    });
                    buttonHandler(false);
                }
            },
            error: function (data) {
                console.log(data,"failed");
            }

        });

    };
    //function 2 buttonHandler either disables or enables the move/copy buttons based on the select boxes
    var buttonHandler = function(status){
        $('#move_model').attr("disabled",status);
        $('#copy_model').attr("disabled",status);
       // $('#move_model').attr("title")
    };
    //function 3 callServer calls server requesting to move or copy a model
    var modelAction = function(action){
        var form = document.forms['dragoon_nc_move_models'];
        var user = form["u"].value;
        console.log();
        $.ajax({
            type: "POST",
            url: $("#dragoon_url").val()+"global.php",
            data: {
                "t": "modelAction",
                "action": action,
                "src": src_select.val(),
                "mod": model_select.val(),
                "dest": dest_select.val(),
                "user": user
            },
            success: function (data) {
                console.log("moved", data);
                //location.reload();
            },
            error: function (data) {
                console.log("move failed", data);
            }
        });
    };

    //event 1 : change in source folder value
    src_select.on("change",function(){
        console.log("changed");
        adjustModels();
    });
    //event2 : Copy/Move Models via button clicks
    move_button.on("click", function(e){
        e.preventDefault();
        $('#confirmModelCopy').modal('show');
        $('#confirmModelCopy .modal-body').html('<p>Are you sure you want to move model <b style="color: #000011">'+model_select.val()+'</b> from <b style="color: #000011">'+ src_select.val()+ '</b> to <b style="color: #000011">'+ dest_select.val() +'</b> ?</p>');
        $('#copyModelConfirmed').on("click", function(){ modelAction("moveModel"); });
    });

    copy_button.on("click", function(e){
        e.preventDefault();
        $('#confirmModelCopy').modal('show');
        $('#confirmModelCopy .modal-body').html('<p>Are you sure you want to copy model <b style="color: #000011">'+model_select.val()+'</b> from <b style="color: #000011">'+ src_select.val()+ '</b> to <b style="color: #000011">'+ dest_select.val() +'</b> ?</p>');
        $('#copyModelConfirmed').on("click", function(){ 
            //final checks have to be performed to confirm if the user is still shared the folder 
            //from which he wants to copy the folder
            var form = document.forms['dragoon_nc_move_models'];
            var user = form["u"].value;
            var owner = src_select.val().split("-");
            console.log("owner is",owner);    
            if(owner[1] == user || owner[0] == "private")
                modelAction("copyModel");
            else{
                console.log("contacting check sharing");
                $.when(checkSharing(src_select.val(),user)).done(function(share_check){
                    console.log(typeof share_check, share_check);
                    if(share_check == '0'){
                        console.log("indicate lack of sharing");
                        $('#alertDisabledSharing').modal('show');
                        return;
                    } 
                    modelAction("copyModel");
                });
            }
            //modelAction("copyModel"); 
        });
    });
    var checkSharing = function(folder_id,user){
        return $.ajax({
            type: "POST",
            url: "sites/all/modules/_custom/NC_models/static/nonClassUpdates.php",
            data: {'folder_id': folder_id, 'req_type': 'checkSharing', 'user': user},
            success: function (data) {
                console.log("success");
            },
            error: function (data) {
                console.log("fail");
            }
        });
    };
});
