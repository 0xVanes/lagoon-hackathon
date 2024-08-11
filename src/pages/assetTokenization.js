import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Button, Form, Alert } from 'react-bootstrap';
import votingData from './abi/Voting.json'; // ABI for the Voting contract
import assetTokenizationData from './abi/AssetTokenization.json'; // ABI for the AssetTokenization contract

const { votingAbi, votingAddress } = votingData;
const { assetTokenizationAbi, assetTokenizationAddress } = assetTokenizationData;

const AssetTokenization = ({ fetchProposals }) => {
  const [name, setName] = useState('');
  const [assetType, setAssetType] = useState('');
  const [uri, setUri] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const proposeAsset = async () => {
    if (!name || !assetType || !uri) {
      setMessage('Please fill out all fields.');
      return;
    }

    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const votingContract = new ethers.Contract(votingAddress, votingAbi, signer);

      // Propose the asset for voting
      const tx = await votingContract.createProposal(
        `Tokenize Asset: ${name}`, 
        `Asset Type: ${assetType}, URI: ${uri}`, 
        0, // No funding required, only approval
        signer.getAddress()
      );
      await tx.wait();

      setMessage('Asset proposal created. Waiting for community approval.');
      fetchProposals(); // Refresh the proposals list
    } catch (error) {
      console.error('Error proposing asset:', error);
      setMessage('Failed to create asset proposal.');
    } finally {
      setIsLoading(false);
    }
  };

  const tokenizeAsset = async (proposalId) => {
    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const votingContract = new ethers.Contract(votingAddress, votingAbi, signer);

      const isApproved = await votingContract.isProposalApproved(proposalId);

      if (!isApproved) {
        setMessage('This asset proposal has not been approved by the community.');
        return;
      }

      const assetTokenizationContract = new ethers.Contract(assetTokenizationAddress, assetTokenizationAbi, signer);
      const tx = await assetTokenizationContract.tokenizeAsset(name, assetType, uri);
      await tx.wait();

      setMessage('Asset successfully tokenized.');
    } catch (error) {
      console.error('Error tokenizing asset:', error);
      setMessage('Failed to tokenize asset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Propose a New Asset for Tokenization</h2>
      {message && <Alert variant="info">{message}</Alert>}
      <Form>
        <Form.Group controlId="formAssetName">
          <Form.Label>Asset Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter asset name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formAssetType">
          <Form.Label>Asset Type</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter asset type"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formAssetUri">
          <Form.Label>Asset Metadata URI</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter asset URI"
            value={uri}
            onChange={(e) => setUri(e.target.value)}
          />
        </Form.Group>
        <Button
          variant="success"
          onClick={proposeAsset}
          disabled={isLoading}
        >
          {isLoading ? 'Proposing...' : 'Propose Asset'}
        </Button>
      </Form>
    </div>
  );
};

export default AssetTokenization;
