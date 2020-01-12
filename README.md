## Live deploy: https://rutasip.github.io/memory-game

My code is still a mess as I am trying to get it up and runnning as soon as possible.
Any feedback is welcome!

## This game is being created for an internship position at Visma.

Here is the original task:

Memory Puzzle

A board full of overturned cards. There is a pair for each card. The player flips over two cards. If they match, then they stay overturned. Otherwise, they flip back. The player needs to overturn all the cards in the fewest moves to win. Implement using only front end technologies (HTML, CSS and JavaScript).

Push your code to Git (e.g. GitHub, GitLab, Bitbucket) repository and share the link with us.

## However, I decided to go a little bit extra :D

Extra stuff:

- Calculates user's score by doing some magic with the remaining time and total flips.
- User can only submit their score if they are logged into Facebook. This way I secure the app from invalid name inputs.
- If not logged in, they will be asked to log into Facebook.
- User submits the score along with their first name and surname first letter.
- The data gets sent to Firebase database where I store the scores.
