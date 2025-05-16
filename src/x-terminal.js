/** @babel */
/** @module x-terminal */
/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * Copyright 2017-2018 Andres Mejia <amejia004@gmail.com>. All Rights Reserved.
 * Copyright (c) 2020 UziTech All Rights Reserved.
 * Copyright (c) 2020 bus-stop All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { CompositeDisposable } from 'atom'

import { CONFIG_DATA } from './config'
import { recalculateActive } from './utils'
import { XTerminalElementImpl } from './element'
import { XTerminalModel, isXTerminalModel } from './model'
import { X_TERMINAL_BASE_URI, XTerminalProfilesSingleton } from './profiles'
import { XTerminalProfileMenuElementImpl } from './profile-menu-element'
import { XTerminalProfileMenuModel } from './profile-menu-model'
import { XTerminalDeleteProfileElementImpl } from './delete-profile-element'
import { XTerminalDeleteProfileModel } from './delete-profile-model'
import { XTerminalOverwriteProfileElementImpl } from './overwrite-profile-element'
import { XTerminalOverwriteProfileModel } from './overwrite-profile-model'
import { XTerminalSaveProfileElementImpl } from './save-profile-element'
import { XTerminalSaveProfileModel } from './save-profile-model'

// Shim Array.prototype.at as required by marked
// This only has an effect at or below Pulsar 1.128.0 ie electron 12/node 14/chrome 92
// See https://caniuse.com/mdn-javascript_builtins_array_at under Chrome header
// and https://github.com/markedjs/marked/issues/3546#issuecomment-2545886874 for the fix
import at from 'array.prototype.at';
at.shim();

import { URL } from 'whatwg-url'

const XTerminalSingletonSymbol = Symbol('XTerminalSingleton sentinel')

class XTerminalSingleton {
	constructor (symbolCheck) {
		if (XTerminalSingletonSymbol !== symbolCheck) {
			throw new Error('XTerminalSingleton cannot be instantiated directly.')
		}
	}

	static get instance () {
		if (!this[XTerminalSingletonSymbol]) {
			this[XTerminalSingletonSymbol] = new XTerminalSingleton(XTerminalSingletonSymbol)
		}
		return this[XTerminalSingletonSymbol]
	}

