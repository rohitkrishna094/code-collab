export const isEmpty = (s: string) => !s || s.length === 0;

export const isNotEmpty = (s: string) => !isEmpty(s);

export const isBlank = (s: string) => !s || /^\s*$/.test(s);

export const isNotBlank = (s: string) => !isBlank(s);
