function volumeMeter(audioContext, averaging) {
	//создаем 
	var processor = audioContext.createScriptProcessor(1024);
	processor.onaudioprocess = volumeAudioProcess;
	processor.volume = 0;
	processor.averaging = averaging || 0.95;
	// this will have no effect, since we don't copy the input to the output,
	// but works around a current Chrome bug.
	processor.connect(audioContext.destination);
	return processor;
}

function volumeAudioProcess(event) {
	var buf = event.inputBuffer.getChannelData(0);
	var bufLength = buf.length;
	var sum = 0;
	var x;
	// Do a root-mean-square on the samples: sum up the squares...
	for (var i = 0; i < bufLength; i++) {
		x = buf[i];
		sum += x * x;
	}
	// ... then take the square root of the sum.
	var rms = Math.sqrt(sum / bufLength);
	this.volume = Math.max(rms, this.volume * this.averaging);
}

export default volumeMeter;