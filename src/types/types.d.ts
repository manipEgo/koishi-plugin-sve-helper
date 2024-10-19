declare type QueryPayload = {
    from: string[],
    card_type: string[],
    rare: string[],
    cost: number[],
    craft: string[],
    race: number[],
    sort_by: string,
    ability: number[],
    name: string,
    pageable: {
        limit: number,
        offset: number
    }
}
declare type Card = {
    id: number,
    card_no: string,
    name_jp: string,
    name_cn: string,
    craft: string,
    card_type: string,
    type: string,
    rare: string,
    from: string,
    cost: number,
    attack: number,
    life: number,
    desc_jp: string,
    desc_cn: string,
    drawer: string,
    img_url: string,
    related_card_nos?: string,
    created_at: number,
    speech: string,
    title: string,
    has_back: number
}