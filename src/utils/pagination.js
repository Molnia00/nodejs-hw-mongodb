function helperParse(value, defaultValue) {
    if (typeof value === undefined) {
        return defaultValue;
    }
    const parseNumber = parseInt(value);
    
    if (Number.isNaN(parseNumber) === true) {
        return defaultValue;
    }

    return parseNumber
}

export function parsePaginationParams(query) {
    const { page, perPage } = query;
    const parsedPage = helperParse(page, 1);
    const parsedPerPage = helperParse(perPage, 10);

    return {
        page: parsedPage,
        perPage: parsedPerPage,
    }
}

