// Copyright (c) 2026, vikas moin and contributors
// For license information, please see license.txt

frappe.ui.form.on("Doc Sync Settings", {
	refresh(frm) {
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
