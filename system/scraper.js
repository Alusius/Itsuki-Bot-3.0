const axios = require("axios")
const cheerio = require("cheerio")
const encodeUrl = require('encodeurl')
const fetch = require("node-fetch");
const yt = require('yt-search')
const FormData = require('form-data')
const fakeUa = require('fake-useragent')
const request = require('request')
const {JSDOM} = require('jsdom')
const fs = require('fs')
const chalk = require('chalk')
const qs = require("qs")
var { instagramGetUrl } = require('./other')
var shortener = (url) => {
  return url;
}
var clean = (data) => {
  let regex = /(<([^>]+)>)/gi;
  data = data.replace(/(<br?\s?\/>)/gi, " \n");
  return data.replace(regex, "");
};

exports.alphacoders = async (t) => {
  let e = await fetch(
    "https://wall.alphacoders.com/api2.0/get.php?auth=3e7756c85df54b78f934a284c11abe4e&method=search&term=" +
      encodeURIComponent(t)
  );
  if (!e.ok) throw await e.text();
  let a = (await e.json())["wallpapers"];
  t = a.map((t) => ({
    width: parseInt(t.width),
    height: parseInt(t.height),
    ext: t.file_type,
    id: parseInt(t.id),
    url: t.url_page,
    img: t.url_image,
    thumb: t.url_thumb,
  }));
  return { status: e.status, creator: "HyzerDev", result: t };
}

exports.fb = async(url) => {
    return new Promise(async(resolve, reject) => {
        await axios.get('https://downvideo.net/').then(gdata => {
        const a = cheerio.load(gdata.data)
        const token = a('body > div > center > div.col-md-10 > form > div > input[type=hidden]:nth-child(2)').attr('value')
        const options = {
            method: "POST",
            url: `https://downvideo.net/download.php`,
            headers: {
                "content-type": 'application/x-www-form-urlencoded',
                "cookie": gdata["headers"]["set-cookie"],
                "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
            },
            formData: {
                URL: url,
                token: token,
            },
        };
        request(options, async function(error, response, body) {
            if (error) throw new Error(error)
            const $ = cheerio.load(body)
            const result = {
                status: 200,
                author: "HyzerDev",
                title: $('body').find('div:nth-child(1) > h4').text(),
                sd: $('#sd > a').attr('href'),
                hd: $('body').find('div:nth-child(7) > a').attr('href')
            }
            resolve(result)
        })
    })
})
}

exports.imdb = async(url) => {
    return new Promise((resolve, reject) => {
        axios.get('https://freedownloadvideo.net/imdb-video-downloader').then((data) => {
            let a = cheerio.load(data.data)
            let token = a('#token').attr('value')
            const options = {
                method: 'POST',
                url: `https://freedownloadvideo.net/wp-json/aio-dl/video-data/`,
                headers: {
                    "content-type": "application/x-www-form-urlencoded;",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
                    "cookie": "PHPSESSID=jue6d59cnfgu8pmraa971cetm6; _gid=GA1.2.1096581014.1656129824; __gads=ID=855f6257a3b17608-227b1200fed200a7:T=1656129824:RT=1656129824:S=ALNI_MYlQs2q77JAmj399O3YnmMSElqAIA; __gpi=UID=0000068f8a6124cf:T=1656129824:RT=1656129824:S=ALNI_MZhz1dM3pQuLjvXkFxtGqNtiIo4yw; _ga_KN64Y44T94=GS1.1.1656129823.1.1.1656130205.0; _ga=GA1.2.1859454192.1656129824"
                },
                formData: {url: url,token: token}
            };
            request(options, async function(error, response, body) {
                if (error) throw new Error(error)
                res = JSON.parse(body)
                result = {
                    status: 200,
                    author: "HyzerDev",
                    ...res,
                }
                resolve(result);
            })
        }).catch(reject)
    })
}

