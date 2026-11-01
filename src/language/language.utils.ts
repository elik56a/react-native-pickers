import type { Locale } from '../core';
import { getCompare, getDisplayNames, safe } from '../core/utils/intl.utils';
import type { SelectOption } from '../select';
import { DEFAULT_PREFERRED_LABEL } from '../select/select.constants';
import { pinPreferred } from '../select/select.utils';
import { LANGUAGE_DATA } from './data';
import { DEFAULT_ALL_LANGUAGES_LABEL } from './language.constants';
import type { Language, LanguageCode, LanguageListOptions } from './language.types';

let cache: Language[] | null = null;
let byCode: Map<string, Language> | null = null;

/** All the built-in languages, sorted by code. */
export const getAllLanguages = (): Language[] => {
  cache ??= LANGUAGE_DATA.map(([code, name, nativeName, country, rtl]) => ({
    code,
    name,
    nativeName,
    country,
    rtl: rtl ?? false,
  }));
  return cache;
};

/** Look up a built-in language by its tag, in any case: 'pt-br' finds 'pt-BR'. */
export const getLanguage = (code: string): Language | undefined => {
  byCode ??= new Map(getAllLanguages().map((language) => [language.code.toLowerCase(), language]));
  return byCode.get(code.toLowerCase());
};

/** Whether text in this language runs right to left, for any BCP 47 tag: 'ar', 'he-IL', 'fa_IR'… */
export const isRtlLanguage = (code: string) => getLanguage(code.split(/[-_]/)[0] ?? '')?.rtl ?? false;

/** The language's name in `locale`, such as 'Spanish' or 'espagnol', or its English name. */
export const getLanguageName = (language: Language, locale?: Locale) =>
  safe(() => getDisplayNames('language', locale)?.of(language.code), language.name);

/**
 * The languages as select options, each under its own name with its name in `locale` below, as a phone's language
 * settings show them: `preferred` first under their own header, then the rest sorted by the name in `locale`.
 * Search matches either name and the tag.
 */
export const buildLanguageOptions = ({
  languages,
  exclude,
  preferred,
  locale,
  preferredLabel = DEFAULT_PREFERRED_LABEL,
  allLanguagesLabel = DEFAULT_ALL_LANGUAGES_LABEL,
}: LanguageListOptions): SelectOption<LanguageCode>[] => {
  const excluded = new Set(exclude);
  const pool = (languages ? languages.flatMap((code) => getLanguage(code) ?? []) : getAllLanguages()).filter((l) => !excluded.has(l.code));
  const { pinned, rest } = pinPreferred(pool, preferred ?? [], (l) => l.code);
  const toOption = (language: Language, group?: string) => {
    const name = getLanguageName(language, locale);
    return {
      label: language.nativeName,
      value: language.code,
      description: name.toLowerCase() === language.nativeName.toLowerCase() ? undefined : name,
      group,
      keywords: [language.code, language.name, name],
      name,
    };
  };
  const compare = getCompare(locale);
  const others = rest.map((l) => toOption(l, pinned.length ? allLanguagesLabel : undefined)).sort((a, b) => compare(a.name, b.name));
  return [...pinned.map((l) => toOption(l, preferredLabel)), ...others].map(({ name: _name, ...option }) => option);
};
