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
