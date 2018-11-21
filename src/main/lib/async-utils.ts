export const forEach = <T, U> (list: T[], asyncFn: (value: T, index: number, array: T[]) => U): Promise<U[]> => Promise.all(list.map(asyncFn))
