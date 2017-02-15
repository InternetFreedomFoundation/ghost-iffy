$(function () {
	var
		to = encodeURIComponent($('#campaign-email-to').text()) || '',
		bcc = encodeURIComponent($('#campaign-email-bcc').text()) || '',
		subject = encodeURIComponent($('#campaign-email-subject').text()) || '',
		body = encodeURIComponent($('#campaign-email-body').text()) || '',
		next = $('#campaign-next').text() || '/',
		head = "mailto:" + to + "?subject=" + subject +
			"&bcc=" + bcc,
		full = head + '&body=' + body,
		gmail = "https://mail.google.com/mail/u/0/?view=cm&source=mailto" +
			"&to=" + to + "&bcc=" + bcc + "&su=" + subject,
		yahoo = "http://compose.mail.yahoo.com/" +
			"?To=" + to + "&Subject=" + subject + "&Bcc=" + bcc,
		canOpenFull = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera\sMini/i
			.test(navigator.userAgent) &&
			!/IEMobile/i.test(navigator.userAgent),
		started = false,
		copied = false,
		container = $('.campaign-email-panel');

	function render() {
		container.empty();
		if (!started) {
			if (canOpenFull) {
				container.append([
					$('<button>').html('Send email').click(open(full)),
				]);
			} else {
				container.append([
					$('<button>').html('Start').click(copy),
				]);
			}
		} else {
			if (!copied) {
				container.append(
					$('<p>').html('Copy the email below, open your mail app, ' +
						'paste and send!'),
				);
			} else {
				container.append(
					$('<p>').html('<b>Copied the email!</b> Now open ' +
						'your mail app, paste and send!')
				);
			}
			container.append([
				$('<button>').html('Gmail').click(open(gmail)),
				' ',
				$('<button>').html('Yahoo').click(open(yahoo)),
				' ',
				$('<button>').html('System Email App').click(open(head))
			]);
		}

		container.append([
			' ',
			$('<a>').html('View email').attr('href', '#')
				.click(manual)
		]);

		if (started && !copied) manual();
	}

	$('.campaign-email-manual').hide();

	function open(url) {
		return function(event) {
			window.open(url);
			location.href = next;
			event.preventDefault();
		}
	}

	function copy() {
		started = true;
		select($('#campaign-email-body')[0]);
		copied = document.execCommand('copy');
		render();
	}

	function manual() {
		$('.campaign-email-manual').show();
	}

	function select(text) {
		var range, selection;
		if (document.body.createTextRange) {
			range = document.body.createTextRange();
			range.moveToElementText(text);
			range.select();
		} else if (window.getSelection) {
			range = document.createRange();
			range.selectNodeContents(text);
			selection = window.getSelection();
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}

	$('.campaign-email-field').click(function (e) {
		select(e.target);
	});

	render();
});
