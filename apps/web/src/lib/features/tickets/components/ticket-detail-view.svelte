<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import PriorityBadge from './priority-badge.svelte';
	import StatusBadge from './status-badge.svelte';
	import SlaBadge from './sla-badge.svelte';
	import TicketPriorityForm from './ticket-priority-form.svelte';

	import TicketDetailsSidebar from './ticket-details-sidebar.svelte';
	import TicketConversation from './ticket-conversation.svelte';
	import TicketMessageForm from './ticket-message-form.svelte';
	import TicketStatusForm from './ticket-status-form.svelte';
	import type { TicketDetails } from '@trak/shared';
	import * as Card from '$lib/components/ui/card';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { formatDateTime } from '../utils/formatters';

	let {
		ticket,
		agents = [],
		currentUser
	}: {
		ticket: TicketDetails;
		agents?: { id: string; name: string }[];
		currentUser?: { id: string; role?: string | null };
	} = $props();

	onMount(() => {
		const events = new EventSource('/tickets/events');
		const handleMessage = (event: MessageEvent<string>) => {
			const payload = JSON.parse(event.data) as { reportId?: string; message?: string };
			if (payload.reportId === ticket.id) {
				toast.info('New reporter reply received', {
					description: payload.message
				});
				void invalidateAll();
			}
		};

		events.addEventListener('ticket-message', handleMessage);
		return () => events.close();
	});
</script>

<div class="@container/main flex flex-col gap-4 md:gap-6">
	<div class="grid grid-cols-1 gap-5 xl:grid-cols-12">
		<!-- Left: Conversation & Status Update -->
		<div class="xl:col-span-8 2xl:col-span-9">
			<Card.Root>
				<Card.Header
					class="flex flex-col justify-between gap-5 border-b sm:flex-row sm:items-center"
				>
					<div class="min-w-0">
						<div class="flex items-center gap-2 text-xs text-muted-foreground">
							<span class="font-bold tracking-wider uppercase">Ticket #{ticket.ticketCode}</span>
						</div>
						<h3 class="truncate text-lg font-medium text-foreground">
							{ticket.title}
						</h3>
						<p class="text-sm text-muted-foreground">
							{formatDateTime(ticket.createdAt)}
						</p>
					</div>
					<div class="flex shrink-0 items-center gap-2">
						<SlaBadge
							isSlaBreached={ticket.isSlaBreached}
							slaResolveDue={ticket.slaResolveDue}
							status={ticket.status}
						/>
						<PriorityBadge priority={ticket.priority} />
						<StatusBadge status={ticket.status} />
					</div>
				</Card.Header>

				<Card.Content>
					<ScrollArea class="h-96">
						<TicketConversation {ticket} />
					</ScrollArea>
				</Card.Content>

				<Card.Footer>
					<div class="w-full space-y-4">
						<TicketMessageForm {ticket} />
						<TicketStatusForm {ticket} />
					</div>
				</Card.Footer>
			</Card.Root>
		</div>

		<!-- Right: Sidebar -->
		<div class="xl:col-span-4 2xl:col-span-3">
			<TicketDetailsSidebar {ticket} {agents} {currentUser} />
			<div class="mt-5">
				<TicketPriorityForm {ticket} />
			</div>
		</div>
	</div>
</div>
