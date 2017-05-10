(function($) {
	//Initialising Accordion
	/*$(".accordion").tabs(".pane", {
		tabs: '> h2',
		effect: 'slide',
		initialIndex: null
	});*/

	//The click to hide function
	$(document).ready(function(){
		$(".accordion > h2").click(function() {
			if ($(this).hasClass("current") && $(this).next().queue().length === 0) {
				$(this).next().slideUp();
				$(this).removeClass("current");
			} else if (!$(this).hasClass("current") && $(this).next().queue().length === 0) {
				$(this).next().slideDown();
				$(this).addClass("current");
			}
		});
	});
})(jQuery);
