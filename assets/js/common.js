$(function() {
	$('.logo').click(function (event) {
		if($('.toggle-menu').css('display') !== 'none') {
			$('.menu').toggleClass('show');
			return false;
		}
	});

	$('input[type=radio]').change(function (event) {
		if (!event.target.checked) return;
		$('input[type=radio][name=' +
			event.target.name + ']').each(function () {
			console.log(event.target.name, this === event.target);
			if (this !== event.target) $(this).change();
		});
	});

	$('[data-toggle]').change(function (event) {
		var toggle = event.target.dataset.toggle,
			state = event.target.checked;

		$('.if-' + toggle)[
			state ? 'addClass' : 'removeClass']('show');
	}).change();
});
