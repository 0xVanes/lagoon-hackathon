import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button, Form, Alert } from 'react-bootstrap';
import RealEstateWaqfTokenData from './abi/RealEstateWaqfToken.json';

const contractAddress = RealEstateWaqfTokenData.tokenAddress;
const contractABI = RealEstateWaqfTokenData.tokenAbi;

const RealEstateWaqf = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [newProposal, setNewProposal] = useState({
    certificateNumber: '',
    wakif: '',
    usedFor: '',
    nazir: '',
    landAddress: '',
    landWidth: '',
    buildingWidth: '',
    priceInUSD: ''
  });

  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      const signer = web3Provider.getSigner();
      setSigner(signer);
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(contractInstance);
    } else {
      alert('Please install MetaMask to use this feature');
    }
  }, []);

  const handleAddProposal = async () => {
    if (contract) {
      try {
        const description = `
          Certificate Number: ${newProposal.certificateNumber},
          Wakif: ${newProposal.wakif},
          Used For: ${newProposal.usedFor},
          Nazir: ${newProposal.nazir},
          Address: ${newProposal.landAddress},
          Land Width: ${newProposal.landWidth} sqm,
          Building Width: ${newProposal.buildingWidth} sqm
        `;
        const tx = await contract.addProposal(description, ethers.utils.parseUnits(newProposal.landWidth, 18), ethers.utils.parseUnits(newProposal.priceInUSD, 18));
        await tx.wait();
        alert('Proposal added successfully');
        setNewProposal({
          certificateNumber: '',
          wakif: '',
          usedFor: '',
          nazir: '',
          landAddress: '',
          landWidth: '',
          buildingWidth: '',
          priceInUSD: ''
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleInputChange = (e) => {
    setNewProposal({ ...newProposal, [e.target.name]: e.target.value });
  };

  const fetchProposals = async () => {
    if (contract) {
      try {
        const proposalCount = await contract.proposalCount();
        const proposalsArray = [];
        for (let i = 1; i <= proposalCount; i++) {
          const proposal = await contract.proposals(i);
          if (proposal.isValidated) {
            proposalsArray.push(proposal);
          }
        }
        setProposals(proposalsArray);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleVote = async (proposalId, support) => {
    if (contract) {
      try {
        const tx = await contract.vote(proposalId, support);
        await tx.wait();
        alert('Vote submitted successfully');
        fetchProposals(); // Refresh proposals after voting
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleValidateVote = async (proposalId) => {
    if (contract) {
      try {
        const tx = await contract.validateVote(proposalId);
        await tx.wait();
        alert('Vote validated successfully');
        fetchProposals(); // Refresh proposals after validation
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleBuyToken = async (proposalId) => {
    if (contract) {
      try {
        const tx = await contract.mintTokens(proposalId);
        await tx.wait();
        alert('Tokens minted and purchased successfully');
        fetchProposals(); // Refresh proposals after minting tokens
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleVerifyCertificate = async () => {
    if (contract) {
      try {
        const isVerified = await contract.verifyCertificate(newProposal.certificateNumber);
        if (isVerified) {
          alert('Certificate number is valid.');
        } else {
          alert('Certificate number is invalid.');
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred during verification.');
      }
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [contract]);

  return (
    <div>
      <h1>Land Tokenization</h1>
      <Form>
        <Form.Group>
          <Form.Label>Certificate Number</Form.Label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Control
              type="text"
              name="certificateNumber"
              value={newProposal.certificateNumber}
              onChange={handleInputChange}
              style={{ marginRight: '10px' }}
            />
            <Button variant="info" onClick={handleVerifyCertificate}>
              Verify
            </Button>
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label>Wakif</Form.Label>
          <Form.Control
            type="text"
            name="wakif"
            value={newProposal.wakif}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Used For</Form.Label>
          <Form.Control
            type="text"
            name="usedFor"
            value={newProposal.usedFor}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Nazir</Form.Label>
          <Form.Control
            type="text"
            name="nazir"
            value={newProposal.nazir}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Address of Land Asset</Form.Label>
          <Form.Control
            type="text"
            name="landAddress"
            value={newProposal.landAddress}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Width of Land (in sqm)</Form.Label>
          <Form.Control
            type="text"
            name="landWidth"
            value={newProposal.landWidth}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Width of Building (in sqm)</Form.Label>
          <Form.Control
            type="text"
            name="buildingWidth"
            value={newProposal.buildingWidth}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Price in USD</Form.Label>
          <Form.Control
            type="text"
            name="priceInUSD"
            value={newProposal.priceInUSD}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddProposal}>
          Add Proposal
        </Button>
      </Form>
      <h2>Existing Proposals</h2>
      {proposals.length === 0 ? (
        <Alert variant="warning">No validated proposals found</Alert>
      ) : (
        <ul>
          {proposals.map((proposal, index) => (
            <li key={index}>
              {proposal.description} - {ethers.utils.formatUnits(proposal.landPrice, 18)} ETH 
              (${ethers.utils.formatUnits(proposal.priceInUSD, 18)} USD) <br />
              Created At: {new Date(proposal.createdAt * 1000).toLocaleString()} <br />
              {proposal.isValidated && (
                <>
                  Vote Validated At: {new Date(proposal.voteValidatedAt * 1000).toLocaleString()} <br />
                  <Button variant="success" onClick={() => handleBuyToken(index)}>Buy Token</Button>
                </>
              )}
              {!proposal.isValidated && (
                <div>
                  <Button variant="primary" onClick={() => handleVote(index, true)}>Support</Button>
                  <Button variant="danger" onClick={() => handleVote(index, false)}>Oppose</Button>
                  <Button variant="secondary" onClick={() => handleValidateVote(index)}>Validate Vote</Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RealEstateWaqf;
