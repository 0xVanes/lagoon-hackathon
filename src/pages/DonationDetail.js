import React from 'react';
import { useAccount } from 'wagmi';
import { Button, Alert } from 'react-bootstrap';
import { FaFacebookF, FaWhatsapp, FaInstagram, FaLink, FaTwitter } from 'react-icons/fa';

const DonationDetail = ({ donation, onBack }) => {
  const { isConnected } = useAccount();

  const handleShare = (platform) => {
    const donationLink = window.location.href; // Adjust the link if needed
    const message = `Check out this donation opportunity: ${donationLink}`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(donationLink)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'instagram':
        navigator.clipboard.writeText(donationLink).then(() => {
          alert('Link copied to clipboard! You can now paste it in your Instagram bio or story.');
        }).catch(err => {
          console.error('Failed to copy: ', err);
        });
        break;
      default:
        navigator.clipboard.writeText(donationLink).then(() => {
          alert('Link copied to clipboard!');
        }).catch(err => {
          console.error('Failed to copy: ', err);
        });
        break;
    }
  };

  const iconButtonStyle = {
    backgroundColor: '#40A578',
    border: 'none',
    color: '#fff',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 5px',
    transition: 'background-color 0.3s',
    fontSize: '18px',
  };

  const hoverStyle = {
    backgroundColor: '#365E32',
  };

  if (!donation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="donation-detail container mt-4">
      <Button 
        onClick={onBack} 
        style={{ ...iconButtonStyle, width: 'auto', height: 'auto', borderRadius: '5px' }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
        onMouseOut={e => e.currentTarget.style.backgroundColor = iconButtonStyle.backgroundColor}
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
            style={{ ...iconButtonStyle, width: 'auto', height: 'auto', borderRadius: '5px' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
            onMouseOut={e => e.currentTarget.style.backgroundColor = iconButtonStyle.backgroundColor}
          >
            Donate Now
          </Button>
        ) : (
          <Alert variant="danger" className="mt-3">
            Please connect your wallet to donate.
          </Alert>
        )}
        <div className="social-share-buttons d-flex justify-content-start mt-3">
          <button 
            onClick={() => handleShare('facebook')} 
            className="share-button" 
            style={iconButtonStyle}
            onMouseOver={e => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
            onMouseOut={e => e.currentTarget.style.backgroundColor = iconButtonStyle.backgroundColor}
          >
            <FaFacebookF />
          </button>
          <button 
            onClick={() => handleShare('whatsapp')} 
            className="share-button" 
            style={iconButtonStyle}
            onMouseOver={e => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
            onMouseOut={e => e.currentTarget.style.backgroundColor = iconButtonStyle.backgroundColor}
          >
            <FaWhatsapp />
          </button>
          <button 
            onClick={() => handleShare('twitter')} 
            className="share-button" 
            style={iconButtonStyle}
            onMouseOver={e => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
            onMouseOut={e => e.currentTarget.style.backgroundColor = iconButtonStyle.backgroundColor}
          >
            <FaTwitter />
          </button>
          <button 
            onClick={() => handleShare('instagram')} 
            className="share-button" 
            style={iconButtonStyle}
            onMouseOver={e => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
            onMouseOut={e => e.currentTarget.style.backgroundColor = iconButtonStyle.backgroundColor}
          >
            <FaInstagram />
          </button>
          <button 
            onClick={() => handleShare()} 
            className="share-link-button" 
            style={iconButtonStyle}
            onMouseOver={e => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
            onMouseOut={e => e.currentTarget.style.backgroundColor = iconButtonStyle.backgroundColor}
          >
            <FaLink />
          </button>
        </div>
      </section>

      <section className="donors mt-4">
        <h2>Donors</h2>
        <ul>
          {donation.donors ? donation.donors.map((donor, index) => (
            <li key={index}>
              <p><strong>Time:</strong> {donor.time}</p>
              <p><strong>Wallet Address:</strong> {donor.walletAddress}</p>
              <p><strong>Amount:</strong> {donor.amount} ISLM</p>
            </li>
          )) : <p>No donors yet.</p>}
        </ul>
      </section>
    </div>
  );
}

export default DonationDetail;
