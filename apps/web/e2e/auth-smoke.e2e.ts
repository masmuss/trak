import { expect, test } from '@playwright/test';

test.describe('auth smoke', () => {
	test('admin logs in and reaches the dashboard', async ({ page }) => {
		await page.goto('/login');
		await page.getByLabel(/email/i).fill('admin@trak.id');
		await page.getByLabel(/password/i).fill('adminpassword123');
		await page.getByRole('button', { name: /login/i }).click();

		await expect(page).toHaveURL(/\/dashboard/);
		await expect(page.getByText('Dashboard Overview')).toBeVisible();
	});

	test('agent flow: tickets list loads with stats', async ({ page }) => {
		await page.goto('/login');
		await page.getByLabel(/email/i).fill('admin@trak.id');
		await page.getByLabel(/password/i).fill('adminpassword123');
		await page.getByRole('button', { name: /login/i }).click();
		await expect(page).toHaveURL(/\/dashboard/);

		await page.goto('/tickets');
		await expect(page.getByText('Total Tickets')).toBeVisible();
		await expect(page.getByText('Pending')).toBeVisible();
	});
});
