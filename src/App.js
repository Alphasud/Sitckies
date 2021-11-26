import { useState, useEffect } from 'react';
import db from './fireBaseConfig';
import StickyNote from './Components/StickyNote';
import './App.css';
import DrawingArea from './Components/DrawingArea';
import StickyImage from './Components/stickyImage';
import { collection, query, onSnapshot } from "firebase/firestore";



function App() {

  const [notes, setNotes] = useState([]);
  const [updatedNotes, setUpdatedNotes] = useState([]);
  const [stickerImage, setStickerImage] = useState([]);
  const [updatedStickerImage, setUpdatedStickerImage] = useState([]);
  const [penColor, setPenColor] = useState('#000000');
  const [isSaved, setIsSaved] = useState(false);
  const [isPaint, setIsPaint] = useState(false);
  const [isErased, setIsErased] = useState(false);
  const [background, setBackground] = useState();
  const [updatedBackground, setUpdatedBackground] = useState();
  const [isBackgroundAdded, setIsbackgroundAdded] = useState(false);
  const [style, setStyle] = useState();
  const ID = background ? background.map(el => el.id) : 'no ID';
  const tiltImage = `rotate(5deg)`;
  const tiltNotes = `rotate(-5deg)`;


  /* Those 3 functions fetch the data (stcikerImage, StickerNotes and background) */
  const fetchBackground = async () => {
    let backgroundDataFromDb = [];
        try {
            const data = await db.collection('backgroundImage').get();
            data.docs.map(el => {
              let image = { ...el.data(), 'id': el.id };
              backgroundDataFromDb.push(image);
              return backgroundDataFromDb;
            });
          setBackground(backgroundDataFromDb);
        } catch (error) {
          console.log(error);
        }
  }

  const fetchStickerNotes = () => {
    const q = query(collection(db, 'stickies'));
    onSnapshot(q, (snapshot) => {
      const stickies = [];
      snapshot.forEach((doc) => {
        let notes = {...doc.data(), 'id': doc.id}
        stickies.push(notes)
      })
      setNotes(stickies);
    })
  } 

  const fetchStickerImages = () => {
    const q = query(collection(db, 'stickerImage'));
      onSnapshot(q, (querySnapshot) => {
        const stickerImage = [];
        querySnapshot.forEach((doc) => {
          let images = {...doc.data(), 'id': doc.id}
          stickerImage.push(images)
        })
        setStickerImage(stickerImage);
      })
  }

  /* Fetch all data on mount */
  useEffect(() => {
    fetchStickerImages();
    fetchBackground();
    fetchStickerNotes();
  }, []);

  /* set the updated background to the value of the background stored in db,
  *  so that if we save we still get the correct background (kind of hacky could be better)
   */
  useEffect(() => {
    setUpdatedBackground(background ? background.map(el => el.image).toLocaleString() : '')
  }, [background]);

  /* Update the state when user updates image, background or note */
  useEffect(() => {
    setStyle(background ? { backgroundImage: `url(${background.map(el => el.image)})` } : { backgroundImage: "url()" })
  }, [background]);

/* Handles the newly note object updated */
  const handleObj = (data) => {
    const result = notes.map(el => {
      const obj = data.find(({ id }) => id === el.id);
      return obj ? obj : el;
    });
    setUpdatedNotes(result);
  }
  useEffect(() => {
    updatedNotes.map(el => {
      return db.collection('stickies').doc(el.id).update({
        top: el.top,
        left: el.left,
        color: el.color,
        text: el.text,
      });
    });
  }, [updatedNotes]);
  
  
  /* Handles the newly sticker image object updated */
  const handleImageObj = (data) => {
    const result = stickerImage.map(el => {
      const obj = data.find(({ id }) => id === el.id);
      return obj ? obj : el;
    });
    setUpdatedStickerImage(result);
  }
  useEffect(() => {
      updatedStickerImage.map(el => {
        return db.collection('stickerImage').doc(el.id).update({
          top: el.top,
          left: el.left,
          image: el.image,
          text: el.text,
        });
      });
  }, [updatedStickerImage])

  /* Handles saving */
  const handleSave = () => {
    try {
      db.collection('backgroundImage').doc(ID.toLocaleString()).update({ image: updatedBackground });
      setIsSaved(true)
    } catch (error) {
      console.log(error);
    }
  }

  /* Generates a random color, used when a note is created */
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  /* Handles the creation of a new note */
  const handleCreateSticker = () => {
    const newSticker = {
      top: Math.random() * (500 - 50) + 50,
      left: Math.random() * (500 - 50) + 50,
      color: getRandomColor(),
      text: ''
    };
    try {
      db.collection('stickies').add(newSticker);
    } catch (error) {
      console.log(error);
    }
    fetchStickerNotes();
  }
   /* Handles the creation of a new sticker image */
  const handleCreateStickerImage = () => {
    const newStickerImage = {
      top: Math.random() * (500 - 50) + 50,
      left: Math.random() * (500 - 50) + 50,
      image: 'https://picsum.photos/200/300',
      text: ''
    };
    try {
      db.collection('stickerImage').add(newStickerImage);
    } catch (error) {
      console.log(error);
    }
    fetchStickerImages();
  }
/* Handles the deletion of a note */
  const handleDelete = (id) => {
    console.log(id);
      try {
        db.collection('stickies').doc(id).delete();
        fetchStickerNotes();
      } catch (error) {
          console.log(error);
      }
    fetchStickerNotes();
  }
  /* Handles the deletion of a sticker image */
  const handleImageDelete = (id) => {
    console.log(id);
      try {
        db.collection('stickerImage').doc(id).delete();
      } catch (error) {
        console.log(error);
      }
      fetchStickerImages();
  }
/* Handles the clearing of all canvas */
  const handleClearAll = () => {
    console.log('CLEARING ALL DATAS');
    try {
      notes.map(el => {
        return db.collection('stickies').doc(el.id).delete();
      });
      db.collection('backgroundImage').doc(ID.toLocaleString()).update({ image: '' });
      stickerImage.map(el => {
        return db.collection('stickerImage').doc(el.id).delete();
      });
    } catch (error) {
      console.log(error);
    }

    fetchStickerNotes();
    fetchStickerImages();
    fetchBackground();
  }

  return (
    <div className="App">
      <h1>Welcome to Stickies !</h1>
      <i className="fas fa-trash-alt brush" onPointerDown={() => setIsErased(true)} onPointerUp={() => setIsErased(false)}></i>
      <input
        className='color-input'
        id="penColor"
        type="color"
        value={penColor}
        onChange={(e) => {setPenColor(e.target.value);}}
     />
      <label htmlFor='penColor'><i className="fas fa-palette brush"></i></label>
      <i className={isPaint ? "fas fa-paint-brush brush" : "fas fa-eraser brush"} onClick={() => setIsPaint(!isPaint)}></i>
      <button className="button" onClick={handleSave}><i className="far fa-save"></i> Save my board</button>
      <button className="button" onClick={handleCreateSticker}><i className="fas fa-sticky-note"></i> Add a sticker</button>
      <button className="button" onClick={handleCreateStickerImage}><i className="fas fa-images"></i> Add a sticker Image</button>
      <button className="button" onClick={handleClearAll}><i className="fas fa-trash-alt"></i> Clear canvas</button>
      <button className="button" onClick={() => setIsbackgroundAdded(true)}><i className="fas fa-images"></i> Add Background Image</button>
      {isSaved ? <div className='save-msg'>
        <i className="fas fa-times" onClick={() => setIsSaved(false)}></i>
        Canvas Saved Successfully !
        <br />{notes.length} sticker {notes.length > 1 ? 'notes' : 'note'} and {stickerImage.length} sticker {stickerImage.length > 1 ? 'images' : 'image'} !
      </div> : null}
      {isBackgroundAdded ? <div className='background-msg'>
        <i className="fas fa-times" onClick={() => setIsbackgroundAdded(false)}></i>
        <input placeholder='Add an image link' type="text"
          onChange={(e) => setUpdatedBackground(e.target.value)} />
        <button className='button' onClick={() => { setStyle({ backgroundImage: `url(${updatedBackground})` }); setIsbackgroundAdded(false)}}>OKAY!</button>
      </div> : null}
      <div className="canvas" style={style}>
        <DrawingArea paint={isPaint} erase={isErased} penColor={penColor}/>
        {notes.map(el => {
          return <StickyNote
            key={el.id}
            noteID={el.id}
            color={el.color}
            left={el.left}
            top={el.top}
            text={el.text}
            tilt={tiltNotes}
            handleObj={handleObj}
            handleDelete={handleDelete}
          />
        })}
        {stickerImage.map(el => {
          return <StickyImage
            key={el.id}
            imageID={el.id}
            left={el.left}
            top={el.top}
            image={el.image}
            text={el.text}
            tilt={tiltImage}
            handleImageObj={handleImageObj}
            handleImageDelete={handleImageDelete}
          />
          })}
      </div>
    </div>
  );
}

export default App;
