import { listen } from '@trak/database';
import type { RequestHandler } from './$types';

const encoder = new TextEncoder();

export const GET: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		return new Response('Unauthorized', { status: 401 });
	}

	let listener: ReturnType<typeof listen> | undefined;
	let heartbeat: ReturnType<typeof setInterval> | undefined;
	let closed = false;

	const close = () => {
		if (closed) return;
		closed = true;
		void listener?.then((meta) => meta.unlisten());
		if (heartbeat) clearInterval(heartbeat);
	};

	const stream = new ReadableStream({
		start(controller) {
			const send = (event: string, data: string) => {
				controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
			};

			send('ready', '{}');
			listener = listen('agent_notifications', (payload) => {
				const data = JSON.parse(payload) as {
					recipientUserId?: string;
					type?: string;
				};
				if (data.recipientUserId && data.recipientUserId !== locals.user?.id) return;
				if (data.type === 'reporter_reply') {
					send('ticket-message', payload);
				}
				send('agent-notification', payload);
			});
			heartbeat = setInterval(() => send('heartbeat', '{}'), 30_000);
		},
		cancel: close
	});

	request.signal.addEventListener('abort', close);

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache, no-transform',
			Connection: 'keep-alive'
		}
	});
};
