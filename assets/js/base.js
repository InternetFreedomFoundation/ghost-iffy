/*
Iffy Theme
https://github.com/internetfreedomfoundation/iffy
Copyright (c) 2016-2017 Internet Freedom Foundation
*/
window.trackDonation = function (type, amount, method) {
	if (type === 'one-time') {
		plausible('donation', { props: { type: 'one-time', amount: amount, method: method } })
	}
	if (type === 'recurring') {
		plausible('donation', { props: { type: 'recurring', amount: amount, method: method } })
	}
}

if (window.razorpayId) {
	window.donate = function (amount) {
		var oneTimefullname = $('#donateOneTimeFullname').val()
		var oneTimepan = $('#donateOneTimePan').val()
		var oneTimeAddress = $('#donateOneTimeAddress').val()
		var promise = new Promise(function (resolve) {
			new Razorpay({
				key: window.razorpayId,
				amount: amount * 100,
				name: window.razorpayName,
				description: window.razorpayDescription,
				prefill: {
					"name": oneTimefullname,
				},
				notes: {
					"NAME": oneTimefullname,
					"PAN": oneTimepan,
					"ADDRESS": oneTimeAddress,
				},
				handler: resolve
			}).open();
		}).then(() => {
			window.trackDonation('one-time', amount, 'unknown')
		});

		if (window.onDonate) return promise.then(onDonate);
		return promise;
	}
}

/**
 * Helper function for POSTing data as JSON with fetch.
 */
async function postFormDataAsJson({ url, formData }) {
	const plainFormData = Object.fromEntries(formData.entries());

	var planMap = {
		"plan_LZE0Tlk0RfSHwy": 100,
		"plan_LZE55rEq3kjtqn": 750,
		"plan_LZFgMUbNksuFHf": 2000,
		"plan_LZFjJpwgImVheg": 5000,
		"plan_LZFlokJYeyFFg0": 10000,
		"plan_LZFqRtuvf6tT0C": 100000,
		"plan_LZFriB0wFn3a4t": 500000
	};
	var amount = planMap[plainFormData.plan];

	formPayload = {
		"plan": plainFormData.plan,
		"name": plainFormData.name,
		"email": plainFormData.email,
		"contact": plainFormData.contact,
		"pan": plainFormData.pan,
		"max_amount": amount,
		"address": {
			"address_line1": plainFormData.address_line1,
			"pincode": parseInt(plainFormData.pincode)
		},
		"type": plainFormData.type
	}

	const formDataJsonString = JSON.stringify(formPayload);

	const fetchOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: formDataJsonString,
	};

	const response = await fetch(url, fetchOptions);

	if (!response.ok) {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	}

	const subscriptionResponse = await response.json();

	var promise = new Promise(function (resolve) {
		new Razorpay({
			key: window.razorpaySubscriptionId,
			subscription_id: subscriptionResponse.id,
			name: window.razorpayName,
			description: window.razorpayDescription,
			prefill: {
				"name": plainFormData.name,
				"email": plainFormData.email,
				"contact": plainFormData.contact
			},
			notes: {
				"REFERENCE": subscriptionResponse.reference
			},
			handler: resolve
		}).open();
	});

	return promise;
}

/**
 * Event handler for a submit form submit event.
 */
async function handleFormSubmit(event) {
	event.preventDefault();

	const form = event.currentTarget;
	const url = form.action;

	try {
		const formData = new FormData(form);
		await postFormDataAsJson({ url, formData });
		form.reset();
	} catch (error) {
		alert("Something went wrong, Please try again later");
		form.reset();
	}
}

const DonateForm = document.getElementById("subscription-form");
DonateForm.addEventListener("submit", handleFormSubmit);

$(function () {
	// Toggle the menu when the logo is clicked on mobile
	$('.logo').click(function (event) {
		if ($('.toggle-menu').css('display') !== 'none') {
			$('.menu').toggleClass('show');
			return false;
		}
	});

	// Fire change handlers on radio buttons that become deselected
	$('input[type=radio]').change(function (event) {
		if (!event.target.checked) return;
		$('input[type=radio][name=' +
			event.target.name + ']').each(function () {
				if (this !== event.target) $(this).change();
			});
	});

	// Toggle element visibility on checkbox / radio button change
	$('[data-toggle]').change(function (event) {
		var toggle = event.target.getAttribute('data-toggle'),
			state = event.target.checked;

		$('.if-' + toggle)[state ? 'addClass' : 'removeClass']('show');
	}).change();
});