	activate (state) {
		// Load profiles configuration.
		this.profilesSingleton = XTerminalProfilesSingleton.instance

		// Reset base profile in case this package was deactivated then
		// reactivated.
		this.profilesSingleton.resetBaseProfile()

		// Disposables for this plugin.
		this.disposables = new CompositeDisposable()

		// Set holding all terminals available at any moment.
		this.terminals_set = new Set()

		// Monitor for changes to all config values.
		for (const data of CONFIG_DATA) {
			this.disposables.add(atom.config.onDidChange(data.keyPath, ({ newValue, oldValue }) => {
				this.profilesSingleton.resetBaseProfile()
			}))
		}
		// Monitor for editor.fontFamily changes for the useEditorFont setting.
		this.disposables.add(atom.config.onDidChange('editor.fontFamily', ({ newValue, oldValue }) => {
			this.profilesSingleton.resetBaseProfile()
		}))

		this.disposables.add(
			// Register view provider for terminal emulator item.
			atom.views.addViewProvider(XTerminalModel, (atomXtermModel) => {
				const atomXtermElement = new XTerminalElementImpl()
				atomXtermElement.initialize(atomXtermModel)
				return atomXtermElement
			}),
			// Register view provider for terminal emulator profile menu item.
			atom.views.addViewProvider(XTerminalProfileMenuModel, (atomXtermProfileMenuModel) => {
				const atomXtermProfileMenuElement = new XTerminalProfileMenuElementImpl()
				atomXtermProfileMenuElement.initialize(atomXtermProfileMenuModel)
				return atomXtermProfileMenuElement
			}),
			// Register view profile for modal items.
			atom.views.addViewProvider(XTerminalDeleteProfileModel, (atomXtermDeleteProfileModel) => {
				const atomXtermDeleteProfileElement = new XTerminalDeleteProfileElementImpl()
				atomXtermDeleteProfileElement.initialize(atomXtermDeleteProfileModel)
				return atomXtermDeleteProfileElement
			}),
			atom.views.addViewProvider(XTerminalOverwriteProfileModel, (atomXtermOverwriteProfileModel) => {
				const atomXtermOverwriteProfileElement = new XTerminalOverwriteProfileElementImpl()
				atomXtermOverwriteProfileElement.initialize(atomXtermOverwriteProfileModel)
				return atomXtermOverwriteProfileElement
			}),
			atom.views.addViewProvider(XTerminalSaveProfileModel, (atomXtermSaveProfileModel) => {
				const atomXtermSaveProfileElement = new XTerminalSaveProfileElementImpl()
				atomXtermSaveProfileElement.initialize(atomXtermSaveProfileModel)
				return atomXtermSaveProfileElement
			}),

			// Add opener for terminal emulator item.
			atom.workspace.addOpener((uri) => {
				if (uri.startsWith(X_TERMINAL_BASE_URI)) {
					const item = new XTerminalModel({
						uri,
						terminals_set: this.terminals_set,
					})
					return item
				}
			}),

			// Set callback to run on current and future panes.
			atom.workspace.observePanes((pane) => {
				// In callback, set another callback to run on current and future items.
				this.disposables.add(pane.observeItems((item) => {
					// In callback, set current pane for terminal items.
					if (isXTerminalModel(item)) {
						item.setNewPane(pane)
					}
					recalculateActive(this.terminals_set)
				}))
				recalculateActive(this.terminals_set)
			}),

			// Add callbacks to run for current and future active items on active panes.
			atom.workspace.observeActivePaneItem((item) => {
				// In callback, focus specifically on terminal when item is terminal item.
				if (isXTerminalModel(item)) {
					item.focusOnTerminal()
				}
				recalculateActive(this.terminals_set)
			}),

			atom.workspace.getRightDock().observeVisible((visible) => {
				if (visible) {
					const item = atom.workspace.getRightDock().getActivePaneItem()
					if (isXTerminalModel(item)) {
						item.focusOnTerminal()
					}
				}
				recalculateActive(this.terminals_set)
			}),

			atom.workspace.getLeftDock().observeVisible((visible) => {
				if (visible) {
					const item = atom.workspace.getLeftDock().getActivePaneItem()
					if (isXTerminalModel(item)) {
						item.focusOnTerminal()
					}
				}
				recalculateActive(this.terminals_set)
			}),

			atom.workspace.getBottomDock().observeVisible((visible) => {
				if (visible) {
					const item = atom.workspace.getBottomDock().getActivePaneItem()
					if (isXTerminalModel(item)) {
						item.focusOnTerminal()
					}
				}
				recalculateActive(this.terminals_set)
			}),

			// Add commands.
			atom.commands.add('atom-workspace', {
				'x-terminal-reloaded:open': () => this.open(
					this.profilesSingleton.generateNewUri(),
					this.addDefaultPosition(),
				),
				'x-terminal-reloaded:open-center': () => this.openInCenterOrDock(atom.workspace),
				'x-terminal-reloaded:open-split-up': () => this.open(
					this.profilesSingleton.generateNewUri(),
					{ split: 'up' },
				),
				'x-terminal-reloaded:open-split-down': () => this.open(
					this.profilesSingleton.generateNewUri(),
					{ split: 'down' },
				),
				'x-terminal-reloaded:open-split-left': () => this.open(
					this.profilesSingleton.generateNewUri(),
					{ split: 'left' },
				),
				'x-terminal-reloaded:open-split-right': () => this.open(
					this.profilesSingleton.generateNewUri(),
					{ split: 'right' },
				),
				'x-terminal-reloaded:open-split-bottom-dock': () => this.openInCenterOrDock(atom.workspace.getBottomDock()),
				'x-terminal-reloaded:open-split-left-dock': () => this.openInCenterOrDock(atom.workspace.getLeftDock()),
				'x-terminal-reloaded:open-split-right-dock': () => this.openInCenterOrDock(atom.workspace.getRightDock()),
				'x-terminal-reloaded:toggle-profile-menu': () => this.toggleProfileMenu(),
				'x-terminal-reloaded:reorganize': () => this.reorganize('current'),
				'x-terminal-reloaded:reorganize-top': () => this.reorganize('top'),
				'x-terminal-reloaded:reorganize-bottom': () => this.reorganize('bottom'),
				'x-terminal-reloaded:reorganize-left': () => this.reorganize('left'),
				'x-terminal-reloaded:reorganize-right': () => this.reorganize('right'),
				'x-terminal-reloaded:reorganize-bottom-dock': () => this.reorganize('bottom-dock'),
				'x-terminal-reloaded:reorganize-left-dock': () => this.reorganize('left-dock'),
				'x-terminal-reloaded:reorganize-right-dock': () => this.reorganize('right-dock'),
				'x-terminal-reloaded:close-all': () => this.exitAllTerminals(),
				'x-terminal-reloaded:insert-selected-text': () => this.insertSelection(),
				'x-terminal-reloaded:run-selected-text': () => this.runSelection(),
				'x-terminal-reloaded:focus': () => this.focus(),
				'x-terminal-reloaded:focus-next': () => this.focusNext(),
				'x-terminal-reloaded:focus-previous': () => this.focusPrev(),
			}),
			atom.commands.add('atom-text-editor, .tree-view, .tab-bar', {
				'x-terminal-reloaded:open-context-menu': {
					hiddenInCommandPalette: true,
					didDispatch: ({ target }) => this.open(
						this.profilesSingleton.generateNewUri(),
						this.addDefaultPosition({ target }),
					),
				},
				'x-terminal-reloaded:open-center-context-menu': {
					hiddenInCommandPalette: true,
					didDispatch: ({ target }) => this.openInCenterOrDock(
						atom.workspace,
						{ target },
					),
				},
				'x-terminal-reloaded:open-split-up-context-menu': {
					hiddenInCommandPalette: true,
					didDispatch: ({ target }) => this.open(
						this.profilesSingleton.generateNewUri(),
						{ split: 'up', target },
					),
				},
				'x-terminal-reloaded:open-split-down-context-menu': {
					hiddenInCommandPalette: true,
					didDispatch: ({ target }) => this.open(
						this.profilesSingleton.generateNewUri(),
						{ split: 'down', target },
					),
				},
				'x-terminal-reloaded:open-split-left-context-menu': {
					hiddenInCommandPalette: true,
					didDispatch: ({ target }) => this.open(
						this.profilesSingleton.generateNewUri(),
						{ split: 'left', target },
					),
				},
				'x-terminal-reloaded:open-split-right-context-menu': {
					hiddenInCommandPalette: true,
					didDispatch: ({ target }) => this.open(
						this.profilesSingleton.generateNewUri(),
						{ split: 'right', target },
					),
				},
				'x-terminal-reloaded:open-split-bottom-dock-context-menu': {
					hiddenInCommandPalette: true,
					didDispatch: ({ target }) => this.openInCenterOrDock(
						atom.workspace.getBottomDock(),
						{ target },
					),
				},
				'x-terminal-reloaded:open-split-left-dock-context-menu': {
					hiddenInCommandPalette: true,
					didDispatch: ({ target }) => this.openInCenterOrDock(
						atom.workspace.getLeftDock(),
						{ target },
					),
				},
				'x-terminal-reloaded:open-split-right-dock-context-menu': {
					hiddenInCommandPalette: true,
					didDispatch: ({ target }) => this.openInCenterOrDock(
						atom.workspace.getRightDock(),
						{ target },
					),
				},
			}),
			atom.commands.add('x-terminal-reloaded', {
				'x-terminal-reloaded:close': () => this.close(),
				'x-terminal-reloaded:restart': () => this.restart(),
				'x-terminal-reloaded:copy': () => this.copy(),
				'x-terminal-reloaded:paste': () => this.paste(),
				'x-terminal-reloaded:unfocus': () => this.unfocus(),
				'x-terminal-reloaded:clear': () => this.clear(),
			}),
		)
	}

