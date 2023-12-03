import './App.css';
import {useState} from 'react';
import {names, titles, animals} from './data/data';

const fourRandomNames = names.sort(() => Math.random() - 0.5).slice(0, 4);
const fourRandomTitles = titles.sort(() => Math.random() - 0.5).slice(0,4);
const fourRandomAnimals = animals.sort(() => Math.random() - 0.5).slice(0,4);
const namedAnimals = fourRandomNames.map((name, index) => `${name} the ${fourRandomAnimals[index]}`);


function App() {
  const [story, setStory] = useState("");
  const [characters, setCharacters] = useState("Norah, Jessica and Caleb");
  const [plot, setPlot] = useState("discover something on a beach");
  const [latestPlot, setLatestPlot] = useState("");
  const [storyImage, setStoryImage] = useState("");

  const changeCharacters = (event) => {
    setCharacters(event.target.value)
  }

  const changePlot = (event) => {
    setPlot(event.target.value)
  }

  const changeLatestPlot = (event) => {
    setLatestPlot(event.target.value)
  }

  const getStoryAPI = 'https://api.openai.com/v1/chat/completions';
  const getImageAPI = 'https://api.openai.com/v1/images/generations';
  const apiHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}` 
  }

  const openAIStoryRequest = () => {

    let plotAddition = latestPlot ? `, in the next story section include ${latestPlot}` : null 
    let storyApiContent = "";

    story ? 
    storyApiContent = `Please provide around 100 words for the following story and end on a cliff hanger ${plotAddition}: ${story}`:
    storyApiContent = `Please provide around 100 word for the start of a children's story and end on a cliff hanger. The story should have characters ${characters}. The plot should include ${plot}.`

    setStory("Making your new story...");

    const storyApiBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "user",
          "content": storyApiContent
        }
      ]
    }

    fetch(getStoryAPI, {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify(storyApiBody)
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`There was an error with the Story API`);
      }

      return response.json();

    })
    .then((data) => {
      const newstorypart = data.choices[0].message.content;
      setStory(story + newstorypart);
    })
    .catch((error) => {
      console.error('Error:', error)
    });

    setLatestPlot(null)


    const imageApiBody = {
      "prompt": `${characters}: ${plot}`,
      "n": 1,
      "size": "512x512"
    }

    if(!storyImage) {
      fetch(getImageAPI, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(imageApiBody)
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`There was an error with the Image API`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setStoryImage(data.data[0].url);
        console.log(storyImage);
      })
    } 
  } 

  const openAIConclusionRequest = () => {

    let concludeStory = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "user",
          "content": `Please conclude the following story: ${story}`
        }
      ]
    }

    setStory("Please wait for your thrilling conclusion to this story");

    fetch(getStoryAPI, {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify(concludeStory)
    })
    .then((response) => {
      if(!response.ok) {
        throw new Error( "There was an error concluding the story");
      }
      return response.json();
    })
    .then((data) => {
      const newstorypart = data.choices[0].message.content;
      setStory(story + newstorypart);
    })
  }


  return (
    <div className="App">
      <header className="App-header bg3">
        <div className="container">
          <h1>Would you like me to tell you a story?</h1>
          <p>Who should be in the story?</p>
          <div className="name-prompts">{
            namedAnimals.map((name, index) => { return <button className={`button-${index}`} key={name} value={name} onClick={changeCharacters}>{name}</button>})
          }</div>
          <input
          className='characters'
          type='text'
          placeholder={characters}
          onChange={changeCharacters}
          />
          <p>What should the story be about?</p>
          <div className="title-prompts">{
            fourRandomTitles.map((title, index) => { return <button className={`button-${index}`} key={title} value={title} onClick={changePlot}>{title}</button>})
          }</div>
          <input
          className='plot'
          type='text'
          placeholder={plot}
          onChange={changePlot}
          />
          <div>
          <button className="storySubmit storyStart" onClick={openAIStoryRequest} href="#scroll">Tell me a story</button>
          <span id="scroll"></span>
          </div>
          { 
          story ?
          <div>
            <h2 className="story-title">{characters}: {plot}</h2>
            {
            storyImage ? <img src={storyImage} /> : null
            }
            <p className="story">{story}</p>
            <input
            className='what-next'
            type='text'
            placeholder="What would you like to happen next?"
            onChange={changeLatestPlot}
            />
            <div>
              <button className="storySubmit storyContinue" onClick={openAIStoryRequest}>Continue the story</button>
            </div>
            <div>
              <button className="storySubmit storyConclude" onClick={openAIConclusionRequest}>Finish the story</button>
            </div>
          </div> :
          null
          }
      </div>
      </header>
    </div>
  );
}

export default App;
