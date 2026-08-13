# Copyright (c) 2026, vikas moin and contributors
# For license information, please see license.txt

from frappe.model.document import Document


class DocSyncQueue(Document):
	def before_insert(self):
		if not self.status:
			self.status = "Queued"
		if not self.idempotency_key:
			self.idempotency_key = None
