    ██╗  ██╗  ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
    ╚██╗██╔╝  ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
     ╚███╔╝█████╗██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
     ██╔██╗╚════╝██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
    ██╔╝ ██╗     ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
    ╚═╝  ╚═╝     ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
                                                             ██████╗ ███████╗██╗      ██████╗  █████╗ ██████╗ ███████╗██████╗ 
                                                             ██╔══██╗██╔════╝██║     ██╔═══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗
                                                             ██████╔╝█████╗  ██║     ██║   ██║███████║██║  ██║█████╗  ██║  ██║
                                                             ██╔══██╗██╔══╝  ██║     ██║   ██║██╔══██║██║  ██║██╔══╝  ██║  ██║
                                                             ██║  ██║███████╗███████╗╚██████╔╝██║  ██║██████╔╝███████╗██████╔╝
                                                             ╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝╚═════╝ 
                                                                 


<br>
<p align="center">
  <a href="https://github.com/Spiker985/x-terminal-reloaded/actions/workflows/main.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/Spiker985/x-terminal-reloaded/main.yml?style=flat-square&logo=github&label=CI%20status" alt="actions status">
  </a>
  <a href="https://github.com/Spiker985/x-terminal-reloaded/tags">
    <img src="https://img.shields.io/github/tag/Spiker985/x-terminal-reloaded.svg?label=current%20version&style=flat-square" alt="version">
  </a>
  <a href="https://github.com/Spiker985/x-terminal-reloaded/stargazers">
    <img src="https://img.shields.io/github/stars/Spiker985/x-terminal-reloaded.svg?style=flat-square" alt="stars">
  </a>
  <a href="https://github.com/Spiker985/x-terminal-reloaded/network">
    <img src="https://img.shields.io/github/forks/Spiker985/x-terminal-reloaded.svg?style=flat-square" alt="forks">
  </a>
  <a href="https://pulsar-edit.dev/download.html">
    <img src="https://img.shields.io/cirrus/github/pulsar-edit/pulsar/master?label=Pulsar%20%28rolling%29&style=flat-square" alt="Pulsar download page">
  </a>
  <a href="https://web.pulsar-edit.dev/packages/x-terminal-reloaded">
    <img src="https://img.shields.io/badge/Pulsar%20package-entry-informational?style=flat-square">
  </a>
</p>
<h3 align="center">
  An xterm based Pulsar plugin for providing terminals inside your workspace!&nbsp;❤️
</h3>
<h5 align="center">A fork of
  <a href="https://web.pulsar-edit.dev/packages/atom-xterm">atom-xterm</a>
  and 
  <a href="https://web.pulsar-edit.dev/packages/x-terminal">x-terminal</a>
</h5>
<br>

