import { useState, useEffect } from 'react';
import db from './fireBaseConfig';
import StickyNote from './Components/StickyNote';
import './App.css';

function App() {

  const [notes, setNotes] = useState([]);
  const [updatedNotes, setUpdatedNotes] = useState([]);
  
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
    fetchData()
  }, []);

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
    } catch (error) {
      console.log(error);
    }
  }

  const handleCreateSticker = () => {
    const newSticker = {
      top: 0,
      left: 0,
      color: '#000',
      text: 'Write something...'
    };
    try {
      db.collection('stickies').add(newSticker);
    } catch (error) {
      console.log(error);
    }
    fetchData();
  }

  const handleDelete = (data, id) => {
    console.log(id);
    if (data === 'delete') {
      try {
        db.collection('stickies').doc(id).delete();
      } catch (error) {
          console.log(error);
      }
      fetchData();
    }
    
  }

  const handleClearAll = () => {
    console.log('CLEARING ALL DATAS');
    try {
      notes.map(el => {
        return db.collection('stickies').doc(el.id).delete();
      });
    } catch (error) {
      console.log(error);
    }
    fetchData();
  }
 
  return (
    <div className="App">
      <h1>Welcome to Stickies !</h1>
      <button className="button" onClick={handleSave}>Save my sticker board</button>
      <button className="button" onClick={handleCreateSticker}>Add a new sticker</button>
      <button className="button" onClick={handleClearAll}>Clear canvas</button>
      <div className="canvas">
        {notes.map(el => {
          return <StickyNote
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
