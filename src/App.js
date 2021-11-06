import { useState, useEffect } from 'react';
import db from './fireBaseConfig';
import StickyNote from './Components/StickyNote';
import './App.css';
import DrawingArea from './Components/DrawingArea';

function App() {

  const [notes, setNotes] = useState([]);
  const [updatedNotes, setUpdatedNotes] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isPaint, setIsPaint] = useState(false);
  const [isErased, setIsErased] = useState(false);
  const [background, setBackground] = useState();
  const [updatedBackground, setUpdatedBackground] = useState('');
  const [isBackgroundAdded, setIsbackgroundAdded] = useState(false);
  const [style, setStyle] = useState();
  const ID = background ? background.map(el => el.id) : 'no ID';

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

  const fetchData = async () => {
  let notesArray = [];
  let error;
        try {
            const data = await db.collection('stickies').get();
            data.docs.map(el => {
                let notes = { ...el.data(), 'id': el.id}
                notesArray.push(notes);
                return  notesArray;
            });
            setNotes(notesArray)
        } catch (e) {
            error = 'error';
            return error;
        }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchBackground();
  }, []);

  useEffect(() => {
    setStyle(background ? { backgroundImage: `url(${background.map(el => el.image)})` } : { backgroundImage: "url()" })
  }, [background])


    useEffect(() => {
      setNotes(updatedNotes)
  }, [updatedNotes])

  const handleObj = (data) => {
    const result = notes.map(el => {
      const obj = data.find(({ id }) => id === el.id);
      return obj ? obj : el;
    });
    setUpdatedNotes(result);
  }

  const handleSave = () => {
    try {
      notes.map(el => {
        return db.collection('stickies').doc(el.id).update({
          top: el.top,
          left: el.left,
          color: el.color,
          text: el.text,
        });
      });
      db.collection('backgroundImage').doc(ID.toLocaleString()).update({image: updatedBackground});
      setIsSaved(true)
    } catch (error) {
      console.log(error);
    }
  }

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
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
    fetchData();
  }

  const handleDelete = (id) => {
    console.log(id);
      try {
        db.collection('stickies').doc(id).delete();
      } catch (error) {
          console.log(error);
      }
      fetchData();
  }

  const handleClearAll = () => {
    console.log('CLEARING ALL DATAS');
    try {
      notes.map(el => {
        return db.collection('stickies').doc(el.id).delete();
      });
      db.collection('backgroundImage').doc(ID.toLocaleString()).update({image: ''});
    } catch (error) {
      console.log(error);
    }
    fetchData();
    fetchBackground();
  }

  return (
    <div className="App">
      <h1>Welcome to Stickies !</h1>
      <i className="fas fa-trash-alt brush" onMouseDown={() => setIsErased(true)} onMouseUp={() => setIsErased(false)}></i>
      <i className={isPaint ? "fas fa-paint-brush brush" : "fas fa-eraser brush"} onClick={() => setIsPaint(!isPaint)}></i>
      <button className="button" onClick={handleSave}><i class="far fa-save"></i> Save my sticker board</button>
      <button className="button" onClick={handleCreateSticker}><i class="fas fa-sticky-note"></i> Add a new sticker</button>
      <button className="button" onClick={handleClearAll}><i className="fas fa-trash-alt"></i> Clear canvas</button>
      <button className="button" onClick={() => setIsbackgroundAdded(true)}><i class="fas fa-images"></i> Add Background Image to Canvas</button>
      {isSaved ? <div className='save-msg'>
        <i className="fas fa-times" onClick={() => setIsSaved(false)}></i>
        Canvas Successfully Saved !
      </div> : null}
      {isBackgroundAdded ? <div className='background-msg'>
        <i className="fas fa-times" onClick={() => setIsbackgroundAdded(false)}></i>
        <input placeholder='Add an image link' type="text"
          onChange={(e) => setUpdatedBackground(e.target.value)} />
        <button className='button' onClick={() => { setStyle({ backgroundImage: `url(${updatedBackground})` }); setIsbackgroundAdded(false)}}>OKAY!</button>
      </div> : null}
      <div className="canvas" style={style}>
        <DrawingArea paint={isPaint} erase={isErased}/>
        {notes.map(el => {
          return <StickyNote
            index={isPaint}
            key={el.id}
            noteID={el.id}
            color={el.color}
            left={el.left}
            top={el.top}
            text={el.text}
            handleObj={handleObj}
            handleDelete={handleDelete}
          />
          })}
      </div>
    </div>
  );
}

export default App;
