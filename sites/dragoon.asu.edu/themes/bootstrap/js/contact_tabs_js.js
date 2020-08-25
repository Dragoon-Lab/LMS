/**
 * Created by RiteshSamala on 6/22/16.
 */
//note: please use closures
//make sure jQuery is passed as an argument as $ alone does not work in drupal
//make sure to test document is ready
(function ($) {
    $(document).ready(function(){

        $('#tab2showteam').click(function (e) {
            console.log("first tab clicked");
            e.preventDefault();
            $('a[href="' + $(this).attr('href') + '"]').tab('show');
        });

        //active specific tabs and scroll down if source is faqlink
        activetabs();

        function activetabs() {
            if (window.location.href.indexOf("faqlink2team") > -1){
                $('body').animate({
                    scrollTop: $("#block-views-contact-tabs-view-block").offset().top
                }, 1000);
                $('.nav-tabs a[href="#tab-1-1"]').tab('show');
            }
            if(window.location.href.indexOf("faqlink2grant") > -1){
                $('body').animate({
                    scrollTop: $("#block-views-contact-tabs-view-block").offset().top
                }, 1000);
            }

        }
        //this functionality is not related to tabs
        //we temporarily fit a place for this code which replaces the asu username with drupal username
        var is_logged_in = $('#asu_hdr_sso').text() == "Sign Out";

        if(is_logged_in){
            console.log("should update asu user name with dragoon user name",drupal_username);
            //find the division where asu username is being displayed, remove that li and add a drupal username li
            var check_for_logout = $('#asu_login_module li:first a').html();
            if(check_for_logout != "Sign Out")
                $('#asu_login_module li:first').html(drupal_username);
                console.log("new menu",$('#asu_universal_nav_new').html());
        }



    });
})(jQuery);