// SVECraftName: {
//     Neutral: "中立",
//     Nightmare: "梦魇",
//     Forest: "精灵",
//     Dragon: "龙族",
//     Haven: "主教",
//     Rune: "巫师",
//     Sword: "皇家"
// },

// ["Forest", "Sword", "Rune", "Dragon", "Nightmare", "Haven", "Neutral"]

// Ze = {
//   0: "入场曲",
//   1: "谢幕曲",
//   2: "启动",
//   3: "进化",
//   4: "进化时",
//   5: "疾驰",
//   6: "突进",
//   7: "守护",
//   8: "吸血",
//   9: "必杀",
//   10: "真红",
//   11: "觉醒",
//   12: "指定攻击",
//   13: "威压",
//   14: "灵气",
//   15: "死灵充能",
//   16: "魔力连锁",
//   17: "快速",
//   18: "积蓄",
//   19: "土之秘术"
// }

type QueryPayload = {
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
type Card = {
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
