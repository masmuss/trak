export { cleanUpStaleSessions } from './bot.service';

export {
	getCategories,
	getCategoryById,
	getActiveCategories,
	createCategory,
	updateCategory,
	deleteCategory
} from './category.service';
export type { CreateCategoryInput, UpdateCategoryInput } from './category.types';

export {
	getUsers,
	getUserById,
	findUserByEmail,
	findUserByEmailExcluding,
	createUser,
	updateUser,
	updateProfile,
	deleteUser
} from './user.service';
export type { CreateUserInput, UpdateUserInput } from './user.types';

export { getPasswordAccount, updateAccountPassword, createAccount } from './account.service';
export type { PasswordAccount, CreateAccountInput } from './account.types';

export {
	getTicketById,
	listTickets,
	getTicketByIdSimple,
	getTicketByTicketCode,
	updateTicketStatus,
	updateTicketPriority,
	checkSlaBreach,
	calculateSLA,
	createReport,
	addReportAttachment,
	getCategoryDistribution,
	getTicketsForExport,
	getTicketStats
} from './report.service';
export type {
	TicketListItem,
	TicketListResult,
	TicketFilters,
	TicketStats,
	CategoryDistribution,
	DistributionResult,
	CreateReportInput,
	CreateAttachmentInput
} from './report.types';

export {
	getInviteCodes,
	getInviteCodeById,
	getInviteCodeByCode,
	validateInviteCode,
	createInviteCode,
	updateInviteCode,
	deleteInviteCode
} from './invite-code.service';
export type {
	CreateInviteCodeInput,
	UpdateInviteCodeInput,
	InviteCodeValidation
} from './invite-code.types';

export {
	getReporters,
	getReporterById,
	getReporterByTelegramId,
	createReporter
} from './reporter.service';
export type { ReporterWithRelations, CreateReporterInput } from './reporter.types';

export { getDashboardStats, getRecentTickets, getTopInviteCodes } from './dashboard.service';
export type { DashboardStats, TopInviteCode } from './dashboard.types';

export {
	createNotification,
	getPendingNotifications,
	markNotificationRead
} from './notification.service';
export type { CreateNotificationInput } from './notification.types';