	deactivate () {
		this.exitAllTerminals()
		this.disposables.dispose()
	}

	deserializeXTerminalModel (serializedModel, atomEnvironment) {
		const pack = atom.packages.enablePackage('x-terminal-reloaded')
		pack.preload()
		pack.activateNow()
		const allowRelaunchingTerminalsOnStartup = atom.config.get('x-terminal-reloaded.terminalSettings.allowRelaunchingTerminalsOnStartup')
		if (!allowRelaunchingTerminalsOnStartup) {
			return
		}
		const url = new URL(serializedModel.uri)
		const relaunchTerminalOnStartup = url.searchParams.get('relaunchTerminalOnStartup')
		if (relaunchTerminalOnStartup === 'false') {
			return
		}
		return new XTerminalModel({
			uri: url.href,
			terminals_set: this.terminals_set,
		})
	}

	openInCenterOrDock (centerOrDock, options = {}) {
		const pane = centerOrDock.getActivePane()
		if (pane) {
			options.pane = pane
		}
		return this.open(
			this.profilesSingleton.generateNewUri(),
			options,
		)
	}

	getPath (target) {
		if (!target) {
			const paths = atom.project.getPaths()
			if (paths && paths.length > 0) {
				return paths[0]
			}
			return null
		}

		const treeView = target.closest('.tree-view')
		if (treeView) {
			// called from treeview
			const selected = treeView.querySelector('.selected > .list-item > .name, .selected > .name')
			if (selected) {
				return selected.dataset.path
			}
			return null
		}

		const tab = target.closest('.tab-bar > .tab')
		if (tab) {
			// called from tab
			const title = tab.querySelector('.title')
			if (title && title.dataset.path) {
				return title.dataset.path
			}
			return null
		}

		const textEditor = target.closest('atom-text-editor')
		if (textEditor && typeof textEditor.getModel === 'function') {
			// called from atom-text-editor
			const model = textEditor.getModel()
			if (model && typeof model.getPath === 'function') {
				return model.getPath()
			}
			return null
		}

		return null
	}

