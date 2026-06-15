export const STATUS_LABEL: Record<string, string> = {
	open: '🔴 Open',
	in_progress: '🟡 In Progress',
	resolved: '🟢 Resolved',
	closed: '⚪ Closed'
};

export const HELP_TEXT =
	'Bantuan Bot Pelaporan:\n\n' +
	'/start - Mulai dan daftarkan diri\n' +
	'/report - Buat laporan baru\n' +
	'/status - Cek status tiket berdasarkan nomor\n' +
	'/help - Tampilkan bantuan ini\n\n' +
	'Setelah memulai laporan, ikuti petunjuk yang diberikan.';

export const COMMANDS_TEXT =
	'Perintah yang tersedia:\n\n' +
	'/start - Mulai dan daftarkan diri\n' +
	'/report - Buat laporan baru\n' +
	'/help - Tampilkan bantuan';

export function welcomeBack(fullName: string): string {
	return (
		`Selamat datang kembali, ${fullName}!\n\n` +
		'Sistem Pelaporan Tiket\n\n' +
		'Perintah:\n' +
		'/report - Buat laporan baru\n' +
		'/status - Cek status tiket\n' +
		'/help - Bantuan'
	);
}

export const WELCOME_NEW =
	'Selamat datang di Sistem Pelaporan Tiket!\n\n' +
	'Untuk mendaftar, silakan masukkan kode undangan (invite code) Anda.';

export function registrationSuccess(fullName: string, firstName: string): string {
	return (
		`✅ Registrasi berhasil! Selamat datang, ${fullName || firstName}!\n\n` +
		'Sistem Pelaporan Tiket\n\n' +
		'Perintah:\n' +
		'/report - Buat laporan baru\n' +
		'/status - Cek status tiket\n' +
		'/help - Bantuan'
	);
}

export function invalidInviteError(code: string): string {
	return (
		`Kode undangan "${code}" tidak valid atau sudah kadaluwarsa.\n\n` +
		'Silakan coba lagi dengan kode yang benar.'
	);
}

export const CANCEL_MESSAGE = '🚫 Laporan dibatalkan.';

export function cancelWithRemoveKeyboard(): string {
	return '🚫 Laporan dibatalkan.';
}

export const IDLE_ERROR_MESSAGE =
	'Maaf, saya tidak mengerti maksud Anda atau sesi laporan Anda sebelumnya telah kedaluwarsa karena tidak ada aktivitas.\n\nSilakan ketik /report untuk memulai laporan baru.';

export const NO_REPORTER_MESSAGE =
	'Anda belum terdaftar. Silakan kirim /start untuk mendaftar terlebih dahulu.';

export const NO_REPORTER_SHORT = 'Anda belum terdaftar. Silakan kirim /start.';

export function statusUsage(): string {
	return 'Gunakan: /status <nomor tiket>\n\nContoh: /status TKT-ABC12345';
}

export function ticketNotFound(ticketCode: string): string {
	return `Tiket ${ticketCode} tidak ditemukan.`;
}

export const UNKNOWN_MESSAGE =
	'Saya tidak mengerti. Silakan gunakan tombol atau perintah yang tersedia.';

export function reportStepTitle(): string {
	return 'Buat Laporan Baru\n\nLangkah 1/3: Masukkan judul laporan.';
}

export function reportStepBody(): string {
	return 'Langkah 2/3: Masukkan deskripsi laporan secara detail.';
}

export function reportStepCategory(): string {
	return 'Langkah 3/3: Pilih kategori laporan:';
}

export function noCategoriesMessage(): string {
	return (
		'Tidak ada kategori tersedia.\n\n' +
		'Sekarang kirim lampiran (foto/dokumen) atau gunakan tombol di bawah.'
	);
}

export function categorySelected(name: string): string {
	return (
		`Kategori dipilih: ${name}\n\n` +
		'Sekarang kirim lampiran (foto/dokumen) atau ketik "/done" untuk selesai.'
	);
}

export const NO_CATEGORY_MESSAGE =
	'Laporan tanpa kategori.\n\nSekarang kirim lampiran (foto/dokumen) atau ketik "/done" untuk selesai.';

export function attachmentReceived(count: number): string {
	return `📎 Diterima. Total lampiran: ${count}\nKirim lagi atau ketik "/done" untuk selesai.`;
}

export function buildReportSummary(params: {
	title?: string;
	body?: string;
	categoryName?: string;
	attachmentSummary: string;
}): string {
	const { title, body, categoryName, attachmentSummary } = params;
	return (
		`Ringkasan Laporan:\n\n` +
		`Judul: ${title ?? '-'}\n` +
		`Deskripsi: ${body ?? '-'}\n` +
		`Kategori: ${categoryName ?? 'Tidak ada'}\n` +
		`Lampiran: ${attachmentSummary}\n\n` +
		`Kirim laporan ini?`
	);
}

export function reportSuccess(ticketCode: string): string {
	return (
		`✅ Laporan berhasil dikirim!` +
		`\n\nKode tiket: ${ticketCode}` +
		`\n\nTerima kasih, laporan Anda akan segera diproses.`
	);
}

export const REPORT_FAILED = '❌ Gagal mengirim laporan. Silakan coba lagi.';

export const WHATS_NEXT = 'Apa yang ingin Anda lakukan selanjutnya?';
