
function funcParseSortBy(value) {
    if (value === 'name') {
        return 'name';
    }
    return '_id';
}


function parseSortOrder(value) {
    if (typeof value === undefined) {
        return 'asc';
    }

    if (value !== 'asc' && value !== 'desc') {
        return 'asc';
    }

    return value

}


export function parseSortParams(query) {
    const { sortBy, sortOrder } = query;
    const parsedSortBy = funcParseSortBy(sortBy);
    const parsedSOrtOrder = parseSortOrder(sortOrder);

    return {
        sortBy: parsedSortBy,
        sortOrder: parsedSOrtOrder,
    }
}