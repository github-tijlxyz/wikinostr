export type Tab = {
    id: number,
    type: "welcome" | "articlefind" | "article",
    parent?: number,
    data?: string,
}
