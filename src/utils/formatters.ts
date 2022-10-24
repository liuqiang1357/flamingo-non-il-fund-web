import BigNumber from 'bignumber.js';
import i18n from 'i18next';

export interface FormatEnumOptions {
  defaultValue?: string;
  ingoreMissing?: boolean;
}

export function formatEnum(
  type: string,
  value: number | string | undefined,
  { defaultValue, ingoreMissing = false }: FormatEnumOptions = {},
): string {
  if (value == undefined) {
    return '-';
  }
  if (i18n.exists(`common:enums.${type}.${value}`)) {
    return i18n.t(`common:enums.${type}.${value}`);
  }
  if (!ingoreMissing) {
    console.warn(`Enum path not found: ${`common:enums.${type}.${value}`}`);
  }
  return String(defaultValue ?? value);
}

export interface FormatLongTextOptions {
  headTailLength?: number;
  headLength?: number;
  tailLength?: number;
}

export function formatLongText(
  value: string | undefined,
  { headTailLength = 8, headLength, tailLength }: FormatLongTextOptions = {},
): string {
  if (value == undefined) {
    return '-';
  }
  const finalHeadLength = headLength ?? headTailLength;
  const finalTailLength = tailLength ?? headTailLength;

  if (value.length <= finalHeadLength + finalTailLength + 3) {
    return value;
  }
  return `${value.slice(0, finalHeadLength)}...${value.slice(value.length - finalTailLength)}`;
}

export interface FormatNumberOptions {
  decimals?: number | string;
  roundingMode?: BigNumber.RoundingMode;
  prefix?: string;
  suffix?: string;
  asPercentage?: boolean;
  withSign?: boolean;
}

export function formatNumber(
  value: number | string | undefined,
  {
    decimals,
    roundingMode,
    prefix,
    suffix,
    asPercentage = false,
    withSign = false,
  }: FormatNumberOptions = {},
): string {
  if (value == undefined) {
    return '-';
  }
  const bn = new BigNumber(value).times(asPercentage ? 100 : 1);
  if (bn.isNaN()) {
    return '-';
  }
  const options = {
    prefix: (prefix ?? '') + (withSign && bn.gte(0) ? '+' : ''),
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    suffix: (asPercentage ? '%' : '') + (suffix ?? ''),
  };
  if (decimals != undefined) {
    return bn.dp(Number(decimals), roundingMode).toFormat(options);
  }
  return bn.toFormat(options);
}