exports.ssweb = async(url, device = 'desktop') => {
     return new Promise((resolve, reject) => {
          const base = 'https://www.screenshotmachine.com'
          const param = {
            url: url,
            device: device,
            cacheLimit: 0
          }
          axios({url: base + '/capture.php',
               method: 'POST',
               data: new URLSearchParams(Object.entries(param)),
               headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
               }
          }).then((data) => {
               const cookies = data.headers['set-cookie']
               if (data.data.status == 'success') {
                    axios.get(base + '/' + data.data.link, {
                         headers: {
                              'cookie': cookies.join('')
                         },
                         responseType: 'arraybuffer'
                    }).then(({ data }) => {
                        result = {
                            status: 200,
                            author: 'HyzerDev',
                            result: data
                        }
                         resolve(result)
                    })
               } else {
                    reject({ status: 404, author: 'HyzerDev', message: data.data })
               }
          }).catch(reject)
     })
}

exports.wallpaper = (title, page = '1') => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`)
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let hasil = []
            $('div.grid-item').each(function (a, b) {
                hasil.push({
                    title: $(b).find('div.info > a > h3').text(),
                    type: $(b).find('div.info > a:nth-child(2)').text(),
                    source: 'https://www.besthdwallpaper.com/'+$(b).find('div > a:nth-child(3)').attr('href'),
                    image: [$(b).find('picture > img').attr('data-src') || $(b).find('picture > img').attr('src'), $(b).find('picture > source:nth-child(1)').attr('srcset'), $(b).find('picture > source:nth-child(2)').attr('srcset')]
                })
            })
            resolve(hasil)
        })
    })
}

exports.xnxxsearch = (query) => {
  return new Promise((resolve, reject) => {
    const baseurl = 'https://www.xnxx.com'
    fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, {method: 'get'})
    .then(res => res.text())
    .then(res => {
      let $ = cheerio.load(res, {
        xmlMode: false
      });
      let title = [];
      let url = [];
      let desc = [];
      let results = [];

      $('div.mozaique').each(function(a, b) {
        $(b).find('div.thumb').each(function(c, d) {
          url.push(baseurl+$(d).find('a').attr('href').replace("/THUMBNUM/", "/"))
        })
      })
      $('div.mozaique').each(function(a, b) {
        $(b).find('div.thumb-under').each(function(c, d) {
          desc.push($(d).find('p.metadata').text())
          $(d).find('a').each(function(e,f) {
              title.push($(f).attr('title'))
          })
        })
      })
      for (let i = 0; i < title.length; i++) {
        results.push({
          title: title[i],
          info: desc[i],
          link: url[i]
        })
      }
      resolve({
        code: 200,
        status: true,
        result: results
      })
    })
    .catch(err => reject({code: 503, status: false, result: err }))
  })
}

exports.xnxxdl = (URL) => {
  return new Promise((resolve, reject) => {
    fetch(`${URL}`, {method: 'get'})
    .then(res => res.text())
    .then(res => {
      let $ = cheerio.load(res, {
        xmlMode: false
      });
      const title = $('meta[property="og:title"]').attr('content');
      const duration = $('meta[property="og:duration"]').attr('content');
      const image = $('meta[property="og:image"]').attr('content');
      const videoType = $('meta[property="og:video:type"]').attr('content');
      const videoWidth = $('meta[property="og:video:width"]').attr('content');
      const videoHeight = $('meta[property="og:video:height"]').attr('content');
      const info = $('span.metadata').text();
      const videoScript = $('#video-player-bg > script:nth-child(6)').html();
      const files = {
        low: (videoScript.match('html5player.setVideoUrlLow\\(\'(.*?)\'\\);') || [])[1],
        high: videoScript.match('html5player.setVideoUrlHigh\\(\'(.*?)\'\\);' || [])[1],
        HLS: videoScript.match('html5player.setVideoHLS\\(\'(.*?)\'\\);' || [])[1],
        thumb: videoScript.match('html5player.setThumbUrl\\(\'(.*?)\'\\);' || [])[1],
        thumb69: videoScript.match('html5player.setThumbUrl169\\(\'(.*?)\'\\);' || [])[1],
        thumbSlide: videoScript.match('html5player.setThumbSlide\\(\'(.*?)\'\\);' || [])[1],
        thumbSlideBig: videoScript.match('html5player.setThumbSlideBig\\(\'(.*?)\'\\);' || [])[1],
      };
      resolve({
        status: 200,
        result: {
          title,
          URL,
          duration,
          image,
          videoType,
          videoWidth,
          videoHeight,
          info,
          files
        }
      })
    })
    .catch(err => reject({code: 503, status: false, result: err }))
  })
}

exports.youtube = (link) => {
  return new Promise((resolve, reject) => {
		const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:|watch\?.*(?:|\&)v=|embed\/|v\/|shorts\/)|youtu\.be\/)([-_0-9A-Za-z]{11}|[-_0-9A-Za-z]{10})/
		if (ytIdRegex.test(link)) {
		let url =  ytIdRegex.exec(link)
		let config = {
			'url': 'https://www.youtube.be/' + url,
			'q_auto': 0,
			'ajax': 1
		}
		let headerss = 	{
			"sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
			"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
			"Cookie": 'PHPSESSID=6jo2ggb63g5mjvgj45f612ogt7; _ga=GA1.2.405896420.1625200423; _gid=GA1.2.2135261581.1625200423; _PN_SBSCRBR_FALLBACK_DENIED=1625200785624; MarketGidStorage={"0":{},"C702514":{"page":5,"time":1625200846733}}'
		}
	axios('https://www.y2mate.com/mates/en68/analyze/ajax',{
			method: 'POST',
			data: new URLSearchParams(Object.entries(config)),
			headers: headerss
		})
	.then(({ data }) => {
		const $ = cheerio.load(data.result)
		let img = $('div.thumbnail.cover > a > img').attr('src');
		let title = $('div.thumbnail.cover > div > b').text();
		let size = $('#mp4 > table > tbody > tr:nth-child(3) > td:nth-child(2)').text()
		let size_mp3 = $('#audio > table > tbody > tr:nth-child(1) > td:nth-child(2)').text()
		let id = /var k__id = "(.*?)"/.exec(data.result)[1]
		let configs = {
    type: 'youtube',
    _id: id,
    v_id: url[1],
    ajax: '1',
    token: '',
    ftype: 'mp4',
    fquality: 480
  }
	axios('https://www.y2mate.com/mates/en68/convert',{
		method: 'POST',
		data: new URLSearchParams(Object.entries(configs)),
		headers: headerss 
	})
	.then(({data}) => {
		const $ = cheerio.load(data.result)
		let link = $('div > a').attr('href')
	let configss = {
    type: 'youtube',
    _id: id,
    v_id: url[1],
    ajax: '1',
    token: '',
    ftype: 'mp3',
    fquality: 128
  }
	axios('https://www.y2mate.com/mates/en68/convert',{
		method: 'POST',
		data: new URLSearchParams(Object.entries(configss)),
		headers: headerss 
	})
	.then(({ data }) => {
		const $ = cheerio.load(data.result)
		let audio = $('div > a').attr('href')
		resolve({
			id: url[1],
			title: title,
			size: size,
			quality: '480p',
			thumb: img,
			link: link,
			size_mp3: size_mp3,
			mp3: audio
		})

		})
			})
		})
	.catch(reject)
	}else reject('link invalid')
	})
}

exports.randomgore = async () => {
    return new Promise(async (resolve, reject) => {
        rand = Math.floor(Math.random() * 218) + 1
        randvid = Math.floor(Math.random() * 16) + 1
        if (rand === 1) {
            slink = 'https://seegore.com/gore/'
        } else {
            slink = `https://seegore.com/gore/page/${rand}/`
        }
        axios.get(slink).then(({
            data
        }) => {
            const $ = cheerio.load(data)
            const link = []
            const result = []
            const username = []
            const linkp = $(`#post-items > li:nth-child(${randvid}) > article > div.post-thumbnail > a`).attr('href')
            const thumbb = $(`#post-items > li:nth-child(${randvid}) > article > div.post-thumbnail > a > div > img`).attr('src')
            axios
                .get(linkp)
                .then(({
                    data
                }) => {
                    const $$ = cheerio.load(data)
                    const format = {
                        judul: $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > header > h1').text(),
                        views: $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > span > span.count').text(),
                        comment: $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > a > span.count').text() == '' ? 'Tidak ada komentar' : $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > a > span.count').text(),
                        thumb: thumbb,
                        link: $$('video > source').attr('src'),
                    }
                    const result = {
                        creator: 'HyzerDev',
                        data: format,
                    }
                    resolve(result)
                })
                .catch(reject)
        })
    })
}

