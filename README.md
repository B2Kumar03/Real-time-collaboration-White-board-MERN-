# Real-Time Collaborative Whiteboard

## Overview
The Real-Time Collaborative Whiteboard is a web application that allows multiple users to collaborate on a shared canvas in real-time. Users can draw, erase, and add shapes to the canvas. The app supports role-based access, ensuring that only the creator of the room can draw on the board. Additionally, the app provides features like undo, redo, exporting the canvas, and inviting other users to join the room via email.

## Features
- **Real-Time Drawing**: Collaborate with multiple users in real-time.
- **Role-Based Access**: Only the creator of the room can draw on the canvas.
- **Drawing Tools**: Pencil, Eraser, Shapes (Rectangle, Circle).
- **Color Palette**: Choose from a variety of colors for drawing.
- **Undo/Redo**: Easily undo or redo your actions on the canvas.
- **Export**: Export the canvas as an image or a PDF.
- **Invite**: Invite other users to join the room via email.

## Screenshot
![Screenshot](https://github.com/B2Kumar03/project2Image/blob/main/Screenshot%202024-08-01%20210007.png?raw=true)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/real-time-collaborative-whiteboard.git
    ```

2. Navigate to the project directory:
    ```sh
    cd real-time-collaborative-whiteboard
    ```

3. Install dependencies:
    ```sh
    npm install
    ```

4. Start the application:
    ```s
    npm start
    ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Enter a room ID to create or join a room.
3. If you are the creator of the room, you can draw on the canvas using the provided tools.
4. Use the "Invite" button to send the room ID to other users via email.
5. Only the creator of the room can draw on the canvas. Other users can view the changes in real-time.

## Components

### `Canvas.tsx`
- Manages the drawing functionality and user interactions on the canvas.
- Provides tools like pencil, eraser, and shapes.
- Implements undo, redo, and export functionality.
- Contains the invite modal for sending room ID to other users via email.

### `Headers.tsx`
- Displays the header and navigation bar.
- Contains the invite modal for sending room ID to other users via email.

### `App.tsx`
- Main entry point of the application.
- Sets up the routing and renders the `Canvas` component based on the route.

## Dependencies
- `react`
- `react-dom`
- `react-router-dom`
- `react-bootstrap`
- `socket.io-client`
- `jspdf`
- `react-icons`
- `bootstrap`

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgements
- Thanks to the developers of the libraries and tools used in this project.
- Special thanks to the contributors who helped in the development of this application.