![X-Terminal demo](https://cdn.statically.io/gh/Spiker985/x-terminal-reloaded/master/resources/x-terminal-demo.gif)

## Pulsar Built-in Terminal

Eventually, I'd like to transition this over to the [Pulsar repo](https://github.com/pulsar-edit/pulsar), however as of right now I'll maintain it separately because there's a lot on our plates over there.

# Installation

There are 3 ways to install this package:
1. Navigate to https://web.pulsar-edit.dev/packages/x-terminal-reloaded and click install.
2. Open Pulsar, open Settings (Ctrl + Shift + Comma), click on Install, search for `x-terminal-reloaded`
3. Install via CLI. `pulsar --package install x-terminal-reloaded` or `pulsar -p install x-terminal-reloaded`

## Opening Terminals

To open terminals, you can open them through the menu or through the available key bindings.

![X-Terminal menu](https://cdn.statically.io/gh/Spiker985/x-terminal-reloaded/master/resources/x-terminal-packages-menu.png)

See [the available key bindings](https://github.com/Spiker985/x-terminal-reloaded/blob/master/keymaps/x-terminal.json) for the x-terminal package.

There's also menu items available for opening terminals via right clicking on a
text editor or on a terminal.

Finally, terminal tabs are automatically reopened at the spot you placed them
when you last exited Pulsar.

## Active Terminal

The active terminal is the terminal that will be used when sending commands to
the terminal with commands like `x-terminal:insert-selected-text` and
`x-terminal:run-selected-text`

The active terminal will always have an astrix (`*`) in front of the title.
By default when a terminal is hidden it becomes inactive and the last used
visible terminal will become active. If there are no visible terminals none are
active.

The `Allow Hidden Terminal To Stay Active` setting will change the
default behavior and keep a terminal that is hidden active until another
terminal is focused.

## Organizing Terminals

To quickly organize your terminal tabs, simply use the main menu. You can also
find menu items by right-clicking on a terminal to organize your terminals.

And of course, there's the old fashion way of just moving the tabs where you
want them. Feel free to place your terminal tabs anywhere in your workspace to
include any of the docks.

![X-Terminal moving terminals demo](https://cdn.statically.io/gh/Spiker985/x-terminal-reloaded/master/resources/x-terminal-moving-terminals-demo.gif)

## Profiles

The x-terminal package supports saving and loading profiles. What this allows
you to do is save commonly used commands and settings for later use.

![X-Terminal profiles demo](https://cdn.statically.io/gh/Spiker985/x-terminal-reloaded/master/resources/x-terminal-profiles-demo.gif)

## Notifications

The x-terminal package provides notifications about terminal process exit
successes and failures. Notifications will appear in Pulsar's own notification
manager as well as on the terminal tab triggering the notification.

Success

![X-Terminal exit success](https://cdn.statically.io/gh/Spiker985/x-terminal-reloaded/master/resources/x-terminal-exit-success.png)

Failure

![X-Terminal exit failure](https://cdn.statically.io/gh/Spiker985/x-terminal-reloaded/master/resources/x-terminal-exit-failure.png)

There are also activity notifications for terminal tabs not in focus.

![X-Terminal activity notification](https://cdn.statically.io/gh/Spiker985/x-terminal-reloaded/master/resources/x-terminal-activity-notification.gif)

## Services

For plugin writers, the `x-terminal` package supports three services, `terminal`, `atom-xterm`, and `platformioIDETerminal`, which
can be used to easily open terminals. These methods are provided using Pulsar's [services](https://pulsar-edit.dev/docs/atom-archive/behind-atom/#interacting-with-other-packages-via-services)
API.

To use a service, add a consumer method to consume the service, or
rather a JavaScript object that provides methods to open terminals and run commands.

### 'terminal' service v1.0.0

The `terminal` service provides an object with `updateProcessEnv`, `run`, `getTerminalViews`, and `open` methods.

As an example on how to use the provided `run()` method, your
`package.json` should have the following.

```json
{
  "consumedServices": {
    "terminal": {
      "versions": {
        "^1.0.0": "consumeTerminalService"
      }
    }
  }
}
```

Your package's main module should then define a `consumeTerminalService`
method, for example.

```js
import { Disposable } from 'atom'

export default {
  terminalService: null,

  consumeTerminalService (terminalService) {
    this.terminalService = terminalService
    return new Disposable(() => {
      this.terminalService = null
    })
  },

  // . . .
}
```

Once the service is consumed, use the `run()` method that is provided
by the service, for example.

```js
// Launch `somecommand --foo --bar --baz` in a terminal.
this.terminalService.run([
   'somecommand --foo --bar --baz'
])
```

### 'atom-xterm' service v2.0.0

The `atom-xterm` service provides the
[openTerminal()](https://github.com/Spiker985/x-terminal-reloaded/blob/465d2909ea1e8457151bf5ddf9f57fc8404e10fe/src/x-terminal.js#L468) method. The `openTerminal()` method behaves just like Pulsar's
[open()](https://github.com/pulsar-edit/pulsar/blob/7d933c561f6f43def1dbb0408df9575e265f6e7d/src/workspace.js#L1077)
method except that the first argument must be a JSON object describing the
terminal profile that should be opened. Docs about this JSON object can be
found [here](https://github.com/Spiker985/x-terminal-reloaded/blob/465d2909ea1e8457151bf5ddf9f57fc8404e10fe/src/config.js#L26).

As an example on how to use the provided `openTerminal()` method, your
`package.json` should have the following.

```json
{
  "consumedServices": {
    "atom-xterm": {
      "versions": {
        "^2.0.0": "consumeAtomXtermService"
      }
    }
  }
}
```

Your package's main module should then define a `consumeAtomXtermService`
method, for example.

```js
import { Disposable } from 'atom'

export default {
  atomXtermService: null,

  consumeAtomXtermService (atomXtermService) {
    this.atomXtermService = atomXtermService
    return new Disposable(() => {
      this.atomXtermService = null
    })
  },

  // . . .
}
```

Once the service is consumed, use the `openTerminal()` method that is provided
by the service, for example.

```js
// Launch `somecommand --foo --bar --baz` in a terminal.
this.atomXtermService.openTerminal({
  command: 'somecommand',
  args: [
    '--foo',
    '--bar',
    '--baz'
  ]
})
```

### 'platformioIDETerminal' service v1.1.0

The `platformioIDETerminal` service provides an [object](https://github.com/Spiker985/x-terminal-reloaded/blob/465d2909ea1e8457151bf5ddf9f57fc8404e10fe/src/x-terminal.js#L579) with `updateProcessEnv`, `run`, `getTerminalViews`, and `open` methods.

As an example on how to use the provided `run()` method, your
`package.json` should have the following.

```json
{
  "consumedServices": {
    "platformioIDETerminal": {
      "versions": {
        "^1.1.0": "consumePlatformioIDETerminalService"
      }
    }
  }
}
```

Your package's main module should then define a `consumePlatformioIDETerminalService`
method, for example.

```js
import { Disposable } from 'atom'

export default {
  platformioIDETerminalService: null,

  consumePlatformioIDETerminalService (platformioIDETerminalService) {
    this.platformioIDETerminalService = platformioIDETerminalService
    return new Disposable(() => {
      this.platformioIDETerminalService = null
    })
  },

  // . . .
}
```

Once the service is consumed, use the `run()` method that is provided
by the service, for example.

```js
// Launch `somecommand --foo --bar --baz` in a terminal.
this.platformioIDETerminalService.run([
   'somecommand --foo --bar --baz'
])
```

# Development

Want to help develop x-terminal? Here's how to quickly get setup.

First clone the [x-terminal-reloaded repo](https://github.com/Spiker985/x-terminal-reloaded.git). This step does _not_ need to be done with `pulsar --package`, if you already have an existing clone.

```sh
pulsar --package develop x-terminal
```

This should clone the x-terminal-reloaded package into the `$HOME/github/x-terminal`
directory. Go into this directory (or your pre-existing directory) and install its dependencies.

```sh
cd $HOME/github/x-terminal
npm install
```

~You shouldn't need to rebuild any [node-pty](https://github.com/Tyriar/node-pty)
since they are pre-compiled, however in the event they aren't available,
you can rebuild them with:~

You will probably need to rebuild `node-pty` as Pulsar's current electron version is no longer LTS. Please do so with the following:

```sh
pulsar --package rebuild
```

Finally, open this directory in Pulsar's dev mode and hack away.

```sh
pulsar --dev
```

There's a test suite available for automated testing of the x-terminal package.
Simply go to `View > Developer > Run Package Specs` in Pulsar's main menu or
use the hotkey. You can run the full test suite (which includes running lint
tools) via command-line by running `npm run test` inside the x-terminal
directory.

Various lint tools are being used to keep the code "beautified". To run only
the lint tools, simply run `npm run lint`.

## Pull Requests

Whenever you're ready to submit a pull request, be sure to submit it
against a fork of the main [x-terminal repo](https://github.com/Spiker985/x-terminal-reloaded)
master branch that you'll own. Fork the repo using Github and make note of the
new `git` URL. Set this new git URL as the URL for the `origin` remote in your
already cloned git repo is follows. You can also validate it with `git remote --verbose`

```sh
git remote set-url upstream "https://github.com/Spiker985/x-terminal-reloaded.git"
git remote set-url origin ${NEW_GIT_URL}
```

Ensure your new changes passes the test suite by running `npm run test`.
Afterwards, push your changes to your repo and then use Github to submit a new
pull request.

## [xterm.js](https://github.com/xtermjs/xterm.js)

The terminals that users interact with in this package is made possible with
major help from the [xterm.js](https://github.com/xtermjs/xterm.js) library. As
such, often times it's necessary to make changes to xterm.js in order to fix
some bug or implement new features.

If you want to work on xterm.js for the benefit of a bug fix or feature to be
supported in x-terminal, here's how you can quickly get setup.

First make a fork of [xterm.js](https://github.com/xtermjs/xterm.js). Next,
clone your newly created fork as follows.

```sh
git clone ${YOUR_XTERMJS_FORK} ${HOME}/github/xterm.js
```

Go into your newly cloned repo for xterm.js.

```sh
cd ${HOME}/github/xterm.js
```

Install all needed dependencies.

```sh
npm install
```

Build xterm.js.

```sh
npm run build
```

Ensure the test suite passes.

```sh
npm run test
npm run lint
```

Add a global link for xterm.js to your system.

```sh
npm link
```

Inside your x-terminal directory, link against the global `xterm` link.

```sh
cd ${HOME}/github/x-terminal
npm link xterm
```

Finally, perform a rebuild using pulsar inside the x-terminal directory.

```sh
pulsar --package rebuild
```

You're all set for developing xterm.js. Hack away in your xterm.js directory,
run `npm run build`, then reload your Pulsar window to see the changes to your
terminals.

# Credits and Legal

Click for copyright and license info about this package.

[![LICENSE and © INFO](https://img.shields.io/badge/©%20&#38;%20LICENSE-MIT-blue.svg?longCache=true&style=flat-square)](LICENSE)

# Feedback

Need to submit a bug report? Have a new feature you want to see implemented in
*x-terminal*? Please feel free to submit them through the appropriate
[issue template](https://github.com/Spiker985/x-terminal-reloaded/issues/new/choose).

For bug reports, please provide images or demos showing your issues if you can.
