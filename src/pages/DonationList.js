import React, { useState, useEffect } from 'react';
import { Card, Carousel, Button, ProgressBar, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DonationDetail from './DonationDetail';
import DonationForm from './DonationForm';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import proposalData from './abi/Proposal.json';

const { proposalAbi, proposalAddress } = proposalData;

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { isConnected } = useAccount();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

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

            proposals.push({
              id: proposal.id.toNumber(),
              title: proposal.title,
              description: proposal.description,
              amount: ethers.utils.formatEther(proposal.balance.toString()),
              goal: ethers.utils.formatEther(proposal.amount.toString()),
              beneficiary: proposal.beneficiary,
              executed: proposal.executed,
              creationTime: proposal.creationTime.toNumber() * 1000,
              image: '/images/lagoon icon only green.png',
            });
          } catch (error) {
            console.error(`Error fetching proposal with ID ${i}:`, error);
          }
        }

        setDonations(proposals);
      } else {
        console.error('Ethereum object not found, install MetaMask.');
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  const handleSelectDonation = (donation) => {
    setSelectedDonation(donation);
  };

  const handleAddDonation = async (formData) => {
    try {
      if (!formData) {
        throw new Error('Form data is undefined.');
      }

      const { title, description, goal, beneficiary } = formData;

      if (!window.ethereum) {
        throw new Error('Ethereum object not found, install MetaMask.');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const proposalContract = new ethers.Contract(proposalAddress, proposalAbi, signer);

      const tx = await proposalContract.createProposal(
        title,
        description,
        ethers.utils.parseEther(goal.toString()),
        beneficiary
      );

      await tx.wait();

      console.log('New proposal added:', formData);

      setShowForm(false);

      fetchProposals();
    } catch (error) {
      console.error('Failed to create proposal:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const calculateTimeLeft = (creationTime) => {
    const endTime = creationTime + 30 * 24 * 60 * 60 * 1000; 
    const timeLeft = endTime - Date.now();

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };
  
  const filteredDonations = donations.filter((donation) => {
    if (filter === 'All') {
      return true;
    }
    if (filter === 'Active') {
      return !donation.executed;
    }
    if (filter === 'Ended') {
      return donation.executed;
    }
    return true;
  });

  const searchedDonations = filteredDonations.filter((donation) =>
    donation.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="d-flex justify-content-between mb-4">
        <Form.Control type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} className="mr-2" />
        <Form.Control as="select" value={filter} onChange={handleFilterChange} className="mr-2">
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Ended">Ended</option>
        </Form.Control>
      </div>

      {isConnected ? (
        <Button className="custom-button mb-4" variant="success" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Proposal'}
        </Button>
      ) : (
        <span className="text-danger">Please connect your wallet to add a donation</span>
      )}

      {showForm && <DonationForm onSubmit={handleAddDonation} />}

      {!selectedDonation ? (
        <>
          <Carousel className="mb-4">
            {searchedDonations.map((donation, index) => (
              <Carousel.Item key={index}>
                <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-top-${index}`}>{donation.title}</Tooltip>}>
                  <Card className="donation-card mb-4" onClick={() => handleSelectDonation(donation)}>
                    <Card.Img variant="top" src={donation.image} alt={`Image for ${donation.title}`}
                      style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body>
                      <Card.Title>{donation.title}</Card.Title>
                      <Card.Text>{donation.description}</Card.Text>
                      <ProgressBar now={(donation.amount / donation.goal) * 100} className="mb-2" variant="success" />
                      <div className="d-flex justify-content-between">
                        <span>{`Raised: ${((donation.amount / donation.goal) * 100).toFixed(2)}% (${donation.amount} ISLM)`}</span>
                        <span>{`Goal: ${donation.goal} ISLM`}</span>
                      </div>
                      <div className="d-flex justify-content-between mt-2">
                        <span>{`Time left: ${calculateTimeLeft(donation.creationTime)}`}</span>
                        {donation.executed && <div className="text-danger">Finished</div>}
                      </div>
                    </Card.Body>
                  </Card>
                </OverlayTrigger>
              </Carousel.Item>
            ))}
          </Carousel>

          <div className="donation-list mt-4">
            {searchedDonations.length > 0 ? (
              <div className="row">
                {searchedDonations.map((donation, index) => (
                  <div key={index} className="col-md-6 mb-4">
                    <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-top-${index}`}>{donation.title}</Tooltip>}>
                      <Card className="donation-card" onClick={() => handleSelectDonation(donation)}>
                        <Card.Img variant="top" src={donation.image} alt={`Image for ${donation.title}`}
                          style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                        />
                        <Card.Body>
                          <Card.Title>{donation.title}</Card.Title>
                          <Card.Text>{donation.description}</Card.Text>
                          <ProgressBar now={(donation.amount / donation.goal) * 100} className="mb-2" variant="success" />
                          <div className="d-flex justify-content-between">
                            <span>{`Raised: ${((donation.amount / donation.goal) * 100).toFixed(2)}% (${donation.amount} ISLM)`}</span>
                            <span>{`Goal: ${donation.goal} ISLM`}</span>
                          </div>
                          <div className="d-flex justify-content-between mt-2">
                            <span>{`Time left: ${calculateTimeLeft(donation.creationTime)}`}</span>
                            {donation.executed && <div className="text-danger">Finished</div>}
                          </div>
                        </Card.Body>
                      </Card>
                    </OverlayTrigger>
                  </div>
                ))}
              </div>
            ) : (
              <div className="d-flex flex-column align-items-center">
                <img src="/images/lagoonIconOnlyWhite.png" alt="Lagoon Image"
                  style={{ maxWidth: '70%', height: 'auto', marginBottom: '20px' }}
                />
                <p>No donations available</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <DonationDetail donation={selectedDonation} onBack={() => setSelectedDonation(null)} />
      )}
    </div>
  );
};

export default DonationList;
