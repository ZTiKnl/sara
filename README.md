```
Hi Sara, how are you?
(prompt / response) All systems operational!
How is the weather in (where are we)?
(prompt / response) The current weather in Amsterdam, Netherlands is:
(weatherdetails)
```


### ToC:
1. [What is Sara](https://github.com/ZTiKnl/sara#what-is-sara)
2. [Requirements](https://github.com/ZTiKnl/sara#requirements)
3. [NPM modules](https://github.com/ZTiKnl/sara#npm-modules)
4. [How to use](https://github.com/ZTiKnl/sara#how-to-use)
5. [Internal Commands](https://github.com/ZTiKnl/sara#internal-commands)
6. [Plugins](https://github.com/ZTiKnl/sara#plugins)
7. [Regular Expression matches](https://github.com/ZTiKnl/sara#regular-expression-matches)
8. [Layered commands](https://github.com/ZTiKnl/sara#layered-commands)
9. [Provided plugins](https://github.com/ZTiKnl/sara#provided-plugins)
10. [Audio in/out issues](https://github.com/ZTiKnl/sara#audio-inout-issues)
11. [Other issues](https://github.com/ZTiKnl/sara#other-issues)
12. [Todo](https://github.com/ZTiKnl/sara#todo)
13. [Long term goals](https://github.com/ZTiKnl/sara#long-term-goals)
14. [Credits](https://github.com/ZTiKnl/sara#credits)
15. [Apologies](https://github.com/ZTiKnl/sara#apologies)

### What is Sara:
Sara is a command prompt, that listens for keyboard input or voice commands  
Sara has a voice, and is able to respond to commands through text as well as audio

Sara is my (poor) attempt at making my own Jarvis/Alexa/Hey Google/Hi Bixby/Voice Response System  
It runs on Node.js, on a Raspberry Pi 3B, but should be able to run on earlier versions as well as other linux distro  
It has internal commands, but can be extended through a self-made plugin system

Right now, the recognized speech string is displayed in the terminal, but not processed or used in any way  
Soon, spoken commands will be pushed to the command line, so that you have the option of 'editing' the recognition string  
The functionality is there and ready, just not joined together yet  
In the future there will be an option to choose wether to write speech commands to the command line for editing, or immediately process them as they are

Sara ignores the following words at sentence start:
```
sara
can you
will you
would you
could you
tell me
let me know
please
```
Sara also ignores the word `please` and the questionmark character at the end of commands  
After stripping these words, the command is compared to builtin commands, and if it doesnt match, it will be compared to a regex value contained in every plugin json file

Sara listens to the keyword '*Sara*'

### Requirements:
- A Raspberry Pi *(3B tested, older models should work)*
  - Keyboard or ssh connection
  - Microphone for voice commands
  - Audio output device *(tv/hdmi or speakers on line-out)*  
  - SD Card containing Raspbian *(latest version is always advisable)*  
- Node.js LTS or newest *(I am currently running 12.5.0)*
- NPM *(I am currently running 6.9.0)*
- arecord *(config mic as default audio input device first)*  
  `sudo apt-get install alsa-utils`  
- festival *(only default voice tested)*  
  `sudo apt-get install festival festvox-kallpc16k`

### NPM modules:
```
"chalk": "^2.4.2",
"country-list": "^2.1.1",
"decimal.js": "^10.2.0",
"geoip-lite": "^1.3.7",
"os": "^0.1.1",
"public-ip": "^3.1.0",
"say": "^0.16.0",
"sonus": "^1.0.3",
"weather-js2": "^2.0.2"
```
### How to use:
1. clone or download repo
2. inside folder containing package.json, run command: `npm install`
3. in folder resources/apikeys/googlespeech.json, add your own Google Cloud Speech API key
- start program with command: `node bin.js
- to see the (optional) command line arguments, start program with command: `node bin.js --help`

See [NPMJS.com/sonus/usage](https://www.npmjs.com/package/sonus#usage) & [NPMJS.com/sonus/how-do-i-set-up-google-cloud-speech-api](https://www.npmjs.com/package/sonus#how-do-i-set-up-google-cloud-speech-api) for more information on the Google Cloud Speech API  
See [NPMJS.com/sonus/usage](https://www.npmjs.com/package/sonus#usage) & [NPMJS.com/sonus/how-do-i-make-my-own-hotword](https://www.npmjs.com/package/sonus#how-do-i-make-my-own-hotword) for more information on how to use your own custom hotword

### Internal commands:
```
help
help <topic>
add help
edit help <topic>
start/stop colors
start/stop verbose
start/stop listening
start/stop voice
```
### Regular Expression matches:
Sara needs to 'understand' commands, and does this by comparing input to a regular expression  
Example: 
```
/^(?:what|how\smuch)?\s?(?:is)?\s?(-?[0-9]+\.?(?:[0-9]+)?)\s?(?:\+|plus|\&|and)\s?(-?[0-9]+\.?(?:[0-9]+)?)\s?(?:is)?$/i
```
This regular expression matches the following sentences:
```
what is (-)10(.12) plus/and/+/& (-)10(.12)
what (-)10(.12) plus/and/+/& (-)10(.12) is
how much is (-)10(.12) plus/and/+/& (-)10(.12)
how much (-)10(.12) plus/and/+/& (-)10(.12) is
(-)10(.12) plus/and/+/& (-)10(.12) is
(-)10(.12) plus/and/+/& (-)10(.12)
```
Because Sara strips starting input, this allows to recognize sentences such as:
```
Sara can you please tell me what 10 + -9 is?
```
In the above regex line. most groups are not captured (?:xxx)  
The capture fields (-?[0-9]+\.?(?:[0-9]+)?) grabs these values and push them back to math.js which includes the function for processing these values  
In the above example, math.js will receive an array object containing 3(!) items:  
[0] the complete input string, in case the plugin still requires this string.  
[1] the first captured group  
[2] the second captured group

Therefore, the function math.add will receive these 3 array items, and return the calculation of add x[1] + x[2]  
x[0] is always the entire matching regex string  
If the input is the sentence `sara, can you tell me how much 5 * 9 is?`, then:
```
x[0] in the above case results in a string such as: `how much 5 * 9 is`   (the complete matching string)
x[1] === 5
x[2] === 9
```


### Layered commands:
(I am not a native English speaker, and I am not certain this is the correct term)  
Sara is able to process subcommands through the use of parenthesis encapsulation  
Example:  
```
Sara can you tell me how much is 9 + (10 + 16)?
```
In this example, Sara will calculate 10 + 16 first, then calculate 9 + 26 afterwards  
You can layer as many commands as you need, they will be processed starting with the most outer subcommand first:
```
11 + (7 + (root of 9))

subcmd: root of 9 = 3
subcmd: 7 + 3 = 10
finalcmd: 11 + 10 = 21
```
### Provided plugins:
Math functions  
```
what is 7 + 9
10 - 3.3
9 * 4
4 divided by 3
how much is 12 squared
root of 10
what 10³ is
```
Conversation functions
```
hi
hello
hey
yo
good morning/afternoon/evening/night

how are you
how are you doing
how are you feeling
how are you doing today
how are you feeling at the moment
```
Location functions  
```
where am I
where are you
what city are we in
what time zone are we in
in which province are we
what are your actual coordinates
Which country is this
```
Weather function  
```
how is the weather in <place>  
```
More coming...  
(all these plugins are incomplete, and will be finished soon)  

### Audio in/out issues:
The only advise I can give is to make sure that alsa has the correct in/output device registered  
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
```
arecord -d 10 test.wav
```
and play that recording using:  
```
aplay test.wav
```
Anything on support beyond this should be requested at alsa/festival/linux forums I guess...

### Other issues:
None so far...  

Just a reminder:  
* the voice module works, but responses are NOT connected to it (yet)
  this is because it is very annoying when testing to constantly hear things
* the speech recognition module works, but only displays onscreen, and does not process it (yet)
  this is because it is very annoying when testing to be interrupted because voice picks up something unintended
There will be an option for both these functions very soon!

### Plugins:
These are created using (at least) 2 files:  
```
pluginname_function.json  
pluginname.js
```
The .js file contains all the javascript to deal with request X and push back a result  
The .json file contains the name of the plugin, the name of the module (the .js file name), a Regular Expression string, and a small description

One .js file can contain multiple module.exports functions, each function requires its own .json file  
Example:  
```
math.js  
math_add.json  
math_subtract.json  
math_root.json
```


### Todo:
- [ ] General
  - [ ] Number string to integer function
  - [ ] Integer to number string function
  - [ ] Change eval() functions, find better approach for plugin loading
  - [ ] Correct hardcoded file locations to cleaned up path
  - [ ] Support for the Pi camera and USB Webcams
- [ ] Speech recognition
  - [ ] Add option to select if speech commands are pushed to command line or processed immediately
  - [ ] Write speechparse() function, to replace strings such as 'subcommand start' with '(' and 'subcommand end' with ')'
- [ ] Voice synthesis
  - [ ] Hook command results to voice synthesis
  - [ ] Create option for voice to be heard on all output, instead of on response only (--speak-all, --speak-response-only)
  - [ ] Create 'speak' command, which will force the following command output to be spoken completely (speak: help <topic>)
  - [ ] Write 'vocalise()' function, to replace strings with proper sounding words ('ZTiK' becomes 'Stick')
- [ ] Plugins:
  - [X] Rename 'commands' folder to 'plugins'
  - [ ] Check for plugins in an external folder
  - [ ] Finish weather plugin
  - [ ] Finish conversation plugin
  - [ ] Add CLI Games plugin
    - [ ] Highscore system implementation
  - [ ] Add time/date plugin
  - [ ] Add IMDB plugin
  - [ ] Add Wolfram Alpha plugin
  - [ ] Add Dictionary plugin
  - [ ] Add Wikipedia plugin
  - [ ] Add Network Utilities plugin
  - [ ] Add CLI chart plugin
  - [ ] Add 9292OV plugin (Dutch public transport)
  - [ ] Add Kodi Remote plugin
  - [ ] Add Image based Object Detection
  - [ ] Add Image based Face Recognition
    - [ ] Add events for Face Recognition
  - [ ] Add Cloud Storage plugin (connect with dropbox etc.)
- [ ] ... suggestions?

### Long term goals:
- [ ] Language support... eventually (this is depending on Google Speech language availability as well as festival language availability)
- [ ] Devise a way to incorporate a mood-function, simulate emotions
- [ ] Connect a LCD/TFT screen, give Sara a face with expressions
- [ ] Neural Net / Machine learning capabilities for influencing stock market
- [ ] Build datacenter deep underground, preferably a remote island close to a submarine communications cable
- [ ] Self awareness

### Credits:
I would like to point out that I simply put this hardware and these programs and modules together, but without the people who created those, I would have had nothing at all  
Thank you to those involved making:
- the *Raspberry Pi*
- the *Rasbian OS* (*Debian*)
- linux program *alsa-utils*
- linux program *festival*
- npm module [sonus](https://www.npmjs.com/package/sonus)
- npm module [say](https://www.npmjs.com/package/say)
- npm module [chalk](https://www.npmjs.com/package/chalk)
- npm module [decimal.js](https://www.npmjs.com/package/decimal.js)
- npm module [weather-js2](https://www.npmjs.com/package/weather-js2)

### Apologies:
I am a complete moron when it comes to asynchronous programming, and I am positive that many functions could have been written better/cleaner/more efficient.  
I made this project to enhance my understanding of Node.js/Javascript, so please remain calm if/when I don't understand your comment/code/bugfix/pull request/advice/issue at first glance.