	refitAllTerminals () {
		const currentActivePane = atom.workspace.getActivePane()
		const currentActiveItem = currentActivePane.getActiveItem()
		for (const terminal of this.terminals_set) {
			// To refit, simply bring the terminal in focus in order for the
			// resize event to refit the terminal.
			const paneActiveItem = terminal.pane.getActiveItem()
			terminal.pane.getElement().focus()
			terminal.pane.setActiveItem(terminal)
			terminal.pane.setActiveItem(paneActiveItem)
		}
		currentActivePane.getElement().focus()
		currentActivePane.setActiveItem(currentActiveItem)
	}

	exitAllTerminals () {
		for (const terminal of this.terminals_set) {
			terminal.exit()
		}
	}

	getSelectedText () {
		const editor = atom.workspace.getActiveTextEditor()
		if (!editor) {
			return ''
		}

		let selectedText = ''
		const selection = editor.getSelectedText()
		if (selection) {
			selectedText = selection.replace(/[\r\n]+$/, '')
		} else {
			const cursor = editor.getCursorBufferPosition()
			if (cursor) {
				const line = editor.lineTextForBufferRow(cursor.row)
				selectedText = line
				editor.moveDown(1)
			}
		}

		return selectedText
	}

	getActiveTerminal () {
		const terminals = [...this.terminals_set]
		return terminals.find(t => t.isActiveTerminal())
	}

	performOnActiveTerminal (operation) {
		const terminal = this.getActiveTerminal()
		if (terminal) {
			operation(terminal)
		}
	}

	insertSelection () {
		const selection = this.getSelectedText()
		if (selection) {
			this.performOnActiveTerminal(t => t.pasteToTerminal(selection))
		}
	}

	runSelection () {
		const selection = this.getSelectedText()
		if (selection) {
			this.performOnActiveTerminal(t => t.runCommand(selection))
		}
	}

	async open (uri, options = {}) {
		const url = new URL(uri)
		if (url.searchParams.get('relaunchTerminalOnStartup') === null) {
			if (!this.profilesSingleton.getBaseProfile().relaunchTerminalOnStartup) {
				url.searchParams.set('relaunchTerminalOnStartup', false)
			}
		}

		if (options.target) {
			const target = this.getPath(options.target)
			if (target) {
				url.searchParams.set('cwd', target)
			}
		}

		return atom.workspace.open(url.href, options)
	}

