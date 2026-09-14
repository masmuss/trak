import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import postgres from 'postgres';
import * as schema from '@trak/database/schema';
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
} from '@trak/database/schema';
import { calculateSLA } from '@trak/services';
import { hashPassword } from 'better-auth/crypto';

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
					name: 'System Bugs & Errors',
					description:
						'Technical issues such as app crashes, unresponsive buttons, pages failing to load, etc.',
					isActive: true
				},
				{
					name: 'Transactions & Payments',
					description:
						'Complaints about payment failures, incorrect billing, balance refunds, or e-wallet/bank issues.',
					isActive: true
				},
				{
					name: 'Account & Security',
					description:
						'Issues with login failures, OTP verification not arriving, forgotten passwords, or blocked accounts.',
					isActive: true
				},
				{
					name: 'Feature Requests & UX',
					description:
						'Interface (UI/UX) improvement suggestions or new feature requests for the product.',
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

		const reportValues = [
			{
				ticketCode: 'TKT-SEED01',
				reporterId: reporterRecords[0].id,
				categoryId: categoryRecords[2].id,
				title: 'Not Receiving WhatsApp OTP Code During Registration',
				body: 'I tried registering a new account using WhatsApp number +628123456789, but after pressing the send OTP button 5 times and waiting 2 minutes each, no message arrived from the system. Please check whether the WhatsApp gateway is having issues.',
				status: 'open' as const,
				priority: 'HIGH' as const,
				createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
			},
			{
				ticketCode: 'TKT-SEED02',
				reporterId: reporterRecords[0].id,
				categoryId: categoryRecords[1].id,
				title: 'LinkAja Balance Charged but Premium Subscription Payment Failed',
				body: 'I checked out a 1-month subscription plan for Rp 150.000 using LinkAja payment. My LinkAja balance was successfully charged, but the Trak checkout page says the transaction expired/failed and my account has not been upgraded to Premium.',
				status: 'in_progress' as const,
				priority: 'HIGH' as const,
				createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
			},
			{
				ticketCode: 'TKT-SEED03',
				reporterId: reporterRecords[1].id,
				categoryId: categoryRecords[0].id,
				title: 'App Crashes When Opening Transaction History Page',
				body: 'Every time I tap the "Transaction History" button in the main navigation, the Trak app closes by itself (force close) without any error message. I use a Samsung S21 phone with Android 13.',
				status: 'resolved' as const,
				priority: 'MEDIUM' as const,
				createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
			},
			{
				ticketCode: 'TKT-SEED04',
				reporterId: reporterRecords[1].id,
				categoryId: categoryRecords[1].id,
				title: 'Double Charge on Monthly Credit Card Bill',
				body: 'On this month credit card bill for the Trak app subscription, two transactions of Rp 89.000 each appeared on the same day (May 15). Please help refund one of the duplicate transactions.',
				status: 'resolved' as const,
				priority: 'HIGH' as const,
				createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
			},
			{
				ticketCode: 'TKT-SEED05',
				reporterId: reporterRecords[3].id,
				categoryId: categoryRecords[2].id,
				title: 'Account Auto-Locked After Password Change',
				body: 'I just changed my password through the settings menu last night. After successfully changing it, I logged out and tried logging back in with the new password. But a message appeared saying "Your account is temporarily disabled for security reasons". Please unlock my account.',
				status: 'open' as const,
				priority: 'CRITICAL' as const,
				createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
			},
			{
				ticketCode: 'TKT-SEED06',
				reporterId: reporterRecords[4].id,
				categoryId: categoryRecords[3].id,
				title: 'Feature Request: Monthly Report Export to Excel/PDF',
				body: 'As an administrator in our team, I need a feature to download/export the monthly support recap data into Excel (.xlsx) files or PDF reports. Right now we have to copy everything manually one by one, which takes a lot of time.',
				status: 'in_progress' as const,
				priority: 'LOW' as const,
				createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
			},
			{
				ticketCode: 'TKT-SEED07',
				reporterId: reporterRecords[1].id,
				categoryId: categoryRecords[3].id,
				title: 'Dark Mode Too Bright in Sidebar Area',
				body: 'The gray text contrast on the dark mode sidebar background is currently a bit hard to read, especially when room lighting is dim. My suggestion: make the sidebar background slightly darker or brighten the gray text so the contrast feels right.',
				status: 'resolved' as const,
				priority: 'LOW' as const,
				createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
			},
			{
				ticketCode: 'TKT-SEED08',
				reporterId: reporterRecords[2].id,
				categoryId: categoryRecords[1].id,
				title: 'Refund Request After Picking the Wrong Premium Plan',
				body: 'I intended to buy the annual subscription plan, but I misclicked and bought the 1-month plan (non-recurring). Can that transaction be refunded so I can redo the annual plan purchase?',
				status: 'closed' as const,
				priority: 'MEDIUM' as const,
				createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
			},
			{
				ticketCode: 'TKT-SEED09',
				reporterId: reporterRecords[4].id,
				categoryId: categoryRecords[1].id,
				title: 'QRIS Payment Method Not Showing QR Code',
				body: 'I tried upgrading my account using the QRIS payment method on the billing page. After selecting QRIS and pressing the Pay button, the loading screen keeps spinning and the QR code never appears at all. I tried in both Chrome and Firefox browsers with the same result.',
				status: 'in_progress' as const,
				priority: 'HIGH' as const,
				createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
			},
			{
				ticketCode: 'TKT-SEED10',
				reporterId: reporterRecords[3].id,
				categoryId: categoryRecords[2].id,
				title: 'Suspicious Access Attempt From Another City',
				body: 'I received a security notification email that there was a login attempt to my account from an IP address located in Surabaya, East Java at 2 AM today, even though I live in Jakarta and was asleep at the time. I want to change my password and force log out from all devices.',
				status: 'closed' as const,
				priority: 'CRITICAL' as const,
				createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
			},
			{
				ticketCode: 'TKT-SEED11',
				reporterId: reporterRecords[0].id,
				categoryId: categoryRecords[0].id,
				title: '"Cancel Submit" Button in Report Cannot Be Clicked',
				body: 'After creating a new complaint in the portal, a "Cancel Report Submission" button appears for the first 5 seconds. But when clicked, the button does not respond and the report is still sent to the agent. Please fix this cancellation functionality.',
				status: 'open' as const,
				priority: 'MEDIUM' as const,
				createdAt: new Date(Date.now() - 30 * 60 * 1000)
			}
		];

		const reportRecords = await db
			.insert(reports)
			.values(
				reportValues.map((r) => {
					const { responseDue, resolveDue } = calculateSLA(r.priority, r.createdAt);
					return {
						...r,
						slaResponseDue: responseDue,
						slaResolveDue: resolveDue
					};
				})
			)
			.returning();
		console.log(`✅ Seeded ${reportRecords.length} reports.`);

		// Update SLA breach for tickets past deadlines
		await db
			.update(reports)
			.set({ isSlaBreached: true })
			.where(
				sql`${reports.slaResponseDue} < NOW() AND ${reports.status} NOT IN ('resolved', 'closed') AND ${reports.isSlaBreached} = false`
			);

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
					note: 'Complaint received. Our Finance team is reconciling the payment records on the LinkAja payment system. Reconciliation usually takes at most 1 business hour.',
					changedAt: new Date(Date.now() - 20 * 60 * 60 * 1000)
				},
				{
					reportId: reportRecords[2].id,
					changedBy: agentId,
					oldStatus: 'open',
					newStatus: 'in_progress',
					note: 'Initial investigation started to analyze the crash logs on the Samsung S21 phone.',
					changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
				},
				{
					reportId: reportRecords[2].id,
					changedBy: agentId,
					oldStatus: 'in_progress',
					newStatus: 'resolved',
					note: 'Crash issue resolved. We released minor update version 1.0.4 to fix transaction history data rendering on certain Android versions.',
					changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
				},
				{
					reportId: reportRecords[3].id,
					changedBy: adminId,
					oldStatus: 'open',
					newStatus: 'resolved',
					note: 'The payment gateway confirmed a double-recording error. The second transaction funds (Rp 89.000) have been voided and returned to the reporter credit card.',
					changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
				},
				{
					reportId: reportRecords[7].id,
					changedBy: adminId,
					oldStatus: 'open',
					newStatus: 'closed',
					note: 'We closed this complaint because the wrong-plan transaction is not eligible for a refund (its transfer quota was already used). Instead we gave a discount voucher to make upgrading to the annual plan easier.',
					changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
				},
				{
					reportId: reportRecords[9].id,
					changedBy: adminId,
					oldStatus: 'open',
					newStatus: 'closed',
					note: 'Account secured. Password changed by the account owner, and we terminated all active sessions on other devices as requested.',
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
