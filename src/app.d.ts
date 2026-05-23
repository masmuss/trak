import type { Session, User } from 'better-auth/minimal';

declare global {
	namespace App {
		interface Locals {
			user?: User;
			session?: Session;
		}
	}
}