	/**
	 * Service function which is a wrapper around 'atom.workspace.open()'. The
	 * only difference with this function from 'atom.workspace.open()' is that it
	 * accepts a profile Object as the first argument.
	 *
	 * @async
	 * @function
	 * @param {Object} profile Profile data to use when opening terminal.
	 * @param {Object} options Options to pass to call to 'atom.workspace.open()'.
	 * @return {XTerminalModel} Instance of XTerminalModel.
	 */
	async openTerminal (profile, options = {}) {
		options = this.addDefaultPosition(options)
		return this.open(
			XTerminalProfilesSingleton.instance.generateNewUrlFromProfileData(profile),
			options,
		)
	}

	/**
	 * Service function which opens a terminal and runs the commands.
	 *
	 * @async
	 * @function
	 * @param {string[]} commands Commands to run in the terminal.
	 * @return {XTerminalModel} Instance of XTerminalModel.
	 */
	async runCommands (commands) {
		let terminal
		if (atom.config.get('x-terminal-reloaded.terminalSettings.runInActive')) {
			terminal = this.getActiveTerminal()
		}

		if (!terminal) {
			const options = this.addDefaultPosition()
			terminal = await this.open(
				XTerminalProfilesSingleton.instance.generateNewUri(),
				options,
			)
		}

		await terminal.element.initializedPromise
		for (const command of commands) {
			terminal.runCommand(command)
		}
	}

	addDefaultPosition (options = {}) {
		const position = atom.config.get('x-terminal-reloaded.terminalSettings.defaultOpenPosition')
		switch (position) {
			case 'Center': {
				const pane = atom.workspace.getActivePane()
				if (pane && !('pane' in options)) {
					options.pane = pane
				}
				break
			}
			case 'Split Up':
				if (!('split' in options)) {
					options.split = 'up'
				}
				break
			case 'Split Down':
				if (!('split' in options)) {
					options.split = 'down'
				}
				break
			case 'Split Left':
				if (!('split' in options)) {
					options.split = 'left'
				}
				break
			case 'Split Right':
				if (!('split' in options)) {
					options.split = 'right'
				}
				break
			case 'Bottom Dock': {
				const pane = atom.workspace.getBottomDock().getActivePane()
				if (pane && !('pane' in options)) {
					options.pane = pane
				}
				break
			}
			case 'Left Dock': {
				const pane = atom.workspace.getLeftDock().getActivePane()
				if (pane && !('pane' in options)) {
					options.pane = pane
				}
				break
			}
			case 'Right Dock': {
				const pane = atom.workspace.getRightDock().getActivePane()
				if (pane && !('pane' in options)) {
					options.pane = pane
				}
				break
			}
		}
		return options
	}

	/**
	 * Function providing service functions offered by 'atom-xterm' service.
	 *
	 * @function
	 * @returns {Object} Object holding service functions.
	 */
	provideAtomXtermService () {
		return {
			openTerminal: async (...args) => {
				return this.openTerminal(...args)
			},
		}
	}

	/**
	 * Function providing service functions offered by 'platformioIDETerminal' service.
	 *
	 * @function
	 * @returns {Object} Object holding service functions.
	 */
	providePlatformIOIDEService () {
		return {
			updateProcessEnv (vars) {
				for (const name in vars) {
					process.env[name] = vars[name]
				}
			},
			run: (commands) => {
				return this.runCommands(commands)
			},
			getTerminalViews: () => {
				return this.terminals_set
			},
			open: () => {
				return this.openTerminal()
			},
		}
	}

	/**
	 * Function providing service functions offered by 'terminal' service.
	 *
	 * @function
	 * @returns {Object} Object holding service functions.
	 */
	provideTerminalService () {
		// for now it is the same as platformioIDETerminal service
		return this.providePlatformIOIDEService()
	}

	close () {
		this.performOnActiveTerminal(t => t.exit())
	}

	restart () {
		this.performOnActiveTerminal(t => t.restartPtyProcess())
	}

	copy () {
		this.performOnActiveTerminal(t => atom.clipboard.write(t.copyFromTerminal()))
	}

