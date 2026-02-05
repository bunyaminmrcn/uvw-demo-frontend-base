function objectToQuery(obj: any, prefix: string | null = ''): string {
    const queryString = Object.keys(obj)
        .map((key) => {
            const value = obj[key];
            if (value === undefined) {
                return ''
            }
            const queryKey = prefix ? `${prefix}[${key}]` : key;

            if (typeof value === 'object' && !Array.isArray(value)) {
                return objectToQuery(value, queryKey);
            }
            return `${encodeURIComponent(queryKey)}=${encodeURIComponent(value)}`;
        }).filter(x => x != '')
        .join('&');

    return queryString;
}

export { objectToQuery }