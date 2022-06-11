# Analyse PDF Files

This is a little tool I made during my bachelors thesis, to help me identify how often certain keywords were found throughout multiple PDF files. My use case was that I had a bunch of annual reports from the University of Twente, and I wanted to see if the phenomenon of Open Research Data had received more attention from the board throughout the years.

## How to use this tool

1. Load the PDF files you want to analyse in the `data` folder. (The name of the file will correspondent to the ouput name in the `results` folder, so you can change the file name if you find it more convenient.)
2. Open the `settings.js` file, and alter the `keywords` array to suit your needs.
3. Install dependencies via `npm install`
4. Run the project via `npm run start`.
5. Results are stored as both a `.json` and a `.html` file in the `./results/output` directory.

## Questions

Open an issue, or send me an email through `m.g.misana@student.tudelft.nl`.
