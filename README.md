# GlitchPicClient
Web client for glitch art!
![WebApp](/app.png)

### About ###
This web app is a minimalist client for users to upload photos to glitch. 
The process:
- User uploads a photo 
- Photo is converted to Base64 
- Base64 string is sent to an Azure Function that glitches the image randomly 
- Glitched Base64 string is sent back to the client and displayed in page

A copy of the glitch function code can be found in this repo at [run.csx](/run.csx). 

### Acknowledgements ###
A huge thank you to [Suz Hinton](https://github.com/noopkat) for helping me with the upload feature and [Rachel Weil](https://github.com/hxlnt) for debugging help!  
