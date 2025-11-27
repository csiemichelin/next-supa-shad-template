export default function Head() {
  const title = '拿鐵拉花藝廊 | 時光咖啡 台北精品咖啡'
  const description =
    '欣賞時光咖啡的拿鐵拉花作品，從森林光影到季節系列，展現台北職人咖啡的細膩手沖與奶泡控制。'
  const url = 'https://shiguang-coffee.vercel.app/gallery/latte_art'
  const image = 'https://shiguang-coffee.vercel.app/images/store-front.png'

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="時光咖啡,台北咖啡,拉花,拿鐵,拉花藝術,咖啡廳" />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="時光咖啡" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  )
}
