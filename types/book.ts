export interface BookData {
    title: string
    creator: string
    subject: string
    description: string[]
    publisher: string[]
    contributor: string[]
    date: string
    type: string
    format: string
    identifier: string[]
    language: string
    [key: string]: string | string[]
}