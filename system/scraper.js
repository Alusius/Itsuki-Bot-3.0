const cheerio = require("cheerio");
const fetch = require("node-fetch");
const axios = require("axios");
const yt = require("yt-search");
const got = require('got')
const fakeUa = require('fake-useragent')
const request = require("request");
const encodeUrl = require("encodeurl");
const FormData = require("form-data");
const chalk = require('chalk')
const qs = require("qs")
const url = require('url')
const { instagramGetUrl } = require('./other')
const shortener = (url) => {
  return url;
}
const clean = (data) => {
  let regex = /(<([^>]+)>)/gi;
  data = data.replace(/(<br?\s?\/>)/gi, " \n");
  return data.replace(regex, "");
};
const {
    fromBuffer
} = require("file-type");
const fs = require("fs");
const yts = require("yt-search");
const mime = require("mime");
const {
    JSDOM
} = require("jsdom");
const error = {
    link: {
        status: false,
        message: "Link tidak valid!"
    },
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

exports.mediafire = async(url) => {
    try{
        const {data} = await axios.get(url)
        const $ = cheerio.load(data)
        const result = {
            filename: $("div.dl-btn-label").attr("title"),
            filesize: $("a#downloadButton").text().split("(")[1].split(")")[0],
            uploadAt: $("ul.details > li:nth-child(2)").text().split(": ")[1],
            mimetype: mime.lookup($("a#downloadButton").attr("href")),
            ext: $("a#downloadButton").attr("href").replace(/^.*[\.\/\\]/, ""),
            filetype: $("div.filetype").text(),
            link: $("a#downloadButton").attr("href")
        }
        return({status: true, ...result})
    }catch{
        return({status: false, message: 'error'})
    }
}
exports.facebook = async(url) => {
    return new Promise((resolve) => {
        const options = {
            method: "POST",
            url: 'https://fdownloader.net/api/ajaxSearch',
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            formData: {
                q: url
            }
        }
        request(options, async function(err, response, body){
            if(err) return resolve({status: false, message: 'error'})
            const data = JSON.parse(body).data
            if(!data) return resolve({status: false, message: 'media not found'})
            const $ = cheerio.load(data)
            const result = {
                sd: $('#fbdownloader > div.tab-wrap > div:nth-child(5) > table > tbody > tr:nth-child(2) > td:nth-child(3) > a').attr('href'),
                hd: $('#fbdownloader > div.tab-wrap > div:nth-child(5) > table > tbody > tr:nth-child(1) > td:nth-child(3) > a').attr('href')
            }
            resolve({status: true, ...result})
        })
    })
}
exports.tenorsgif = async(query) => {
    return new Promise((resolve) => {
        axios.get(`https://tenor.com/search/${query.replace(/ /g, '-')}-stickers`).then(({data}) => {
            const $ = cheerio.load(data)
            const result = []
            $('#view > div > div > div > div.GifList > div:nth-child(1) > figure').each(function(){
                result.push({
                    name: $(this).find('div.Sticker > img').attr('alt'),
                    url: $(this).find('div.Sticker > img').attr('src')
                })
            })
            resolve(result != '' ? {
                status: true,
                result: result
            } : {
                status: false,
                message: 'not found'
            })
        }).catch(e => {
            resolve({status: false, message: 'error'})
        })
    })
}
exports.jadwalmplid = async () => {
    return new Promise((resolve, reject) => {
        axios.get('https://id-mpl.com/schedule').then(({
            data
        }) => {
            const $ = cheerio.load(data)
            const result = []
            week = 1
            data1 = []
            data2 = []
            jam = []
            replay = []
            for (let i = 66; i <= 73; i++) {
                $(`#mc-${i} > div > div > div`).each(function() {
                    tanggal = $(this).find('div.ticket-date.mb10.mt20').text()
                    $(this).find('div > span.teams-wrap > div > div.match-team1.text-center').each(function(a, b) {
                        data1.push({
                            a: $(b).find('div > div > b').text(),
                            score: $(b).find('div.font-title').text().trim()
                        })
                        result.push({
                            tanggal: tanggal,
                            week: week,
                            jam: '',
                            match: '',
                            score: '',
                            replay: ''
                        })
                    })
                    $(this).find('div > span.teams-wrap > div > div.match-team2.text-center').each(function(a, b) {
                        data2.push({
                            a: $(b).find('div > div > b').text(),
                            score: $(b).find('div.font-title').text().trim()
                        })
                    })
                    $(this).find('div > span.teams-wrap > div').each(function(a, b) {
                        jam.push($(b).find('div.match-score.center > div > b').text())
                        replay.push($(b).find('div.match-vs.match-link.replay > a').attr('href'))
                    })
                })
                for (let i = 0; i < data1.length; i++) {
                    result[i].match = `${data1[i].a} Vs ${data2[i].a}`
                    result[i].jam = jam[i],
                        result[i].replay = replay[i] ? replay[i] : 'Coming Soon'
                    result[i].score = data1[i].score ? `${data1[i].score} : ${data2[i].score}` : 'Coming Soon'
                }
                week += 1
            }
            resolve(result)
        })
    })
}
exports.primbonkerja = async(tgl, bln, thn) => {
    const {data} = await axios.request('https://www.primbon.com/pekerjaan_weton_lahir.php', {
        method: 'post',
        data: new URLSearchParams(Object.entries({
            tgl: tgl,
            bln: bln,
            thn: thn,
            submit: '+Submit!+'
        })),
        headers: {
            "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
        }
    })
    const $ = cheerio.load(data)
    const result = {
        hari_lahir: $('#body').text().split('Hari Lahir:')[1].split('Pekerjaan')[0].trim(),
        pekerjaan: 'Pekerjaan ' + $('#body').text().split('Hari Lahir:')[1].split('Pekerjaan')[1].split('< Hitung')[0].trim(),
    }
    return(result)
}
exports.expandUrl = async (url) => {
    let link;
    try {
        const res = await axios({
            method: "get",
            url: url,
            maxRedirects: 0,
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; Redmi 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.58 Mobile Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9",
            },
        });
        link = res.headers.location;
    } catch (err) {
        if (Math.trunc(err.response.status / 100) === 3) {
            link = err.response.headers.location;
        } else {
            throw err;
        }
    } finally {
        return link;
    }
};
exports.pinvideo = async(url) => {
    return new Promise(async(resolve, reject) => {
        const gettoken = await axios.get('https://viddownloader.online/pinterest-downloader/')
        const token = cheerio.load(gettoken.data)('#token').attr('value')
        const options = {
            method: 'POST',
            url: 'https://viddownloader.online/wp-json/aio-dl/video-data/',
            headers: {
                "content-type": 'application/json; charset=UTF-8',
                "cookie": 'PHPSESSID=pboq0ag9iikl5fd1ahf1cchs93;'
            },
            formData: {
                url: url,
                token: token
            }
        }
        request(options, async function(error, response, body){
            if(error) return resolve({status: false})
            const data = JSON.parse(body)
            resolve(data.error ? {status: false, ...data} : {status: true, ...data})
        })
    })
}
exports.tiktokstalk = async(user) => {
  return new Promise(async(resolve, reject) => {
    const options = {
      method: 'POST',
      url: 'https://toolxox.com/seo/find-tiktok-account-analyze.php',
      headers: {
        "content-type": 'application/x-www-form-urlencoded',
        "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
      },
      formData: {
        url: user          
      }
    }
    request(options, async function(error, response, body) {
      const $ = cheerio.load(body)
      if(!$('#profile > tbody > tr > td:nth-child(1)').text().replace(/\D/g, '')) return resolve({status: false, message: 'user not found'})
      const {data} = await axios.get(`https://urlebird.com/user/${user}/`)
      const $$ = cheerio.load(data)
      const result = {
        status: true,
        username: $$('body').find('div.col-md-auto.text-center.text-md-left.pl-0 > h1').text(),
        nickname: $$('body').find('div.col-md-auto.text-center.text-md-left.pl-0 > div > h5').text(),
        ppurl: $$('body').find('div.col-md-auto.justify-content-center.text-center > img').attr('src'),
        followers: $('#profile > tbody > tr > td:nth-child(1)').text().replace(/\D/g, ''),
        following: $('#profile > tbody > tr > td:nth-child(2)').text().replace(/\D/g, ''),
        likes: $('#profile > tbody > tr > td:nth-child(3)').text().replace(/\D/g, ''),
        videos: $('#profile > tbody > tr > td:nth-child(4)').text().replace(/\D/g, ''),
      }
      resolve(result)
    })
  })
}
exports.attp = async(text) => {
  return new Promise(async(resolve, reject) => {
	  const getid = await axios.get('https://id.bloggif.com/text')
	  const id = cheerio.load(getid.data)('#content > form').attr('action')
	  const options = {
		    method: "POST",
		    url: `https://id.bloggif.com${id}`,
		    headers: {
			"content-type": 'application/x-www-form-urlencoded',
			"user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
		    },
		    formData: {
			target: 1,
			text: text,
			glitter_id: Math.floor(Math.random() * 2821),
			font_id: 'lucida_sans_demibold_roman',
			size: 100,
			bg_color: 'FFFFFF',
			transparent: 1,
			border_color: 000000,
			border_width: 2,
			shade_color: 000000,
			shade_width: 1,
			angle: 0,
			text_align: 'center'
		    },
		};
		request(options, async function(error, response, body) {
		  const $ = cheerio.load(body)
		  const url = $('#content > div:nth-child(10) > a').attr('href')
		  resolve(url != '' ? {status: true, text: text, url: 'https://id.bloggif.com' + url} : {status: false})
		})
    })
}
exports.ttp = async (text) => {
    return new Promise((resolve, reject) => {
            const options = {
                method: 'POST',
                url: `https://www.picturetopeople.org/p2p/text_effects_generator.p2p/transparent_text_effect`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
                    "Cookie": "_ga=GA1.2.1667267761.1655982457; _gid=GA1.2.77586860.1655982457; __gads=ID=c5a896288a559a38-224105aab0d30085:T=1655982456:RT=1655982456:S=ALNI_MbtHcmgQmVUZI-a2agP40JXqeRnyQ; __gpi=UID=000006149da5cba6:T=1655982456:RT=1655982456:S=ALNI_MY1RmQtva14GH-aAPr7-7vWpxWtmg; _gat_gtag_UA_6584688_1=1"
                },
                formData: {
                    'TextToRender': text,
                    'FontSize': '100',
                    'Margin': '30',
                    'LayoutStyle': '0',
                    'TextRotation': '0',
                    'TextColor': 'ffffff',
                    'TextTransparency': '0',
                    'OutlineThickness': '3',
                    'OutlineColor': '000000',
                    'FontName': 'Lekton',
                    'ResultType': 'view'
                }
            };
            request(options, async function(error, response, body) {
                if (error) return resolve({status: false, message: error})
                const $ = cheerio.load(body)
                const result = 'https://www.picturetopeople.org' + $('#idResultFile').attr('value')
                resolve({ status: true, author: "expar animej", result: result })
            });
        })
}
exports.y1s = async (type, url, quality) => {
    quality = quality ? quality : "360p";
    const {
        data
    } = await axios.request("https://yt1s.com/api/ajaxSearch/index", {
        method: "post",
        data: new URLSearchParams(
            Object.entries({
                q: url,
                vt: "home",
            })
        ),
        headers: {
            cookie: "_ga=GA1.2.1497648114.1652002131; _gat_gtag_UA_173445049_1=1; _gid=GA1.2.969868327.1652002131; __atuvc=1|19; __atuvs=62778d5c4fade304000; prefetchAd_3897490=true",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36",
        },
    });
    if (data.mess.includes("Invalid"))
        return {
            creator: "@ihsanafajar",
            ...data,
            status: false,
        };
    const getk =
        type == "mp3" ?
        Object.values(data.links.mp3)[0] :
        Object.values(data.links.mp4).find((mp) => mp.q == quality);
    if (getk == null)
        return {
            status: false,
            message: `${quality} not available`,
        };
    const getlink = await axios.request(
        "https://yt1s.com/api/ajaxConvert/convert", {
            method: "post",
            data: new URLSearchParams(
                Object.entries({
                    vid: data.vid,
                    k: getk.k,
                })
            ),
        }
    );
    return {
        creator: "@ihsanafajar",
        ...getlink.data,
        size: getk.size,
        status: true,
        thumbnail: `https://i.ytimg.com/vi/${data.vid}/0.jpg`,
    };
};
exports.downvideo = async (url) => {
    const gettoken = await axios.get("https://downvideo.quora-wiki.com/");
    const $$ = cheerio.load(gettoken.data);
    const token = $$("#token").attr("value");
    const {
        data
    } = await axios.request(
        "https://downvideo.quora-wiki.com/system/action.php", {
            method: "post",
            data: new URLSearchParams(
                Object.entries({
                    url: url,
                    token: token,
                })
            ),
            headers: {
                cookie: "fpestid=YT6abn7OdTpNYkeS7164xlFIg6RZEhfPvEtZnVWfk0kDip1a8iTAnO51q7VzTGLl89oycQ; __gads=ID=823e2024511cfbf1-221294301ad30014:T=1651936582:RT=1651936582:S=ALNI_Mb2xUbOd3tTkcYykDeYbYsj3ejTKQ; PHPSESSID=446tiepgldu14thd36q7ekpi22",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36",
            },
        }
    );
    return data.medias == "" ? {
        status: false,
        ...data
    } : {
        status: true,
        ...data
    };
};
exports.styleText = async (text) => {
    let res = await fetch(
        "http://qaz.wtf/u/convert.cgi?text=" + encodeURIComponent(text)
    );
    let html = await res.text();
    let dom = new JSDOM(html);
    let table = dom.window.document.querySelector("table").children[0].children;
    let obj = {};
    for (let tr of table) {
        let name = tr.querySelector(".aname").innerHTML;
        let content = tr.children[1].textContent
            .replace(/^\n/, "")
            .replace(/\n$/, "");
        obj[name + (obj[name] ? " Reversed" : "")] = content;
    }
    return obj;
};
exports.tikdown = async (url) => {
    if (!/tiktok/.test(url)) return error.link;
    const gettoken = await axios.get("https://tikdown.org/id");
    const $ = cheerio.load(gettoken.data);
    const token = $("#download-form > input[type=hidden]:nth-child(2)").attr(
        "value"
    );
    const param = {
        url: url,
        _token: token,
    };
    const {
        data
    } = await axios.request("https://tikdown.org/getAjax?", {
        method: "post",
        data: new URLSearchParams(Object.entries(param)),
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "user-agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36",
        },
    });
    getdata = cheerio.load(data.html);
    if (data.status) {
        return {
            status: true,
            thumbnail: getdata("img").attr("src"),
            video: getdata("div.download-links > div:nth-child(1) > a").attr("href"),
            audio: getdata("div.download-links > div:nth-child(2) > a").attr("href"),
        };
    } else
        return {
            status: false,
        };
};
exports.anoboyongoing = async () => {
    return new Promise(async (resolve, reject) => {
        const {
            data
        } = await axios.get('https://62.182.83.93/')
        const $ = cheerio.load(data)
        const result = []
        $('body > div.wrap > div.container > div.home_index > a').each(function() {
            result.push({
                title: $(this).find('h3').text(),
                time: $(this).find('div.jamup').text(),
                url: $(this).attr('href')
            })
        })
        resolve(result != '' ? {
            status: true,
            result: result
        } : {
            status: false,
            message: 'error'
        })
    })
}
exports.peakpx = async (query) => {
    return new Promise(async (resolve, reject) => {
        const results = [];
        const html = await fetch("https://www.peakpx.com/en/search?q=" + query);
        const $ = cheerio.load(await html.text());
        $("#list_ul > li").each((i, elem) => {
            const title = $(elem).find(".title").text();
            const image = $(elem).find("figure > a > img").attr("data-srcset");
            if (image === undefined) return;
            const url = `${image.split(" ")[2].slice(3)}`;
            results.push({
                title,
                image: url,
            });
        });
        resolve(results);
    });
};
exports.mdl = async (query) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                `https://mydramalist.com/search?q=${query}&adv=titles&ty=68,77,83&so=relevance`
            )
            .then(({
                data
            }) => {
                //console.log(data)
                const $ = cheerio.load(data);
                const result = [];
                $("div > div > div.col-xs-9.row-cell.content").each(function() {
                    result.push({
                        judul: $(this).find("h6 > a:nth-child(1)").text(),
                        type: $(this).find("span.text-muted").text(),
                        rating: $(this).find("p:nth-child(4) > span.p-l-xs.score").text(),
                        url: "https://mydramalist.com" +
                            $(this).find("h6 > a:nth-child(1)").attr("href"),
                        desc: $(this).find("p:nth-child(5)").text(),
                    });
                });
                resolve(result);
            });
    });
};
exports.mdlinfo = async (url) => {
    return new Promise((resolve, reject) => {
        axios.get(url).then(({
            data
        }) => {
            //console.log(data)
            const $ = cheerio.load(data);
            genre = "";
            const result = {};
            $("#content").each(function() {
                $(this)
                    .find(
                        "#show-detailsxx > div.show-detailsxss > ul:nth-child(1) > li.list-item.p-a-0.show-genres > a"
                    )
                    .each(function() {
                        genre += $(this).text() + ", ";
                    });
                $(this)
                    .find("div.box-body.light-b > ul > li")
                    .each(function() {
                        result[
                            $(this).find("b").text().replace(" ", "_").replace(":", "").toLowerCase()
                        ] = $(this).text().split(": ")[1];
                    });
                $(this)
                    .find("#show-detailsxx > div.show-detailsxss > ul:nth-child(1) > li")
                    .each(function() {
                        result[
                            $(this)
                            .find("b")
                            .text()
                            .replace(/ /g, "_")
                            .replace(":", "")
                            .toLowerCase()
                        ] = $(this).find("a").text();
                    });
                result["thumbnail"] = $(this)
                    .find("div.col-sm-4.film-cover.cover > a.block > img")
                    .attr("src");
            });
            resolve(result);
        });
    });
};
exports.musicaldown = async (URL) => {
    if (!/tiktok/.test(URL)) return error.link;
    return new Promise((resolve, rejecet) => {
        axios
            .get("https://musicaldown.com/id", {
                headers: {
                    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
                },
            })
            .then((res) => {
                const $ = cheerio.load(res.data);
                const url_name = $("#link_url").attr("name");
                const token_name = $("#submit-form > div")
                    .find("div:nth-child(1) > input[type=hidden]:nth-child(2)")
                    .attr("name");
                const token_ = $("#submit-form > div")
                    .find("div:nth-child(1) > input[type=hidden]:nth-child(2)")
                    .attr("value");
                const verify = $("#submit-form > div")
                    .find("div:nth-child(1) > input[type=hidden]:nth-child(3)")
                    .attr("value");
                let data = {
                    [`${url_name}`]: URL,
                    [`${token_name}`]: token_,
                    verify: verify,
                };
                axios
                    .request({
                        url: "https://musicaldown.com/id/download",
                        method: "post",
                        data: new URLSearchParams(Object.entries(data)),
                        headers: {
                            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
                            cookie: res.headers["set-cookie"],
                        },
                    })
                    .then((respon) => {
                        const ch = cheerio.load(respon.data);
                        axios
                            .request({
                                url: "https://musicaldown.com/id/mp3",
                                method: "post",
                                headers: {
                                    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
                                    cookie: res.headers["set-cookie"],
                                },
                            })
                            .then((resaudio) => {
                                const hc = cheerio.load(resaudio.data);
                                const a = {
                                    creator: "Fajar Ihsan",
                                    video: {
                                        //body > div.welcome.section > div > div:nth-child(2) > div.col.s12.l8 > a:nth-child(10)
                                        link1: ch("body > div.welcome.section > div")
                                            .find("div:nth-child(2) > div.col.s12.l8 > a:nth-child(4)")
                                            .attr("href"),
                                        link2: ch("body > div.welcome.section > div")
                                            .find("div:nth-child(2) > div.col.s12.l8 > a:nth-child(6)")
                                            .attr("href"),
                                        link3: ch("body > div.welcome.section > div")
                                            .find("div:nth-child(2) > div.col.s12.l8 > a:nth-child(8)")
                                            .attr("href"),
                                        link4: ch("body > div.welcome.section > div")
                                            .find("div:nth-child(2) > div.col.s12.l8 > a:nth-child(10)")
                                            .attr("href")
                                    },
                                    audio: {
                                        judul: hc(
                                                "body > div.welcome.section > div > div:nth-child(2) > div.col.s12.l8"
                                            )
                                            .find("h2")
                                            .text()
                                            .split(": ")[1],
                                        link1: hc(
                                            "body > div.welcome.section > div > div:nth-child(2) > div.col.s12.l8 > a:nth-child(5)"
                                        ).attr("href"),
                                        link2: hc(
                                            "body > div.welcome.section > div > div:nth-child(2) > div.col.s12.l8 > a:nth-child(7)"
                                        ).attr("href"),
                                        link3: hc(
                                            "body > div.welcome.section > div > div:nth-child(2) > div.col.s12.l8 > a:nth-child(9)"
                                        ).attr("href"),
                                    },
                                };
                                const b = {
                                    creator: "Fajar Ihsan",
                                    audio: {
                                        judul: hc(
                                                "body > div.welcome.section > div > div:nth-child(2) > div.col.s12.l8"
                                            )
                                            .find("h2")
                                            .text()
                                            .split(": ")[1],
                                        link1: ch("body > div.welcome.section > div")
                                            .find("div:nth-child(2) > div.col.s12.l8 > a:nth-child(5)")
                                            .attr("href"),
                                        link2: ch("body > div.welcome.section > div")
                                            .find("div:nth-child(2) > div.col.s12.l8 > a:nth-child(7)")
                                            .attr("href"),
                                        link3: ch("body > div.welcome.section > div")
                                            .find("div:nth-child(2) > div.col.s12.l8 > a:nth-child(9)")
                                            .attr("href"),
                                    },
                                };
                                resolve(
                                    URL.includes("/music/") ? {
                                        status: true,
                                        ...b
                                    } : {
                                        status: true,
                                        ...a
                                    }
                                );
                            });
                    });
            });
    });
};
exports.google = async (query, lang = 'id') => {
    const body = await got('https://www.google.co.id/search', {
        searchParams: {
            q: query,
            lr: `lang_${lang}`
        },
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
        }
    }).text()
    const $ = cheerio.load(body)
    const result = []
    $('div.tF2Cxc').each(function() {
        const el = $(this)
        const header = el.find('cite.iUh30').text()
        const title = el.find('div.yuRUbf > a > h3').text()
        const url = el.find('div.yuRUbf > a[href]').attr('href')
        const description =
            el.find('div.VwiC3b > span').text() || el.find('div.VwiC3b').text()
        if (el.length && url) {
            result.push({
                header: header,
                title: title,
                url,
                description: description
            })
        }
    })
    return result != '' ? {
        status: true,
        result
    } : {
        status: false,
        message: 'not found'
    }
}

