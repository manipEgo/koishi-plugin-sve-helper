import { Context, Session, Schema, h } from 'koishi'
import { SVEAbilityName, SVECardTypeName, SVECraftName } from './types/enums'

export const name = 'sve-helper'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

const sveHelperUrl = 'https://www.svehelperwin.com'
const raceUrl = sveHelperUrl + '/api/race/getAll'
const queryUrl = sveHelperUrl + '/api/card/getCardList'
const backCardUrl = sveHelperUrl + '/api/backCard/getCardByCardNo'
const imgUrl = 'https://shadowverse-evolve.com/wordpress/wp-content/images/cardlist' // /from/card_no.png

function parseCardImagePath(card: Card) {
  let imgName = `${card.card_no}`
  if (!card.from.startsWith('SD')) {
    imgName = imgName.toLowerCase()
  }
  if (["BP01", "BP02", "SD"].includes(card.from)) {
    imgName = `${imgName.replace('-', '_')}`
  }
  if (["bp03-u03", "bp03-u04", "bp03-u06"].includes(imgName)) {
    imgName = `${imgName}-2`
  }
  imgName = imgName === 'cp01-p33' ? 'cp01-p330' : imgName === 'etd01-002' ? 'etd01-002%20' : imgName === 'cp03-124' ? 'cp03-124re' : imgName === 'cp03-004' ? 'cp03-004re' : imgName
  if (card.has_back !== 0) {
    if (imgName.startsWith('bp08')) {
      imgName = `${imgName}_${card.has_back === -1 ? 'back' : 'front'}`
    } else {
      imgName = `${imgName}${card.has_back === -1 ? '_ura' : ''}`
    }
  }
  return `${imgUrl}/${card.from}/${imgName}.png`
}

async function findBackCards(ctx: Context, cards: Card[]) {
  return new Promise<Card[]>(async resolve => {
    let backCards = []
    for (let i = 0; i < cards.length; i++) {
    if (cards[i].has_back) {
        const res = await ctx.http.post(
          backCardUrl,
          {card_no: cards[i].card_no}
        )
        if (res.code === 200) {
          let backData = res.data
          backData.has_back = -1
          backCards.push(backData)
        }
      }
    }
    resolve(backCards)
  })
}

function makeCardMessage(ctx: Context, session: Session, card: Card) {
  let cardImgUrl = parseCardImagePath(card)
  ctx.logger('sve-helper').info(`inferred image url (please report if incorrect) | ${card.name_cn}: ${cardImgUrl}`)
  return h('message', {'id': session.bot.selfId}, h('img', {src: cardImgUrl}), `${card.name_cn}\n${card.desc_cn}`)
}

export function apply(ctx: Context) {
  ctx.command('sve-helper <query>', '影之诗卡牌查询')
    .alias('sve')
    .option('limit', '-n <limit> 返回数量')
    .option('offset', '-o <offset> 偏移量')
    .option('cost', '-c <cost> 费用')
    .option('race', '-r <race> 类型')
    .option('rare', '-R <rare> 罕度')
    .option('from', '-f <from> 卡包')
    .option('craft', '-C <craft> 职业')
    .option('ability', '-a <ability> 能力')
    .option('card_type', '-t <card_type> 卡牌种类')
    .action(async ({session, options}, query) => {
      let raceIds = []
      if (options.race) {
        let raceQuery = options.race.split(',')
        const race_res = await ctx.http.post(
          raceUrl,
          {
            "headers": {
              "Host": sveHelperUrl,
            }
          }
        )
        if (race_res.code !== 200) {
          ctx.logger('sve-helper').warn('获取卡牌类型列表失败', race_res.data)
          return '获取卡牌类型列表失败'
        }
        const raceList = race_res.data
        if (!raceList) {
          ctx.logger('sve-helper').warn('获取卡牌类型列表 - 响应数据无效', race_res.data)
          return '获取卡牌类型列表 - 响应数据无效'
        }
        raceIds = raceList.filter((raceItem: Race) => raceQuery.includes(raceItem.jp_name) || raceQuery.includes(raceItem.cn_name)).map(raceItem => raceItem.id)
      }
      const payload: QueryPayload = {
        from: options.from ? options.from.toUpperCase().split(',') : [],
        card_type: options.card_type ? options.card_type.toLowerCase().replace('token', 'FollowerToken,SpellToken,AmuletToken').split(',').map((cardType: string) => SVECardTypeName[cardType] || '') : [],
        rare: options.rare ? options.rare.toUpperCase().split(',') : [],
        cost: options.cost ? options.cost.split(',').map(Number) : [],
        craft: options.craft ? options.craft.toLowerCase().split(',').map((craft: string) => SVECraftName[craft] || '') : [],
        race: raceIds,
        sort_by: 'byCostAsc',
        ability: options.ability ? options.ability.split(',').map((ability: string) => SVEAbilityName[ability] || null) : [],
        name: query,
        pageable: {
          limit: Number(options.limit) || 5,
          offset: Number(options.offset) || 0
        }
      }
      const res = await ctx.http.post(
        queryUrl,
        payload
      )
      if (res.code !== 200) {
        ctx.logger('sve-helper').warn('查询失败', res.data)
        return '查询失败'
      }
      if (!res.data || !res.data.list) {
        ctx.logger('sve-helper').warn('响应数据无效', res.data)
        return '响应数据无效'
      }
      const cards = res.data.list
      if (cards.length === 0) {
        return '未找到卡片'
      }
      const backCards = await findBackCards(ctx, cards)
      cards.push(...backCards)
      session.send(h('message', { 'forward': true }, cards.map((card: Card) => makeCardMessage(ctx, session, card))))
      ctx.logger('sve-helper').info('查询成功')
    })
}
