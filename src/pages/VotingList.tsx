import React, { useState, useEffect } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import { ethers } from 'ethers';
import proposalData from './abi/Proposal.json';

const { proposalAbi, proposalAddress } = proposalData;

const VotingList: React.FC = () => {
  const [proposals, setProposals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const proposalContract = new ethers.Contract(proposalAddress, proposalAbi, signer);

        const proposalCount = await proposalContract.getProposalCount();
        console.log('Proposal Count:', proposalCount.toString());

        const proposals = [];

        for (let i = 1; i <= proposalCount; i++) {
          try {
            const proposal = await proposalContract.getProposal(i);

            if (proposal.amount.eq(0) && proposal.beneficiary === ethers.constants.AddressZero) {
              continue;
            }

            const voters = await proposalContract.getVoters(i); // Assume this method returns the list of voter addresses
            const totalVoters = voters.length;

            proposals.push({
              id: proposal.id.toNumber(),
              title: proposal.title,
              description: proposal.description,
              goal: ethers.utils.formatEther(proposal.amount.toString()),
              beneficiary: proposal.beneficiary,
              creationTime: proposal.creationTime.toNumber() * 1000,
              timeLeft: calculateTimeLeft(proposal.creationTime.toNumber() * 1000),
              voters,
              totalVoters,
            });
          } catch (error) {
            console.error(`Error fetching proposal with ID ${i}:`, error);
          }
        }

        setProposals(proposals);
      } else {
        console.error('Ethereum object not found, install MetaMask.');
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  const calculateTimeLeft = (creationTime: number) => {
    const endTime = creationTime + 30 * 24 * 60 * 60 * 1000;
    const timeLeft = endTime - Date.now();
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProposals = proposals.filter(
    (proposal) =>
      proposal.id.toString().includes(searchTerm) ||
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Voting List</h2>

      <Form.Control
        type="text"
        placeholder="Search by Proposal ID or Title"
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4"
      />

      <ListGroup>
        {filteredProposals.length > 0 ? (
          filteredProposals.map((proposal, index) => (
            <ListGroup.Item key={index}>
              <h5>Proposal ID: {proposal.id}</h5>
              <p>Title: {proposal.title}</p>
              <p>Description: {proposal.description}</p>
              <p>Goal: {proposal.goal} ISLM</p>
              <p>Beneficiary: {proposal.beneficiary}</p>
              <p>Time Left: {proposal.timeLeft}</p>
              <p>Total Voters: {proposal.totalVoters}</p>
              <p>Voters:</p>
              <ul>
                {proposal.voters.map((voter: string, voterIndex: number) => (
                  <li key={voterIndex}>{voter}</li>
                ))}
              </ul>
            </ListGroup.Item>
          ))
        ) : (
          <p>No matching proposals found</p>
        )}
      </ListGroup>
    </div>
  );
};

export default VotingList;