exports.googleImg = async (query) => {
    const data = await got(`https://www.google.com/search?q=${query}&tbm=isch`, {
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9,id;q=0.8',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36'
        }
    }).text()

    const $ = cheerio.load(data)
    const pattern =
        /\[1,\[0,"(?<id>[\d\w\-_]+)",\["https?:\/\/(?:[^"]+)",\d+,\d+\]\s?,\["(?<url>https?:\/\/(?:[^"]+))",\d+,\d+\]/gm
    const matches = $.html().matchAll(pattern)
    const decodeUrl = (url) => decodeURIComponent(JSON.parse(`"${url}"`))
    const result = [...matches]
        .map(({
            groups
        }) => decodeUrl(groups.url))
        .filter((v) => /.*\.jpe?g|png$/gi.test(v))
    return result != '' ? {
        status: true,
        result
    } : {
        status: false,
        message: 'Image not found'
    }
}
exports.ggtiktok = async (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            let form = new URLSearchParams();
            form.append("link", url);
            let html = await (
                await fetch("https://www.ggtiktok.com/results", {
                    method: "POST",
                    body: form,
                })
            ).text();
            $ = cheerio.load(html);
            let urls = [];
            $("div.container")
                .find("a")
                .each(function(i, e) {
                    urls.push($(e).attr("href"));
                });
            urls.slice(0, -4);
            if (urls[0].length < 100)
                return resolve({
                    creator: "@neoxrs – Wildan Izzudin",
                    status: false,
                });
            let urlList = {
                video: "https://www.ggtiktok.com" + urls[0],
                videoWM: "https://www.ggtiktok.com" + urls[1],
            };
            resolve({
                creator: "@neoxrs – Wildan Izzudin",
                status: true,
                data: urlList,
            });
        } catch {
            return resolve({
                creator: "@neoxrs – Wildan Izzudin",
                status: false,
            });
        }
    });
};
exports.twitterdl2 = async (url) => {
    return new Promise(async (resolve, reject) => {
        const param = {
            URL: url,
        };
        const {
            data
        } = await axios.request("https://twdown.net/download.php", {
            method: "post",
            data: new URLSearchParams(Object.entries(param)),
            headers: {
                cookie: "_ga=GA1.2.1179402207.1647696060; _gid=GA1.2.2120988570.1647696060; _gat=1; __gads=ID=656e88e6682c39b4-2253281b06d100e1:T=1647696058:RT=1647696058:S=ALNI_MZ39j_NBhBuM0sjafGz5pKyigruOQ",
                "user-agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
            },
        });
        const $ = cheerio.load(data);
        user = $("body").find("div:nth-child(2) > h4 > strong").text();
        user != "" ?
            resolve({
                creator: "Fajar Ihsana",
                status: true,
                username: user,
                caption: $("body").find("div:nth-child(2) > p").text(),
                thumbnail: $("body").find("div:nth-child(1) > img").attr("src"),
                hd: $("body")
                    .find("table > tbody > tr:nth-child(1) > td:nth-child(4) > a")
                    .attr("href"),
                sd: $("body")
                    .find("table > tbody > tr:nth-child(2) > td:nth-child(4) > a")
                    .attr("href"),
            }) :
            resolve({
                creator: "Fajar Ihsana",
                status: false,
            });
    });
};
exports.twitterdl = async (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (url.includes("?s=")) {
                url = url.split("?s=")[0];
            }
            const param = {
                url: url,
            };
            const {
                data
            } = await axios.request(
                "https://www.savetweetvid.com/downloader", {
                    method: "post",
                    data: new URLSearchParams(Object.entries(param)),
                    headers: {
                        cookie: "XSRF-TOKEN=eyJpdiI6Ikhjdmk5K0loXC9tTFVNSE9VMlZNU1wvUT09IiwidmFsdWUiOiIxWkZ6eE5cLzFBSGN1dmk4VGhZV3JwR1MrNUlBdmJaSXIwMFBKc1FDclErZ21CZ3k1V3oxMXd5NzJRenFDYnVtSVg0aWdodEtCOGNtSnA3cmUwbW9FaWc9PSIsIm1hYyI6ImE2NWUzODFkODU5NTAzOGRkNmZiOTk1YjFiOTNkNDE5N2E2OWM4ZWYzOGEzY2MxMDBlYTkzZDU4YjlmMDc1OTkifQ==; expires=Thu, 10-Mar-2022 11:40:10 GMT; Max-Age=7200; path=/",
                        "user-agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
                    },
                }
            );
            const $ = cheerio.load(data);
            const result = {};
            $("body").each(function(a, b) {
                (result["username"] = $(b)
                    .find("div:nth-child(2) > div > div.col-md-4.col-sm-4 > h5")
                    .text()),
                (result["caption"] = $(b)
                    .find("div:nth-child(2) > div > div.col-md-4.col-sm-4 > p")
                    .text()),
                (result["download"] = []);
                $(b)
                    .find("table > tbody > tr")
                    .each(function() {
                        result["download"].push({
                            resolusi: $(this).find("td:nth-child(1)").text().split(" ")[0],
                            url: $(this).find("td:nth-child(4) > a").attr("href"),
                        });
                    });
            });
            result.username != "" ?
                resolve({
                    creator: "@ihsanafajar",
                    status: true,
                    data: result,
                }) :
                resolve({
                    creator: "@ihsanafajar",
                    status: false,
                });
        } catch {
            resolve({
                creator: "@ihsanafajar",
                status: false,
            });
        }
    });
};
exports.jobstreet = async(query) => {
	return new Promise(async(resolve, reject) => {
		const {data} = await axios.get(`https://www.jobstreet.co.id/id/job-search/${query}-jobs/`)
		const $ = cheerio.load(data)
		const result = []
		$('#jobList > div.sx2jih0.z0qC4_0 > div:nth-child(2) > div > div').each(function(){
			result.push({
				job: $(this).find('h1 > a > div > span').text(),
				perusahaan: $(this).find('div:nth-child(1) > div:nth-child(2) > span').text(),
				lokasi: $(this).find('div:nth-child(1) > span:nth-child(3) > span').text(),
				upah: $(this).find('div:nth-child(1) > span:nth-child(4)').text() ? $(this).find('div:nth-child(1) > span:nth-child(4)').text() : '-',
				upload_date: $(this).find('time > span').text(),
				url: 'https://www.jobstreet.co.id' + $(this).find('div:nth-child(1) > div:nth-child(2) > h1 > a').attr('href')
			})

		})
		resolve(result != '' ? {status: true, result} : {status: false, message: 'Job not found!'})
	})
}
exports.tebakgambar = async () => {
    let random_level = Math.floor(Math.random() * 136);
    let random_eq = Math.floor(Math.random() * 20);
    return axios
        .get(`https://jawabantebakgambar.net/level-${random_level}/`)
        .then((val) => {
            let url = "https://jawabantebakgambar.net";
            const $ = cheerio.load(val.data);
            let href = $("ul > * > a").eq(random_eq);
            let jwbn = href.find("span").text();
            let img = href.find("img").attr("data-src");
            let src = url + img;
            let petunjuk = jwbn.replace(/[AIUEO|aiueo]/g, "_");
            return {
                img: src,
                jawaban: jwbn,
                petunjuk,
            };
        });
};
exports.libur = async (tahun) => {
    const data = await axios.get("https://tanggalan.com/" + tahun);
    const $ = cheerio.load(data.data);
    const result = {};
    result["tahun"] = tahun;
    result["data"] = [];
    num = 1;
    $("#main > article > ul").each(function(a, b) {
        tbulan = $(b).find("li:nth-child(1) > a").attr("href").split("-")[0];
        bulan =
            tbulan == "januari" ?
            "January 1" :
            tbulan == "februari" ?
            "February 2" :
            tbulan == "maret" ?
            "March 3" :
            tbulan == "april" ?
            "April 4" :
            tbulan == "mei" ?
            "May 5" :
            tbulan == "juni" ?
            "June 6" :
            tbulan == "juli" ?
            "July 7" :
            tbulan == "agustus" ?
            "August 8" :
            tbulan == "september" ?
            "September 9" :
            tbulan == "oktober" ?
            "October 10" :
            tbulan == "november" ?
            "November 11" :
            tbulan == "desember" ?
            "December 12" :
            "";
        $(
            `#main > article > ul:nth-child(${num}) > li:nth-child(4) > table > tbody > tr`
        ).each(function() {
            //result.data = result.data ? result.data : []
            result.data.push({
                tanggal: $(this).find("td:nth-child(1)").text(),
                bulan: bulan,
                event: $(this).find("td:nth-child(2)").text(),
            });
        });
        num += 1;
    });
    return result;
};
exports.cuaca = async (place) => {
    var data = await axios.get(
        `https://www.accuweather.com/id/search-locations?query=${place}`
    );
    plink = data.request.res.responseUrl
        .replace("/en/", "/id/")
        .replace("weather-forecast", "current-weather");
    var $ = cheerio.load(data.data);
    const result = {};
    if (
        $("body")
        .find("div.locations-list.content-module > a:nth-child(1)")
        .attr("href") != undefined
    ) {
        var data = await axios.get(
            "https://www.accuweather.com" +
            $("body")
            .find("div.locations-list.content-module > a:nth-child(1)")
            .attr("href")
        );
        plink = data.request.res.responseUrl
            .replace("/en/", "/id/")
            .replace("weather-forecast", "current-weather");
        var $ = cheerio.load(data.data);
    }
    var data = await axios.get(plink);
    var $ = cheerio.load(data.data);
    result["Tempat"] = $(
        "body > div > div.nfl-header > div.header-outer > div > a.header-city-link > h1"
    ).text();
    result["Suhu"] = $("body").find("div.display-temp").text().trim();
    result["Deskripsi"] = $("body")
        .find(
            "div.current-weather-card.card-module.content-module.non-ad > div.phrase"
        )
        .text();
    $(
        "body > div > div.two-column-page-content > div.page-column-1 > div.content-module > div.current-weather-card.card-module.content-module.non-ad > div.current-weather-details > div > div"
    ).each(function(a, b) {
        if ($(b).find("div:nth-child(1)").text() != "RealFeel Shade™") {
            result[$(b).find("div:nth-child(1)").text()] = $(b)
                .find("div:nth-child(2)")
                .text();
        }
    });
    return result.Suhu != '' ? {
        status: true,
        ...result,
    } : {
        status: false,
        message: "Tempat tidak ditemukan!",
    };
};
exports.asupanfilminfo = async (link) => {
    const {
        data
    } = await axios.get(link);
    const $ = cheerio.load(data);
    const result = {};
    $("body > div > div:nth-child(5) > div.card-body.p-2 > ul > li").each(
        function(a, b) {
            result[$(b).text().split(": ")[0].trim().replace(/ /g, "_")] = $(b)
                .text()
                .split(": ")[1]
                .trim();
        }
    );
    result["thumbnail"] = $("body").find("div.card-footer > a").attr("href");
    return result;
};
exports.gsmarena = async (query) => {
    var {
        data
    } = await axios.get(
        "https://www.gsmarena.com/res.php3?sSearch=" + query
    );
    const $ = cheerio.load(data);
    const result = {};
    link = $("#review-body > div > ul > li > a").attr("href");
    var {
        data
    } = await axios.get("https://www.gsmarena.com/" + link);
    const $$ = cheerio.load(data);
    result["title"] = $$("#body")
        .find("div.article-info-line.page-specs.light.border-bottom > h1")
        .text();
    result["thumbnail"] = $$("#body").find("div > a > img").attr("src");
    $$("#specs-list > table").each(function(a, b) {
        result[$$(b).find("tr > th").text().toLowerCase().replace(/ /g, "")] = $$(b)
            .find("td.nfo")
            .text()
            .trim();
    });
    return result;
};
exports.stickerTelegram = async (query, page = "1") => {
    const {
        data
    } = await axios.get(
        `https://combot.org/telegram/stickers?q=${encodeURI(query)}&page=${page || 1}`
    );
    const $ = cheerio.load(data);
    let results = [];
    $(
        "body > div > main > div.page > div > div.stickers-catalogue > div.tab-content > div > div"
    ).each(function() {
        const title = $(this).find(".sticker-pack__title").text()?.trim();
        const icon = $(this)
            .find(
                ".sticker-pack__sticker > div.sticker-pack__sticker-inner > div.sticker-pack__sticker-img"
            )
            .attr("data-src");
        const link = $(this)
            .find(".sticker-pack__header > a.sticker-pack__btn")
            .attr("href");
        let stickers = [];
        $(this)
            .find(".sticker-pack__list > div.sticker-pack__sticker")
            .each(function() {
                const sticker = $(this)
                    .find(".sticker-pack__sticker-inner > div.sticker-pack__sticker-img")
                    .attr("data-src");
                stickers.push(sticker);
            });
        results.push({
            title,
            icon,
            link,
            stickers,
        });
    });
    return results;
};