exports.goredl = async (link) => {
    return new Promise(async (resolve, reject) => {
        axios
            .get(link)
            .then(({
                data
            }) => {
                const $$ = cheerio.load(data)
                const format = {
                    judul: $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > header > h1').text(),
                    views: $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > span > span.count').text(),
                    comment: $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > a > span.count').text(),
                    link: $$('video > source').attr('src'),
                }
                const result = {
                    creator: 'HyzerDev',
                    data: format,
                }
                resolve(result)
            })
            .catch(reject)
    })
}

exports.searchgore = async (query) => {
    return new Promise(async (resolve, reject) => {
        axios.get('https://seegore.com/?s=' + query).then((dataa) => {
            const $$$ = cheerio.load(dataa)
            pagina = $$$('#main > div.container.main-container > div > div.bb-col.col-content > div > div > div > div > nav > ul > li:nth-child(4) > a').text()
            rand = Math.floor(Math.random() * pagina) + 1
            if (rand === 1) {
                slink = 'https://seegore.com/?s=' + query
            } else {
                slink = `https://seegore.com/page/${rand}/?s=${query}`
            }
            axios
                .get(slink)
                .then(({
                    data
                }) => {
                    const $ = cheerio.load(data)
                    const link = []
                    const judul = []
                    const uploader = []
                    const format = []
                    const thumb = []
                    $('#post-items > li > article > div.content > header > h2 > a').each(function(a, b) {
                        link.push($(b).attr('href'))
                    })
                    $('#post-items > li > article > div.content > header > h2 > a').each(function(c, d) {
                        jud = $(d).text()
                        judul.push(jud)
                    })
                    $('#post-items > li > article > div.content > header > div > div.bb-cat-links > a').each(function(e, f) {
                        upl = $(f).text()
                        uploader.push(upl)
                    })
                    $('#post-items > li > article > div.post-thumbnail > a > div > img').each(function(g, h) {
                        thumb.push($(h).attr('src'))
                    })
                    for (let i = 0; i < link.length; i++) {
                        format.push({
                            judul: judul[i],
                            uploader: uploader[i],
                            thumb: thumb[i],
                            link: link[i],
                        })
                    }
                    const result = {
                        creator: 'HyzerDev',
                        data: format,
                    }
                    resolve(result)
                })
                .catch(reject)
        })
    })
}

