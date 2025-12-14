export default {
  title: 'Tuva Data Tools',
  description: 'API Documentation and Guides',
  head: [
    ['script', { src: 'https://code.jquery.com/jquery-3.2.1.min.js' }],
    ['script', { src: 'https://unpkg.com/react@18/umd/react.development.js' }],
    ['script', { src: 'https://unpkg.com/react-dom@18/umd/react-dom.development.js', defer: true }],
    ['link', { rel: 'stylesheet', href: '/assets/tools/tuva-data-tools.min.css' }],
    ['script', { src: '/assets/tools/tuva-data-tools.min.js', defer: true }]
  ],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/quick-start' },
      { text: 'API', link: '/api/' },
      { text: 'Playground', link: '/playground' },
      { text: 'v2.3.0', link: 'https://tuvalabs.com/changelogs/data-exploration/#v2.3.0' }
    ],
    outline: {
      level: [2, 3],
      label: 'On this page'
    },
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            {
              text: 'Quick Start',
              link: '/guide/quick-start',
              collapsed: false,
              items: [
                { text: 'Prerequisites', link: '/guide/quick-start#prerequisites' },
                { text: 'Step 1: Import Dependencies', link: '/guide/quick-start#step-1-import-dependencies' },
                { text: 'Step 2: Add Tuva Data Tools', link: '/guide/quick-start#step-2-add-tuva-data-tools' },
                { text: 'Step 3: Prepare Your Data', link: '/guide/quick-start#step-3-prepare-your-data' },
                { text: 'Step 4: Create the Component', link: '/guide/quick-start#step-4-create-the-component' },
                { text: 'Step 5: Using the API', link: '/guide/quick-start#step-5-using-the-api' },
                { text: 'Try It Out', link: '/guide/quick-start#try-it-out' },
                { text: 'Complete Example', link: '/guide/quick-start#complete-example' },
                { text: 'Next Steps', link: '/guide/quick-start#next-steps' }
              ]
            },
            { text: 'Developer Tools', link: '/guide/developer-tools' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Configuration', link: '/api/configuration' },
            { text: 'Data Methods', link: '/api/data' },
            { text: 'Plot State', link: '/api/plot-state' },
            { text: 'Utility Methods', link: '/api/utility' }
          ]
        }
      ],
      '/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Playground', link: '/playground' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/TuvaLabs/tuvalabs.github.io' }
    ],
    search: {
      provider: 'local'
    },
    footer: {
      message: 'Tuva Data Tools Documentation',
      copyright: 'Copyright © Tuva Labs'
    }
  }
}
