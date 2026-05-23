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
					status: 'open'
				},
				{
					reporterId: reporterRecords[0].id,
					categoryId: categoryRecords[1].id, // Transaksi & Pembayaran
					title: 'Saldo LinkAja Terpotong tapi Pembayaran Langganan Premium Gagal',
					body: 'Saya melakukan checkout untuk paket langganan 1 bulan seharga Rp 150.000 menggunakan pembayaran LinkAja. Di aplikasi LinkAja saldo sudah terpotong sukses, namun halaman checkout aplikasi Trak menyatakan transaksi expired/gagal dan akun saya belum berubah status ke Premium.',
					status: 'in_progress'
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
					changedBy: adminId, // Reference the admin user we just seeded
					oldStatus: 'open',
					newStatus: 'in_progress',
					note: 'Keluhan diterima. Tim Finance kami sedang mencocokkan mutasi pembayaran pada sistem pembayaran LinkAja. Proses pencocokan biasanya memakan waktu maksimal 1 jam kerja.'
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