exports.igstalker = async(Username) => {
  return new Promise((resolve, reject) => {
    axios.get('https://dumpor.com/v/'+Username, {
      headers: {
        "cookie": "_inst_key=SFMyNTY.g3QAAAABbQAAAAtfY3NyZl90b2tlbm0AAAAYWGhnNS1uWVNLUU81V1lzQ01MTVY2R0h1.fI2xB2dYYxmWqn7kyCKIn1baWw3b-f7QvGDfDK2WXr8",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
      }
    }).then(res => {
      const $ = cheerio.load(res.data)
      const result = {
        profile: $('#user-page > div.user > div.row > div > div.user__img').attr('style').replace(/(background-image: url\(\'|\'\);)/gi, ''),
        fullname: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > div > a > h1').text(),
        username: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > div > h4').text(),
        post: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > ul > li:nth-child(1)').text().replace(' Posts',''),
        followers: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > ul > li:nth-child(2)').text().replace(' Followers',''),
        following: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > ul > li:nth-child(3)').text().replace(' Following',''),
        bio: $('#user-page > div.user > div > div.col-md-5.my-3 > div').text()
      }
      resolve(result)
    })
  })
}

exports.instagram = async(url) => {
let result = await instagramGetUrl(url)
return result
}

exports.igdl = async(url) => {
    return new Promise(async (resolve, reject) => {
        axios.request({
            url: 'https://www.instagramsave.com/download-instagram-videos.php',
            method: 'GET',
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "cookie": "PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg"
            }
        })
            .then(({ data }) => {
                const $ = cheerio.load(data)
                const token = $('#token').attr('value')
                let config = {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
                        "cookie": "PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg",
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    },
                    data: {
                        'url': url,
                        'action': 'post',
                        'token': token
                    }
                }
                axios.post('https://www.instagramsave.com/system/action.php', qs.stringify(config.data), { headers: config.headers })
                    .then(({ data }) => {
                        resolve(data.medias)
                    })
            })
            .catch(reject)
    })
}

exports.aiovideodl = async (url) => {
    try {
        const tokenn = await axios.get('https://aiovideodl.ml/', {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'cookie': 'PHPSESSID=3893d5f173e91261118a1d8b2dc985c3; _ga=GA1.2.792478743.1635388171;',
            }
        })
        let a = cheerio.load(tokenn.data)
        let token = a('#token').attr('value')
        const param = {
            url: url,
            token: token
        }
        const {
            data
        } = await axios.request('https://aiovideodl.ml/wp-json/aio-dl/video-data/', {
            method: 'post',
            data: new URLSearchParams(Object.entries(param)),
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'cookie': 'PHPSESSID=3893d5f173e91261118a1d8b2dc985c3; _ga=GA1.2.792478743.1635388171;',
            }
        })
        return ({
            status: true,
            creator: '@ihsanafajar',
            ...data
        })
    } catch (e) {
        return ({
            status: false
        })
    }
}

