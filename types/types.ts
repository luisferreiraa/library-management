// types.ts
export type SortDirection = "asc" | "desc"

export type SortOption<T> = {
    value: keyof T;
    direction: "asc" | "desc";
};

export type ActiveFilterOption = "all" | "active" | "inactive"

export type ActiveFilterItemOption = "all" | "BOOK" | "PERIODICAL" | "DVD" | "VHS" | "CD"
