const path = require('path')

// constants
const EMPTY_CHANGED_TEXT = Object.freeze({ content: '', path: '' })
const EMPTY_INITIAL_TEXT = Object.freeze({ content: '' })
const MODAL_STATES = Object.freeze({
  OPEN: 'OPEN',
  NEW: 'NEW',
  RECENT: 'RECENT',
  NONE: 'NONE',
})
const CHANGE_FILE_TITLE = (name = 'Untitled.md') =>
  `Do you want to save the changes you made to "${name}"?`

// State, used in all the required files.

let openedFiles = []
let changedText = { ...EMPTY_CHANGED_TEXT }
let initialText = { ...EMPTY_INITIAL_TEXT }
let modalState = MODAL_STATES.NONE
let fileTitle = ''
let recentPath = ''

// Makeshift database
const recentFilesPath = path.resolve('./recently-open-files.txt')

require('./components/html-elements')
require('./components/open-files-helper')
require('./components/save-files-helper')

require('./components/edit-files')
require('./components/save-files')
require('./components/open-files')
require('./components/new-files')
require('./components/recent-files')
