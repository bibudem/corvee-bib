import { writeFileSync } from 'fs'
import { join } from 'path'
import axios from 'axios'

const links = []

axios
  .get('https://lgapi-ca.libapps.com/1.1/guides/?site_id=18643&key=795c7d5de062bc2e8272f9db564eee70&expand=pages')
  .then(response => {
    response.data.forEach(guide => {
      if (guide.type_label === 'General Purpose Guide' && guide.status_label === 'Published') {
        let i = 0;
        const guideId = guide.id

        guide.pages.forEach(page => {
          i++;
          let link = `https://api.bib.umontreal.ca/guides/embed/${guideId}`
          if (i > 1) {
            link += `?tab=${page.id}`
          }
          links.push(link)
        })

      }
    });

    writeFileSync(join(__dirname, '..', 'config', 'links.json'), JSON.stringify(links, null, 2))

    process.exit()
  })