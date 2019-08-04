```
<input> Hi Sara, how are you?
(prompt / response) All systems operational!
<input> How is the weather in (where are we)?
(prompt / response) The current weather in Amsterdam, Netherlands is:
(weatherdetails)
<input> _
```

![Type: Experimental](https://img.shields.io/badge/Type-Experimental-blue "Experimental") ![Status: Work in progress](https://img.shields.io/badge/Status-Work_in_progress-blue "Work in progress")  

### ToC:
1. [What is Sara](https://github.com/ZTiKnl/sara#what-is-sara)
2. [Requirements](https://github.com/ZTiKnl/sara#requirements)
3. [NPM modules](https://github.com/ZTiKnl/sara#npm-modules)
4. [How to use](https://github.com/ZTiKnl/sara#how-to-use)
5. [Internal Commands](https://github.com/ZTiKnl/sara#internal-commands)  
  5.1 [Colors](https://github.com/ZTiKnl/sara#colors)  
  5.2 [Verbose](https://github.com/ZTiKnl/sara#verbose)  
  5.3 [Help](https://github.com/ZTiKnl/sara#help)  
  5.4 [Hearing](https://github.com/ZTiKnl/sara#hearing)  
  5.5 [Voice](https://github.com/ZTiKnl/sara#voice)  
  5.6 [Vision](https://github.com/ZTiKnl/sara#vision)  
6. [Regular Expression matches](https://github.com/ZTiKnl/sara#regular-expression-matches)
7. [Layered commands](https://github.com/ZTiKnl/sara#layered-commands)
8. [Plugins](https://github.com/ZTiKnl/sara#plugins)
9. [Provided plugins](https://github.com/ZTiKnl/sara#provided-plugins)  
  9.1 [Math](https://github.com/ZTiKnl/sara#math)  
  9.2 [Conversation](https://github.com/ZTiKnl/sara#conversation)  
  9.3 [Location](https://github.com/ZTiKnl/sara#location)  
  9.4 [Weather](https://github.com/ZTiKnl/sara#weather)  
  9.5 [XBMC remote](https://github.com/ZTiKnl/sara#xbmc-remote)  
  9.6 [Timedate](https://github.com/ZTiKnl/sara#timedate)  
  9.7 [Wikipedia](https://github.com/ZTiKnl/sara#wikipedia)  
  9.8 [News](https://github.com/ZTiKnl/sara#news)  
10. [Audio in/out issues](https://github.com/ZTiKnl/sara#audio-inout-issues)
11. [Other issues](https://github.com/ZTiKnl/sara#other-issues)  
  11.1 [Sonus/Google Cloud Speech API](https://github.com/ZTiKnl/sara#sonusgoogle-cloud-speech-api)  
  11.2 [Haobosou USB microphone](https://github.com/ZTiKnl/sara#haobosou-usb-microphone)  
  11.3 [Known](https://github.com/ZTiKnl/sara#known)  
12. [Todo](https://github.com/ZTiKnl/sara#todo)
13. [Long term goals](https://github.com/ZTiKnl/sara#long-term-goals)
14. [Credits](https://github.com/ZTiKnl/sara#credits)
15. [Apologies](https://github.com/ZTiKnl/sara#apologies)

Attention: this package is currently a work in progress  
**Do not install via** `npm install @ztik.nl/sara`  
Clone or download from [Sara @ Github](https://github.com/ZTiKnl/sara.git)  

Github documentation will be the Current/Latest testing build  
NPM will be pushed occasionally when there shouldn't be any app-breaking bugs  
Many changes are to be expected, do not expect backwards compatibility  

Current version: `0.2.2`  
When the core program is more complete I will start [semantic version](https://docs.npmjs.com/about-semantic-versioning) 1.0.0  

### What is Sara:
Sara is a command prompt, that listens for keyboard input or voice commands  
Sara has a voice, and is able to respond to commands through text as well as audio

Sara is my (poor) attempt at making my own *Jarvis/Alexa/Hey Google/Hi Bixby/Voice Response System*  
It runs in Node.js on a Raspberry Pi 3B, but should be able to run on earlier versions as well as other linux distro  
It has some internal commands, but can be extended through a self-made plugin system

**Hearing works**  
Voice commands can be sent to the command line for editing, or immediately be processed without user intervention  
This option selection is currently hidden away in hearing.js, but will be in the commandline arguments and config.json soon  

**Voice works**  
Voice output works, but further testing is required  
Different voices (male and female) are now possible, soon there will be an option to select, as well as a way to display a list of voices for each language!  

**Vision works**  
All it does is take a picture every 30 minutes using a USB webcam  
Pi camera not supported yet, will be supported later  
There are object/face detection functions, as well as some other functions (age/expression/gender labeling)  but NONE of these functions are connected to the webcam source image yet!  
There are NO object/face recognition functions at this moment, but this will be added soon  

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
Sara also ignores the word `please` and the `?` character at the end of commands  
After stripping these words, the command is compared to internal commands, and if it doesnt match, it will be compared to a regex string contained in every plugin .json file

Sara listens to the keyword '*Sara*'

### Requirements:
Hardware:
- A Raspberry Pi *(3B tested, older models should work)*
  - Keyboard or ssh connection
  - Microphone for voice commands (I use a [G11 Touch Induction/Haobosou](https://www.gearbest.com/microphone/pp_009493107682.html?wid=1433363) ~20 euro, *excellent* results)
  - Audio output device *(tv/hdmi or speakers on line-out)*  
  - Webcam for future object/face recognition modules (I use a HP Webcam HD-4110)
  - SD Card containing Raspbian *(latest version is always advisable)*  
    - Self-powered USBhub is advisable when using USB microphone/webcam  

Software:
- Node.js LTS or newest *(I am currently running 12.5.0)*
- NPM *(I am currently running 6.9.0)*
- aplay and arecord *([config audio in/out as default audio devices first](https://github.com/ZTiKnl/sara#audio-inout-issues))*  
  `sudo apt-get install alsa-utils`  
- fswebcam (I installed it, didnt touch a single config file)  
  `apt-get install fswebcam`  

Other:  
- Google Cloud API key *(one key to rule them all!)*  
  This is free for a certain amount of requests, see [Sonus/Google Cloud Speech/Vision API](https://github.com/ZTiKnl/sara#sonusgoogle-cloud-speech-api) for more details  
  *The same key is used for speech recognition, generating voices and face/object detection*  
    *Face recognition will be calculated in-app, so it will not make requests to the Google Cloud Vision API*  
- [newsapi.org](https://newsapi.org/) API key (optional)  
  Free for personal use, used for the news plugin  

### NPM modules:
```
"@google-cloud/text-to-speech": "^1.1.2",
"@google-cloud/vision": "^1.1.3",
"@tensorflow/tfjs-node": "^1.2.5",
"canvas": "^2.5.0",
"chalk": "^2.4.2",
"country-list": "^2.1.1",
"date-and-time": "^0.8.1",
"decimal.js": "^10.2.0",
"face-api.js": "^0.20.1",
"geoip-lite": "^1.3.7",
"he": "^1.2.0",
"node-webcam": "^0.5.0",
"play-sound": "^1.1.3",
"public-ip": "^3.1.0",
"rollup": "^1.17.0",
"sonus": "^1.0.3",
"weather-js2": "^2.0.2",
"weeknumber": "^1.1.1",
"wiki-entity": "^0.4.3"
```
### How to use:
1. Clone or download [this repo](https://github.com/ZTiKnl/sara.git)  
2. Inside main folder containing bin.js & package.json, run command: `npm install`
3. In folder resources/apikeys/googlespeech.json, add your own Google Cloud Speech API key
- Start program with command: `node bin.js`
- To see the (optional) command line arguments, start program with command: `node bin.js --help`
- It is also possible to use a config.json file to force default behaviour  

For more information on the Google Cloud Speech API, see:  
[NPMJS.com/sonus/usage](https://www.npmjs.com/package/sonus#usage) & [NPMJS.com/sonus/how-do-i-set-up-google-cloud-speech-api](https://www.npmjs.com/package/sonus#how-do-i-set-up-google-cloud-speech-api)  
The Google API key file is located at `./resources/apikeys/googlecloud.json`  

For more information on how to setup your own custom hotword, see:  
[NPMJS.com/sonus/usage](https://www.npmjs.com/package/sonus#usage) & [NPMJS.com/sonus/how-do-i-make-my-own-hotword](https://www.npmjs.com/package/sonus#how-do-i-make-my-own-hotword)  
The custom hotword file is located at `./resources/speechrecognition/Sarah.pmdl`  


### Internal commands:
I have tried to keep everything modular, so if something doesn't work on your system, you can disable that function through commandline arguments, config.json options file, or in the app itself  
The vision command will be extended with object/face recognition, ~~if I can~~ *when I* get that to work properly  
#### Colors:
`start/stop colors` turns on/off colored responses/prompt  
#### Verbose:
`start/stop verbose` turns on/off verbose mode  
  Verbose mode will turn on display of output with a 'data' or 'warn' type  
#### Help:
`help` displays the main 'help' section  
`list help` displays a list of all help topics  
`help <topic>` displays help on the topic requested (still needs to be populated)  
`add help` fill in the form and a new help topic is born!  
`edit help <topic>` find an error in a certain help topic, you can fix it.  
#### Hearing:
`start/stop listening` turns on/off speech recognition  
`start/stop hearing` same as above  
#### Voice:
`start/stop voice` turns on/off text-to-speech  
`start/stop talking` same as above  
`silence` stop speaking the current sentence/item  
#### Vision:
`start/stop vision` turns on/off timer (30 min) for webcam snapshot to ./resources/vision/frame.png  
`start/stop watching` same as above  
  Nothing is done with this image at this time, but there are tests being done with detection and recognition...  
  - Face/object detection works, but is not connected yet, it will be soon after some more testing  
  - Face recognition does not work yet, this will need a more complex neural net to connect the dots between different images  
  
### Regular Expression matches:
Sara needs to 'understand' commands, and does this by comparing input to a regular expression found inside each plugin function's .json file  

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
Using the input sentence above, then:
```
x[0] == "what 10 + -9 is"
x[1] == 10
x[2] == -9
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

Regular Expressions in these .json files need special characters to be escaped twice:  
`"regex": "/^(?:what|how\\smuch)?\\s?(?:is)?\\s?(-?[0-9]+\\.?(?:[0-9]+)?)\\s?(?:\\+|plus|\\&|and)\\s?(-?[0-9]+\\.?(?:[0-9]+)?)\\s?(?:is)?$/i",`

Since Sara removes certain words from the start of the sentence, all that the regex requires is the intent and if variables need to be passed to the function, one or more working capture groups
### Provided plugins:  
All commands listed are functional, although some plugins will require adding more commands (math.power, etc)  
More plugins are coming, see Todo list for what I'd like to add (if possible)...  
#### Math:
```
what is 7 + 9
10 - 3.3
9 * 4
4 divided by 3
how much is 12 squared
root of 10
what 10³ is
```
#### Conversation:
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
#### Location:
```
where am I
where are you
what city are we in
what time zone are we in
in which province are we
what are your actual coordinates
Which country is this
```
#### Weather:
```
weather  
how is the weather  
how is the weather in/around/near <place>  
what is the weather like in/around/near <place>  
weather forecast  
what is the weather forecast  
what is the weather forecast for <place>  
```
#### XBMC remote  
Add connection details to file plugins/xbmc-remote/connection.json (see example file connection_example.json)  
```
stop video/movie/film/playback/episode
stop the video/movie/film/playback/episode
stop this video/movie/film/playback/episode
pause/pause video/movie/film/playback/episode
resume the video/movie/film/playback/episode
continue this video/movie/film/playback/episode
media menu select
media menu back
media menu move up/down/left/right
media menu move up/down/left/right 5x
media menu move up/down/left/right 5*
media menu move up/down/left/right 5 times
media menu move up/down/left/right 5 entries
media menu move up/down/left/right 1 entry
media menu home
media menu info/information
media menu context
media menu submenu
```
#### Timedate  
```
what time is it
what is the date
what year is it
what month is it
what day it is
what is the week number
```
#### Wikipedia  
```
what is <subject>
more about <subject>
```
#### News  
Add newsapi,org api key to file plugins/news/newsorg.json (see example file newsorg_example.json)  
```
news headlines
tech news headlines
news headlines from bbc-news
news headlines in US
news headlines on bitcoin
```
### Audio in/out issues:
The only advise I can give is to make sure that alsa has the correct in/output device registered  
My Raspberry Pi config:  
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
This solved every issue I had with aplay and arecord  
Using these settings I am able to record from the proper input device with the following command:  
```
arecord -d 10 test.wav
```
and play that recording using:  
```
aplay test.wav
```
Anything on support beyond this should be requested at alsa/linux forums I guess  
Feel free to ask, but don't *expect* an answer...

### Other issues:  

#### Sonus/Google Cloud Speech API
I understand people can have problems getting through this, so here is a small guide (thanks to [smart-mirror.io](https://docs.smart-mirror.io/docs/configuring_voice.html#setting-up-speech-recognition))
- Setting up Speech Recognition  
  Sara uses Sonus with Google Cloud Speech for keyword spotting and recognition.  
  To set that up, you'll need to create a new project in the Cloud Platform Console:  

- In the Cloud Platform Console, go to the Projects page and select or create a new project  
  [GO TO THE PROJECTS PAGE](https://console.cloud.google.com/project)  

- Enable billing for your project.  
  [ENABLE BILLING](https://support.google.com/cloud/answer/6293499#enable-billing)

- Enable the Cloud Speech API.  
  [ENABLE THE API](https://console.cloud.google.com/flows/enableapi?apiid=speech.googleapis.com) - For more info see [Cloud Speech API Pricing](https://cloud.google.com/speech/#cloud-speech-api-pricing) (for simple use it should be free)  

- Create a new *JSON service account key*, edit it with a text editor and copy the contents to *./resources/apikeys/googlespeech.json*  
  When prompted to create a new service account select 'Owner' or 'Project Owner'  

As I understand, 90% of problems with Sonus are related to billing issues in Google Cloud  

#### Haobosou USB microphone  
The microphone I use is a 'C-Media Haobosou G11 Touch Induction' and for a couple of days I have been having problems with it  
When connecting the microphone, the blue power indicator would light up, and after 2 seconds it would turn off again  
Pressing the touch induction area has no effect, and thus I am left with a disabled mic  
It IS recognized by lsusb/hwinfo/arecord -l/dmesg but it is *OFF*  

After three days of wrestling, I found the solution somewhere online (lost the url, no credits, sry)
```
ztik@sara:~/nodejs/sara $ amixer
Simple mixer control 'Mic',0
  Capabilities: cvolume cvolume-joined cswitch cswitch-joined
  Capture channels: Mono
  Limits: Capture 0 - 62
  Mono: Capture 53 [85%] [18.07dB] [off]
```

```
ztik@sara:~/nodejs/sara $ amixer set Mic 80% cap

ztik@sara:~/nodejs/sara $ amixer
Simple mixer control 'Mic',0
  Capabilities: cvolume cvolume-joined cswitch cswitch-joined
  Capture channels: Mono
  Limits: Capture 0 - 62
  Mono: Capture 53 [85%] [18.07dB] [on]
```
There is probably a better command for turning the mic on, but this also sets the recording volume at 80%, which is my personal preference  

#### Known:
The vision module works, but all it does is take a picture every 30 min, no further processing connected at this moment

### Todo:
- [ ] General
  - [x] ~~Scan for .config file, load settings from there~~  
    - [x] ~~Overwrite settings with arguments~~  
    - [ ] Rewrite console.log() to response.conlog()  
  - [ ] Number string to integer function
  - [ ] Integer to number string function
  - [ ] Change eval() functions, find better approach for plugin loading
  - [ ] Correct hardcoded file locations to cleaned up path
  - [ ] Blacklist certain plugin names, to avoid overwriting internal functions
- [ ] Help function
  - [ ] Create help documentation for internal functions and plugins
  - [ ] Add .json file import to help function, so plugins can add topics to the function
  - [x] ~~Add `list help` command, and/or display all topics using `help`~~  
- [ ] Speech recognition
  - [x] ~~Add option to select if speech commands are pushed to command line or processed immediately~~  
  - [ ] Write speechparse() function, to replace strings such as 'subcommand start' with '(' and 'subcommand end' with ')'
- [ ] Voice synthesis
  - [x] ~~Hook command results to voice synthesis~~  
  - [ ] Add voices list display/selection
  - [x] ~~Add voice settings to config.json~~  
  - [ ] Create option for voice to be heard on all output, instead of on response only (`--speak-all`, `--speak-response-only`)
  - [ ] Create 'speak' command, which will force the following command output to be spoken completely  
  (normal behaviour is to use voice only on 'response' type items, all other types (such as data, info, status) are skipped)
  - [x] ~~Write 'vocalise()' function, to replace strings with proper sounding words ('ZTiK' becomes 'Stick')~~  
    - [x] ~~Add SSML language markup support~~
      - [ ] Add SSML markup to plugin outputs where needed (math functions)  
    - [ ] Add .json file import to vocalise() function, so plugins or end-users can add words to the list  
- [ ] Vision  
  - [x] ~~Support for USB Webcams~~  
      - [ ] Support for the Pi camera  
  - [ ] Image manipulation through imagemagick  
  - [x] ~~Object/face detection~~  
  - [ ] Object/face recognition    
- [ ] Plugins
  - [x] ~~Rename 'commands' folder to 'plugins'~~  
  - [ ] Check for plugins in an external folder
  - [x] ~~Add weather plugin~~
    - [ ] Add more commands: sun, sunrise, sunset, wind, rain  
  - [x] ~~Add news plugin~~  
    - [ ] Finish news plugin  
  - [x] ~~Add conversation plugin~~  
    - [ ] Finish conversation plugin  
  - [ ] Add Gmail plugin  
  - [ ] Add Google Translate plugin (*translate to french (news headlines from bbc-news)*)  
  - [ ] Add CLI Games plugin  
    - [ ] Highscore system implementation  
  - [x] ~~Add time/date plugin~~  
  - [ ] Add IMDB plugin
  - [ ] Add Wolfram Alpha plugin
  - [ ] Add Dictionary plugin
  - [x] ~~Add Wikipedia plugin~~  
    - [ ] Add topic overview/selection on multiple matches with request  
    - [ ] Ask if user wants to know more after reading topic description  
  - [ ] Add Network Utilities plugin
  - [ ] Add CLI chart plugin
  - [ ] Add 9292OV plugin (Dutch public transport)
  - [x] ~~Add xbmc plugin~~
    - [x] ~~Add functions (stop, pause, select, back, up, down, left right, info, home, contextmenu)~~
    - [ ] Add more functions to remote control (next, previous, rewind, forward, sendtext)
  - [ ] Add Image based Object Detection
  - [ ] Add Image based Face Recognition
    - [ ] Add events for Face Recognition
  - [ ] Add Cloud Storage plugin (connect with dropbox etc.)
  - [ ] Add Discord connectivity  
- [ ] ... suggestions?

### Long term goals:
- [ ] Language support... eventually (this is depending on my personal skills as well as Google Speech and Text-To-Speech language availability)  
- [ ] Remote Control Windows PC within the network  (this would require a seperate app for Windows to receive commands and process them)  
- [ ] Devise a way to incorporate a mood-function, simulate emotions
- [ ] Connect a LCD/TFT screen, give Sara a face with expressions
- [ ] Neural Net / Machine learning capabilities for influencing stock market
- [ ] Build datacenter deep underground, preferably a remote island close to a submarine communications cable
- [ ] Self awareness

### Credits:
I would like to point out that I simply put this hardware and these programs and modules together, but without the people who created those, I would have had nothing at all!  
Thank you to those involved making:
- the *Raspberry Pi*
- the *Rasbian OS* (*Debian*)
- linux program *alsa-utils*
- prompt/cli module code [A-312](https://stackoverflow.com/a/24519813/9820439)
- npm module [Sonus](https://www.npmjs.com/package/sonus)
- npm module [Chalk](https://www.npmjs.com/package/chalk)
- npm module [decimal.js](https://www.npmjs.com/package/decimal.js)
- npm module [Weather](https://www.npmjs.com/package/weather-js2)
- npm module [play-sound](https://www.npmjs.com/package/play-sound)
- xbmc plugin code [Marcus Linderoth](https://github.com/msloth/kodi.js)  

Hope I didn't miss anyone here, if so, please let me know and I will update!

### Apologies:
I am a complete moron when it comes to asynchronous programming, and I am positive that many functions could have been written better/cleaner/more efficient.  
I made this project to enhance my understanding of Node.js/Javascript, so please remain calm if/when I don't understand your comment/code/bugfix/pull request/advice/issue at first glance.
