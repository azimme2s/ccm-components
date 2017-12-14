ccm.files[ "configs.js" ] = {
  "position": "right",
  "demo": {
    data: { store: [ 'ccm.store', { 'store': 'feedback', 'url': 'https://ccm.inf.h-brs.de' } ], key: 'demo' },
  },

  "localhost": {
    "from_above": "30%",
    "position": "right",
    data: { store: [ 'ccm.store', { 'store': 'feedback', 'url': 'http://localhost:8080' } ], key: 'demo' }
  },

  "local": {
    "from_above": "30%",
    "position": "right",
    data: { store: [ 'ccm.store', { 'store': 'feedback', 'url': 'http://localhost:8080' } ] },
  }

};