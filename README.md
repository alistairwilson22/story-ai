# Create a children's story with OpenAI

This project uses OpenAI's API to create a 'Make your own adventure' style story.
The app provides character and story prompts or you can type your own.
When you ask to tell a story it'll create an image for the story and start a story.
When the story is made you can give a prompt on how you'd like the story to develop or ask it to conclude.
This was built with my children in mind as a fun way to play with Open AI and hopefully encourage my children to enjoy reading more!

## How to set up

Download project
Run npm build
Run npm start

You'll need an API key from Open AI here https://platform.openai.com/docs/api-reference/authentication
And you'll need to add that in a .env.local file 
REACT_APP_OPENAI_API_KEY = YOUR_API_KEY