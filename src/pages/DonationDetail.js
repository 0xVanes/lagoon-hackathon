import React from 'react';
import { useAccount } from 'wagmi';
import { Button, Alert } from 'react-bootstrap';

const DonationDetail = ({ donation, onBack }) => {
  const { isConnected } = useAccount();

  const handleShare = () => {
    const donationLink = window.location.href; // Adjust the link if needed
    navigator.clipboard.writeText(donationLink).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const buttonStyle = {
    backgroundColor: '#40A578', // light green color
    borderColor: '#40A578',
    color: '#fff',
    transition: 'background-color 0.3s, border-color 0.3s',
    padding: '5px 10px',
    fontSize: '14px',
    marginBottom: '10px',
  };

  const hoverStyle = {
    backgroundColor: '#365E32', // darker shade of light green for hover effect
    borderColor: '#365E32',
  };

  if (!donation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="donation-detail container mt-4">
      <Button 
        onClick={onBack} 
        style={{ ...buttonStyle, width: 'auto' }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
        onMouseOut={e => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
      >
        Back to List
      </Button>
      <h1>{donation.title ? donation.title : "No Title Available"}</h1>
      
      <section className="project-overview mb-4">
        <h2>Project Overview</h2>
        <p>{donation.description ? donation.description : "No Description Available"}</p>
      </section>

      <section className="donation-info mb-4">
        <h2>Project Information</h2>
        <p><strong>Total Lagooned:</strong> {donation.amount ? donation.amount : "N/A"} ISLM / {donation.goal ? donation.goal : "N/A"} ISLM Oceaned</p>
        <p><strong>Number of Donors:</strong> XX</p>
        <ul>
          <li>We appreciate that you want to help us. For that, we will give you a reward of:</li>
          <li>1100 ISLM – Will be given 10LGN</li>
          <li>2200 ISLM – Will be given 20LGN</li>
          <li>5500 ISLM – Will be given 50LGN</li>
        </ul>
      </section>

      <section className="call-to-action">
        <h2>Call to Action</h2>
        {isConnected ? (
          <Button 
            className="donate-button mb-2" 
            style={{ ...buttonStyle, width: 'auto' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
            onMouseOut={e => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
          >
            Donate Now
          </Button>
        ) : (
          <Alert variant="danger" className="mt-3">
            Please connect your wallet to donate.
          </Alert>
        )}
        <Button 
          onClick={handleShare} 
          className="share-button" 
          style={{ ...buttonStyle, width: 'auto' }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
          onMouseOut={e => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
        >
          Share Link
        </Button>
      </section>
    </div>
  );
}

export default DonationDetail;