exports.facebook = async (url) => {
    const param = {
        q: url
    }
    const {
        data
    } = await axios.request({
        url: 'https://fbdownloader.online/api/analyze',
        method: 'post',
        data: new URLSearchParams(Object.entries(param)),
        headers: {
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
        }
    })
    return data
}

exports.facebook2 = async(url) => {
    return new Promise(async(resolve, reject) => {
        await axios.get('https://downvideo.net/').then(gdata => {
        const a = cheerio.load(gdata.data)
        const token = a('body > div > center > div.col-md-10 > form > div > input[type=hidden]:nth-child(2)').attr('value')
        const options = {
            method: "POST",
            url: `https://downvideo.net/download.php`,
            headers: {
                "content-type": 'application/x-www-form-urlencoded',
                "cookie": gdata["headers"]["set-cookie"],
                "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
            },
            formData: {
                URL: url,
                token: token,
            },
        };
        request(options, async function(error, response, body) {
            if (error) throw new Error(error)
            const $ = cheerio.load(body)
            const result = {
                status: 200,
                author: "Memek",
                title: $('body').find('div:nth-child(1) > h4').text(),
                sd: $('#sd > a').attr('href'),
                hd: $('body').find('div:nth-child(7) > a').attr('href')
            }
            resolve(result)
        })
    })
})
}

exports.pinterestvid = async (link) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: `https://pinterestvideodownloader.com/id/`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'user-agent': fakeUa(),
                cookie: '_ga=GA1.2.894954552.1635394717;',
            },
            formData: {
                url: link,
            },
        }

        request(options, async function(error, response, body) {
            if (error) throw new Error(error)
            const $ = cheerio.load(body)
            const link = []
            const judul = []
            const result = []
            $('#content > center > div > div.col-md-4.col-md-offset-4 > table > tbody > tr > td > a').each(function(a, b) {
                deta = $(b).text()
                judul.push(deta)
                link.push($(b).attr('href'))
            })
            for (let i = 0; i < link.length; i++) {
                result.push({
                    dlinfo: judul[i],
                    link: link[i],
                })
            }
            resolve({
                creator: 'HyzerDev',
                result: result,
            })
        })
    })
}

