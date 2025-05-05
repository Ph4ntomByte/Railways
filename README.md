# Railway Puzzle Game

A browser-based tile-connection puzzle game built with **HTML**, **CSS**, and **JavaScript**—no frameworks required.  
Arrange straight, curved, or switchable track segments on a grid so that every cell is connected by a single continuous railway.

![Gameplay example](/pics/railway-gameplay.png)

---

## 📄 Declaration

**Student:** Rauf Suleymanov  
**Course:** Web Programming - Assessment (CVDJB8)  
**Institution:** Eötvös Loránd University  
I declare this work is my own and has not been shared or copied. Violation of ELTE regulations (§74/C) may result in expulsion.

---

## 🏆 Completed Requirements

### Mandatory (8 points)
- ✔️ Plain HTML file, no frameworks  
- ✔️ Avoids all 'bad practices'  
- ✔️ Readme properly filled  
- ✔️ Menu with name field, difficulty select, Start button  
- ✔️ Start navigates to game screen  
- ✔️ Rules accessible from menu  
- ✔️ Player name displayed & timer starts  
- ✔️ Random map per difficulty loads with all UI elements  

### Basic Tasks (12 points)
- ✔️ Place elements per rules (straight on bridge, 90° on mountain, none on oasis)  
- ✔️ Automatic puzzle validation (continuous path, no cell touched twice, correct elements)  
- ✔️ Display completion time  
- ✔️ Leaderboard per difficulty (saved in LocalStorage)  
- ✔️ Clean design & organized code  

### Bonus (5 points)
- ✔️ Save & restore game state  
- ✔️ Persistent leaderboards in LocalStorage  
- ✔️ Drag-to-place path drawing  

---

## 🎮 How to Play

1. **Run** run live server.
2. **Enter** your name, **select** difficulty, and **Start**.  
3. **Place** track pieces:
   - **Straight**: only horizontal/vertical on bridges  
   - **Curve**: only on curved segments  
   - **Rotate**: click a placed piece to rotate 90°  
   - **Empty/Oasis**: cannot place on oasis  
4. **Solve** when all grid cells are connected in one continuous loop.  
5. Upon completion, your **time** is recorded and shown on the **leaderboard**.

---

## ⚙️ Folder Structure

```
/
├── css/
│   └── style.css
├── js/
│   └── app.js
├── pics/
│   └── buttons
│   └── levels
│   └── railway-gameplay.png
│   └── screens
│   └── tiles
├── index.html
└── README.md
```

---

## 🛠 Technologies

- **HTML5** & **CSS3** for layout & styling  
- **Vanilla JavaScript** for game logic & UI interaction  
- **LocalStorage** for saving game state & leaderboards  

---

## 🚀 Running Locally

No server needed—just open in any modern browser:

```bash
http-server
```

---

## 🤝 Contributing

Suggestions or improvements welcome. Fork the repo, submit a PR, and we’ll review!

---

## 📄 License

MIT License © 2025 Rauf 