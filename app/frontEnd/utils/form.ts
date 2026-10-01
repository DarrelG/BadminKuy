export const formText = (form: FormData, key: string): string =>
    String(form.get(key) ?? "").trim();