exports.pinterest = async(querry) => {
return new Promise(async(resolve,reject) => {
 axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + querry, {
headers: {
"cookie" : "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
}
}).then(({ data }) => {
const $ = cheerio.load(data)
const result = [];
const hasil = [];
$('div > a').get().map(b => {
const link = $(b).find('img').attr('src')
result.push(link)
});
result.forEach(v => {
if(v == undefined) return
hasil.push(v.replace(/236/g,'736'))
})
hasil.shift();
resolve(hasil)
})
})
}

exports.stickersearch = async (query) => {
    return new Promise((resolve) => {
        axios.get(`https://getstickerpack.com/stickers?query=${query}`).then(({
            data
        }) => {
            const $ = cheerio.load(data)
            const link = []
            $('#stickerPacks > div > div:nth-child(3) > div > a').each(function(a, b) {
                link.push($(b).attr('href'))
            })
            rand = link[Math.floor(Math.random() * link.length)]
            axios.get(rand).then(({
                data
            }) => {
                const $$ = cheerio.load(data)
                const url = []
                $$('#stickerPack > div > div.row > div > img').each(function(a, b) {
                    url.push($$(b).attr('src').split('&d=')[0])
                })
                resolve({
                    creator: 'HyzerDev',
                    title: $$('#intro > div > div > h1').text(),
                    author: $$('#intro > div > div > h5 > a').text(),
                    author_link: $$('#intro > div > div > h5 > a').attr('href'),
                    sticker: url,
                })
            })
        })
    })
}


exports.dddtik = async (link) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: `https://dddtik.com/down.php`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'user-agent': fakeUa(),
                cookie: 'sc_is_visitor_unique=rx12545292.1635383422.F7DED83AD2BA4F9517A804FC1A0ED021.1.1.1.1.1.1.1.1.1; __gads=ID=b947ab19f44e72c9-22cb5054e4cc00ef:T=1635383422:RT=1635383422:S=ALNI_MZWS0q0Op8F6EpwhOL1pMlFTGjCvQ',
            },
            formData: {
                url: link,
            },
        }

        request(options, async function(error, response, body) {
            if (error) throw new Error(error)
            const $ = cheerio.load(body)
            resolve({
                creator: 'HyzerDev',
                caption: $('div > div.ml-3 > span').text(),
                download: {
                    source: $('div > div:nth-child(4)').find('a').attr('href'),
                    dddtik: $('div > div:nth-child(5)').find('a').attr('href'),
                },
            })
        })
    })
}

exports.jadwaltv = async (channel) => {
    return new Promise((resolve, reject) => {
        const time = Math.floor(new Date() / 1000)
        axios.get('https://www.jadwaltv.net/channel/' + channel).then(({
            data
        }) => {
            const $ = cheerio.load(data)
            const acara = []
            const jam = []
            const result = []
            $('div > div > table > tbody > tr').each(function(a, b) {
                if ($(b).find('td:nth-child(1)').text() != 'Jam') {
                    jam.push($(b).find('td:nth-child(1)').text())
                }
                if ($(b).find('td:nth-child(2)').text() != 'Acara') {
                    acara.push($(b).find('td:nth-child(2)').text())
                }
            })
            for (let i = 0; i < acara.length; i++) {
                result.push({
                    acara: acara[i],
                    jam: jam[i],
                })
            }
            format = result.filter((mek) => mek.acara != 'Jadwal TV selengkapnya di JadwalTV.Net')
            console.log(acara)
            resolve({
                creator: 'HyzerDev',
                channel: channel,
                result: format,
            })
        })
    })
}

