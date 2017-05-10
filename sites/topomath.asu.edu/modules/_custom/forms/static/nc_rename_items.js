jQuery(document).ready(function($) {
    //create variables for input items to be modified via jQuery selectors
    var item_to_rename = $('#item_selected');
    var original_folder = $('#original_folder_name');
    var original_model = $('#original_model_name');
    var new_name = $('#new_item_name');
    var rename_button = $('#rename_item_button');
    var form = document.forms['dragoon_nc_rename_items'];
    var user_name = form["u_ren"].value;

    //First Event
    //User will make a choice about what he wants to rename
    //read the choice and make appropriate action

    item_to_rename.on("change",function(){
        //show folder label and hide model label
        $('#ren_folder_label').show(); $('#rename_label').show();
        //show rename button
        rename_button.show();
        original_folder.find('option').remove();
        var inp = $("input[name='choose_item_rename']:checked").val();
        console.log("user wants to rename", inp);
        if(inp == "Folder"){
            console.log("showing folder list");
            var own_folders = form["user_owned_folders"].value;
            own_folders = jQuery.parseJSON(own_folders);
            for(var key in own_folders){
                if(own_folders[key]!= 'My "Private" Folder') {
                    var temp_option2 = new Option(own_folders[key], key);
                    original_folder.append($(temp_option2));
                }
            }
            original_folder.show();
            new_name.show();
            new_name.attr("disabled",false);
            new_name.attr("placeholder","");
            original_model.hide();
            //hide model label
            $('#ren_model_label').hide();
        }
        else if(inp == "Model"){
            var shared_folders = form["user_shared_folders"].value;
            shared_folders = jQuery.parseJSON(shared_folders);
            for(var key in shared_folders){
                var temp_option = new Option(shared_folders[key],key);
                original_folder.append($(temp_option));
            }
            original_folder.show();
            original_model.show();
            retrieveModels();
            new_name.show();
            //show model label
            $('#ren_model_label').show();
        }
    });


    //retrieve models helper function
    var retrieveModels = function() {
        var current_folder = original_folder.val();
        //console.log("current folder",current_folder);
        //make a call to Dragoon API to get models for the current folder
        $.ajax({
            type: "POST",
            url: $("#dragoon_url").val()+"global.php",
            data: {
                "t": "reqNonClassProblems",
                "g": current_folder
            },
            success: function (data) {
                console.log("success");
                var model_data = jQuery.parseJSON(data);
                console.log(model_data)
                if (model_data["error"] !== undefined) {
                    var option1 = new Option("No modes found in current folder", "None");
                    original_model.append($(option1));
                    original_model.val("None");
                    original_model.attr("disabled", true);
                    new_name.attr("placeholder","model has to be selected to rename");
                    new_name.attr("disabled",true);
                }
                else {
                    original_model.attr("disabled", false);
                    new_name.attr("disabled",false);
                    original_model.find('option').each(function () {
                        $(this).remove();
                    });
                    for (var key in model_data) {
                        var temp_option = new Option(key, model_data[key]);
                        original_model.append($(temp_option));
                    }
                }
            },
            error: function (data) {
                console.log(data, "failed");
            }

        });
    }

    //event 2 , on change of folder
    original_folder.on("change",function(){
        var inp = $("input[name='choose_item_rename']:checked").val();
        if(inp == "Model"){
            retrieveModels();
        }
    });

    //event 3 , on clicking the rename button
    rename_button.on("click",function(e){
        e.preventDefault();
        var new_val = new_name.val();
        //check if the new name is empty and if so alert

        if(new_val == ""){
            $('#rename_label').append('<b style="color: red">  New name cannot be empty !</b>');
            return;
        }

        var orig_fol_name = original_folder.val();
        var to_change = $("input[name='choose_item_rename']:checked").val();

        if(to_change == "Folder"){
            var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
            if (pattern.test(new_val)) {
                $('#rename_label').append('<b style="color: red">  New Folder name cannot contain special characters !</b>');
                //alert("Please only use standard alphanumerics");
                return;
            }
        }

        if(to_change == "Folder"){
            //step 1 : update local folder names
            console.log(new_val,orig_fol_name);
            $.ajax({
                type: "POST",
                url: "sites/all/modules/_custom/NC_models/static/nonClassUpdates.php",
                data: {'old_folder_id': orig_fol_name, 'new_folder_id': new_val+"-"+user_name, 'new_folder_name': new_val, 'req_type': 'renameFolder'},
                success: function (data) {
                    console.log(data);
                    renameAction("Folder");
                },
                error: function (data) {
                    console.log("fail");
                }
            });
            //step 2 : update all group names on dragoon
        }
        else if(to_change == "Model"){
            //update only problem names on dragoon where folder name is the given
            //a check has to be performed if any last minute sharing has been disabled for the folder to the user
            //who is trying to rename the model inside it
            var check_owner = orig_fol_name.split("-");
            if(check_owner[1].trim() != user_name.trim()){
                //if the owner is not the one who is renaming the model then we need to check if sharing has been disabled
                //in the last minute
                $.when(checkSharing(orig_fol_name,user_name)).done(function(share_check){
                //console.log(typeof share_check, share_check);
                if(share_check == '0'){
                    console.log("indicate lack of sharing");
                    $('#alertDisabledSharing').modal('show');
                    return;
                } 
                renameAction("Model");
            });
            }
        }
    });

    var renameAction = function(action){
        var input = {};
        input["old_folder"] = original_folder.val();
        if(action == "Model") {
            input["old_model"] = original_model.val();
            input["new_item"] = new_name.val();
        }
        else
            input["new_item"] = new_name.val() + "-" + user_name;

        input["action"] = action;
        input["t"] = "renameItems";
        console.log(input);

        $.ajax({
            type: "POST",
            url: $("#dragoon_url").val()+"global.php",
            data: input,
            success: function (data) {
                console.log("renamed", data);
                location.reload();
            },
            error: function (data) {
                console.log("rename failed", data);
            }
        });
    };

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
