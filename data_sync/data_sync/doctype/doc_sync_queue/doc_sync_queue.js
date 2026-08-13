// Copyright (c) 2026, vikas moin and contributors
// For license information, please see license.txt

frappe.ui.form.on("Doc Sync Queue", {
	refresh(frm) {
		if (frm.is_new()) return;

		if (frm.doc.status !== "Synced") {
			frm.add_custom_button(__("Retry Now"), () => {
				frappe.call({
					method: "data_sync.sync.retry_entry",
					args: { entry_name: frm.doc.name },
					callback() {
						frappe.show_alert({
							message: __("Queued in background. Refresh in a moment to see the result."),
							indicator: "blue",
						});
						frm.reload_doc();
					},
				});
			});
		}

		if (frm.doc.ref_doctype && frm.doc.ref_docname) {
			frm.add_custom_button(__("Open Document"), () => {
				frappe.set_route("Form", frm.doc.ref_doctype, frm.doc.ref_docname);
			});
		}
	},
});
