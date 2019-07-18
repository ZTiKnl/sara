    Hi Sara, how are you?
    (prompt / response) All systems operational!
    How is the weather in (where are we)?
    The current weather in Amsterdam, Netherlands is:
    (weatherdetails)

### What is Sara?
Sara is a command prompt, that listens for keyboard input or speech recognition.  
Sara has a voice, and is able to respond to commands through text as well as audio.

Sara is my (poor) attempt at making my own Jarvis/Alexa/Hey Google/Hi Bixby/Voice Response System.  
It runs on Node.js, on a Raspberry Pi 3B, but should be able to run on earlier versions as well as other linux distros.  
It has builtin commands, but can be extended through a self-made plugin system.

Right now, the recognized speech string is displayed in the terminal, but not processed or used in any way.  
Soon, spoken commands will be pushed to the command line, so that you have the option of 'editing' the recognition string.  
The functionality is there and ready, just not joined together yet.  
In the future there will be an option to choose wether to write speech commands to the command line for editing, or immediately process them as they are.

Sara ignores the following words at sentence start:
    sara  
    can you  
    will you  
    would you  
    could you  
    tell me  
    let me know  
    please

After stripping these words, the command is compared to builtin commands, and if it doesnt match, it will be compared to a regex value contained in every plugin json file.

Sara listens to the keyword 'Sara'

### Requirements:
arecord (config mic as default audio input device first)  
    sudo apt-get install alsa-utils
festival (only default voice tested)  
    sudo apt-get install festival festvox-kallpc16k

### NPM modules:
    "chalk": "^2.4.2",
    "country-list": "^2.1.1",
    "decimal.js": "^10.2.0",
    "geoip-lite": "^1.3.7",
    "os": "^0.1.1",
    "public-ip": "^3.1.0",
    "readline-utils": "^2.2.3",
    "say": "^0.16.0",
    "sonus": "^1.0.3",
    "weather-js2": "^2.0.2"

### Sara has basic functionality such as:
    help
    help <topic>
    add help
    edit help <topic>
    start/stop colors
    start/stop verbose
    start/stop listening
    start/stop voice

### Sara has some basic plugins provided:
Math functions (what is 7 + 9) matches with regex /^(?:what|how\smuch)?\s?(?:is)?\s?(-?[0-9]+\.?(?:[0-9]+)?)\s?(?:\+|plus|\&|and)\s?(-?[0-9]+\.?(?:[0-9]+)?)\s?(?:is)?$/i  
Greeting functions (saying hi/hello, asking how you are)  
Location functions (where am I, where are you, what city are we in, etc)  
Weather function (how is the weather in <place>)  
More coming...  
(all these plugins are incomplete, and will be finished soon)  

### Audio in/out issues:
The only advise I can give is to make sure that alsa has the correct in/output device registered.  
My raspi:  
```
ztik@sara:~/ $ arecord -l
**** List of CAPTURE Hardware Devices ****
>>> card 0: haobosou [haobosou], device 0: USB Audio [USB Audio] <<<
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 1: HD4110 [HP Webcam HD-4110], device 0: USB Audio [USB Audio]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
```
I use card 0, device 0 for my audio in (haobosou microphone, cheap and great quality audio)
```
ztik@sara:~/ $ aplay -l
**** List of PLAYBACK Hardware Devices ****
card 2: ALSA [bcm2835 ALSA], device 0: bcm2835 ALSA [bcm2835 ALSA]
  Subdevices: 7/7
  Subdevice #0: subdevice #0
  Subdevice #1: subdevice #1
  Subdevice #2: subdevice #2
  Subdevice #3: subdevice #3
  Subdevice #4: subdevice #4
  Subdevice #5: subdevice #5
  Subdevice #6: subdevice #6
>>> card 2: ALSA [bcm2835 ALSA], device 1: bcm2835 IEC958/HDMI [bcm2835 IEC958/HDMI] <<<
  Subdevices: 1/1
  Subdevice #0: subdevice #0
```
I use the HDMI output on my raspi for audio out, so I am using card 2, device 1 here

My config file:
```
ztik@sara:~/ $ cat ~/.asoundrc
pcm.!default {
  type asym
  playback.pcm {
    type plug
    slave.pcm "hw:2,1"
  }
  capture.pcm {
    type plug
    slave.pcm "hw:0,0"
  }
}
```
This solved every issue I had with festival and with arecord  
Using these settings I am able to record from the proper input device with the following command:  
    'arecord -d 10 test.wav && aplay test.wav'  
and play that recording using:  
    'aplay test.wav'  

Anything on support beyond this should be requested at alsa/festival/linux forums I guess.



### Plugins:
These are created using (at least) 2 files:  
```
    pluginname_function.json  
    pluginname.js
```
The .js file contains all the javascript to deal with request X and push back a result.  
The .json file contains the name of the plugin, the name of the module (the .js file name), a Regular Expression string, and a small description

One .js file can contain multiple module.exports functions.  
Each function requires its own .json file.  
example:  
```
    math.js  
    math_add.json  
    math_subtract.json  
    math_root.json
```


### Todo:
- [ ] Add option to select if speech commands are pushed to command line or processed immediately
- [ ] Change eval() functions, find better approach for plugin loading
- [ ] Correct all paths to resolve properly
- [ ] Check for plugins in an external folder
- [ ] Fix / finish plugins, add extra functions
- [ ] ...
- [ ] Language support... eventually (this is depending on Google Speech language availability as well as festival language availability)