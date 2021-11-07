# Sticker Note App
A small web-app which allows users to arrange sticky notes on a canvas.

## Dependencies
- "firebase": "^9.2.0",
- "konva": "^8.2.3",
- "react": "^17.0.2",
- "react-dom": "^17.0.2",
- "react-konva": "^17.0.2-5",
- "react-scripts": "4.0.3",
- "web-vitals": "^1.0.1"

## Get started
This project uses npm.

Clone this repository on your computer : 
`git clone git@github.com:Alphasud/Stickies.git`

Go to directory, then
`npm install`

then, 
`npm run start`

It runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## In this app you can :
- Add a sticky note anywhere on the screen.
- Drag and drop a sticky note to a new location.
- Delete a sticky note.
- Set the text contained in a sticky note (either at creation or after).
- Clear the canvas of all stickers and background.
- Change the color of a sticky note.
- Draw anywhere on the canvas, switch pen color (default is black), select eraser tool to erase, or erase all drawing at once (for now, drawing cannot be saved) (this feature uses the Konva library)
- Paste an image link to set it as the canvas background.
- Add/delete sticker image (initial image is random).
- Change image on sticker image.
- Save your canvas on a distant database (here I use Firestore from Firebase).

## Future features could include :
- Authentication.
- 'Private' dashboard with all your canvas and personal info.
- Creating multiple canvas.
- Sharing canvas with other user.
- Saving the drawings.
- Include type checking with prop types.
- Use SCSS.
- Better documentation.
- Better UI, this one got a strong 2000's vibe^^




