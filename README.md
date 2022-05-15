<h1 align="center">
  <br>
  <img src="./resources/seal_dance.gif?raw=true&sanitize=true" alt="Seal" width="100">
</h1>

<h1 align="center">Ice Breakers</h1>

<p align="center">
  <img alt="GitHub" src="https://img.shields.io/badge/license-MIT-blue">
</p>

# Introduction

During the COVID Pandemic, people could hardly meet in person, resulting in a sense of distance between people. When meeting online, it is often difficult to move forward because of the social awkwardness. Ice-breaking games are essential at this time because they can narrow the distance between people.

**GOOD NEWS**

Here we are, Introducing the **cutting-edge** multiplayer mini-game “Ice Breakers” where players can invite their newly formed group to a quick game for introductory and Ice-Breaking purposes. A live chat is provided during the game for the group to communicate and get accustomed to each other.

Play now: https://ice-breakers-game.herokuapp.com/

![image-20220514213325910](https://user-images.githubusercontent.com/62285883/168422575-8eac6b48-9c91-490f-ab14-68314cc02c05.png)

## Gameplay

### Get Ready!

Once you are have joined a room, please select a colour for your avatar and click the ready button!
Background Music is playing, but you can mute it with the button on the top left corner.

![IdlePage](https://user-images.githubusercontent.com/61868315/168454458-b3110682-7c2c-4842-baf2-3600df60c8e5.png)

![IdlePageReady](https://user-images.githubusercontent.com/61868315/168454466-e8bab651-18fb-4777-b481-2d8c85dae4dd.png)

### Game Configurations

Only the host can change the game configuration. If no seal player is chosen, the host will be the seal by default.

![gameConfig](https://user-images.githubusercontent.com/61868315/168454521-fd8725ec-42ef-4be6-a8ad-7a3f27f1e54b.png)

### Control and Rules

|  Key  |                                      Action                                       |
| :---: | :-------------------------------------------------------------------------------: |
|   W   |                             Move up one ice (square)                              |
|   S   |                                 Move down one ice                                 |
|   A   |                                 Move left one ice                                 |
|   D   |                                Move right one ice                                 |
| Space | Break the neighbouring ice in the direction that the player is facing (seal only) |

**Seal** can only move in water (where ice is broken).

**Penguin** can only move on the ices (light blue squares).

If a **penguin** is on a broken ice at any time, it sadly dies.

When all **penguin** players are dead before the time is up, the **seal** player wins!

Otherwise, if there is at least one **penguin** player that is alive at the end, the **penguin** players lose...

![GamePage](https://user-images.githubusercontent.com/61868315/168454599-2f8ac712-8abc-4693-9e09-325a3a3504df.png)

**Seal Win**
![seal_win](https://user-images.githubusercontent.com/61868315/168454604-fc51b77c-31e8-4892-b145-c6d89871e96d.png)

**Penguins win**
![penguins_win](https://user-images.githubusercontent.com/61868315/168454637-efc54a0f-6194-4a86-8a08-19cab2409953.png)

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
socket backend at `http://localhost:8080/`.

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