exports.emoji = async (emoji) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://emojipedia.org/search/?q=${encodeUrl(emoji)}`).then(({
            data
        }) => {
            const $ = cheerio.load(data)
            resolve({
                creator: 'HyzerDev',
                nama: $('body > div.container > div.content > article > h1').text(),
                result: {
                    apple: $('body').find('li:nth-child(1) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src'),
                    google: $('body').find('li:nth-child(2) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src'),
                    samsung: $('body').find('li:nth-child(3) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src'),
                    microsoft: $('body').find('li:nth-child(4) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src'),
                    whatsapp: $('body').find('li:nth-child(5) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src'),
                    twitter: $('body').find('li:nth-child(6) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src'),
                    facebook: $('body').find('li:nth-child(7) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src'),
                    skype: $('body').find('li:nth-child(8) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src'),
                    joypixels: $('body').find('li:nth-child(9) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src'),
                    openemoji: $('body').find('li:nth-child(10) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src'),
                    emojidex: $('body').find('li:nth-child(11) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src'),
                    messenger: $('body').find('li:nth-child(12) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src'),
                    lg: $('body').find('li:nth-child(13) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src'),
                    htc: $('body').find('li:nth-child(14) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src'),
                    mozilla: $('body').find('li:nth-child(15) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src'),
                    softbank: $('body').find('li:nth-child(16) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src'),
                    docomo: $('body').find('li:nth-child(17) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src'),
                },
            })
        })
    })
}

exports.ceritahantu = async () => {
    return new Promise((resolve, reject) => {
        axios.get(`https://cerita-hantu.com/list-cerita-hantu-a-z/`).then(({
            data
        }) => {
            const $ = cheerio.load(data)
            const plink = []
            $('div > div > ul:nth-child(7) > li > a').each(function(a, b) {
                plink.push($(b).attr('href'))
            })
            $('div > div > ul:nth-child(9) > li > a').each(function(a, b) {
                if ($(b).attr('href') != undefined) {
                    plink.push($(b).attr('href'))
                }
            })
            $('div > div > ol > li > a').each(function(a, b) {
                if ($(b).attr('href') != undefined) {
                    plink.push($(b).attr('href'))
                }
            })
            axios.get(plink[Math.floor(Math.random() * plink.length)]).then(({
                data
            }) => {
                const $$ = cheerio.load(data)
                const clink = []
                $$('div > div > a').each(function(a, b) {
                    if ($$(b).attr('href').startsWith('https:')) {
                        clink.push($$(b).attr('href'))
                    }
                })
                rand = clink[Math.floor(Math.random() * clink.length)]
                axios.get(rand).then(({
                    data
                }) => {
                    const $$$ = cheerio.load(data)
                    resolve({
                        creator: 'HyzerDev',
                        judul: $$$('div > header > div > h1 > a').text(),
                        author: $$$('div > header > div > div > span.simple-grid-entry-meta-single-author > span > a').text(),
                        author_link: $$$('div > header > div > div > span.simple-grid-entry-meta-single-author > span > a').attr('href'),
                        upload_date: $$$('div > header > div > div > span.simple-grid-entry-meta-single-date').text(),
                        kategori: $$$('div > header > div > div > span.simple-grid-entry-meta-single-cats > a').text(),
                        source: rand,
                        cerita: $$$('div > div > p').text().split('Cerita Hantu')[1].split('Copyright')[0],
                    })
                })
            })
        })
    })
}

exports.xnxxdl = (URL) => {
  return new Promise((resolve, reject) => {
    fetch(`${URL}`, {method: 'get'})
    .then(res => res.text())
    .then(res => {
      let $ = cheerio.load(res, {
        xmlMode: false
      });
      const title = $('meta[property="og:title"]').attr('content');
      const duration = $('meta[property="og:duration"]').attr('content');
      const image = $('meta[property="og:image"]').attr('content');
      const videoType = $('meta[property="og:video:type"]').attr('content');
      const videoWidth = $('meta[property="og:video:width"]').attr('content');
      const videoHeight = $('meta[property="og:video:height"]').attr('content');
      const info = $('span.metadata').text();
      const videoScript = $('#video-player-bg > script:nth-child(6)').html();
      const files = {
        low: (videoScript.match('html5player.setVideoUrlLow\\(\'(.*?)\'\\);') || [])[1],
        high: videoScript.match('html5player.setVideoUrlHigh\\(\'(.*?)\'\\);' || [])[1],
        HLS: videoScript.match('html5player.setVideoHLS\\(\'(.*?)\'\\);' || [])[1],
        thumb: videoScript.match('html5player.setThumbUrl\\(\'(.*?)\'\\);' || [])[1],
        thumb69: videoScript.match('html5player.setThumbUrl169\\(\'(.*?)\'\\);' || [])[1],
        thumbSlide: videoScript.match('html5player.setThumbSlide\\(\'(.*?)\'\\);' || [])[1],
        thumbSlideBig: videoScript.match('html5player.setThumbSlideBig\\(\'(.*?)\'\\);' || [])[1],
      };
      resolve({
        status: 200,
        result: {
          title,
          URL,
          duration,
          image,
          videoType,
          videoWidth,
          videoHeight,
          info,
          files
        }
      })
    })
    .catch(err => reject({code: 503, status: false, result: err }))
  })
}

