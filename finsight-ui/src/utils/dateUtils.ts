export const formatDate = (date: any) => {
    const options = {
        year: 'numeric' as const,
        month: '2-digit' as const,
        day: '2-digit' as const,
        hour: '2-digit' as const,
        minute: '2-digit' as const,
        hour12: false as const,
        timeZone: "Australia/Sydney" as const
    };
    return new Intl.DateTimeFormat('en-UK', options).format(date);
};

export const parseDate = (dateString: string): Date => {
    return new Date(dateString);
};
