import {
	STATIC_CALLBACK,
	encodeCategoryCallback,
	encodeReplyCallback,
	encodeStatusCallback
} from './callbacks';

type ReplyKeyboard = {
	keyboard: { text: string }[][];
	resize_keyboard: boolean;
	one_time_keyboard: boolean;
};

type InlineKeyboard = {
	inline_keyboard: { text: string; callback_data: string }[][];
};

export const cancelKeyboard: ReplyKeyboard = {
	keyboard: [[{ text: '❌ Batal' }]],
	resize_keyboard: true,
	one_time_keyboard: true
};

export const doneKeyboard: ReplyKeyboard = {
	keyboard: [[{ text: '✅ Selesai' }, { text: '❌ Batal' }]],
	resize_keyboard: true,
	one_time_keyboard: true
};

export function buildCategoryKeyboard(categories: { id: string; name: string }[]): InlineKeyboard {
	const keyboard = categories.map((cat) => [
		{ text: cat.name, callback_data: encodeCategoryCallback(cat.id) }
	]);
	return { inline_keyboard: keyboard };
}

export function buildConfirmKeyboard(): InlineKeyboard {
	return {
		inline_keyboard: [
			[
				{ text: 'Ya, kirim', callback_data: STATIC_CALLBACK.CONFIRM_REPORT },
				{ text: 'Batal', callback_data: STATIC_CALLBACK.CANCEL_REPORT }
			]
		]
	};
}

export function buildWelcomeKeyboard(): InlineKeyboard {
	return {
		inline_keyboard: [
			[{ text: '📝 Buat laporan baru', callback_data: STATIC_CALLBACK.NEW_REPORT }],
			[{ text: '❓ Bantuan', callback_data: STATIC_CALLBACK.SHOW_COMMANDS }]
		]
	};
}

export function buildPostSubmitKeyboard(ticketCode: string): InlineKeyboard {
	return {
		inline_keyboard: [
			[
				{ text: '📝 Buat laporan baru', callback_data: STATIC_CALLBACK.NEW_REPORT },
				{ text: '🔍 Cek status', callback_data: encodeStatusCallback(ticketCode) }
			],
			[{ text: '💬 Balas ticket', callback_data: encodeReplyCallback(ticketCode) }],
			[{ text: '📋 Perintah', callback_data: STATIC_CALLBACK.SHOW_COMMANDS }]
		]
	};
}

export function buildTicketStatusKeyboard(ticketCode: string, canReply: boolean): InlineKeyboard {
	const actions = [{ text: '🔄 Refresh status', callback_data: encodeStatusCallback(ticketCode) }];
	if (canReply) {
		actions.unshift({ text: '💬 Balas ticket', callback_data: encodeReplyCallback(ticketCode) });
	}

	return { inline_keyboard: [actions] };
}

export const removeKeyboard = { remove_keyboard: true } as const;
