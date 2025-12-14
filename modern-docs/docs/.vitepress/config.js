export default {
  title: 'Tuva Data Tools',
  description: 'API Documentation and Guides',
  head: [
    ['script', { src: 'https://code.jquery.com/jquery-3.2.1.min.js' }],
    ['script', { src: 'https://unpkg.com/react@18/umd/react.development.js' }],
    ['script', { src: 'https://unpkg.com/react-dom@18/umd/react-dom.development.js' }],
    ['link', { rel: 'stylesheet', href: '/assets/tools/tuva-data-tools.min.css' }],
    ['script', { src: '/assets/tools/tuva-data-tools.min.js' }]
  ],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/quick-start' },
      { text: 'Playground', link: '/playground' },
      { text: 'API', link: '/api/' },
      { text: 'v2.3.0', link: 'https://tuvalabs.com/changelogs/data-exploration/#v2.3.0' }
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Quick Start', link: '/guide/quick-start' },
          { text: 'Playground', link: '/playground' },
          { text: 'Initialized with Data', link: '/guide/initialized-with-data' },
          { text: 'Initialized without Data', link: '/guide/initialized-without-data' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/TuvaLabs/tuvalabs.github.io' }
    ]
  }
}
