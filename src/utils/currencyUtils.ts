/**
 * Uganda Shillings (UGX) Currency Formatting Utilities for SBL Events
 */

export const CURRENCY_CODE = 'UGX';
export const CURRENCY_LABEL = 'Uganda Shillings';

/**
 * Formats a numeric value into full Ugandan Shillings string with standard thousands separator.
 * e.g., formatUGX(4500000) => "UGX 4,500,000"
 */
export function formatUGX(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'UGX 0';
  }
  return `UGX ${Math.round(amount).toLocaleString('en-US')}`;
}

/**
 * Formats a numeric value into a concise shorthand string.
 * e.g., formatUGXShort(4500000) => "UGX 4.5M"
 *       formatUGXShort(750000)  => "UGX 750K"
 */
export function formatUGXShort(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'UGX 0';
  }

  const num = Math.round(amount);
  const abs = Math.abs(num);

  if (abs >= 1_000_000_000) {
    return `UGX ${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  }
  if (abs >= 1_000_000) {
    return `UGX ${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (abs >= 1_000) {
    return `UGX ${(num / 1_000).toFixed(0)}K`;
  }
  return `UGX ${num.toLocaleString('en-US')}`;
}
