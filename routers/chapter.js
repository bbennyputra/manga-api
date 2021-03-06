const router = require('express').Router()
const cheerio = require('cheerio')
const baseUrl = require('../constants/urls')
const { default: Axios } = require('axios')

router.get('/',(req,res) => {
    res.send('chapter')
})

//chapter ----done ----
router.get('/:slug', (req, res,next) => {
    const slug = req.params.slug
    const url = baseUrl+slug
    console.log(url);
    let link
    Axios.get(`https://pdf.komiku.co.id/${slug}`).then(response => {
        const $ = cheerio.load(response.data)
        const element = $('.title')
        link = element.find('a').attr('href')
    }).catch(err=>{
        console.log(err.message);
    })

    Axios.get(url).then(response => {
            const $ = cheerio.load(response.data)            
            const content = $('#article')
            let chapter_image = []
            let title,chapter_image_link,image_number,chapter_endpoint,download_link
            chapter_endpoint = slug+'/'
            content.find('.dsk2').filter(function (){
                title = $(this).find('h1').text().replace('Komik ','')
            })
            download_link = link
            content.find('.bc').filter(function (){
                $(this).find('img').each(function (i,el){
                chapter_image_link = $(el).attr('src')
                image_number = i+1
                chapter_image.push({image_number,chapter_image_link})
                })
            })
            res.json({title,chapter_endpoint,download_link,chapter_image})
    }).catch(err=>{
        console.log(err.message);
    })
})

// router.get('/download/:id',(req, res)=>{
//     const id = req.params.id
//     const url = `${baseUrl}download/${id}`
//     console.log(url);
//     Axios.get(url).then(response =>{
//         const $ = cheerio.load(response.data)
//         const element = $('#fulldl')
//         let download_pdf
//         download_pdf = element.find('a').attr('href')
//         console.log(element.text());
//         res.json({download_pdf})
//     })
// })

module.exports = router