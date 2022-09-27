import axios from 'axios'

const EXCLUDED_GUIDE_TYPES = [5, 6]
const PUBLISHED_STATUS = 1

export async function fetchGuides() {
  return new Promise(async (resolve, reject) => {
    const guides = []

    const { data } = await axios.get('https://lgapi-ca.libapps.com/1.1/guides/?site_id=18643&key=795c7d5de062bc2e8272f9db564eee70&expand=pages')

    data.forEach(guideData => {
      if (guideData.status === PUBLISHED_STATUS && !EXCLUDED_GUIDE_TYPES.includes(guideData.type_id)) {
        let i = 0;
        const guide = {
          url: null,
          aliasUrl: null,
          pages: []
        }
        const guideUrl = `https://api.bib.umontreal.ca/guides/embed/${guideData.id}`

        guideData.pages
          // Keeping only published pages
          .filter(page => page.enable_display === '1')
          .forEach(page => {
            i++;
            const tabParam = `tab=${page.id}`
            if (i > 1) {
              guide.pages.push(`${guideUrl}?${tabParam}`)
            } else {
              guide.url = guideUrl
              guide.aliasUrl = `${guideUrl}?${tabParam}`
            }
          })

        guides.push(guide)

      }
    });

    resolve(guides)

  })
}