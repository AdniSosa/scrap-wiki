// Paso 1: Inicializar el Proyecto Inicia con npm install para instalar las dependencias (express, cheerio, axios).
// Paso 2: Crear un Archivo index.js Crea un archivo llamado index.js en el directorio del proyecto. Aquí estará todo el código de tu proyecto
// Paso 3: Crear un servidor http
// Paso 4: Accederemos a la web de wikipedia (https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap), en esa web encontraremos enlaces a los que tendremos que acceder y recorrer esas página y recoger los siguinetes datos:
    // El título (h1)
    // Todas las imágenes ('img')
    // Todos los textos ('p')

// Paso 5: Crea un array y dentro guarda cada uno de los datos de las páginas en un objeto (título, imagenes, textos)
// Paso 6: Saca toda esa información en un console.log() cuando todo termine, o en un res.send() en la misma ruta o en otra... donde decidas
//Para recoger los enlaces, deberás recoger solo los que están dentro del ID: #mw-pages. Será algo así: $('#mw-pages a').each((index, element)...

const axios = require('axios'),
cheerio = require('cheerio'),
express = require('express'),
app = express(),
PORT = 3000,
url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap';

app.get('/', async (req, res) => {
    try{
        const response = await axios.get(url);
        if(response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            const pageTitle = $('title').text();
            //console.log(pageTitle);
            const links = [];
            const rapers = [];
            const imgs = [];

            const $links = $('#mw-pages a');

            $links.each((index, element) => {
                const link = $(element).attr('href');
                links.push(link);
                //console.log(links);
                
            })

            for (const element of links) {
                //console.log(element);
                const linkResponse = await axios.get(`https://es.wikipedia.org/${element}`)
                if(linkResponse.status === 200) {
                    const html = linkResponse.data;
                    const $ = cheerio.load(html);
                    
                    $('img').each((index, element) => {
                        const img = $(element).attr('src');
                        imgs.push(img);
                        //console.log(imgs)
                    });

                    
                    const title = $('h1').text();
                    const content = $('p').text()
                    rapers.push({title, imgs, content});
                }
                
            }       
        
            
           // const allRapers = rapers.map(raper => `${raper.title}</h2><img src='${raper.imgs.map(img1 => img1)}' alt='${raper.title}'><p>${raper.content}</p></li>`).join('');
            //const allLinks = links.map(link => `<li><a href='https://es.wikipedia.org/${link}'>${link}</a></li>`).join('');
            console.log(rapers)
            res.json(rapers)
        }
    }catch (error) {
        console.log('Error al obtener los datos', error)
    }
})

app.listen(PORT, () => {
    console.log(`Express está escuchando en el puerto http://localhost:${PORT}`);
})
