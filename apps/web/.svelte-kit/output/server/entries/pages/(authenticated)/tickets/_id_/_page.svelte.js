import { $ as clsx, Q as attr, a as bind_props, c as ensure_array_like, et as escape_html, f as spread_props, i as attributes, l as head, o as derived, p as stringify } from "../../../../../chunks/dev.js";
import { B as Button, H as Separator, I as CalendarIcon, U as cn, a as TelegramLogoIcon, o as TagIcon, p as PaperclipIcon, r as UserIcon, x as ClockIcon } from "../../../../../chunks/navigation.js";
import { a as Select_content, i as Select_trigger, o as Select_item, r as Textarea, s as Select, t as Status_badge } from "../../../../../chunks/status-badge.js";
import { a as Field, i as Field_set, n as Field_label, r as Field_group, t as Field_description } from "../../../../../chunks/field.js";
//#region src/lib/components/ui/card/card.svelte
function Card($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, size = "default", $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "card",
			"data-size": size,
			class: clsx(cn("group/card flex flex-col gap-4 overflow-hidden rounded-lg bg-card py-4 text-xs/relaxed text-card-foreground ring-1 ring-foreground/10 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 *:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/card/card-content.svelte
function Card_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "card-content",
			class: clsx(cn("px-4 group-data-[size=sm]/card:px-3", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/card/card-description.svelte
function Card_description($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<p${attributes({
			"data-slot": "card-description",
			class: clsx(cn("text-xs/relaxed text-muted-foreground", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></p>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/card/card-header.svelte
function Card_header($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "card-header",
			class: clsx(cn("group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-lg px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/card/card-title.svelte
function Card_title($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "card-title",
			class: clsx(cn("font-heading text-sm font-medium", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/features/tickets/components/ticket-description.svelte
function Ticket_description($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ticket } = $$props;
		$$renderer.push(`<div class="space-y-6"><div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div class="space-y-1"><div class="flex items-center gap-2"><span class="text-xs font-bold tracking-wider text-muted-foreground uppercase">Ticket ID: #${escape_html(ticket.id.slice(0, 8))}</span> `);
		Separator($$renderer, {
			orientation: "vertical",
			class: "h-3"
		});
		$$renderer.push(`<!----> <span class="inline-flex items-center gap-1 text-xs text-muted-foreground">`);
		TagIcon($$renderer, { class: "size-3" });
		$$renderer.push(`<!----> ${escape_html(ticket.category?.name ?? "Uncategorized")}</span></div> <h1 class="text-2xl font-bold tracking-tight md:text-3xl">${escape_html(ticket.title)}</h1></div> `);
		Status_badge($$renderer, { status: ticket.status });
		$$renderer.push(`<!----></div> `);
		Separator($$renderer, {});
		$$renderer.push(`<!----> `);
		if (Card) {
			$$renderer.push("<!--[-->");
			Card($$renderer, {
				children: ($$renderer) => {
					if (Card_header) {
						$$renderer.push("<!--[-->");
						Card_header($$renderer, {
							children: ($$renderer) => {
								if (Card_title) {
									$$renderer.push("<!--[-->");
									Card_title($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Incident Description`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` `);
								if (Card_description) {
									$$renderer.push("<!--[-->");
									Card_description($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Detailed description submitted by the reporter.`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
					$$renderer.push(` `);
					if (Card_content) {
						$$renderer.push("<!--[-->");
						Card_content($$renderer, {
							children: ($$renderer) => {
								$$renderer.push(`<p class="text-sm leading-relaxed whitespace-pre-wrap text-foreground">${escape_html(ticket.body)}</p> `);
								if (ticket.attachments && ticket.attachments.length > 0) {
									$$renderer.push("<!--[0-->");
									Separator($$renderer, {});
									$$renderer.push(`<!----> <div class="p-6"><h4 class="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">`);
									PaperclipIcon($$renderer, { class: "size-4" });
									$$renderer.push(`<!----> Attachments (${escape_html(ticket.attachments.length)})</h4> <div class="grid grid-cols-2 gap-4 sm:grid-cols-3"><!--[-->`);
									const each_array = ensure_array_like(ticket.attachments);
									for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
										let attachment = each_array[$$index];
										$$renderer.push(`<a${attr("href", attachment.storageUrl)} target="_blank" rel="external noopener noreferrer" class="group relative flex flex-col items-center justify-center rounded-lg border p-4 transition-colors hover:bg-muted/50">`);
										if (attachment.fileType.startsWith("image/")) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<img${attr("src", attachment.storageUrl)} alt="Attachment" class="max-h-24 rounded-md object-contain"/>`);
										} else {
											$$renderer.push("<!--[-1-->");
											$$renderer.push(`<div class="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">`);
											PaperclipIcon($$renderer, { class: "size-6" });
											$$renderer.push(`<!----></div> <span class="w-full truncate text-center text-xs font-medium text-muted-foreground group-hover:text-foreground">Download File</span>`);
										}
										$$renderer.push(`<!--]--></a>`);
									}
									$$renderer.push(`<!--]--></div></div>`);
								} else $$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]-->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				},
				$$slots: { default: true }
			});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(`</div>`);
	});
}
//#endregion
//#region src/lib/features/tickets/components/ticket-timeline.svelte
function Ticket_timeline($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ticket } = $$props;
		const statusHistories = derived(() => ticket.statusHistories ?? []);
		function formatDate(dateStr) {
			return new Date(dateStr).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			});
		}
		if (Card) {
			$$renderer.push("<!--[-->");
			Card($$renderer, {
				children: ($$renderer) => {
					if (Card_header) {
						$$renderer.push("<!--[-->");
						Card_header($$renderer, {
							children: ($$renderer) => {
								if (Card_title) {
									$$renderer.push("<!--[-->");
									Card_title($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Activity Log &amp; Timeline`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` `);
								if (Card_description) {
									$$renderer.push("<!--[-->");
									Card_description($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Historical records of status transitions and agent notes.`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
					$$renderer.push(` `);
					if (Card_content) {
						$$renderer.push("<!--[-->");
						Card_content($$renderer, {
							children: ($$renderer) => {
								if (statusHistories().length === 0) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<div class="flex flex-col items-center justify-center py-8 text-center"><div class="mb-3 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">`);
									ClockIcon($$renderer, { class: "size-5" });
									$$renderer.push(`<!----></div> <p class="text-sm font-medium text-muted-foreground">No status modifications logged yet.</p> <p class="mt-1 text-xs text-muted-foreground">This ticket was initialized as Open on ${escape_html(formatDate(ticket.createdAt))}.</p></div>`);
								} else {
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`<div class="relative ml-4 space-y-8 border-l border-border pl-6"><!--[-->`);
									const each_array = ensure_array_like(statusHistories());
									for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
										let history = each_array[$$index];
										$$renderer.push(`<div class="relative"><div class="absolute top-1.5 -left-8.5 flex size-4 items-center justify-center rounded-full border-2 border-primary bg-background"><div class="size-1.5 rounded-full bg-primary"></div></div> <div class="flex flex-col gap-1"><div class="flex flex-wrap items-center gap-2 text-sm"><span class="font-semibold text-foreground">${escape_html(history.changedByUser?.name ?? "System Agent")}</span> <span class="text-xs text-muted-foreground">transitioned status from</span> `);
										Status_badge($$renderer, { status: history.oldStatus });
										$$renderer.push(`<!----> <span class="text-xs text-muted-foreground">to</span> `);
										Status_badge($$renderer, { status: history.newStatus });
										$$renderer.push(`<!----></div> <span class="flex items-center gap-1 text-xs text-muted-foreground">`);
										ClockIcon($$renderer, { class: "size-3" });
										$$renderer.push(`<!----> ${escape_html(formatDate(history.changedAt))}</span> `);
										if (history.note) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<div class="mt-2 rounded-lg bg-muted/50 p-3 text-sm text-foreground">${escape_html(history.note)}</div>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--></div></div>`);
									}
									$$renderer.push(`<!--]--> <div class="relative"><div class="absolute top-1.5 -left-8.5 flex size-4 items-center justify-center rounded-full border-2 border-muted-foreground/30 bg-background"><div class="size-1.5 rounded-full bg-muted-foreground/30"></div></div> <div class="flex flex-col gap-1"><div class="flex items-center gap-2 text-sm"><span class="font-semibold text-muted-foreground">Ticket Created</span> <span class="text-xs text-muted-foreground">via Telegram Bot</span> `);
									Status_badge($$renderer, { status: "open" });
									$$renderer.push(`<!----></div> <span class="flex items-center gap-1 text-xs text-muted-foreground">`);
									ClockIcon($$renderer, { class: "size-3" });
									$$renderer.push(`<!----> ${escape_html(formatDate(ticket.createdAt))}</span></div></div></div>`);
								}
								$$renderer.push(`<!--]-->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				},
				$$slots: { default: true }
			});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
	});
}
//#endregion
//#region src/lib/features/tickets/components/ticket-status-form.svelte
function Ticket_status_form($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ticket } = $$props;
		let selectedStatus = "open";
		let noteText = "";
		const statusOptions = [
			{
				label: "Open",
				value: "open"
			},
			{
				label: "In Progress",
				value: "in_progress"
			},
			{
				label: "Resolved",
				value: "resolved"
			},
			{
				label: "Closed",
				value: "closed"
			}
		];
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Card) {
				$$renderer.push("<!--[-->");
				Card($$renderer, {
					children: ($$renderer) => {
						if (Card_header) {
							$$renderer.push("<!--[-->");
							Card_header($$renderer, {
								children: ($$renderer) => {
									if (Card_title) {
										$$renderer.push("<!--[-->");
										Card_title($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<!---->Transition Status`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(` `);
									if (Card_description) {
										$$renderer.push("<!--[-->");
										Card_description($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<!---->Update state and document actions.`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` `);
						if (Card_content) {
							$$renderer.push("<!--[-->");
							Card_content($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<form method="POST" action="?/updateStatus"><input type="hidden" name="status"${attr("value", selectedStatus)}/> `);
									if (Field_set) {
										$$renderer.push("<!--[-->");
										Field_set($$renderer, {
											children: ($$renderer) => {
												if (Field_group) {
													$$renderer.push("<!--[-->");
													Field_group($$renderer, {
														children: ($$renderer) => {
															if (Field) {
																$$renderer.push("<!--[-->");
																Field($$renderer, {
																	children: ($$renderer) => {
																		if (Field_label) {
																			$$renderer.push("<!--[-->");
																			Field_label($$renderer, {
																				for: "status",
																				children: ($$renderer) => {
																					$$renderer.push(`<!---->Select New Status`);
																				},
																				$$slots: { default: true }
																			});
																			$$renderer.push("<!--]-->");
																		} else {
																			$$renderer.push("<!--[!-->");
																			$$renderer.push("<!--]-->");
																		}
																		$$renderer.push(` `);
																		if (Select) {
																			$$renderer.push("<!--[-->");
																			Select($$renderer, {
																				type: "single",
																				get value() {
																					return selectedStatus;
																				},
																				set value($$value) {
																					selectedStatus = $$value;
																					$$settled = false;
																				},
																				children: ($$renderer) => {
																					if (Select_trigger) {
																						$$renderer.push("<!--[-->");
																						Select_trigger($$renderer, {
																							id: "status",
																							children: ($$renderer) => {
																								$$renderer.push(`<!---->${escape_html(statusOptions.find((o) => o.value === selectedStatus)?.label ?? "Select Status")}`);
																							},
																							$$slots: { default: true }
																						});
																						$$renderer.push("<!--]-->");
																					} else {
																						$$renderer.push("<!--[!-->");
																						$$renderer.push("<!--]-->");
																					}
																					$$renderer.push(` `);
																					if (Select_content) {
																						$$renderer.push("<!--[-->");
																						Select_content($$renderer, {
																							children: ($$renderer) => {
																								$$renderer.push(`<!--[-->`);
																								const each_array = ensure_array_like(statusOptions);
																								for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
																									let option = each_array[$$index];
																									if (Select_item) {
																										$$renderer.push("<!--[-->");
																										Select_item($$renderer, spread_props([option]));
																										$$renderer.push("<!--]-->");
																									} else {
																										$$renderer.push("<!--[!-->");
																										$$renderer.push("<!--]-->");
																									}
																								}
																								$$renderer.push(`<!--]-->`);
																							},
																							$$slots: { default: true }
																						});
																						$$renderer.push("<!--]-->");
																					} else {
																						$$renderer.push("<!--[!-->");
																						$$renderer.push("<!--]-->");
																					}
																				},
																				$$slots: { default: true }
																			});
																			$$renderer.push("<!--]-->");
																		} else {
																			$$renderer.push("<!--[!-->");
																			$$renderer.push("<!--]-->");
																		}
																		$$renderer.push(` `);
																		if (Field_description) {
																			$$renderer.push("<!--[-->");
																			Field_description($$renderer, {
																				children: ($$renderer) => {
																					$$renderer.push(`<!---->Select the new status for the ticket.`);
																				},
																				$$slots: { default: true }
																			});
																			$$renderer.push("<!--]-->");
																		} else {
																			$$renderer.push("<!--[!-->");
																			$$renderer.push("<!--]-->");
																		}
																	},
																	$$slots: { default: true }
																});
																$$renderer.push("<!--]-->");
															} else {
																$$renderer.push("<!--[!-->");
																$$renderer.push("<!--]-->");
															}
															$$renderer.push(` `);
															if (Field) {
																$$renderer.push("<!--[-->");
																Field($$renderer, {
																	children: ($$renderer) => {
																		if (Field_label) {
																			$$renderer.push("<!--[-->");
																			Field_label($$renderer, {
																				for: "note",
																				children: ($$renderer) => {
																					$$renderer.push(`<!---->Status Note (Optional)`);
																				},
																				$$slots: { default: true }
																			});
																			$$renderer.push("<!--]-->");
																		} else {
																			$$renderer.push("<!--[!-->");
																			$$renderer.push("<!--]-->");
																		}
																		$$renderer.push(` `);
																		Textarea($$renderer, {
																			id: "note",
																			name: "note",
																			placeholder: "Add details about why status changed...",
																			class: "min-h-24 text-sm",
																			get value() {
																				return noteText;
																			},
																			set value($$value) {
																				noteText = $$value;
																				$$settled = false;
																			}
																		});
																		$$renderer.push(`<!----> `);
																		if (Field_description) {
																			$$renderer.push("<!--[-->");
																			Field_description($$renderer, {
																				children: ($$renderer) => {
																					$$renderer.push(`<!---->Add details about why status changed.`);
																				},
																				$$slots: { default: true }
																			});
																			$$renderer.push("<!--]-->");
																		} else {
																			$$renderer.push("<!--[!-->");
																			$$renderer.push("<!--]-->");
																		}
																	},
																	$$slots: { default: true }
																});
																$$renderer.push("<!--]-->");
															} else {
																$$renderer.push("<!--[!-->");
																$$renderer.push("<!--]-->");
															}
															$$renderer.push(` `);
															if (Field) {
																$$renderer.push("<!--[-->");
																Field($$renderer, {
																	children: ($$renderer) => {
																		Button($$renderer, {
																			type: "submit",
																			class: "w-full",
																			disabled: selectedStatus === ticket.status,
																			children: ($$renderer) => {
																				$$renderer.push(`<!---->Apply Transition`);
																			},
																			$$slots: { default: true }
																		});
																	},
																	$$slots: { default: true }
																});
																$$renderer.push("<!--]-->");
															} else {
																$$renderer.push("<!--[!-->");
																$$renderer.push("<!--]-->");
															}
														},
														$$slots: { default: true }
													});
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(`</form>`);
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					},
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
//#region src/lib/features/tickets/components/ticket-reporter.svelte
function Ticket_reporter($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ticket } = $$props;
		function formatDate(dateStr) {
			return new Date(dateStr).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			});
		}
		function getInitials(name) {
			return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
		}
		if (Card) {
			$$renderer.push("<!--[-->");
			Card($$renderer, {
				children: ($$renderer) => {
					if (Card_header) {
						$$renderer.push("<!--[-->");
						Card_header($$renderer, {
							children: ($$renderer) => {
								if (Card_title) {
									$$renderer.push("<!--[-->");
									Card_title($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Reporter Profile`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` `);
								if (Card_description) {
									$$renderer.push("<!--[-->");
									Card_description($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Information about the incident reporter.`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
					$$renderer.push(` `);
					if (Card_content) {
						$$renderer.push("<!--[-->");
						Card_content($$renderer, {
							class: "space-y-4",
							children: ($$renderer) => {
								$$renderer.push(`<div class="flex items-center gap-3"><div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">${escape_html(getInitials(ticket.reporter.fullName))}</div> <div class="min-w-0"><h4 class="truncate text-sm font-semibold text-foreground">${escape_html(ticket.reporter.fullName)}</h4> `);
								if (ticket.reporter.username) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<a${attr("href", `https://t.me/${stringify(ticket.reporter.username)}`)} target="_blank" rel="external noopener noreferrer" class="inline-flex items-center gap-1 text-xs text-primary hover:underline">`);
									TelegramLogoIcon($$renderer, { class: "size-3" });
									$$renderer.push(`<!----> @${escape_html(ticket.reporter.username)}</a>`);
								} else {
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`<span class="text-xs text-muted-foreground">No Username</span>`);
								}
								$$renderer.push(`<!--]--></div></div> `);
								Separator($$renderer, {});
								$$renderer.push(`<!----> <div class="space-y-3 text-sm"><div class="flex items-center justify-between"><span class="flex items-center gap-1.5 text-muted-foreground">`);
								UserIcon($$renderer, { class: "size-4" });
								$$renderer.push(`<!----> Telegram ID</span> <span class="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">${escape_html(String(ticket.reporter.telegramId))}</span></div> <div class="flex items-center justify-between"><span class="flex items-center gap-1.5 text-muted-foreground">`);
								CalendarIcon($$renderer, { class: "size-4" });
								$$renderer.push(`<!----> Submitted On</span> <span class="text-xs font-medium text-foreground">${escape_html(formatDate(ticket.createdAt))}</span></div> <div class="flex items-center justify-between"><span class="flex items-center gap-1.5 text-muted-foreground">`);
								ClockIcon($$renderer, { class: "size-4" });
								$$renderer.push(`<!----> Last Updated</span> <span class="text-xs font-medium text-foreground">${escape_html(formatDate(ticket.updatedAt))}</span></div></div>`);
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				},
				$$slots: { default: true }
			});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
	});
}
//#endregion
//#region src/lib/features/tickets/components/ticket-detail-view.svelte
function Ticket_detail_view($$renderer, $$props) {
	let { ticket } = $$props;
	$$renderer.push(`<div class="flex flex-1 flex-col gap-6 p-6 pt-2"><div class="grid grid-cols-1 gap-6 lg:grid-cols-3"><div class="space-y-6 lg:col-span-2">`);
	Ticket_description($$renderer, { ticket });
	$$renderer.push(`<!----> `);
	Ticket_timeline($$renderer, { ticket });
	$$renderer.push(`<!----></div> <div class="space-y-6">`);
	Ticket_reporter($$renderer, { ticket });
	$$renderer.push(`<!----> `);
	Ticket_status_form($$renderer, { ticket });
	$$renderer.push(`<!----></div></div></div>`);
}
//#endregion
//#region src/routes/(authenticated)/tickets/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		head("1j9syj", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Ticket Details - ${escape_html(data.ticket?.title ?? "Incident")}</title>`);
			});
		});
		if (data.ticket) {
			$$renderer.push("<!--[0-->");
			Ticket_detail_view($$renderer, { ticket: data.ticket });
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="m-6 rounded-xl border border-dashed p-8 text-center text-muted-foreground">Unable to load ticket details. Please try again.</div>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
