<h1 align="center">
  <br>
  <img src="./resources/Penguin_Front_LeftRight.png?raw=true&sanitize=true" alt="Penguin" width="100">
  <img src="./resources/seal_left.png?raw=true&sanitize=true" alt="Seal" width="100">
</h1>

<h1 align="center">Break Ice Game</h1>

<p align="center">
  <img alt="GitHub" src="https://img.shields.io/badge/license-MIT-blue">
</p>

# Introduction

During the COVID Pandemic, people could hardly meet in person, resulting in a sense of distance between people. When meeting online, it is often difficult to move forward because of the social awkwardness. Ice-breaking games are essential at this time because they can narrow the distance between people.

**GOOD NEWS**

Here we are, Introducing the **cutting-edge** multiplayer mini-game “Break Ice Game” where players can invite their newly formed group to a quick game for introductory and Ice-Breaking purposes. A live chat is provided during the game for the group to communicate and get accustomed to each other.

Play now: https://break-ice-game.herokuapp.com/

![image-20220514213325910](https://user-images.githubusercontent.com/62285883/168422575-8eac6b48-9c91-490f-ab14-68314cc02c05.png)

## Gameplay

### Get Ready!

Once you are have joined a room, please select a colour for your avatar and click the ready button!

![image-20220514215013283](https://user-images.githubusercontent.com/62285883/168422598-1b9f6f2c-0713-4a94-af4b-98881a3e70a0.png)

![image-20220514215224356](https://user-images.githubusercontent.com/62285883/168422604-36616383-141a-4106-8b30-715fc78149b0.png)

### Game Configurations

Only the host can change the game configuration. If no seal player is chosen, the host will be the seal by default.

![image-20220514215544779](https://user-images.githubusercontent.com/62285883/168422613-5a2fd901-7997-405f-bde5-552df9c6fad4.png)

### Control and Rules

|  Key  |                                      Action                                       |
| :---: | :-------------------------------------------------------------------------------: |
|   W   |                             Move up one ice (square)                              |
|   S   |                                 Move down one ice                                 |
|   A   |                                 Move left one ice                                 |
|   D   |                                Move right one ice                                 |
| Space | Break the neighbouring ice in the direction that the player is facing (seal only) |

**Seal** can only move on the broken ices (squares with light blue borders).

**Penguin** can only move on the ices (light blue squares).

If a **penguin** is on a broken ice at any time, it sadly dies.

When all **penguin** players are dead before the time is up, the **seal** player wins!

Otherwise, if there is at least one **penguin** player that is alive at the end, the **penguin** players lose...

![image-20220514222911919](https://user-images.githubusercontent.com/62285883/168422634-9bddb199-b4a5-4a33-aba6-69ac67da04a5.png)

## Installation

To clone and run this application, you'll need [Git](https://git-scm.com), [Node.js 16.x](https://nodejs.org/en/download/), [Yarn](https://yarnpkg.com/getting-started/install) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/UOA-CS732-SE750-Students-2022/break-ice-game

# Install dependencies
$ yarn install

# Run the app locally
$ yarn start:dev
```

By default your application will be hosted at `http://localhost:3000`, while the
socket backend at `http://localhost:8080/api`.

## Running tests

```bash
yarn test
```

## Tech Stack

- Node
- Express
- React
- Mantine
- Tailwind
- SocketIO

## Background Music
https://dova-s.jp/EN/bgm/play7987.html

## Team

**Team name:** No More Delay

#### **Members**

| Name      | upi     |
| --------- | ------- |
| Peter     | tzho416 |
| Dylan Xin | dxin779 |
| Owen Wang | wany027 |
| Jianle Li | jli830  |
| Jeff Peng | zpen741 |
| Jimmy     | swan825 |
