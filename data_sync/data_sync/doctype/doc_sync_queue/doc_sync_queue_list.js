frappe.listview_settings["Doc Sync Queue"] = {
	add_fields: ["status"],
	get_indicator(doc) {
		const colors = {
			Queued: "orange",
			Synced: "green",
			Failed: "red",
			Skipped: "gray",
		};
		return [__(doc.status), colors[doc.status] || "gray", "status,=," + doc.status];
	},
};
