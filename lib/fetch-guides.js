import { default as axios } from 'axios'

export async function fetchGuides() {
  return new Promise(async (resolve, reject) => {

    /**
     * @type { Array<{ url: null; aliasUrl: null; pages: Array<string>; }> }
     */
    const guides = []

    const { data } = await axios.get('https://lgapi-ca.libapps.com/1.1/guides/?site_id=18643&key=795c7d5de062bc2e8272f9db564eee70&expand=pages&guide_types=1,2,3,4&status=1')

    data.forEach((/** @type {{ id: number; pages: any[]; }} */ guideData) => {
      let i = 0;
      const guide = {
        url: '',
        aliasUrl: '',
        pages: []
      }
      const guideUrl = `https://api.bib.umontreal.ca/guides/embed/${guideData.id}`

      guideData.pages
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

    });

    resolve(guides)

  })
}