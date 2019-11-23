# Content Recommender
This is a simple web application that recommends/suggests content to the users. We are often perplexed by the large scale of
content that is available around us to feed. This application suggests movies and TV series based on the user's mood and taste.
If you've been in a situation where it was almost impossible to decide which movie or series you're going to watch next then this
application is just for you.



## Installation


### Mac/Linux
1. Open terminal and `cd` into the downloaded directory `contentRecommendation`
2. Clone or download the repository to your local machine.
3. Make sure NodeJS and npm is installed. For help visit: https://www.nodejs.org/en/
4. Now run `npm install express redis` to install express framework and redis.
5. Similarly install other dependencies required for this project using npm from `package.json`
6. Now run `redis-server` to start the redis server.
7. Now run `node app.js`
8. Then go to `localhost:3000` from any web browser to view the home page of the app.

### Windows
1. Install GitBash for windows to run linux type bash terminal, for help visit: https://git-scm.com/downloads
2. Clone or download the repository to your local machine.
3. Open terminal and `cd` into the downloaded directory `contentRecommendation`
4. Make sure NodeJS and npm is installed. For help visit: https://www.nodejs.org/en/
5. Now run `npm install express redis` to install express framework and redis.
6. Similarly install other dependencies required for this project using npm from `package.json`
7. Now run `redis-server` to start the redis server.
8. Now run `node app.js`
9. Then go to `localhost:3000` from any web browser to view the home page of the app.
<br />

This application requires an API key to send requests to the The MovieDB database.
Place your API key and Authorization Access Token in file named `config.js`<br />
To get an API key and Access Token, register on TMDB and follow this guide: <br />
https://www.themoviedb.org/documentation/api <br />
https://developers.themoviedb.org/3/getting-started/introduction <br />

## License
[MIT License](https://github.com/chiragsrvstv/contentRecommendation/blob/master/LICENSE) <br />
Copyright (c) 2019 Chirag Srivastava


<br />
<br />
<sup> Powered by www.themoviedb.org </sup>
