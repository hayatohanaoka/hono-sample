import { QIITA_HOST, ZENN_HOST } from "../articleSourceUrls.js"

export interface IDriver {
    getArticles(): Promise<any>
    searchArticles(query: string): Promise<any>
}


export class QiitaDriver implements IDriver {
    getArticles = async (): Promise<any> => {
        const response = await fetch(`${QIITA_HOST}/api/v2/items?per_page=100`)
        
        if (!response.ok) throw new Error(`Failed to fetch Qiita articles: ${response.statusText}`)
        
        return await response.json()
    }

    async searchArticles(query: string): Promise<any> {
        const response = await fetch(`${QIITA_HOST}/api/v2/items?per_page=100&query=${query}`)
        
        if (!response.ok) throw new Error(`Failed to search Qiita articles: ${response.statusText}`)
        
        return await response.json()
    }
}

export class ZennDriver implements IDriver {
    getArticles = async (): Promise<any> => {
        const response = await fetch(`${ZENN_HOST}/api/articles?article_type=tech`)
        
        if (!response.ok) throw new Error(`Failed to fetch Zenn articles: ${response.statusText}`)
        
        return await response.json()
    }

    async searchArticles(query: string): Promise<any> {
        const response = await fetch(`${ZENN_HOST}/api/articles?article_type=tech&query=${query}`)
        
        if (!response.ok) throw new Error(`Failed to search Zenn articles: ${response.statusText}`)
        
        return await response.json()
    }
}
