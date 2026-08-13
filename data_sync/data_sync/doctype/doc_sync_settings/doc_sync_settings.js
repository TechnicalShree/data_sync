// Copyright (c) 2026, vikas moin and contributors
// For license information, please see license.txt

frappe.ui.form.on("Doc Sync Settings", {
	refresh(frm) {
		// This form contains connection credentials. Prevent the browser from
		// inserting previously saved values into the settings fields.
		[
			"site_identifier",
			"target_url",
			"api_key",
			"api_secret",
			"max_retries",
			"request_timeout",
			"batch_size",
		].forEach((fieldname) => {
			const field = frm.fields_dict[fieldname];
			if (field && field.$input) {
				field.$input.attr("autocomplete", fieldname === "api_secret" ? "new-password" : "off");
			}
		});

		frm.add_custom_button(__("Test Connection"), () => {
			frappe.call({
				method: "data_sync.sync.test_connection",
				freeze: true,
				freeze_message: __("Contacting target server..."),
				callback(r) {
					const res = r.message || {};
					frappe.msgprint({
						title: res.ok ? __("Connected") : __("Connection Failed"),
						indicator: res.ok ? "green" : "red",
						message: frappe.utils.escape_html(String(res.message)),
					});
				},
			});
		});

		frm.add_custom_button(__("Sync Queue"), () => {
			frappe.set_route("List", "Doc Sync Queue");
		});
	},
});
