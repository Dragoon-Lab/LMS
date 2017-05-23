jQuery(document).ready(function($) {

    $('#share_nc_model').click(function () {
        console.log($('#dragoon_nc_manageSharing').serialize());
        $.ajax({
            type: "POST",
            url: "sites/all/modules/_custom/NC_models/static/nonClassUpdates.php",
            data: $('#dragoon_nc_manageSharing').serialize(),
            success: function (data) {
                console.log(data);
                //location.reload();
            },
            error: function (data) {

                console.log("fail");
            }
        });

    });

    //this event-function handles removing an user from shared list of a folder
    $('.glyphShare').on("click",function () {
        var current_glyph = this;
        $('#confirmRemoveShare').modal('show');

        $('#removeShareConfirmed').click(function () {
            $(current_glyph).closest('tr').remove();
            //send an ajax request to complete delete share holder
            var form = document.forms['dragoon_nc_manageSharing'];
            //console.log(form["select_folder"].value,$(current_glyph).closest('tr').find('td span:first').text());

            $.ajax({
                type: "POST",
                url: "sites/all/modules/_custom/NC_models/static/nonClassUpdates.php",
                data: {
                    "req_type": "deleteShareHolder",
                    "folder_id": form["select_folder"].value,
                    "user_id": $(current_glyph.closest('tr')).find('td span:first').text()
                },
                success: function (data) {
                    console.log(data);
                    //location.reload();
                },
                error: function (data) {

                    console.log("fail");
                }

            });

        });

    });

    $("#shareHoldersList").on("click","i.glyphShare",function(){
        var current_glyph = this;
        $('#confirmRemoveShare').modal('show');

        $('#removeShareConfirmed').click(function () {
            $(current_glyph).closest('tr').remove();
            //send an ajax request to complete delete share holder
            var form = document.forms['dragoon_nc_manageSharing'];
            //console.log(form["select_folder"].value,$(current_glyph).closest('tr').find('td span:first').text());

            $.ajax({
                type: "POST",
                url: "sites/all/modules/_custom/NC_models/static/nonClassUpdates.php",
                data: {
                    "req_type": "deleteShareHolder",
                    "folder_id": form["select_folder"].value,
                    "user_id": $(current_glyph.closest('tr')).find('td span:first').text()
                },
                success: function (data) {
                    console.log(data);
                    //location.reload();
                },
                error: function (data) {

                    console.log("fail");
                }

            });

        });
    });

    //sharing a user to a folder
    $('#shareAuser').on("click",function(e){
        e.preventDefault();
        var uemail = $('#share_user_name').val();
        //console.log("uemail is",uemail);
        if(uemail == ''){
            console.log("email empty");
            $('#share_user_name').addClass('focusedtextselect');
            $('#share_user_name').attr("placeholder","email can not be empty");
            return;
        }
        var form = document.forms['dragoon_nc_manageSharing'];
        if(uemail == form["selfEmail"].value){
            console.log("self email",form["selfEmail"].value);
            $('#share_user_name').attr("placeholder","");
            $('#share_user_name').val('');
            //$('#share_user_name').addClass('focusedtextselect');
            $('#share_user_name').attr("placeholder","can not share with yourself");
            return;
        }
        console.log(form["sh_user_name"].value,form["select_folder"].value);
        $.ajax({
            type: "POST",
            url: "sites/all/modules/_custom/NC_models/static/nonClassUpdates.php",
            data: {
                "req_type": "validateSharedHolder",
                "user_email": form["sh_user_name"].value,
                "folder_id": form["select_folder"].value
            },
            success: function (data) {
                console.log("data is",data);
                if(data == "fail"){
                    console.log("invalid email address");
                    $('#share_user_name').val('');
                    $('#share_user_name').removeClass('focusedtextsuccess');
                    $('#share_user_name').addClass('focusedtextselect');
                    $('#share_user_name').attr("placeholder","invalid email address");
                    return;
                }
                else if(data == "duplicate"){
                    console.log(data);
                    $('#share_user_name').val('');
                    $('#share_user_name').removeClass('focusedtextsuccess');
                    $('#share_user_name').addClass('focusedtextselect');
                    $('#share_user_name').attr("placeholder","this user is already in the shared list");
                    return;
                }
                else{
                    var uname = data.split("-");
                    uname = uname[1];
                    console.log(data);
                    $('#share_user_name').val('');
                    $('#share_user_name').removeClass('focusedtextselect');
                    $('#share_user_name').addClass('focusedtextsuccess');
                    $('#share_user_name').attr("placeholder","shared succesfully !");
                    //now place this user in the users list
                    var newTr = "<tr class='eachSharedHolder'>"+
                                "<td><div class='sharedUserContent'><span>"+uname+"</span><br><span class='sharedHolderEmail'>"+uemail+"</span></div></td>"+
                                "<td><i class='glyphicon glyphicon-remove glyphShare' title='Unshare User' data-toggle='modal'></td>"+
                                "</tr>";
                    $('#shareHoldersList').append(newTr);

                }
            },
            error: function (data) {
                console.log(data,"failed");
            }

        });
    });

    $('#folder_list').on("change",function(){
        $('#share_user_name').removeClass('focusedtextselect');
        $('#share_user_name').removeClass('focusedtextsuccess');
        $('#share_user_name').removeAttr('placeholder');
        var current_folder = $(this).val();
        //console.log(current_folder);
        $('#shareHoldersList').html('');
        $.ajax({
            type: "POST",
            url: "sites/all/modules/_custom/NC_models/static/nonClassUpdates.php",
            data: {
                "req_type": "getUserList",
                "folder_id": current_folder
            },
            success: function (data) {
                var userData = data.split(",");
                console.log(userData);
                for(var i=0;i<userData.length;i++)
                {
                    var newUser = userData[i];
                    if(newUser != "") {
                        var udet = newUser.split("-");
                        var uname = udet[0];
                        var uemail = udet[1];
                        console.log(uname, uemail);
                        var newTr = "<tr class='eachSharedHolder'>" +
                            "<td><div class='sharedUserContent'><span>" + uname + "</span><br><span class='sharedHolderEmail'>" + uemail + "</span></div></td>" +
                            "<td><i class='glyphicon glyphicon-remove glyphShare' title='Unshare User' data-toggle='modal'></td>" +
                            "</tr>";
                        $('#shareHoldersList').append(newTr);

                    }
                }
            },
            error: function(data){
                console.log(data);
            }
        });
    });

    $('#shareDone').click(function(){
        location.reload();
    })
});
