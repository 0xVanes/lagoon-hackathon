import React, { useState, useEffect } from 'react';
import { Card, Carousel, Button, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DonationDetail from './DonationDetail';
import DonationForm from './DonationForm';
import { useAccount } from 'wagmi';

const DonationList = () => {
  const [donations, setDonations] = useState([
    {
      title: 'We want to make a mosque in Pasteur',
      description: 'We need help in making mosque in Pasteur area',
      amount: 15000,
      goal: 30000,
      image: 'https://via.placeholder.com/600x200',
      timestamp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    },
    {
      title: 'We want to build elementary school in XX area',
      description: 'We need help to find an area in XX to build school',
      amount: 8000,
      goal: 20000,
      image: 'https://via.placeholder.com/600x200',
      timestamp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    },
  ]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { isConnected } = useAccount();

  const handleSelectDonation = (donation) => {
    setSelectedDonation(donation);
  };

  const handleAddDonation = (newDonation) => {
    newDonation.timestamp = Date.now() + 30 * 24 * 60 * 60 * 1000; // Add a default time limit of 30 days
    setDonations([...donations, newDonation]);
    setShowForm(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDonations((prevDonations) =>
        prevDonations.map((donation) => ({
          ...donation,
          isFinished: donation.timestamp < Date.now(),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-4">
      {isConnected ? (
        <Button className="custom-button mb-4" variant="success" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Donation'}
        </Button>
      ) : (
        <span className="text-danger">Please connect your wallet to add a donation</span>
      )}

      {showForm && <DonationForm onSubmit={handleAddDonation} />}

      {!selectedDonation ? (
        <>
          <Carousel className="mb-4">
            {donations.map((donation, index) => (
              <Carousel.Item key={index}>
                <Card className="donation-card mb-4" onClick={() => handleSelectDonation(donation)}>
                  <Card.Img variant="top" src={donation.image} alt={`Image for ${donation.title}`} className="donation-image" />
                  <Card.Body>
                    <Card.Title>{donation.title}</Card.Title>
                    <Card.Text>{donation.description}</Card.Text>
                    <ProgressBar now={(donation.amount / donation.goal) * 100} className="mb-2" variant="success" />
                    <div className="d-flex justify-content-between">
                      <span>{`Raised: ${((donation.amount / donation.goal) * 100).toFixed(2)}% (${donation.amount} ISLM)`}</span>
                      <span>{`Goal: ${donation.goal} ISLM`}</span>
                    </div>
                    {donation.isFinished && <div className="text-danger mt-2">Finished</div>}
                  </Card.Body>
                </Card>
              </Carousel.Item>
            ))}
          </Carousel>

          <div className="donation-list mt-4">
            {donations.length > 0 ? (
              <div className="row">
                {donations.map((donation, index) => (
                  <div key={index} className="col-md-6 mb-4">
                    <Card className="donation-card" onClick={() => handleSelectDonation(donation)}>
                      <Card.Img variant="top" src={donation.image} alt={`Image for ${donation.title}`} />
                      <Card.Body>
                        <Card.Title>{donation.title}</Card.Title>
                        <Card.Text>{donation.description}</Card.Text>
                        <ProgressBar now={(donation.amount / donation.goal) * 100} className="mb-2" variant="success" />
                        <div className="d-flex justify-content-between">
                          <span>{`Raised: ${((donation.amount / donation.goal) * 100).toFixed(2)}% (${donation.amount} ISLM)`}</span>
                          <span>{`Goal: ${donation.goal} ISLM`}</span>
                        </div>
                        {donation.isFinished && <div className="text-danger mt-2">Finished</div>}
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <p>No donations available</p>
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
