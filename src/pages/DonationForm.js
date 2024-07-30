import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAccount } from 'wagmi';

const DonationForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [goal, setGoal] = useState('');
  const [image, setImage] = useState('');
  const { isConnected } = useAccount();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    const newDonation = { title, description, amount: parseFloat(amount), goal: parseFloat(goal), image };
    onSubmit(newDonation);
    setTitle('');
    setDescription('');
    setAmount('');
    setGoal('');
    setImage('');
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group controlId="formTitle" className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formDescription" className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formAmount" className="mb-3">
        <Form.Label>Amount Collected in ISLM</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formGoal" className="mb-3">
        <Form.Label>Target Amount in ISLM</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formImage" className="mb-3">
        <Form.Label>Image URL</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </Form.Group>

      <Button className="custom-button" variant="success" type="submit">
        Submit
      </Button>

      {!isConnected && (
        <Alert variant="danger" className="mt-3">
          Please connect your wallet to submit a donation.
        </Alert>
      )}
    </Form>
  );
};

export default DonationForm;
