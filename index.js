let currentTimeoutId = undefined
let isEnabled = false
let controller = undefined
let messagePorts = new Set()

exports.loadPlugin = async function(gridController, persistedData) {
    controller = gridController
    isEnabled = true
    runLoop()
}

exports.unloadPlugin = async function() {
    controller = undefined
    messagePorts.forEach((port) => port.close())
    messagePorts.clear()
    cancelLoop()
}

exports.addMessagePort = async function(port) {
    port.on("message", (e) => {
        onMessage(port, e.data)
    })
    
    messagePorts.add(port)
    port.on("close", () => {
        messagePorts.delete(port)
    })
    port.start()
}

async function onMessage(port, data) {
    if (data.type === 'request-echo'){
        port.postMessage({
            type: 'echo',
			message: 'Echo message'
        })
    }
}

async function runLoop(){
    if (!isEnabled) return

	
    messagePorts.forEach((port) => port.postMessage({
		type: 'echo',
		message: 'Loop message'
	}))
    currentTimeoutId = setTimeout(runLoop, 2000)
}

function cancelLoop(){
    isEnabled = false
    clearTimeout(currentTimeoutId)
}
