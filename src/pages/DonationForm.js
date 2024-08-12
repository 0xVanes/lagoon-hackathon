import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import proposalData from './abi/Proposal.json';

const { proposalAbi, proposalAddress } = proposalData;

const DonationForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    if (!window.ethereum) {
      setMessage('Please install a Web3 wallet like MetaMask');
    }
  }, []);

  const createProposal = async (title, description, goal, beneficiary) => {
    if (!window.ethereum) {
      setMessage('Ethereum provider not detected. Please install MetaMask or another Web3 wallet.');
      return;
    }

    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);

      const signer = provider.getSigner();
      const proposalContract = new ethers.Contract(proposalAddress, proposalAbi, signer);

      const goalString = goal.toString();

      const tx = await proposalContract.createProposal(
        title,
        description,
        ethers.utils.parseEther(goalString),
        beneficiary
      );
      await tx.wait();

      setMessage('Proposal created successfully!');
      onSubmit({ title, description, goal: goalString, beneficiary });
    } catch (error) {
      console.error('Error creating proposal:', error);

      if (error.code === 'INSUFFICIENT_FUNDS') {
        setMessage('Failed to create proposal: Insufficient funds for gas.');
      } else if (error.code === 'NETWORK_ERROR') {
        setMessage('Failed to create proposal: Network error. Please check your connection.');
      } else if (error.code === 'ACTION_REJECTED') {
        setMessage('Transaction was rejected. Please confirm the transaction to proceed.');
      } else {
        setMessage(`Failed to create proposal: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      setMessage('Please connect your wallet first.');
      return;
    }

    if (!title || !description || !goal || !walletAddress) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      const goalInt = parseInt(goal, 10);
      await createProposal();
      //await createProposal(title, description, goalInt, walletAddress);

      onSubmit({
        title,
        description,
        goal: goalInt.toString(),
        beneficiary: walletAddress,
      });

      setTitle('');
      setDescription('');
      setGoal('');
      setWalletAddress('');
      setMessage('Proposal created successfully!');
      fetchProposals();
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  return (
    <>
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

        <Form.Group controlId="formGoal" className="mb-3">
          <Form.Label>Donation Goal in ISLM</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formWalletAddress" className="mb-3">
          <Form.Label>Beneficiary Wallet Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </Form.Group>

        <Button className="custom-button" variant="success" type="submit" disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Submit'}
        </Button>

        {!isConnected && (
          <Alert variant="danger" className="mt-3">
            Please connect your wallet to submit a donation.
          </Alert>
        )}

        {message && (
          <Alert variant={message.includes('success') ? 'success' : 'danger'} className="mt-3">
            {message}
          </Alert>
        )}
      </Form>
    </>
  );
};

export default DonationForm;
