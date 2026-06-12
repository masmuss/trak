import type {
	FilterConfig,
	FilterValue,
	ParsedFilters,
	SelectFilterConfig,
	SearchFilterConfig,
	DateRangeFilterConfig,
	DateFilterConfig
} from './types';

/**
 * Filter Configuration System
 * Provides type-safe filter definitions and utilities
 */

export class FilterManager {
	private configs: Map<string, FilterConfig> = new Map();

	constructor(configs: FilterConfig[] = []) {
		configs.forEach((config) => this.addConfig(config));
	}

	/**
	 * Add a filter configuration
	 */
	addConfig(config: FilterConfig): void {
		this.configs.set(config.key, config);
	}

	/**
	 * Get a filter configuration by key
	 */
	getConfig(key: string): FilterConfig | undefined {
		return this.configs.get(key);
	}

	/**
	 * Get all filter configurations
	 */
	getAllConfigs(): FilterConfig[] {
		return Array.from(this.configs.values());
	}

	/**
	 * Parse URL search params to filter values
	 */
	parseFromURL(url: URL): ParsedFilters {
		const filters: ParsedFilters = {};

		for (const [key, config] of this.configs) {
			const rawValue = url.searchParams.get(key);
			if (!rawValue) continue;

			const serverKey = config.serverKey || key;
			filters[serverKey] = this.parseValue(config, rawValue);
		}

		return filters;
	}

	/**
	 * Serialize filter values to URL search params
	 */
	serializeToURL(filters: ParsedFilters): URLSearchParams {
		const params = new URLSearchParams();

		for (const [key, config] of this.configs) {
			const serverKey = config.serverKey || key;
			const value = filters[serverKey];

			if (value !== undefined && value !== null && value !== '') {
				params.set(key, this.serializeValue(config, value));
			}
		}

		return params;
	}

	/**
	 * Parse a single filter value based on its type
	 */
	private parseValue(config: FilterConfig, rawValue: string): FilterValue {
		switch (config.type) {
			case 'multi-select':
				return rawValue.split(',').filter(Boolean);
			case 'select':
				return rawValue;
			case 'search':
				return rawValue;
			case 'date':
				return new Date(rawValue);
			case 'date-range': {
				const [from, to] = rawValue.split('..');
				return {
					from: from ? new Date(from) : undefined,
					to: to ? new Date(to) : undefined
				};
			}
			default:
				return rawValue;
		}
	}

	/**
	 * Serialize a single filter value based on its type
	 */
	private serializeValue(config: FilterConfig, value: FilterValue): string {
		switch (config.type) {
			case 'multi-select':
				return (value as string[]).join(',');
			case 'date-range': {
				const range = value as { from?: Date; to?: Date };
				return `${range.from?.toISOString() || ''}..${range.to?.toISOString() || ''}`;
			}
			case 'date':
				return (value as Date).toISOString();
			default:
				return String(value);
		}
	}

	/**
	 * Validate filter value against config
	 */
	validate(key: string, value: FilterValue): boolean {
		const config = this.getConfig(key);
		if (!config) return false;

		switch (config.type) {
			case 'select':
			case 'multi-select': {
				const selectConfig = config as SelectFilterConfig;
				const validValues = new Set(selectConfig.options.map((o) => o.value));

				if (config.type === 'select') {
					return validValues.has(value as string);
				} else {
					return (value as string[]).every((v) => validValues.has(v));
				}
			}
			case 'date':
				return value instanceof Date && !isNaN(value.getTime());
			case 'date-range': {
				const range = value as { from?: Date; to?: Date };
				return (
					(!range.from || (range.from instanceof Date && !isNaN(range.from.getTime()))) &&
					(!range.to || (range.to instanceof Date && !isNaN(range.to.getTime())))
				);
			}
			case 'search':
				return typeof value === 'string';
			default:
				return true;
		}
	}

	/**
	 * Get default values for all filters
	 */
	getDefaults(): ParsedFilters {
		const defaults: ParsedFilters = {};

		for (const [key, config] of this.configs) {
			const serverKey = config.serverKey || key;

			switch (config.type) {
				case 'multi-select':
					defaults[serverKey] = [];
					break;
				case 'search':
					defaults[serverKey] = '';
					break;
				case 'date-range':
					defaults[serverKey] = { from: undefined, to: undefined };
					break;
				default:
					defaults[serverKey] = undefined;
			}
		}

		return defaults;
	}

	/**
	 * Check if any filter has active value
	 */
	hasActiveFilters(filters: ParsedFilters): boolean {
		for (const [key, config] of this.configs) {
			const serverKey = config.serverKey || key;
			const value = filters[serverKey];

			if (value !== undefined && value !== null && value !== '') {
				if (Array.isArray(value) && value.length === 0) continue;
				if (typeof value === 'object' && !Object.values(value).some((v) => v !== undefined))
					continue;
				return true;
			}
		}
		return false;
	}

	/**
	 * Clear all filters
	 */
	clearFilters(): ParsedFilters {
		return this.getDefaults();
	}

	/**
	 * Clear a specific filter
	 */
	clearFilter(key: string, filters: ParsedFilters): ParsedFilters {
		const config = this.getConfig(key);
		if (!config) return filters;

		const serverKey = config.serverKey || key;
		const newFilters = { ...filters };
		delete newFilters[serverKey];
		return newFilters;
	}

	/**
	 * Toggle a multi-select filter value
	 */
	toggleMultiSelect(key: string, value: string, filters: ParsedFilters): ParsedFilters {
		const config = this.getConfig(key);
		if (!config || config.type !== 'multi-select') return filters;

		const serverKey = config.serverKey || key;
		const current = (filters[serverKey] as string[]) || [];
		const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];

		return {
			...filters,
			[serverKey]: next
		};
	}

	/**
	 * Set a filter value
	 */
	setFilter(key: string, value: FilterValue, filters: ParsedFilters): ParsedFilters {
		const config = this.getConfig(key);
		if (!config) return filters;

		const serverKey = config.serverKey || key;
		return {
			...filters,
			[serverKey]: value
		};
	}
}

/**
 * Helper function to create filter configurations
 */
export function createFilterConfigs<T = string>(
	configs: (SelectFilterConfig<T> | SearchFilterConfig | DateRangeFilterConfig | DateFilterConfig)[]
): FilterConfig[] {
	return configs as FilterConfig[];
}

/**
 * Helper to create select filter config
 */
export function createSelectFilter<T = string>(
	config: Omit<SelectFilterConfig<T>, 'type'>
): SelectFilterConfig<T> {
	return { ...config, type: 'select' };
}

/**
 * Helper to create multi-select filter config
 */
export function createMultiSelectFilter<T = string>(
	config: Omit<SelectFilterConfig<T>, 'type'>
): SelectFilterConfig<T> {
	return { ...config, type: 'multi-select' };
}

/**
 * Helper to create search filter config
 */
export function createSearchFilter(config: Omit<SearchFilterConfig, 'type'>): SearchFilterConfig {
	return { ...config, type: 'search' };
}

/**
 * Helper to create date-range filter config
 */
export function createDateRangeFilter(
	config: Omit<DateRangeFilterConfig, 'type'>
): DateRangeFilterConfig {
	return { ...config, type: 'date-range' };
}