exports.stickerLine = async (query) => {
    const {
        data
    } = await axios.get(
        `https://store.line.me/api/search/sticker?query=${query}&offset=0&limit=36&type=ALL&includeFacets=true`
    );
    return data.items.map(
        ({
            title,
            productUrl,
            id,
            description,
            payloadForProduct: {
                staticUrl,
                animationUrl,
                soundUrl
            },
            authorId,
            authorName,
        }) => {
            return {
                id,
                title,
                description,
                url: encodeURI("https://store.line.me" + productUrl),
                sticker: staticUrl,
                stickerAnimated: animationUrl,
                stickerSound: soundUrl,
                authorId,
                authorName,
            };
        }
    );
};
exports.youtube = async (type, link, quality) => {
    return new Promise(async (resolve, reject) => {
        const ytIdRegex =
            /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:|watch\?.*(?:|\&)v=|embed\/|v\/|shorts\/)|youtu\.be\/)([-_0-9A-Za-z]{11}|[-_0-9A-Za-z]{10})/;
        quality ? quality : (quality = 360);
        if (ytIdRegex.test(link)) {
            let url = ytIdRegex.exec(link);
            let mdata = await yt({
                videoId: url[1],
            });
            let config = {
                url: "https://www.youtube.be/" + url,
                q_auto: 0,
                ajax: 1,
            };
            let headerss = {
                "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                Cookie: 'PHPSESSID=6jo2ggb63g5mjvgj45f612ogt7; _ga=GA1.2.405896420.1625200423; _gid=GA1.2.2135261581.1625200423; _PN_SBSCRBR_FALLBACK_DENIED=1625200785624; MarketGidStorage={"0":{},"C702514":{"page":5,"time":1625200846733}}',
            };
            axios("https://www.y2mate.com/mates/id276/analyze/ajax", {
                    method: "POST",
                    data: new URLSearchParams(Object.entries(config)),
                    headers: headerss,
                })
                .then(({
                    data
                }) => {
                    const $ = cheerio.load(data.result);
                    //#mp4 > table > tbody > tr:nth-child(1) > td:nth-child(2)
                    asize = {
                        mp3: [],
                        mp4: []
                    };
                    $("#mp4 > table > tbody > tr").each(function() {
                        asize.mp4.push({
                            quality: $(this).find("td:nth-child(1)").text().trim().split(" ")[0],
                            size: $(this).find("td:nth-child(2)").text(),
                        });
                    });
                    let img = $("div.thumbnail.cover > a > img").attr("src");
                    let title = $("div.thumbnail.cover > div > b").text();
                    let size =
                        type == "mp4" ?
                        asize.mp4.find((sz) => sz.quality == quality + "p").size :
                        $("#audio > table > tbody > tr:nth-child(1) > td:nth-child(2)").text();
                    let id = /var k__id = "(.*?)"/.exec(data.result)[1] || url[1];
                    let configs = {
                        type: "youtube",
                        _id: id,
                        v_id: url[1],
                        ajax: "1",
                        token: "",
                        ftype: "mp4",
                        fquality: quality ? quality : 480,
                    };
                    axios("https://www.y2mate.com/mates/id276/convert", {
                        method: "POST",
                        data: new URLSearchParams(Object.entries(configs)),
                        headers: headerss,
                    }).then(({
                        data
                    }) => {
                        const $ = cheerio.load(data.result);
                        let link = $("div > a").attr("href");

                        let configss = {
                            type: "youtube",
                            _id: id,
                            v_id: url[1],
                            ajax: "1",
                            token: "",
                            ftype: "mp3",
                            fquality: 128,
                        };
                        axios("https://www.y2mate.com/mates/en68/convert", {
                            method: "POST",
                            data: new URLSearchParams(Object.entries(configss)),
                            headers: headerss,
                        }).then(({
                            data
                        }) => {
                            const $ = cheerio.load(data.result);
                            let audio = $("div > a").attr("href");
                            // const mdata2 = mdata.all[0]
                            // const array = Object.keys(mdata2)
                            // const isi = Object.values(mdata2)
                            // let json = {}
                            // for (let x = 0; x < array.length; x++) {
                            // 	json[array[x]] = isi[x]
                            // }
                            resolve({
                                status: true,
                                id: url[1],
                                title: title,
                                size: size,
                                quality: quality,
                                thumb: img,
                                link: type == "mp4" ? link : audio,
                                ...mdata,
                            });
                        });
                    }).catch(error.link)
                }).catch(error.link)
        } else resolve(error.link);
    });
};
const randomarray = async (array) => {
    return array[Math.floor(Math.random() * array.length)];
};
exports.kbbi = async (kata) => {
    return new Promise(async (resolve, reject) => {
        const {data} = await axios.get(`https://kbbi.kemdikbud.go.id/entri/` + kata)
        const $ = cheerio.load(data);
        const arti = [];
        const undef = $("body > div.container.body-content > h4:nth-child(6)").text();
        if (undef == " Entri tidak ditemukan.") return resolve({status: false,message: "Kata tidak ditemukan!"});
        const lema = $("body > div.container.body-content > h2").text();
        $("body > div.container.body-content > ol > li").each(function(a, b) {
            deta = $(b).text();
            if(deta.split("a        ")[1] != undefined) arti.push(deta.split("a        ")[1]);
        });
        resolve(arti != '' ? {
            status: true,
            lema: lema,
            arti: arti,
        } : {
            status: false,
            message: 'kata tidak ditemukan!'
        });
    });
};
exports.ghuser = async (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            var response = await axios.get(`https://api.github.com/users/${user}`);
        } catch {
            return resolve({
                status: false,
                message: "User not found",
            });
        }
        if (response.status == 200) {
            const results = response.data;
            data = {};
            data.code = response.status;
            (data.status = true),
            (data.user = {
                idUser: results.id,
                username: results.login,
                nodeId: results.node_id,
                avatarUrl: results.avatar_url,
                gravatarId: results.gravatar_id == "" ? null : results.gravatar_id,
                githubUrl: results.html_url,
                type: results.type,
                isSiteAdmin: results.site_admin,
                name: results.name,
                company: results.company,
                blog: results.blog,
                email: results.email,
                hireable: results.hireable,
                bio: results.bio,
                publicRepos: results.public_repos,
                publicGists: results.public_gists,
                followers: results.followers,
                following: results.following,
                createdAt: results.created_at,
                updatedAt: results.updated_at,
            });
            data.creator = "Zhirrr";
            resolve(data);
        } else {
            resolve({
                code: 500,
                status: false,
                success: false,
                message: "Server Bermasalah",
            });
        }
    });
};
exports.ghrepo = async (repo) => {
    return new Promise(async (resolve, reject) => {
        await axios
            .get(`https://api.github.com/search/repositories?q=${repo}`)
            .then((response) => {
                if (response.status == 200) {
                    const results = response.data.items;

                    data = {};
                    data.code = response.status;
                    data.message = "ok";
                    data.totalCount = response.data.total_count;
                    data.items = [];
                    data.creator = "Zhirrr";

                    if (data.totalCount != 0) {
                        results.forEach((res) => {
                            data.items.push({
                                id: res.id,
                                nodeId: res.node_id,
                                nameRepo: res.name,
                                fullNameRepo: res.full_name,
                                url_repo: res.html_url,
                                description: res.description,
                                git_url: res.git_url,
                                ssh_url: res.ssh_url,
                                clone_url: res.clone_url,
                                svn_url: res.svn_url,
                                homepage: res.homepage,
                                stargazers: res.stargazers_count,
                                watchers: res.watchers,
                                forks: res.forks,
                                defaultBranch: res.default_branch,
                                language: res.language,
                                isPrivate: res.private,
                                isFork: res.fork,
                                createdAt: res.created_at,
                                updatedAt: res.updated_at,
                                pushedAt: res.pushed_at,
                                author: {
                                    username: res.owner.login,
                                    id_user: res.owner.id,
                                    avatar_url: res.owner.avatar_url,
                                    user_github_url: res.owner.html_url,
                                    type: res.owner.type,
                                    isSiteAdmin: res.owner.site_admin,
                                },
                            });
                        });
                    } else {
                        data.items = "Repositories not found";
                    }

                    resolve(data);
                } else {
                    reject({
                        code: 500,
                        success: false,
                        message: "Server Bermasalah",
                    });
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};
exports.Quran = async (surah, ayat) => {
    return new Promise((resolve, reject) => {
        axios
            .get(encodeURI(`https://alquran-apiii.vercel.app/surah/${surah}/${ayat}`))
            .then((response) => resolve(response.data))
            .catch(reject);
    });
};
exports.chord = async (query) => {
    const glink = await axios.get(`https://www.gitagram.com/?s=${query}`)
    const plink = cheerio.load(glink.data)('#content').find('tbody > tr:nth-child(1) > td:nth-child(1) > a:nth-child(1)').attr('href')
    if (plink == undefined) return ({
        status: false,
        message: 'Chord not found!'
    })
    const {
        data
    } = await axios.get(plink)
    const $ = cheerio.load(data)
    return ({
        status: true,
        title: $('article > div > header > h1').text(),
        artist: $('article > div > header > a:nth-child(7) > span').text(),
        chord: $('article > div > div.content > pre').text()
    })
};
exports.emojimix = (emoji1, emoji2) => {
  return new Promise(async (resolve, reject) => {
    const query = `${encodeURIComponent(emoji1)}${emoji2 != undefined ? '_' + encodeURIComponent(emoji2) : ''}`
    await fetch('https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=' + query)
      .then((res) => res.json())
      .then((json) => {
        if(json.error) return resolve(json.error)
        if (json.results.length === 0) return resolve(undefined)
        resolve(json)
      })
      .catch((err) => reject(err))
  })
}
exports.emoji = async (emoji) => {
    return new Promise((resolve, reject) => {
        axios
            .get(`https://emojipedia.org/search/?q=${encodeUrl(emoji)}`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                resolve({
                    creator: "Fajar Ihsana",
                    nama: $("body > div.container > div.content > article > h1").text(),
                    result: {
                        apple: $("body")
                            .find(
                                "li:nth-child(1) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        google: $("body")
                            .find(
                                "li:nth-child(2) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        samsung: $("body")
                            .find(
                                "li:nth-child(3) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        microsoft: $("body")
                            .find(
                                "li:nth-child(4) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        whatsapp: $("body")
                            .find(
                                "li:nth-child(5) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        twitter: $("body")
                            .find(
                                "li:nth-child(6) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        facebook: $("body")
                            .find(
                                "li:nth-child(7) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        skype: $("body")
                            .find(
                                "li:nth-child(8) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        joypixels: $("body")
                            .find(
                                "li:nth-child(9) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        openemoji: $("body")
                            .find(
                                "li:nth-child(10) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        emojidex: $("body")
                            .find(
                                "li:nth-child(11) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        messenger: $("body")
                            .find(
                                "li:nth-child(12) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        lg: $("body")
                            .find(
                                "li:nth-child(13) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        htc: $("body")
                            .find(
                                "li:nth-child(14) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        mozilla: $("body")
                            .find(
                                "li:nth-child(15) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        softbank: $("body")
                            .find(
                                "li:nth-child(16) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        docomo: $("body")
                            .find(
                                "li:nth-child(17) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                    },
                });
            });
    });
};
exports.dddtik = async (link) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: "POST",
            url: `https://dddtik.com/down.php`,
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "user-agent": fakeUa(),
                cookie: "sc_is_visitor_unique=rx12545292.1635383422.F7DED83AD2BA4F9517A804FC1A0ED021.1.1.1.1.1.1.1.1.1; __gads=ID=b947ab19f44e72c9-22cb5054e4cc00ef:T=1635383422:RT=1635383422:S=ALNI_MZWS0q0Op8F6EpwhOL1pMlFTGjCvQ",
            },
            formData: {
                url: link,
            },
        };

        request(options, async function(error, response, body) {
            if (error) throw new Error(error);
            const $ = cheerio.load(body);
            resolve({
                creator: "Fajar Ihsana",
                caption: $("div > div.ml-3 > span").text(),
                download: {
                    source: $("div > div:nth-child(4)").find("a").attr("href"),
                    dddtik: $("div > div:nth-child(5)").find("a").attr("href"),
                },
            });
        });
    });
};
exports.lafadz = async (query) => {
    return new Promise((resolve, reject) => {
        axios
            .get(`http://lafzi.apps.cs.ipb.ac.id/web/search.php?q=${query}&vowel=on`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const surah = [];
                const arab = [];
                const arti = [];
                const result = [];
                $("#srb-container > div > div.sura-name > span").each(function(a, b) {
                    deta = $(b).text();
                    surah.push(deta);
                });
                $("#srb-container > div > div.aya_container > div.aya_text").each(function(
                    a,
                    b
                ) {
                    deta = $(b).text();
                    arab.push(deta);
                });
                $("#srb-container > div > div.aya_container > div.aya_trans").each(
                    function(a, b) {
                        deta = $(b).text();
                        arti.push(deta);
                    }
                );
                for (let i = 0; i < surah.length; i++) {
                    result.push({
                        surat: surah[i],
                        arabic: arab[i],
                        arti: arti[i],
                    });
                }
                resolve({
                    creator: "Fajar Ihsana",
                    result: result,
                });
            });
    });
};
exports.listsurat = async () => {
    return new Promise((resolve, reject) => {
        axios.get("https://litequran.net/").then(({
            data
        }) => {
            const $ = cheerio.load(data);
            surah = [];
            data = [];
            $("body > main > section > ol > li > a").each(function(a, b) {
                data.push($(b).attr("href").split("/")[3]);
            });
            no = 1;
            for (let i of data) {
                surah.push({
                    no: no,
                    surah: i,
                });
                no += 1;
            }
            resolve(surah);
        });
    });
};
exports.surat = async (surah) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://litequran.net/` + surah).then(({
            data
        }) => {
            const $ = cheerio.load(data);
            const arab = [];
            const latin = [];
            const arti = [];
            const result = [];
            $("body > main > article > ol > li > span.ayat").each(function(a, b) {
                deta = $(b).text();
                arab.push(deta);
            });
            $("body > main > article > ol > li > span.bacaan").each(function(a, b) {
                deta = $(b).text();
                latin.push(deta);
            });
            $("body > main > article > ol > li > span.arti").each(function(a, b) {
                deta = $(b).text();
                arti.push(deta);
            });
            num = 1;
            for (let i = 0; i < arab.length; i++) {
                result.push({
                    ayat: num,
                    arabic: arab[i],
                    latin: latin[i],
                    arti: arti[i],
                });
                num += 1;
            }
            resolve({
                creator: "Fajar Ihsana",
                surat: $("body > main > article > header > h1").text(),
                jumlah_ayat: arab.length,
                result: result,
            });
        });
    });
};
exports.merdekanews = async () => {
    return new Promise((resolve) => {
        axios.get("https://www.merdeka.com/peristiwa/").then(({
            data
        }) => {
            const $ = cheerio.load(data);
            const judul = [];
            const upload = [];
            const link = [];
            const thumb = [];
            const result = [];
            $("#mdk-content-center > div.inner-content > ul > li > div").each(function(
                a,
                b
            ) {
                deta = $(b).find("h3 > a").text();
                judul.push(deta);
                link.push("https://www.merdeka.com" + $(b).find("h3 > a").attr("href"));
                upload.push($(b).find("div > span").text());
                thumb.push($(b).find("div > a > img").attr("src"));
            });
            for (let i = 0; i < judul.length; i++) {
                result.push({
                    judul: judul[i],
                    upload_date: upload[i],
                    link: link[i],
                    thumb: thumb[i],
                });
            }
            resolve(result);
        });
    });
};
exports.metronews = async () => {
    return new Promise((resolve) => {
        axios.get("https://www.metrotvnews.com/news").then(({
            data
        }) => {
            const $ = cheerio.load(data);
            const judul = [];
            const desc = [];
            const link = [];
            const thumb = [];
            const tag = [];
            const result = [];
            $(
                "body > div.container.layout > section.content > div > div.item-list.pt-20 > div > div > h3 > a"
            ).each(function(a, b) {
                judul.push($(b).attr("title"));
            });
            $(
                "body > div.container.layout > section.content > div > div.item-list.pt-20 > div > div > p"
            ).each(function(a, b) {
                deta = $(b).text();
                desc.push(deta);
            });
            $(
                "body > div.container.layout > section.content > div > div.item-list.pt-20 > div > div > h3 > a"
            ).each(function(a, b) {
                link.push("https://www.metrotvnews.com" + $(b).attr("href"));
            });
            $(
                "body > div.container.layout > section.content > div > div.item-list.pt-20 > div > img"
            ).each(function(a, b) {
                thumb.push($(b).attr("src").replace("w=300", "w=720"));
            });
            for (let i = 0; i < judul.length; i++) {
                result.push({
                    judul: judul[i],
                    link: link[i],
                    thumb: thumb[i],
                    deskripsi: desc[i],
                });
            }
            resolve(result);
        });
    });
};
exports.asupanfilm = async (query) => {
    return new Promise((resolve) => {
        axios.get(`https://asupanfilm.link/?search=${query}`).then(({
            data
        }) => {
            const $ = cheerio.load(data);
            const judul = [];
            const desc = [];
            const thumb = [];
            const link = [];
            const result = [];
            $(
                "body > div > div > div.card-body.p-2 > ul > li > div > div > h6 > a"
            ).each(function(a, b) {
                deta = $(b).text();
                judul.push(deta);
            });
            $("body > div > div > div.card-body.p-2 > ul > li > div > div").each(
                function(a, b) {
                    deta = $(b).text();
                    desc.push(deta.split("   ")[2]);
                }
            );
            $("body > div > div > div.card-body.p-2 > ul > li > div > img").each(
                function(a, b) {
                    thumb.push($(b).attr("src").split("UX67_CR0,0,67,98_AL_")[0]);
                }
            );
            $(
                "body > div > div > div.card-body.p-2 > ul > li > div > div > h6 > a"
            ).each(function(a, b) {
                link.push("https://asupanfilm.link/" + $(b).attr("href"));
            });
            for (let i = 0; i < judul.length; i++) {
                result.push({
                    judul: judul[i],
                    deskripsi: desc[i],
                    thumb: thumb[i],
                    link: link[i],
                });
            }
            resolve(result);
        });
    });
};
exports.trendtwit = (country) => {
    return new Promise((resolve, reject) => {
        axios
            .get(`https://getdaytrends.com/${country}/`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const hastag = [];
                const tweet = [];
                const result = [];
                $(
                    "#trends > table.table.table-hover.text-left.clickable.ranking.trends.wider.mb-0 > tbody > tr> td.main > a"
                ).each(function(a, b) {
                    deta = $(b).text();
                    hastag.push(deta);
                });
                $(
                    "#trends > table.table.table-hover.text-left.clickable.ranking.trends.wider.mb-0 > tbody > tr > td.main > div > span"
                ).each(function(a, b) {
                    deta = $(b).text();
                    tweet.push(deta);
                });
                num = 1;
                for (let i = 0; i < hastag.length; i++) {
                    result.push({
                        rank: num,
                        hastag: hastag[i],
                        tweet: tweet[i],
                    });
                    num += 1;
                }
                resolve({
                    country: country,
                    result: result,
                });
            })
            .catch(reject);
    });
};
exports.zerochan = (query) => {
    return new Promise((resolve, reject) => {
        axios
            .get("https://www.zerochan.net/search?q=" + query)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const judul = [];
                const result = [];
                const id = [];
                $("#thumbs2 > li > a > img").each(function(a, b) {
                    if (!$(b).attr("alt").startsWith("https://static.zerochan.net/")) {
                        judul.push($(b).attr("alt"));
                    }
                });
                $("#thumbs2 > li > a").each(function(a, b) {
                    id.push($(b).attr("href"));
                });
                for (let i = 0; i < judul.length; i++) {
                    result.push(
                        "https://s1.zerochan.net/" +
                        judul[i].replace(/\ /g, ".") +
                        ".600." +
                        id[i].split("/")[1] +
                        ".jpg"
                    );
                }
                resolve(
                    result != "" ? {
                        status: true,
                        creator: "Fajar Ihsana",
                        result: result,
                    } : {
                        status: false,
                        message: "image not found"
                    }
                );
            })
            .catch(reject => {
                resolve({
                    status: false,
                    message: 'Image not found'
                })
            });
    });
};
exports.happymoddl = (link) => {
    return new Promise((resolve, reject) => {
        axios
            .get(link)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const link = [];
                const jlink = [];
                const result = [];
                const title = $(
                    "body > div > div.container-left > section:nth-child(1) > div > h1"
                ).text();
                const info = $(
                    "body > div > div.container-left > section:nth-child(1) > div > ul"
                ).text();
                $(
                    "body > div.container-row.clearfix.container-wrap.pdt-font-container > div.container-left > section:nth-child(1) > div > div:nth-child(3) > div > p > a"
                ).each(function(a, b) {
                    deta = $(b).text();
                    jlink.push(deta);
                    if ($(b).attr("href").startsWith("/")) {
                        link.push("https://happymod.com" + $(b).attr("href"));
                    } else {
                        link.push($(b).attr("href"));
                    }
                });
                for (let i = 0; i < link.length; i++) {
                    result.push({
                        title: jlink[i],
                        dl_link: link[i],
                    });
                }
                console.log(link);
                resolve({
                    creator: "Fajar Ihsana",
                    title: title,
                    info: info.replace(/\t|- /g, ""),
                    download: link,
                });
            })
            .catch(reject);
    });
};
exports.goredl = async (link) => {
    return new Promise(async (resolve, reject) => {
        axios
            .get(link)
            .then(({
                data
            }) => {
                const $$ = cheerio.load(data);
                const format = {
                    judul: $$(
                        "div.single-main-container > div > div.bb-col.col-content > div > div > div > div > header > h1"
                    ).text(),
                    views: $$(
                        "div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > span > span.count"
                    ).text(),
                    comment: $$(
                        "div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > a > span.count"
                    ).text(),
                    link: $$("video > source").attr("src"),
                };
                const result = {
                    creator: "Fajar Ihsana",
                    data: format,
                };
                resolve(result);
            })
            .catch(reject);
    });
};
exports.anoboys = (query) => {
    return new Promise((resolve, reject) => {
        axios
            .get("https://anoboy.digital/?s=" + query)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const format = [];
                const link = [];
                const judul = [];
                const thumb = [];
                const uptime = [];
                const result = [];
                $("body > div.wrap > div.container > div.column-content > a").each(
                    function() {
                        result.push({
                            title: $(this).find("div > div.amvj > h3").text(),
                            uptime: $(this).find("div > div.jamup").text(),
                            thumbnail: $(this).find("div > amp-img").attr("src"),
                            link: $(this).attr("href"),
                        });
                    }
                );
                resolve({
                    status: data.status,
                    creator: "Fajar Ihsana",
                    data: result,
                });
            })
            .catch(reject);
    });
};
exports.film = async (query) => {
    return new Promise((resolve, reject) => {
        axios
            .get(`http://167.99.71.200/?s=${query}`)
            .then((data) => {
                const $ = cheerio.load(data.data);
                const judul = [];
                const genre = [];
                const thumb = [];
                const link = [];
                const format = [];
                $("div > div.item-article > header > h2 > a").each(function(a, b) {
                    deta = $(b).text();
                    judul.push(deta);
                });
                $("div > div.item-article > header > div.gmr-movie-on").each(function(
                    a,
                    b
                ) {
                    deta = $(b).text();
                    genre.push(deta);
                });
                $("div > div.content-thumbnail.text-center > a > img").each(function(
                    a,
                    b
                ) {
                    thumb.push($(b).attr("src"));
                });
                $("div > div.item-article > header > div.gmr-watch-movie > a").each(
                    function(a, b) {
                        link.push($(b).attr("href"));
                    }
                );
                for (let i = 0; i < judul.length; i++) {
                    format.push({
                        judul: judul[i],
                        genre: genre[i],
                        thumb: thumb[i],
                        link_nonton: link[i],
                    });
                }
                if (format == "") {
                    resolve({
                        status: "error",
                    });
                } else {
                    resolve(format);
                }
            })
            .catch(reject);
    });
};
exports.webtoons = async (query) => {
    return new Promise((resolve, reject) => {
        axios
            .get(`https://www.webtoons.com/id/search?keyword=${query}`)
            .then((data) => {
                const $ = cheerio.load(data.data);
                const judul = [];
                const genre = [];
                const author = [];
                const link = [];
                const likes = [];
                const format = [];
                $("#content > div > ul > li > a > div > p.subj").each(function(a, b) {
                    deta = $(b).text();
                    judul.push(deta);
                });
                $("div > ul > li > a > span").each(function(a, b) {
                    deta = $(b).text();
                    genre.push(deta);
                });
                $("div > ul > li > a > div > p.author").each(function(a, b) {
                    deta = $(b).text();
                    author.push(deta);
                });
                $("div > ul > li > a > div > p.grade_area > em").each(function(a, b) {
                    deta = $(b).text();
                    likes.push(deta);
                });
                $("#content > div > ul > li > a").each(function(a, b) {
                    link.push($(b).attr("href"));
                });
                for (let i = 0; i < judul.length; i++) {
                    format.push({
                        judul: judul[i],
                        genre: genre[i],
                        author: author[i],
                        likes: likes[i],
                        link: "https://www.webtoons.com" + link[i],
                    });
                }
                if (likes == "") {
                    resolve({
                        status: `${query} tidak dapat ditemukan/error`,
                    });
                } else {
                    resolve(format);
                }
            })
            .catch(reject);
    });
};
exports.soundcloud = async (link) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: "POST",
            url: "https://www.klickaud.co/download.php",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            formData: {
                value: link,
                "2311a6d881b099dc3820600739d52e64a1e6dcfe55097b5c7c649088c4e50c37": "710c08f2ba36bd969d1cbc68f59797421fcf90ca7cd398f78d67dfd8c3e554e3",
            },
        };
        request(options, async function(error, response, body) {
            if (error) throw new Error(error);
            const $ = cheerio.load(body);
            resolve({
                judul: $(
                    "#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(2)"
                ).text(),
                download_count: $(
                    "#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(3)"
                ).text(),
                thumb: $(
                    "#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(1) > img"
                ).attr("src"),
                link: $("#dlMP3").attr("onclick").split(`downloadFile('`)[1].split(`',`)[0],
            });
        });
    });
};
exports.gempa = async () => {
    return new Promise(async (resolve, reject) => {
        axios
            .get("https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg")
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const drasa = [];
                $("table > tbody > tr:nth-child(1) > td:nth-child(6) > span")
                    .get()
                    .map((rest) => {
                        dir = $(rest).text();
                        drasa.push(dir.replace("\t", " "));
                    });
                teks = "";
                for (let i = 0; i < drasa.length; i++) {
                    teks += drasa[i] + "\n";
                }
                const rasa = teks;
                const format = {
                    imagemap: $("div.modal-body > div > div:nth-child(1) > img").attr("src"),
                    magnitude: $("table > tbody > tr:nth-child(1) > td:nth-child(4)").text(),
                    kedalaman: $("table > tbody > tr:nth-child(1) > td:nth-child(5)").text(),
                    wilayah: $("table > tbody > tr:nth-child(1) > td:nth-child(6) > a").text(),
                    waktu: $("table > tbody > tr:nth-child(1) > td:nth-child(2)").text(),
                    lintang_bujur: $(
                        "table > tbody > tr:nth-child(1) > td:nth-child(3)"
                    ).text(),
                    dirasakan: rasa,
                };
                const result = {
                    creator: "Fajar Ihsana",
                    data: format,
                };
                resolve(result);
            })
            .catch(reject);
    });
};
exports.resepmasakan = async (query) => {
    const sresep = await axios.get("https://resepkoki.id/?s=" + query);
    const $$ = cheerio.load(sresep.data);
    const lresep = $$("body")
        .find(
            "div.masonry-grid > div:nth-child(1) > article > div > div.archive-item-media > a"
        )
        .attr("href");
    if (lresep == undefined)
        return {
            status: false,
            message: "Resep tidak ditemukan!",
        };
    const {
        data
    } = await axios.get(lresep);
    const $ = cheerio.load(data);
    const abahan = [];
    const atakaran = [];
    const atahap = [];
    $(
        "body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-name"
    ).each(function(a, b) {
        bh = $(b).text();
        abahan.push(bh);
    });
    $(
        "body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-amount"
    ).each(function(c, d) {
        uk = $(d).text();
        atakaran.push(uk);
    });
    $(
        "body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-content > div.single-steps > table > tbody > tr > td.single-step-description > div > p"
    ).each(function(e, f) {
        th = $(f).text();
        atahap.push(th);
    });
    const judul = $(
        "body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-title.title-hide-in-desktop > h1"
    ).text();
    const waktu = $(
        "body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-cooking-time > span"
    ).text();
    const hasil = $(
            "body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-serves > span"
        )
        .text()
        .split(": ")[1];
    const level = $(
            "body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-difficulty > span"
        )
        .text()
        .split(": ")[1];
    const thumb = $(
        "body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-main-media > img"
    ).attr("src");
    tbahan = "bahan\n";
    for (let i = 0; i < abahan.length; i++) {
        tbahan += abahan[i] + " " + atakaran[i] + "\n";
    }
    ttahap = "tahap\n";
    for (let i = 0; i < atahap.length; i++) {
        ttahap += atahap[i] + "\n\n";
    }
    const tahap = ttahap;
    const bahan = tbahan;
    const result = {
        creator: "Fajar Ihsana",
        data: {
            judul: judul,
            waktu_masak: waktu,
            hasil: hasil,
            tingkat_kesulitan: level,
            thumb: thumb,
            bahan: bahan.split("bahan\n")[1],
            langkah_langkah: tahap.split("tahap\n")[1],
        },
    };
    return judul ? {
        status: true,
        ...result,
    } : {
        status: false,
        message: "Resep tidak ditemukan!",
    };
};
exports.searchgore = async (query) => {
    return new Promise(async (resolve, reject) => {
        axios.get("https://seegore.com/?s=" + query).then((dataa) => {
            const $$$ = cheerio.load(dataa);
            pagina = $$$(
                "#main > div.container.main-container > div > div.bb-col.col-content > div > div > div > div > nav > ul > li:nth-child(4) > a"
            ).text();
            rand = Math.floor(Math.random() * pagina) + 1;
            if (rand === 1) {
                slink = "https://seegore.com/?s=" + query;
            } else {
                slink = `https://seegore.com/page/${rand}/?s=${query}`;
            }
            axios
                .get(slink)
                .then(({
                    data
                }) => {
                    const $ = cheerio.load(data);
                    const link = [];
                    const judul = [];
                    const uploader = [];
                    const format = [];
                    const thumb = [];
                    $("#post-items > li > article > div.content > header > h2 > a").each(
                        function(a, b) {
                            link.push($(b).attr("href"));
                        }
                    );
                    $("#post-items > li > article > div.content > header > h2 > a").each(
                        function(c, d) {
                            jud = $(d).text();
                            judul.push(jud);
                        }
                    );
                    $(
                        "#post-items > li > article > div.content > header > div > div.bb-cat-links > a"
                    ).each(function(e, f) {
                        upl = $(f).text();
                        uploader.push(upl);
                    });
                    $("#post-items > li > article > div.post-thumbnail > a > div > img").each(
                        function(g, h) {
                            thumb.push($(h).attr("src"));
                        }
                    );
                    for (let i = 0; i < link.length; i++) {
                        format.push({
                            judul: judul[i],
                            uploader: uploader[i],
                            thumb: thumb[i],
                            link: link[i],
                        });
                    }
                    const result = {
                        creator: "Fajar Ihsana",
                        data: format,
                    };
                    resolve(result);
                })
                .catch(reject);
        });
    });
};
exports.sfiledown = async (link) => {
    return new Promise((resolve, reject) => {
        axios
            .get(link)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const nama = $(
                    "body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(2) > b"
                ).text();
                const size = $("#download").text().split("Download File");
                const desc = $(
                    "body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(7) > center > h1"
                ).text();
                const type = $(
                    "body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(4) > a:nth-child(3)"
                ).text();
                const upload = $(
                    "body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(5)"
                ).text();
                const uploader = $(
                    "body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(4) > a:nth-child(2)"
                ).text();
                const download = $(
                    "body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(6)"
                ).text();
                const link = $("#download").attr("href");
                other = link.split("/")[7].split("&is")[0];
                const format = {
                    judul: nama + other.substr(other.length - 6).split(".")[1],
                    size: size[1].split("(")[1].split(")")[0],
                    type: type,
                    mime: other.substr(other.length - 6).split(".")[1],
                    desc: desc,
                    uploader: uploader,
                    uploaded: upload.split("\n - Uploaded: ")[1],
                    download_count: download.split(" - Downloads: ")[1],
                    link: link,
                };
                const result = {
                    creator: "Hanya Orang Biasa",
                    data: format,
                };
                resolve(result);
            })
            .catch(reject);
    });
};
exports.happymod = (query) => {
    return new Promise((resolve, reject) => {
        axios
            .get("https://www.happymod.com/search.html?q=" + query)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const nama = [];
                const link = [];
                const rating = [];
                const thumb = [];
                const format = [];
                $(
                    "body > div.container-row.clearfix.container-wrap > div.container-left > section > div > div > h3 > a"
                ).each(function(a, b) {
                    nem = $(b).text();
                    nama.push(nem);
                    link.push("https://happymod.com" + $(b).attr("href"));
                });
                $(
                    "body > div.container-row.clearfix.container-wrap > div.container-left > section > div > div > div.clearfix > span"
                ).each(function(c, d) {
                    rat = $(d).text();
                    rating.push(rat);
                });
                $(
                    "body > div.container-row.clearfix.container-wrap > div.container-left > section > div > a > img"
                ).each(function(e, f) {
                    thumb.push($(f).attr("data-original"));
                });
                for (let i = 0; i < link.length; i++) {
                    format.push({
                        judul: nama[i],
                        thumb: thumb[i],
                        rating: rating[i],
                        link: link[i],
                    });
                }
                const result = {
                    creator: "Hanya Orang Biasa",
                    data: format,
                };
                resolve(result);
            })
            .catch(reject);
    });
};
exports.corona = async (country) => {
    if (!country) return loghandler.noinput;
    try {
        const res = await axios.request(
            `https://www.worldometers.info/coronavirus/country/` + country, {
                method: "GET",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Linux; Android 9; Redmi 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36",
                },
            }
        );
        let result = {};
        const $ = cheerio.load(res.data);
        result.status = res.status;
        result.negara = $("div").find("h1").text().slice(3).split(/ /g)[0];
        result.total_kasus =
            $("div#maincounter-wrap")
            .find("div.maincounter-number > span")
            .eq(0)
            .text() + " total";
        result.total_kematian =
            $("div#maincounter-wrap")
            .find("div.maincounter-number > span")
            .eq(1)
            .text() + " total";
        result.total_sembuh =
            $("div#maincounter-wrap")
            .find("div.maincounter-number > span")
            .eq(2)
            .text() + " total";
        result.informasi = $("div.content-inner > div").eq(1).text();
        result.informasi_lengkap =
            "https://www.worldometers.info/coronavirus/country/" + country;
        if (result.negara == "") {
            result.status = "error";
        }
        return result;
    } catch (error404) {
        return "=> Error => " + error404;
    }
};
exports.artinama = (query) => {
    return new Promise((resolve, reject) => {
        queryy = query.replace(/ /g, "+");
        axios
            .get(
                "https://www.primbon.com/arti_nama.php?nama1=" +
                query +
                "&proses=+Submit%21+"
            )
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const result = $("#body").text();
                const result2 = result.split("\n      \n        \n        \n")[0];
                const result4 = result2.split("ARTI NAMA")[1];
                const result5 = result4.split(".\n\n");
                const result6 = result5[0] + "\n\n" + result5[1];
                resolve(result6);
            })
            .catch(reject);
    });
};
exports.drakor = (query) => {
    return new Promise((resolve, reject) => {
        queryy = query.replace(/ /g, "+");
        axios
            .get("https://drakorasia.net/?s=" + queryy + "&post_type=post")
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const result = [];
                const link = [];
                const judul = [];
                const thumb = [];
                $("#post > div > div.thumbnail > a").each(function(a, b) {
                    link.push($(b).attr("href"));
                    thumb.push($(b).find("img").attr("src"));
                });
                $(
                    "#post > div > div.title.text-center.absolute.bottom-0.w-full.py-2.pb-4.px-3 > a > h2"
                ).each(function(c, d) {
                    titel = $(d).text();
                    judul.push(titel);
                });
                for (let i = 0; i < link.length; i++) {
                    result.push({
                        judul: judul[i],
                        thumb: thumb[i],
                        link: link[i],
                    });
                }
                resolve(result);
            })
            .catch(reject);
    });
};
exports.wattpad = (query) => {
    return new Promise((resolve, reject) => {
        axios
            .get("https://www.wattpad.com/search/" + query)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const result = [];
                const linkk = [];
                const judull = [];
                const thumb = [];
                const dibaca = [];
                const vote = [];
                const bab = [];
                $("ul.list-group > li.list-group-item").each(function(a, b) {
                    linkk.push("https://www.wattpad.com" + $(b).find("a").attr("href"));
                    thumb.push($(b).find("img").attr("src"));
                });
                $(
                    "div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(1) > div.icon-container > div > span.stats-value"
                ).each(function(e, f) {
                    baca = $(f).text();
                    dibaca.push(baca);
                });
                $(
                    "div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(2) > div.icon-container > div > span.stats-value"
                ).each(function(g, h) {
                    vot = $(h).text();
                    vote.push(vot);
                });
                $(
                    "div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(3) > div.icon-container > div > span.stats-value"
                ).each(function(i, j) {
                    bb = $(j).text();
                    bab.push(bb);
                });
                $("div.story-card-data.hidden-xxs > div.story-info > div.title").each(
                    function(c, d) {
                        titel = $(d).text();
                        judull.push(titel);
                    }
                );
                for (let i = 0; i < linkk.length; i++) {
                    if (!judull[i] == "") {
                        result.push({
                            judul: judull[i],
                            dibaca: dibaca[i],
                            divote: vote[i],
                            thumb: thumb[i],
                            link: linkk[i],
                        });
                    }
                }
                resolve(result);
            })
            .catch(reject);
    });
};
exports.sfilesearch = (query) => {
    return new Promise((resolve, reject) => {
        axios
            .get("https://sfile.mobi/search.php?q=" + query + "&search=Search")
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const result = [];
                const link = [];
                const neme = [];
                const size = [];
                $("div.w3-card.white > div.list > a").each(function(a, b) {
                    link.push($(b).attr("href"));
                });
                $("div.w3-card.white > div.list > a").each(function(c, d) {
                    name = $(d).text();
                    neme.push(name);
                });
                $("div.w3-card.white > div.list").each(function(e, f) {
                    siz = $(f).text();
                    //sz = siz.
                    size.push(siz.split("(")[1]);
                });
                for (let i = 0; i < link.length; i++) {
                    result.push({
                        nama: neme[i],
                        size: size[i].split(")")[0],
                        link: link[i],
                    });
                }
                resolve(result != '' ? {status: true, result: result} : {status: false, message: 'Not found!'});
            })
            .catch(reject);
    });
};
exports.wikisearch = async (query) => {
    const res = await axios.get(
        `https://id.m.wikipedia.org/w/index.php?search=${query}`
    );
    const $ = cheerio.load(res.data);
    const hasil = [];
    let wiki = $("#mf-section-0").find("p").text();
    let thumb = $("#mf-section-0").find("div > div > a > img").attr("src");
    thumb = thumb ? thumb : "//pngimg.com/uploads/wikipedia/wikipedia_PNG35.png";
    thumb = "https:" + thumb;
    let judul = $("h1#section_0").text();
    hasil.push({
        wiki,
        thumb,
        judul,
    });
    return hasil;
};
exports.konachan = (chara) => {
    return new Promise((resolve, reject) => {
        let text = chara.replace(" ", "_");
        axios
            .get("https://konachan.net/post?tags=" + text + "+")
            .then(({
                data
            }) => {
                const $$ = cheerio.load(data);
                const no = [];
                $$("div.pagination > a").each(function(c, d) {
                    no.push($$(d).text());
                });
                let mat = Math.floor(Math.random() * no.length);
                axios
                    .get("https://konachan.net/post?page=" + mat + "&tags=" + text + "+")
                    .then(({
                        data
                    }) => {
                        const $ = cheerio.load(data);
                        const result = [];
                        $(
                            "#post-list > div.content > div:nth-child(4) > ul > li > a.directlink.largeimg"
                        ).each(function(a, b) {
                            result.push($(b).attr("href"));
                        });
                        resolve(
                            result != "" ? {
                                status: true,
                                result: result,
                            } : {
                                status: false,
                                message: "image not found",
                            }
                        );
                    });
            })
            .catch(reject);
    });
};
exports.wallpaperhd = (chara) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://wall.alphacoders.com/search.php?search=" +
                chara +
                "&filter=4K+Ultra+HD"
            )
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const result = [];
                $("div.boxgrid > a > picture").each(function(a, b) {
                    result.push($(b).find("img").attr("src").replace("thumbbig-", ""));
                });
                resolve(result);
            })
            .catch(reject);
    });
};
exports.tebakgambar = () => {
    let random_level = Math.floor(Math.random() * 136);
    let random_eq = Math.floor(Math.random() * 20);
    return axios
        .get(`https://jawabantebakgambar.net/level-${random_level}/`)
        .then((val) => {
            let url = "https://jawabantebakgambar.net";
            const $ = cheerio.load(val.data);
            let href = $("ul > * > a").eq(random_eq);
            let jwbn = href.find("span").text();
            let img = href.find("img").attr("data-src");
            let src = url + img;
            let petunjuk = jwbn.replace(/[AIUEO|aiueo]/g, "_");
            return {
                img: src,
                jawaban: jwbn,
                petunjuk,
            };
        });
};
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log("Update 'scraper.js'");
    delete require.cache[file];
});
