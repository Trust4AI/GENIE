interface HistoryItem {
    role: 'user' | 'model'
    parts: { text: string }[]
}

export { HistoryItem }
