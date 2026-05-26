export default {
  title: 'Data Tools',
  description: 'API Documentation and Guides',
  head: [
    ['link', { rel: 'icon', href: '/assets/images/favicon.ico' }],
    ['script', { src: 'https://code.jquery.com/jquery-3.2.1.min.js' }],
    ['script', { src: 'https://unpkg.com/react@18/umd/react.development.js' }],
    ['script', { src: 'https://unpkg.com/react-dom@18/umd/react-dom.development.js', defer: false }],
    ['link', { rel: 'stylesheet', href: 'https://tools.tuvalabs.com/data-exploration/tools-docs/tuva-data-tools.min.css' }],
    ['script', { src: 'https://tools.tuvalabs.com/data-exploration/tools-docs/tuva-data-tools.min.js', defer: false }]
  ],
  themeConfig: {
    logo: { light: '/assets/images/tuva-logo-green.png', dark: '/assets/images/tuva-logo-white.png' },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/quick-start' },
      { text: 'API', link: '/api/' },
      { text: 'Playground', link: '/playground' },
      { text: 'Changelog', link: 'https://tuvalabs.com/changelogs/data-exploration/' }
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
              items: [
                { text: 'Prerequisites', link: '/guide/quick-start#prerequisites' },
                { text: 'Import Dependencies', link: '/guide/quick-start#step-1-import-dependencies' },
                { text: 'Add Tuva Data Tools', link: '/guide/quick-start#step-2-add-tuva-data-tools' },
                { text: 'Prepare Your Data', link: '/guide/quick-start#step-3-prepare-your-data' },
                { text: 'Create the Component', link: '/guide/quick-start#step-4-create-the-component' },
                { text: 'Using the API', link: '/guide/quick-start#step-5-using-the-api' },
                { text: 'Try It Out', link: '/guide/quick-start#try-it-out' },
                { text: 'Complete Example', link: '/guide/quick-start#complete-example' },
                { text: 'Next Steps', link: '/guide/quick-start#next-steps' }
              ]
            },
            { 
              text: 'Developer Tools', 
              link: '/guide/developer-tools',
              items: [
                { text: 'Code Snippets', link: '/guide/developer-tools#code-snippets' },
                { text: 'Browser Console Helpers', link: '/guide/developer-tools#browser-console-helpers' },
                { text: 'React Integration Examples', link: '/guide/developer-tools#react-integration-examples' },
                { text: 'Performance Tips', link: '/guide/developer-tools#performance-tips' },
                { text: 'Common Patterns', link: '/guide/developer-tools#common-patterns' },
                { text: 'Testing Utilities', link: '/guide/developer-tools#testing-utilities' },
                { text: 'Troubleshooting', link: '/guide/developer-tools#troubleshooting' },
                { text: 'Additional Resources', link: '/guide/developer-tools#additional-resources' }
              ]
            }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            {
              text: 'Configuration',
              link: '/api/configuration',
              collapsed: false,
              items: [
                { text: 'changeTheme', link: '/api/configuration#changetheme' },
                { text: 'setGridLines', link: '/api/configuration#setgridlines' },
                { text: 'setFontSize', link: '/api/configuration#setfontsize' },
                { text: 'setCaseSize', link: '/api/configuration#setcasesize' },
                { text: 'setAnimation', link: '/api/configuration#setanimation' },
                { text: 'setPlotTitleVisible', link: '/api/configuration#setplottitlevisible' },
                { text: 'setStatsLabels', link: '/api/configuration#setstatslabels' },
                { text: 'setAttributeKeyboardSupport', link: '/api/configuration#setattributekeyboardsupport' },
                { text: 'Other Configuration Methods', link: '/api/configuration#other-configuration-methods' },
                { text: 'Complete Configuration Example', link: '/api/configuration#complete-configuration-example' }
              ]
            },
            { text: 'Data Methods', link: '/api/data' },
            { text: 'Plot State', link: '/api/plot-state' },
            { text: 'Utility Methods', link: '/api/utility' },
            {
              text: 'Iframe Bridge',
              link: '/api/iframe',
              collapsed: false,
              items: [
                { text: 'Wiring the hook', link: '/api/iframe#wiring-the-hook' },
                { text: 'Options', link: '/api/iframe#options' },
                { text: 'Return value', link: '/api/iframe#return-value' },
                { text: 'Message protocol — new API', link: '/api/iframe#message-protocol-new-api' },
                { text: 'Parent-side recipe', link: '/api/iframe#parent-side-recipe' },
                { text: 'Message protocol — legacy API', link: '/api/iframe#message-protocol-legacy-api' },
                { text: 'Notes & gotchas', link: '/api/iframe#notes-gotchas' }
              ]
            }
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
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/TuvaLabs/tuvalabs.github.io' }
    // ],
    search: {
      provider: 'local'
    },
    footer: {
      message: 'Tuva Data Tools Documentation',
      copyright: `© ${new Date().getFullYear()} Tuva Labs Inc.`
    }
  }
}
