# Copyright (c) 2026, vikas moin and contributors
# For license information, please see license.txt
"""Endpoints the other server calls. Both require API key authentication."""

import frappe
from frappe.utils import now

from data_sync import sync


@frappe.whitelist()
def ping():
	"""Used by Test Connection on Doc Sync Settings."""
	settings = sync.get_settings()
	return {
		"message": "ok",
		"site_identifier": settings.site_identifier if settings else None,
		"enabled": bool(settings.enabled) if settings else False,
		"user": frappe.session.user,
	}


@frappe.whitelist(methods=["POST"])
def receive(doctype, docname, event, origin_site, idempotency_key, payload):
	"""Accept one document change from the other server and apply it here."""
	if frappe.session.user == "Guest":
		raise frappe.PermissionError

	settings = sync.get_settings()
	if not settings or not settings.enabled:
		frappe.throw("Data Sync is disabled on this server")

	if origin_site and settings.site_identifier and origin_site == settings.site_identifier:
		# Same Site Identifier on both servers - this would loop forever.
		frappe.throw(
			f"Origin site '{origin_site}' matches this server's Site Identifier. "
			"Give each server a distinct Site Identifier."
		)

	entry, is_duplicate = sync.log_incoming(
		doctype=doctype,
		docname=docname,
		event=event,
		origin_site=origin_site,
		idempotency_key=idempotency_key,
		payload=payload,
	)

	if is_duplicate and entry.status == "Synced":
		return {"ok": True, "duplicate": True, "queue_entry": entry.name}

	frappe.db.commit()
	sync.apply_entry(entry.name)

	result = {"ok": True, "queue_entry": entry.name, "applied_on": now()}
	entry.db_set("response", frappe.as_json(result), update_modified=False)
	frappe.db.commit()

	return result
