import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import {
	inviteCodes,
	reporters,
	categories,
	reports,
	reportAttachments,
	statusHistories,
	user,
	account,
	session,
	verification
} from './schema';
import { hashPassword } from 'better-auth/crypto';
import { loadEnvFile } from 'process';

try {
	loadEnvFile();
} catch {
	console.warn(
		'⚠️  No .env file found or failed to load. Make sure DATABASE_URL is set in environment variables.'
	);
}

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set in environment variables');
}

// Connect to database
const client = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(client, { schema });

async function main() {
	console.log('⏳ Starting database seeding (Digital Product Complaints)...');

	try {
		// 1. Clean existing data in reverse order of foreign key dependencies
		console.log('🧹 Cleaning existing tables...');
		await db.delete(statusHistories);
		await db.delete(reportAttachments);
		await db.delete(reports);
		await db.delete(reporters);
		await db.delete(categories);
		await db.delete(session);
		await db.delete(account);
		await db.delete(user);
		await db.delete(verification);
		await db.delete(inviteCodes);
		console.log('✅ Tables cleaned successfully.');

		// 2. Insert Invite Codes
		console.log('🔑 Seeding invite codes...');
		const inviteCodeRecords = await db
			.insert(inviteCodes)
			.values([
				{
					code: 'INVITE-ACTIVE-1',
					isActive: true,
					expiresAt: null
				},
				{
					code: 'INVITE-ACTIVE-2',
					isActive: true,
					expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days in future
				},
				{
					code: 'INVITE-EXPIRED',
					isActive: true,
					expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day in past
				}
			])
			.returning();
		console.log(`✅ Seeded ${inviteCodeRecords.length} invite codes.`);

		// 3. Insert Users & Accounts (Admin & Agent)
		console.log('👥 Seeding users and accounts...');
		const adminId = 'admin-user-id-1';
		const agentId = 'agent-user-id-1';

		const userRecords = await db
			.insert(user)
			.values([
				{
					id: adminId,
					name: 'Admin',
					email: 'admin@trak.id',
					emailVerified: true,
					role: 'admin',
					isActive: true
				},
				{
					id: agentId,
					name: 'Agent Budi',
					email: 'agent.budi@trak.id',
					emailVerified: true,
					role: 'agent',
					isActive: true
				}
			])
			.returning();

		await db.insert(account).values([
			{
				id: 'admin-account-id',
				userId: adminId,
				accountId: adminId,
				providerId: 'credential',
				password: await hashPassword('adminpassword123')
			},
			{
				id: 'agent-account-id',
				userId: agentId,
				accountId: agentId,
				providerId: 'credential',
				password: await hashPassword('agentpassword123')
			}
		]);
		console.log(`✅ Seeded ${userRecords.length} users and accounts.`);

		// 4. Insert Categories
		console.log('📁 Seeding categories...');
		const categoryRecords = await db
			.insert(categories)
			.values([
				{
					name: 'Bug & Eror Sistem',
					description:
						'Masalah teknis seperti aplikasi crash, tombol tidak merespon, halaman tidak memuat, dll.',
					isActive: true
				},
				{
					name: 'Transaksi & Pembayaran',
					description:
						'Keluhan mengenai kegagalan pembayaran, tagihan tidak sesuai, refund saldo, atau masalah e-wallet/bank.',
					isActive: true
				},
				{
					name: 'Akun & Keamanan',
					description:
						'Isu mengenai kegagalan login, verifikasi OTP tidak terkirim, lupa password, atau akun terblokir.',
					isActive: true
				},
				{
					name: 'Usulan Fitur & UX',
					description:
						'Saran peningkatan antarmuka (UI/UX) atau permintaan fitur baru untuk produk.',
					isActive: true
				}
			])
			.returning();
		console.log(`✅ Seeded ${categoryRecords.length} categories.`);

		// 5. Insert Reporters
		console.log('🤖 Seeding reporters...');
		const reporterRecords = await db
			.insert(reporters)
			.values([
				{
					telegramId: 987654321n,
					username: 'bambang_p',
					fullName: 'Bambang Pamungkas',
					inviteCodeId: inviteCodeRecords[0].id
				},
				{
					telegramId: 123456789n,
					username: 'joni_w',
					fullName: 'Joni Wijaya',
					inviteCodeId: inviteCodeRecords[0].id
				},
				{
					telegramId: 246810121n,
					username: 'siska_l',
					fullName: 'Siska Lestari',
					inviteCodeId: inviteCodeRecords[1].id
				},
				{
					telegramId: 135791113n,
					username: 'rian_h',
					fullName: 'Rian Hidayat',
					inviteCodeId: inviteCodeRecords[1].id
				},
				{
					telegramId: 998877665n,
					username: 'linda_k',
					fullName: 'Linda Kusumawati',
					inviteCodeId: inviteCodeRecords[0].id
				}
			])
			.returning();
		console.log(`✅ Seeded ${reporterRecords.length} reporters.`);

		// 6. Insert Reports
		console.log('📝 Seeding reports...');
		const reportRecords = await db
			.insert(reports)
			.values([
				{
					reporterId: reporterRecords[0].id,
					categoryId: categoryRecords[2].id, // Akun & Keamanan
					title: 'Gagal Menerima Kode OTP WhatsApp saat Registrasi',
					body: 'Saya mencoba mendaftar akun baru menggunakan nomor WhatsApp +628123456789, namun setelah menekan tombol kirim OTP sebanyak 5 kali dan menunggu masing-masing 2 menit, tidak ada pesan masuk dari sistem. Mohon dicek apakah gateway WhatsApp sedang bermasalah.',
					status: 'open',
					createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
				},
				{
					reporterId: reporterRecords[0].id,
					categoryId: categoryRecords[1].id, // Transaksi & Pembayaran
					title: 'Saldo LinkAja Terpotong tapi Pembayaran Langganan Premium Gagal',
					body: 'Saya melakukan checkout untuk paket langganan 1 bulan seharga Rp 150.000 menggunakan pembayaran LinkAja. Di aplikasi LinkAja saldo sudah terpotong sukses, namun halaman checkout aplikasi Trak menyatakan transaksi expired/gagal dan akun saya belum berubah status ke Premium.',
					status: 'in_progress',
					createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
				},
				{
					reporterId: reporterRecords[1].id,
					categoryId: categoryRecords[0].id, // Bug & Eror Sistem
					title: 'Aplikasi Crash Saat Membuka Halaman Riwayat Transaksi',
					body: 'Setiap kali saya menekan tombol "Riwayat Transaksi" di navigasi utama, aplikasi Trak langsung menutup sendiri (force close) tanpa ada pesan eror. Saya menggunakan HP Android Samsung S21 dengan OS Android 13.',
					status: 'resolved',
					createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
				},
				{
					reporterId: reporterRecords[2].id,
					categoryId: categoryRecords[1].id, // Transaksi & Pembayaran
					title: 'Double Charge Pada Tagihan Bulanan Kartu Kredit',
					body: 'Pada tagihan kartu kredit bulan ini untuk pembayaran langganan aplikasi Trak, muncul dua kali transaksi dengan nominal masing-masing Rp 89.000 pada hari yang sama (15 Mei). Mohon bantuannya untuk memproses refund satu transaksi yang double.',
					status: 'resolved',
					createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
				},
				{
					reporterId: reporterRecords[3].id,
					categoryId: categoryRecords[2].id, // Akun & Keamanan
					title: 'Isu Akun Terkunci Otomatis Setelah Ganti Password',
					body: 'Saya baru saja mengganti password melalui menu pengaturan kemarin malam. Setelah sukses mengganti password, saya log out dan mencoba login kembali dengan password baru. Namun muncul pesan "Akun Anda dinonaktifkan sementara karena alasan keamanan". Tolong buka kunci akun saya.',
					status: 'open',
					createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
				},
				{
					reporterId: reporterRecords[4].id,
					categoryId: categoryRecords[3].id, // Usulan Fitur & UX
					title: 'Usulan Fitur Export Laporan Bulanan ke Format Excel/PDF',
					body: 'Sebagai administrator di tim kami, saya butuh fitur untuk mendownload/export data rekap laporan support bulanan ke dalam format file Excel (.xlsx) atau laporan PDF. Saat ini kami harus menyalinnya secara manual satu per satu, yang memakan waktu.',
					status: 'in_progress',
					createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
				},
				{
					reporterId: reporterRecords[1].id,
					categoryId: categoryRecords[3].id, // Usulan Fitur & UX
					title: 'Tampilan Dark Mode Terlalu Terang Pada Bagian Sidebar',
					body: 'Kontras teks warna abu-abu di atas latar belakang sidebar dark mode saat ini agak susah dibaca, terutama jika pencahayaan ruangan redup. Usulan saya, latar belakang sidebar dibuat sedikit lebih gelap atau warna teks abu-abunya diperterang agar kontrasnya pas.',
					status: 'resolved',
					createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
				},
				{
					reporterId: reporterRecords[2].id,
					categoryId: categoryRecords[1].id, // Transaksi & Pembayaran
					title: 'Permohonan Refund Karena Salah Pilih Paket Premium',
					body: 'Saya berniat membeli paket langganan tahunan, tetapi salah mengklik dan membeli paket langganan 1 bulan (non-recurring). Apakah bisa transaksi tersebut di-refund sehingga saya bisa mengulang transaksi pembelian paket tahunan?',
					status: 'closed',
					createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
				},
				{
					reporterId: reporterRecords[4].id,
					categoryId: categoryRecords[1].id, // Transaksi & Pembayaran
					title: 'Metode Pembayaran QRIS Tidak Menampilkan Kode QR',
					body: 'Saya mencoba mengupgrade akun menggunakan metode pembayaran QRIS di halaman billing. Setelah memilih QRIS dan menekan tombol Bayar, layar loading terus berjalan dan kode QR-nya tidak muncul sama sekali. Saya sudah coba di browser Chrome dan Firefox hasilnya sama.',
					status: 'in_progress',
					createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
				},
				{
					reporterId: reporterRecords[3].id,
					categoryId: categoryRecords[2].id, // Akun & Keamanan
					title: 'Upaya Akses Mencurigakan Dari Luar Kota',
					body: 'Saya mendapatkan email notifikasi keamanan bahwa ada upaya login ke akun saya dari IP address berlokasi di Surabaya, Jawa Timur pada jam 2 dini hari tadi, padahal saya berdomisili di Jakarta dan sedang tertidur saat itu. Saya ingin mengganti password dan memaksa log out dari seluruh device.',
					status: 'closed',
					createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
				},
				{
					reporterId: reporterRecords[0].id,
					categoryId: categoryRecords[0].id, // Bug & Eror Sistem
					title: 'Tombol "Batal Kirim" di Laporan Tidak Bisa Diklik',
					body: 'Setelah membuat keluhan baru di portal, ada tombol "Batal Kirim Laporan" yang muncul selama 5 detik pertama. Namun ketika diklik, tombol tersebut tidak merespon dan laporan tetap terkirim ke agent. Mohon perbaiki fungsionalitas pembatalan ini.',
					status: 'open',
					createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
				}
			])
			.returning();
		console.log(`✅ Seeded ${reportRecords.length} reports.`);

		// 7. Insert Status Histories
		console.log('📜 Seeding status histories...');
		const historyRecords = await db
			.insert(statusHistories)
			.values([
				{
					reportId: reportRecords[1].id,
					changedBy: adminId,
					oldStatus: 'open',
					newStatus: 'in_progress',
					note: 'Keluhan diterima. Tim Finance kami sedang mencocokkan mutasi pembayaran pada sistem pembayaran LinkAja. Proses pencocokan biasanya memakan waktu maksimal 1 jam kerja.',
					changedAt: new Date(Date.now() - 20 * 60 * 60 * 1000)
				},
				{
					reportId: reportRecords[2].id,
					changedBy: agentId,
					oldStatus: 'open',
					newStatus: 'in_progress',
					note: 'Investigasi awal dijalankan untuk menganalisa crash log pada HP Samsung S21.',
					changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
				},
				{
					reportId: reportRecords[2].id,
					changedBy: agentId,
					oldStatus: 'in_progress',
					newStatus: 'resolved',
					note: 'Masalah crash teratasi. Kami merilis update minor versi 1.0.4 untuk memperbaiki rendering data riwayat transaksi pada versi Android tertentu.',
					changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
				},
				{
					reportId: reportRecords[3].id,
					changedBy: adminId,
					oldStatus: 'open',
					newStatus: 'resolved',
					note: 'Pihak payment gateway membenarkan adanya kesalahan pencatatan transaksi ganda. Dana transaksi yang kedua (sebesar Rp 89.000) sudah di-void dan dikembalikan ke kartu kredit Pelapor.',
					changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
				},
				{
					reportId: reportRecords[7].id,
					changedBy: adminId,
					oldStatus: 'open',
					newStatus: 'closed',
					note: 'Kami menutup keluhan ini karena transaksi salah paket tidak memenuhi syarat refund (telah terpakai kuota transfernya). Sebagai gantinya kami memberikan voucher diskon untuk mempermudah upgrade ke paket tahunan.',
					changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
				},
				{
					reportId: reportRecords[9].id,
					changedBy: adminId,
					oldStatus: 'open',
					newStatus: 'closed',
					note: 'Akun telah diamankan. Password diubah oleh pemilik akun, dan kami mematikan seluruh sesi aktif pada device lain seperti yang diminta.',
					changedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
				}
			])
			.returning();
		console.log(`✅ Seeded ${historyRecords.length} status history records.`);

		console.log('🎉 Database seeding completed successfully!');
	} catch (error) {
		console.error('❌ Error seeding database:', error);
	} finally {
		// Close client connection
		await client.end();
	}
}

main();
