import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatCompactNumber,
  formatPercent,
  formatDate,
} from './formatters';

describe('formatters utility', () => {
  describe('formatNumber', () => {
    it('should format numbers with Indonesian thousand separator dot', () => {
      // id-ID uses dot for thousands
      const formatted = formatNumber(125482);
      expect(formatted).toBe('125.482');
    });

    it('should format millions correctly', () => {
      const formatted = formatNumber(42560321);
      expect(formatted).toBe('42.560.321');
    });

    it('should handle zero, null, and undefined safely', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(null)).toBe('0');
      expect(formatNumber(undefined)).toBe('0');
    });
  });

  describe('formatCompactNumber', () => {
    it('should format millions with "Jt" suffix', () => {
      expect(formatCompactNumber(1500000)).toBe('1.5 Jt');
      expect(formatCompactNumber(42000000)).toBe('42.0 Jt');
    });

    it('should format thousands with "Rb" suffix', () => {
      expect(formatCompactNumber(2500)).toBe('2.5 Rb');
      expect(formatCompactNumber(150000)).toBe('150.0 Rb');
    });

    it('should return raw number as string if under 1000', () => {
      expect(formatCompactNumber(500)).toBe('500');
    });

    it('should return 0 for falsy input', () => {
      expect(formatCompactNumber(0)).toBe('0');
      expect(formatCompactNumber(null)).toBe('0');
    });
  });

  describe('formatPercent', () => {
    it('should format decimal percentages to 1 decimal place with %', () => {
      expect(formatPercent(98.54)).toBe('98.5%');
      expect(formatPercent(100)).toBe('100.0%');
    });

    it('should return 0% for null or undefined', () => {
      expect(formatPercent(null)).toBe('0%');
      expect(formatPercent(undefined)).toBe('0%');
    });
  });

  describe('formatDate', () => {
    it('should format ISO date strings into Indonesian localized date format', () => {
      const result = formatDate('2026-10-20T00:00:00.000Z');
      expect(result).toContain('2026');
      expect(result).toMatch(/Oktober|Okt/i);
    });

    it('should return dash for empty or null dates', () => {
      expect(formatDate(null)).toBe('-');
      expect(formatDate(undefined)).toBe('-');
      expect(formatDate('')).toBe('-');
    });
  });
});
