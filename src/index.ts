import { Context, Schema, h } from 'koishi'

export const name = 'sve-helper'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

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

const queryUrl = 'https://www.svehelperwin.com/api/card/getCardList'
const imgUrl = 'https://shadowverse-evolve.com/wordpress/wp-content/images/cardlist' // /from/card_no.png
const imgBackUrl = 'https://www.svehelperwin.com/api/backCard/getCardByCardNo'

function parseCardImagePath(card: Card) {
  let imgName = `${card.card_no}`
  if (!card.from.startsWith('SD')) {
    imgName = imgName.toLowerCase()
  }
  if (card.from in ["BP01", "BP02", "SD"]) {
    imgName = `${imgName.replace('-', '_')}`
  }
  if (imgName in ["bp03-u03", "bp03-u04", "bp03-u06"]) {
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

function makeCardMessage(ctx: Context, card: Card) {
  let cardImgUrl = parseCardImagePath(card)
  ctx.logger('sve-helper').info(`inferred image url (please report if incorrect): ${cardImgUrl}`)
  return h('message', h('img', {src: cardImgUrl}), `${card.name_cn}\n${card.desc_cn}`)
}

export function apply(ctx: Context) {
  ctx.command('sve-helper <query>')
    .action(({session}, query) => {
      const payload: QueryPayload = {
        from: [],
        card_type: [],
        rare: [],
        cost: [],
        craft: [],
        race: [],
        sort_by: 'cost',
        ability: [],
        name: query,
        pageable: {
          limit: 5,
          offset: 0
        }
      }
      return ctx.http.post(
        queryUrl,
        payload
      ).then((res) => {
        if (res.code !== 200) {
          ctx.logger('sve-helper').warn('查询失败', res.data)
          return '查询失败'
        }
        const cards = res.data.list
        if (cards.length === 0) {
          return '未找到卡片'
        }
        // card has back, append back card
        cards.forEach((card: Card) => {
          if (card.has_back) {
            ctx.http.post(
              imgBackUrl,
              {card_no: card.card_no}
            ).then((res) => {
              if (res.code === 200) {
                let backData = res.data
                backData.has_back = -1
                cards.push(backData)
              }
            })
          }
        })
        session.send(h('message', {'forward': true}, cards.map((card: Card) => makeCardMessage(ctx, card))))
      })
    })
}
