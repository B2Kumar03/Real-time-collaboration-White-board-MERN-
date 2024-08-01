import React, { useRef, useState, useEffect, MouseEvent, ChangeEvent, FormEvent } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Button, Dropdown, DropdownButton, ButtonGroup, Row, Col, Modal, Form } from 'react-bootstrap';
import { FaPencilAlt, FaEraser, FaShapes, FaPalette, FaFileExport, FaUndo, FaRedo, FaEnvelope } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import { Socket } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Headers from './Headers';
import './canvas.css';

interface CanvasProps {
  socket: Socket;
}

const Canvas: React.FC<CanvasProps> = ({ socket }) => {
  const { id: roomID } = useParams<{ id: string }>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [tool, setTool] = useState<string>('pencil');
  const [color, setColor] = useState<string>('#000000');
  const [history, setHistory] = useState<Array<ImageData>>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [inviteEmail, setInviteEmail] = useState<string>('');

  const location = useLocation();
  const state = location.state as { userName: string; isCreator: boolean };
  const { userName = 'Guest', isCreator = false } = state || {};

  useEffect(() => {
    if (roomID) {
      socket.emit('join-room', roomID);
    }
  }, [roomID, socket]);

  useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext('2d');
      if (renderCtx) {
        setContext(renderCtx);
        saveHistory(renderCtx);
      }
    }
  }, []);

  useEffect(() => {
    if (context) {
      socket.on('canvas-update', (data: { tool: string, color: string, lineWidth: number, x: number, y: number }) => {
        if (data.tool === 'pencil') {
          context.lineTo(data.x, data.y);
          context.strokeStyle = data.color;
          context.lineWidth = data.lineWidth;
          context.stroke();
        } else if (data.tool === 'eraser') {
          context.globalCompositeOperation = 'destination-out';
          context.beginPath();
          context.arc(data.x, data.y, 10, 0, 2 * Math.PI);
          context.fill();
          context.globalCompositeOperation = 'source-over';
        }
      });
    }
    return () => {
      socket.off('canvas-update');
    };
  }, [context, socket]);

  const saveHistory = (ctx: CanvasRenderingContext2D) => {
    if (canvasRef.current) {
      const newHistory = [...history];
      newHistory.splice(historyIndex + 1, newHistory.length - historyIndex - 1);
      newHistory.push(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      if (canvasRef.current && context) {
        context.putImageData(history[historyIndex - 1], 0, 0);
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      if (canvasRef.current && context) {
        context.putImageData(history[historyIndex + 1], 0, 0);
      }
    }
  };

  const startDrawing = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!isCreator) return;
    if (context) {
      if (tool === 'pencil') {
        context.beginPath();
        context.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
        setDrawing(true);
      } else if (tool === 'eraser') {
        context.globalCompositeOperation = 'destination-out';
        context.beginPath();
        context.arc(event.nativeEvent.offsetX, event.nativeEvent.offsetY, 10, 0, 2 * Math.PI);
        context.fill();
        setDrawing(true);
      }
    }
  };

  const draw = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!isCreator) return;
    if (drawing && context) {
      const x = event.nativeEvent.offsetX;
      const y = event.nativeEvent.offsetY;
      if (tool === 'pencil') {
        context.lineTo(x, y);
        context.strokeStyle = color;
        context.lineWidth = 2;
        context.stroke();
        emitDrawEvent(x, y);
      } else if (tool === 'eraser') {
        context.beginPath();
        context.arc(x, y, 10, 0, 2 * Math.PI);
        context.fill();
        emitDrawEvent(x, y);
      }
    }
  };

  const stopDrawing = () => {
    if (!isCreator) return;
    if (drawing && context) {
      context.closePath();
      context.globalCompositeOperation = 'source-over';
      setDrawing(false);
      saveHistory(context);
    }
  };

  const emitDrawEvent = (x: number, y: number) => {
    socket.emit('canvas-update', { roomID, tool, color, lineWidth: 2, x, y });
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const handleShapeSelect = (shape: 'rectangle' | 'circle') => {
    if (context && canvasRef.current) {
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      context.strokeStyle = color;
      context.fillStyle = color;
      context.beginPath();
      if (shape === 'rectangle') {
        context.rect(width / 4, height / 4, width / 2, height / 2);
      } else if (shape === 'circle') {
        context.arc(width / 2, height / 2, height / 4, 0, 2 * Math.PI);
      }
      context.stroke();
      context.fill();
    }
  };

  const handleExport = (format: 'image' | 'pdf') => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      if (format === 'image') {
        link.download = 'canvas.png';
        link.href = canvasRef.current.toDataURL('image/png');
      } else if (format === 'pdf') {
        const pdf = new jsPDF();
        pdf.addImage(canvasRef.current.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
        link.download = 'canvas.pdf';
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        link.href = pdfUrl;
      }
      link.click();
    }
  };

  const handleInviteClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInviteEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  };

  const handleInviteSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inviteEmail) {
      // Logic to send the roomID to the provided email
      console.log(`Sending room ID: ${roomID} to email: ${inviteEmail}`);
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="container mt-4 d-flex flex-column h-100">
        <h1>{!isCreator ? "You joined Real-Time Collaboration Whiteboard" : ""}</h1>
        {isCreator && (
          <Row className="mb-3 align-items-center">
            <Col>
              <div className="d-flex align-items-center gap-2">
                <Button
                  variant={tool === 'pencil' ? 'primary' : 'outline-primary'}
                  onClick={() => setTool('pencil')}
                >
                  <FaPencilAlt /> Pencil
                </Button>
                <Button
                  variant={tool === 'eraser' ? 'secondary' : 'outline-secondary'}
                  onClick={() => setTool('eraser')}
                >
                  <FaEraser /> Eraser
                </Button>
                <DropdownButton as={ButtonGroup} title={<span><FaShapes /> Shapes</span>} id="bg-nested-dropdown">
                  <Dropdown.Item eventKey="1" onClick={() => handleShapeSelect('rectangle')}>Rectangle</Dropdown.Item>
                  <Dropdown.Item eventKey="2" onClick={() => handleShapeSelect('circle')}>Circle</Dropdown.Item>
                </DropdownButton>
                <div className="d-flex align-items-center gap-2">
                  <FaPalette />
                  <input type="color" value={color} onChange={handleColorChange} />
                </div>
              </div>
            </Col>
            <Col>
              <div className="d-flex justify-content-end align-items-center gap-2 mt-8">
                <Button onClick={undo} disabled={historyIndex <= 0}><FaUndo /> Undo</Button>
                <Button onClick={redo} disabled={historyIndex >= history.length - 1}><FaRedo /> Redo</Button>
                <DropdownButton as={ButtonGroup} title={<span><FaFileExport /> Export</span>} id="bg-nested-dropdown">
                  <Dropdown.Item eventKey="1" onClick={() => handleExport('image')}>Image</Dropdown.Item>
                  <Dropdown.Item eventKey="2" onClick={() => handleExport('pdf')}>PDF</Dropdown.Item>
                </DropdownButton>
                <Button onClick={handleInviteClick} style={{ backgroundColor: 'red' }}><FaEnvelope /> Invite</Button>
              </div>
            </Col>
          </Row>
        )}
        <canvas
          ref={canvasRef}
          className="border border-dark flex-grow-1"
          width="1273"
          height="600"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        ></canvas>
        <h6 className='center'>{`Welcome ${userName} !`} {isCreator ? "" : `You joined Room ID: ${roomID}` }</h6>
      </div>
      
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Invite User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleInviteSubmit}>
            <Form.Group controlId="formRoomID">
              <Form.Label>Room ID</Form.Label>
              <Form.Control type="text" placeholder={roomID} readOnly />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={inviteEmail} onChange={handleInviteEmailChange} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Send
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Canvas;
