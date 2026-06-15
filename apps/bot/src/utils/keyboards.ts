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
		{ text: cat.name, callback_data: `category_${cat.id}` }
	]);
	keyboard.push([{ text: 'Lewati', callback_data: 'skip_category' }]);
	return { inline_keyboard: keyboard };
}

export function buildConfirmKeyboard(): InlineKeyboard {
	return {
		inline_keyboard: [
			[
				{ text: 'Ya, kirim', callback_data: 'confirm_report' },
				{ text: 'Batal', callback_data: 'cancel_report' }
			]
		]
	};
}

export function buildSkipAttachmentKeyboard(): InlineKeyboard {
	return {
		inline_keyboard: [[{ text: 'Lewati lampiran', callback_data: 'skip_attachment' }]]
	};
}

export function buildPostSubmitKeyboard(ticketCode: string): InlineKeyboard {
	return {
		inline_keyboard: [
			[
				{ text: '📝 Buat laporan baru', callback_data: 'new_report' },
				{ text: '🔍 Cek status', callback_data: `status_${ticketCode}` }
			],
			[{ text: '📋 Perintah', callback_data: 'show_commands' }]
		]
	};
}

export const removeKeyboard = { remove_keyboard: true } as const;