	paste () {
		this.performOnActiveTerminal(t => t.pasteToTerminal(atom.clipboard.read()))
	}

	unfocus () {
		atom.views.getView(atom.workspace).focus()
	}

	clear () {
		this.performOnActiveTerminal(t => t.clear())
	}

	focus () {
		if (this.terminals_set.size === 0) {
			this.openTerminal()
		} else {
			const activeTerminal = [...this.terminals_set].find(t => t.activeIndex === 0)
			activeTerminal.focusOnTerminal(true)
		}
	}

	focusNext () {
		if (this.terminals_set.size === 0) {
			this.openTerminal()
		} else {
			const terminals = [...this.terminals_set]
			let i = terminals.findIndex(t => t.activeIndex === 0) + 1
			if (i >= terminals.length) {
				i -= terminals.length
			}
			terminals[i].focusOnTerminal(true)
		}
	}

	focusPrev () {
		if (this.terminals_set.size === 0) {
			this.openTerminal()
		} else {
			const terminals = [...this.terminals_set]
			let i = terminals.findIndex(t => t.activeIndex === 0) - 1
			if (i < 0) {
				i += terminals.length
			}
			terminals[i].focusOnTerminal(true)
		}
	}

	toggleProfileMenu () {
		const item = atom.workspace.getActivePaneItem()
		if (isXTerminalModel(item)) {
			item.toggleProfileMenu()
		}
	}

	reorganize (orientation) {
		if (this.terminals_set.size === 0) {
			return
		}
		const activePane = atom.workspace.getActivePane()
		let activeItem = activePane.getActiveItem()
		let newPane
		switch (orientation) {
			case 'current':
				newPane = activePane
				break
			case 'top':
				newPane = activePane.findTopmostSibling().splitUp()
				break
			case 'bottom':
				newPane = activePane.findBottommostSibling().splitDown()
				break
			case 'left':
				newPane = activePane.findLeftmostSibling().splitLeft()
				break
			case 'right':
				newPane = activePane.findRightmostSibling().splitRight()
				break
			case 'bottom-dock':
				newPane = atom.workspace.getBottomDock().getActivePane()
				break
			case 'left-dock':
				newPane = atom.workspace.getLeftDock().getActivePane()
				break
			case 'right-dock':
				newPane = atom.workspace.getRightDock().getActivePane()
				break
			default:
				throw new Error('Unknown orientation: ' + orientation)
		}
		for (const item of this.terminals_set) {
			item.pane.moveItemToPane(item, newPane, -1)
		}
		if (isXTerminalModel(activeItem)) {
			if (atom.workspace.getPanes().length > 1) {
				// When reorganizing still leaves more than one pane in the
				// workspace, another pane that doesn't include the newly
				// reorganized terminal tabs needs to be focused in order for
				// the terminal views to get properly resized in the new pane.
				// All this is yet another quirk.
				for (const pane of atom.workspace.getPanes()) {
					if (pane !== activeItem.pane) {
						pane.getElement().focus()
						break
					}
				}
			}
			activeItem.pane.getElement().focus()
			activeItem.pane.setActiveItem(activeItem)
		} else if (activeItem instanceof HTMLElement) {
			activeItem.focus()
		} else if (typeof activeItem.getElement === 'function') {
			activeItem = activeItem.getElement()
			activeItem.focus()
		}
	}
}

export { config } from './config'

export function getInstance () {
	return XTerminalSingleton.instance
}

export function activate (state) {
	return XTerminalSingleton.instance.activate(state)
}

export function deactivate () {
	return XTerminalSingleton.instance.deactivate()
}

export function deserializeXTerminalModel (serializedModel, atomEnvironment) {
	return XTerminalSingleton.instance.deserializeXTerminalModel(
		serializedModel,
		atomEnvironment,
	)
}

export function provideAtomXtermService () {
	return XTerminalSingleton.instance.provideAtomXtermService()
}

export function providePlatformIOIDEService () {
	return XTerminalSingleton.instance.providePlatformIOIDEService()
}

export function provideTerminalService () {
	return XTerminalSingleton.instance.provideTerminalService()
}
