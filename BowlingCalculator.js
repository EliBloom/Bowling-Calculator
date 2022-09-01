/**
 * Function used for finding the scores of each individual frame
 *
 * @param {Array[number]} rolls - an array consisting of numbers(0-9), strikes('X'), and spares('/')
 *
 * @return {Array[score]} An array of scores for each frame
 */
function frameCalculator(rolls) {
  // Object: {frameIndex, score of frame}
  let scoresMap = {};
  // hold the rolls for each frame
  let frames = [];
  // the current frame
  let frame = [];
  // Object: {frameIndex, current score for strike frame
  let strikesMap = {};
  // used for indexing strikes
  let frameIndex = 0;
  // determines whether the current roll is the first or second roll in the current frame
  let rollCount = 1;
  let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  // build the "frames" array
  for (let x = 0; x < rolls.length; x++) {
    let roll = rolls[x];

    if (numbers.includes(roll)) {
      if (rollCount === 2) {
        frame.push(roll);
        frames[frameIndex] = frame;
        frame = [];

        rollCount = 1;
        frameIndex++;
      } else {
        frame.push(roll);
        frames.push(frame);
        rollCount = 2;
      }
    } else if (roll === "X") {
      frame.push(roll);
      frames.push(frame);
      frame = [];

      // make null in case the following required frames are unfinished
      scoresMap[frameIndex] = null;

      // set base score not including bonus points
      if (roll === "X" || roll === "x") {
        strikesMap[frameIndex] = 10;
      }

      frameIndex++;
    } else if (roll === "/") {
      frame.push(roll);
      frames[frameIndex] = frame;
      frame = [];

      rollCount = 1;

      // make null in case the following required frames are unfinished
      scoresMap[frameIndex] = null;
      if (rolls[x + 1]) {
        if (rolls[x + 1] === "X" || rolls[x + 1] === "x") {
          scoresMap[frameIndex] = 20;
        } else {
          scoresMap[frameIndex] = 10 + rolls[x + 1];
        }
      }
      frameIndex++;
    }
  }

  // Calculate the scores of standard 0-9 rolls
  for (let x = 0; x < frames.length; x++) {
    let frame = frames[x];
    // add scores if both rolls were less than 10(spare or strike)
    if (frame.length === 2) {
      if (frame[1] != "/") {
        scoresMap[x] = frame[0] + frame[1];
      }
    }
    // the frame only has one role, so the frame has not been finished
    else if (numbers.includes(frame[0])) {
      scoresMap[x] = null;
    }
  }

  // evaluate strike bonuses if there are any strikes
  if (Object.keys(strikesMap).length > 0) {
    findStrikeBonuses(scoresMap, strikesMap, frames);
  }

  return Object.values(scoresMap);
}

/**
 * Helper function to find the score bonuses from scoring strikes
 *
 * @param {Object<index, score>} scoresMap - an object whose key is the frame index and value is the score of the frame
 * @param {Object<index, strike score>} strikesMap - an object whose key is the frame index and value is the score mulitplier of the strike
 * @param {Array[Array[roll]]} frames - an array consisting of numbers(0-9), strikes('X'), and spares('/')
 *
 * @returns void
 */
function findStrikeBonuses(scoresMap, strikesMap, frames) {
  let strikeKeys = Object.keys(strikesMap);

  for (let x = 0; x < strikeKeys.length; x++) {
    let key = parseInt(strikeKeys[x]);

    // find if there are consecutive strikes and calculate the score bonus
    for (let y = 1; y < 3; y++) {
      if (frames[key + y]?.length > 1) {
        // spares are a special case so have to deal with them accordingly
        if (frames[key + y][1] === "/") {
          strikesMap[key] = strikesMap[key] + 10;
        } else {
          strikesMap[key] =
            strikesMap[key] + frames[key + y][0] + frames[key + y][1];
        }

        break;
        // a single frame can only reach a max score of 30
      } else {
        strikesMap[key] = strikesMap[key] + 10;
        if (strikesMap[key] === 30) {
          break;
        }
      }
    }

    scoresMap[key] = strikesMap[key];
  }
}

console.log(
  frameCalculator([2, 6, "X", "X", "X", "X", 3, "/", 3, 4, 1, 3, "X"])
);
