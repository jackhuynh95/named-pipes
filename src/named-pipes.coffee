crypto = require 'crypto'
EventEmitter = require('events').EventEmitter
net = require 'net'

module.exports =
	listen: (pipeName) ->
		new PipeEmitter(pipeName, false, true)

	connect: (pipeName) ->
		new PipeEmitter(pipeName, false, false)

class PipeEmitter extends EventEmitter
	clients: {}

	constructor: (@pipeName, @listenOnSub, @listen) ->
		super

		pipePrefix = "\\\\.\\pipe\\"

		if (@pipeName.includes(pipePrefix)) 
			@pipeAddress = "#{@pipeName}"
		else 
			@pipeAddress = "#{pipePrefix}#{@pipeName}"

		if @listenOnSub
			hash = crypto.createHash('sha1')
			hash.update(process.hrtime().toString())
			@subKey = hash.digest('hex')

		@listenToPipe() if @listen

	listenToPipe: ->
		@listenPipe = net.createServer (stream) => @createStream(stream)

		if @listenOnSub
			@send 'npmsg:connect-to-subkey', @subKey
			@listenPipe.listen @pipeAddress + "-" + @subKey
		else
			@listenPipe.listen @pipeAddress

	createStream: (stream) ->
		stream.on 'data', (str) => @handleWrite(str)

	handleWrite: (str) ->
		obj = JSON.parse(str.toString())

		obj.arguments.unshift(obj.event)

		if obj.subKey
			@handleMessageFromClient(obj)
		else
			@emit.apply this, obj.arguments

	send: (event, data = null, allowSubKey = false) ->
		new Promise (resolve, reject) =>
			obj = data

			obj.event = event if event
			obj.subKey = @subKey if (allowSubKey && @subKey)

			pipe = net.connect(@pipeAddress, () -> resolve("connected")).on('error', (err) -> reject(err) )
			pipe.write('RIG,' + JSON.stringify(obj)) if !!obj
			pipe.end()

	handleMessageFromClient: (obj) ->
		unless @clients[obj.subKey]
			@clients[obj.subKey] = new PipeEmitter(@pipeName + "-" + obj.subKey, false, false)

		if obj.event == 'npmsg:connect-to-subkey'
			@emit 'connect', @clients[obj.subKey]
		else
			@clients[obj.subKey].emit.apply(@clients[obj.subKey], obj.arguments)
