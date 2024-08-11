import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, Button, Spinner, FormControl } from 'react-bootstrap';
import proposalData from './abi/Proposal.json';
import votingData from './abi/Voting.json';

const { proposalAbi, proposalAddress } = proposalData;
const { votingAbi, votingAddress } = votingData;

const VotingList = () => {
    const [proposals, setProposals] = useState([]);
    const [filteredProposals, setFilteredProposals] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchProposals();
    }, []);

    useEffect(() => {
        // Filter proposals based on search query
        setFilteredProposals(
            proposals.filter((proposal) =>
                proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                proposal.id.toString().includes(searchQuery)
            )
        );
    }, [searchQuery, proposals]);

    const fetchProposals = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const proposalContract = new ethers.Contract(proposalAddress, proposalAbi, signer);
            const votingContract = new ethers.Contract(votingAddress, votingAbi, signer);

            const proposalCount = await proposalContract.getProposalCount();
            const proposalsArray = [];

            for (let i = 1; i <= proposalCount; i++) {
                const proposal = await proposalContract.getProposal(i);
                const votes = await votingContract.getVotes(i);

                proposalsArray.push({
                    id: proposal.id.toNumber(),
                    title: proposal.title,
                    description: proposal.description,
                    votesFor: votes.votesFor.toNumber(),
                    votesAgainst: votes.votesAgainst.toNumber(),
                    executed: proposal.executed,
                });
            }
            setProposals(proposalsArray);
            setFilteredProposals(proposalsArray); // Initialize with all proposals
        } catch (error) {
            console.error('Error fetching proposals:', error);
        }
    };

    const voteOnProposal = async (proposalId, support) => {
        setLoadingId(proposalId);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const votingContract = new ethers.Contract(votingAddress, votingAbi, signer);

            const tx = await votingContract.vote(proposalId, support, {
              gasLimit: 500000, 
            });
            await tx.wait();

            // Optimistically update UI
            setProposals((prevProposals) => 
                prevProposals.map(p => 
                    p.id === proposalId 
                        ? {
                            ...p, 
                            votesFor: support ? p.votesFor + 1 : p.votesFor, 
                            votesAgainst: support ? p.votesAgainst : p.votesAgainst + 1 
                          } 
                        : p)
            );
        } catch (error) {
            console.error('Error voting on proposal:', error);
        } finally {
            setLoadingId(null);
        }
    };

    const executeProposal = async (proposalId) => {
        setLoadingId(proposalId);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const votingContract = new ethers.Contract(votingAddress, votingAbi, signer);

            const tx = await votingContract.executeProposal(proposalId, {
              gasLimit: 500000, 
            });
            await tx.wait();

            // Optimistically update UI
            setProposals((prevProposals) => 
                prevProposals.map(p => 
                    p.id === proposalId ? { ...p, executed: true } : p)
            );
        } catch (error) {
            console.error('Error executing proposal:', error);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Voting List</h2>
            <FormControl
                type="text"
                placeholder="Search by title or ID"
                className="mb-3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {filteredProposals.length > 0 ? (
                filteredProposals.map((proposal) => (
                    <Card key={proposal.id} className="mb-3">
                        <Card.Body>
                            <Card.Title>{proposal.title}</Card.Title>
                            <Card.Text>{proposal.description}</Card.Text>
                            <Card.Text>
                                Votes For: {proposal.votesFor} | Votes Against: {proposal.votesAgainst}
                            </Card.Text>
                            <Button
                                variant="success"
                                onClick={() => voteOnProposal(proposal.id, true)}
                                disabled={loadingId === proposal.id || proposal.executed}
                            >
                                {loadingId === proposal.id && !proposal.executed ? <Spinner size="sm" animation="border" /> : 'Support'}
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => voteOnProposal(proposal.id, false)}
                                disabled={loadingId === proposal.id || proposal.executed}
                            >
                                {loadingId === proposal.id && !proposal.executed ? <Spinner size="sm" animation="border" /> : 'Oppose'}
                            </Button>
                            {!proposal.executed && (
                                <Button
                                    variant="warning"
                                    onClick={() => executeProposal(proposal.id)}
                                    disabled={loadingId === proposal.id}
                                >
                                    {loadingId === proposal.id ? <Spinner size="sm" animation="border" /> : 'Execute Proposal'}
                                </Button>
                            )}
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <p>No proposals found.</p>
            )}
        </div>
    );
};

export default VotingList;