exports.apkDl = async(url) => {
	let res = await fetch('https://apk.support/gapi/index.php', {
		method: 'post',
		body: new URLSearchParams(Object.entries({ x: 'downapk', t: 1, google_id: url, device_id: '', language: 'en-US', dpi: 480, gl: 'SUQ=', model: '', hl: 'en', de_av: '', aav: '', android_ver: 5.1, tbi: 'arm64-v8a', country: 0, gc: undefined }))
	})
	let $ = cheerio.load(await res.text())
	let fileName = $('div.browser > div.dvContents > ul > li > a').text().trim().split(' ')[0]
	let download = $('div.browser > div.dvContents > ul > li > a').attr('href')
	if (!download) throw 'Can\'t download the apk!'
	let mimetype = (await fetch(download, { method: 'head' })).headers.get('content-type')
	return { fileName, mimetype, download }
}

exports.textpro = async(effect, ...texts) => {
  texts = texts.filter(v => v)
  let eff = effects.find(v => (new RegExp(v.title, 'gi')).test(effect))
  if (!eff) return -1
  let resCookie = await fetch(eff.url, {
    headers: {
      "User-Agent": "GoogleBot",
    },
  })
  let html = await resCookie.text()
  const $$$ = cheerio.load(html)
  let textRequire = [!!$$$('#text-0').length, !!$$$('#text-1').length, !!$$$('#text-2').length].filter(v => v)
  // console.log({ textRequire, texts, textRequireLength: textRequire.length, textsLength: texts.length })
  if (textRequire.length > texts.length) return textRequire.length
  let cookieParse = (cookie, query) => cookie.includes(query + '=') ? cookie.split(query + '=')[1].split(';')[0] : 'undefined'
  let hasilcookie = resCookie.headers
    .get("set-cookie")
  hasilcookie = {
    __cfduid: cookieParse(hasilcookie, '__cfduid'),
    PHPSESSID: cookieParse(hasilcookie, 'PHPSESSID')
  }
  hasilcookie = Object.entries(hasilcookie).map(([nama, value]) => nama + '=' + value).join("; ")
  const $ = cheerio.load(html)
  const token = $('input[name="token"]').attr("value")
  const form = new formData()
  for (let text of texts) form.append("text[]", text)
  form.append("submit", "Go")
  form.append("token", token)
  form.append("build_server", "https://textpro.me")
  form.append("build_server_id", 1)
  let resUrl = await fetch(eff.url, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "GoogleBot",
      Cookie: hasilcookie,
      ...form.getHeaders(),
    },
    body: form.getBuffer(),
  })
  const $$ = cheerio.load(await resUrl.text())
  let token2 = JSON.parse($$('#form_value').eq(1).text())
  let encode = encodeURIComponent;
  let body = Object.keys(token2)
    .map((key) => {
      let vals = token2[key];
      let isArray = Array.isArray(vals);
      let keys = encode(key + (isArray ? "[]" : ""));
      if (!isArray) vals = [vals];
      let out = [];
      for (let valq of vals) out.push(keys + "=" + encode(valq));
      return out.join("&");
    })
    .join("&")
  let resImgUrl = await fetch(`https://textpro.me/effect/create-image?${body}`, {
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "GoogleBot",
      Cookie: hasilcookie,
    }
  })
  let results = await resImgUrl.json()
  return 'https://textpro.me' + results.fullsize_image
}

