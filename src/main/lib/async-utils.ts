export const forEach = <T, U> (list: T[], asyncFn: (value: T, index: number, array: T[]) => U) => Promise.all(list.map(asyncFn))
