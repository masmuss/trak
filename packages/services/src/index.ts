export { cleanUpStaleSessions } from './bot.service';
export { createAuditLog } from './audit.service';
export { getAuditLogs, getAuditLogsCount } from './audit.service';
export type { AuditLogInput, AuditLogFilters } from './audit.service';

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

export { createReport } from './report.service';
export { submitReportWithAttachments } from './ticket-submit.service';
export type { SubmitReportInput } from './ticket-submit.service';
export {
	getTicketById,
	listTickets,
	getTicketByIdSimple,
	getTicketByTicketCode,
	getTicketByTicketCodeForReporter,
	getCategoryDistribution,
	getTicketsForExport,
	getStaleTickets,
	getTicketStats,
	isTicketSortKey,
	parseStaleHours
} from './ticket-query.service';
export { updateTicketStatus, updateTicketPriority } from './ticket-status.service';
export { addReportAttachment, getReportAttachmentById } from './ticket-attachment.service';
export { createTicketMessage, createReporterTicketMessage } from './ticket-message.service';
export { claimTicket, assignTicket, getActiveTicketCounts } from './ticket-assignment.service';
export type { AgentWorkload } from './ticket-assignment.service';
export { calculateSLA, checkSlaBreach } from './ticket-sla.service';
export type {
	TicketListItem,
	TicketListResult,
	TicketFilters,
	TicketSortKey,
	TicketStats,
	CategoryDistribution,
	DistributionResult,
	CreateReportInput,
	CreateAttachmentInput,
	CreateTicketMessageInput
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

export {
	getDashboardStats,
	getRecentTickets,
	getTopInviteCodes,
	getCriticalTickets,
	getPerformanceOverview,
	getTicketVolume,
	getTicketCreationTrend,
	getSlaCalendar
} from './dashboard.service';
export type {
	DashboardStats,
	TopInviteCode,
	PerformanceOverviewData,
	VolumeDayData,
	CreationTrend,
	SlaCalendarData,
	SlaDeadline,
	DayData
} from './dashboard.types';

export {
	createNotification,
	publishAgentNotification,
	getPendingNotifications,
	markNotificationRead,
	markAllNotificationsRead,
	purgeReadNotifications,
	NOTIFICATION_RETENTION_DAYS
} from './notification.service';
export {
	createAgentNotification,
	getAgentNotifications,
	getUnreadAgentNotificationCount,
	markAgentNotificationRead,
	markAllAgentNotificationsRead
} from './notification.service';
export type { CreateNotificationInput } from './notification.types';
