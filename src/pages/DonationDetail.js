import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button, Alert, Form } from 'react-bootstrap';
import { FaFacebookF, FaWhatsapp, FaInstagram, FaLink, FaTwitter } from 'react-icons/fa';
import { ethers } from 'ethers';
import proposalData from './abi/Proposal.json';

const DonationDetail = ({ donation, onBack }) => {
    const { isConnected, address } = useAccount();
    const [donationAmount, setDonationAmount] = useState('');
    const [message, setMessage] = useState('');

    const proposalAbi = proposalData.proposalAbi;
    const proposalAddress = proposalData.proposalAddress;

    const handleShare = (platform) => {
        const donationLink = window.location.href;
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

    const validateProposalId = async (_proposalId) => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const proposalContract = new ethers.Contract(proposalAddress, proposalAbi, signer);

            const [executed, expired] = await proposalContract.getProposalStatus(_proposalId);
            console.log('Proposal Executed:', executed);
            console.log('Proposal Expired:', expired);

            return !executed && !expired;
        } catch (error) {
            console.error('Error validating proposal ID:', error);
            return false;
        }
    };

    const handleDonate = async () => {
        try {
            if (!isConnected) {
                setMessage('Please connect your wallet first');
                return;
            }

            if (!donationAmount || parseFloat(donationAmount) <= 0) {
                setMessage('Please enter a valid donation amount');
                return;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            const signer = provider.getSigner();

            const proposalContract = new ethers.Contract(proposalAddress, proposalAbi, signer);

            const amountInWei = ethers.utils.parseEther(donationAmount);
            console.log('Attempting to donate:', {
                proposalId: donation.id,
                amountInWei: amountInWei.toString(),
                address: proposalAddress,
            });

            const tx = await proposalContract.donate(donation.id, {
                value: amountInWei,
                gasLimit: 500000, 
            });

            console.log('Transaction submitted:', tx.hash);

            const receipt = await tx.wait();
            console.log('Transaction receipt:', receipt);

            if (receipt.status === 1) {
                setMessage('Donation successful!');
            } else {
                setMessage('Donation failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during donation:', error);

            let errorMessage = 'Donation failed.';
            if (error.code === 'INSUFFICIENT_FUNDS') {
                errorMessage = 'Insufficient funds for gas.';
            } else if (error.code === 'NETWORK_ERROR') {
                errorMessage = 'Network error. Please check your connection.';
            } else if (error.code === 'ACTION_REJECTED') {
                errorMessage = 'Transaction was rejected. Please confirm the transaction to proceed.';
            } else if (error.reason) {
                errorMessage = error.reason;
            } else if (error.error && error.error.message) {
                errorMessage = error.error.message;
            } else {
                errorMessage = error.message;
            }

            setMessage(errorMessage);
        }
    };

    return (
        <div className="donation-detail container mt-4">
            <Button onClick={onBack} style={{ ...iconButtonStyle, width: 'auto', height: 'auto', borderRadius: '5px' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
                onMouseOut={e => e.currentTarget.style.backgroundColor = iconButtonStyle.backgroundColor}>Back to List</Button>
            <h1>{donation?.title || "No Title Available"}</h1>

            <section className="project-overview mb-4">
                <h2>Project Overview</h2>
                <p>{donation?.description || "No Description Available"}</p>
            </section>

            <section className="donation-info mb-4">
                <h2>Project Information</h2>
                <p><strong>Total Raised:</strong> {donation?.raised || "0"} ISLM / {donation?.goal || "N/A"} ISLM Goal</p>
                <p><strong>Number of Donors:</strong> {donation?.donors ? donation.donors.length : "XX"}</p>
                <ul>
                    <li>We appreciate that you want to help us. For that, we will give you a reward of:</li>
                    <li>1100 ISLM – Will be given 10LGN</li>
                    <li>2200 ISLM – Will be given 20LGN</li>
                    <li>5500 ISLM – Will be given 50LGN</li>
                </ul>
            </section>

            <section className="call-to-action">
                <h2>Donate</h2>
                <Form.Group controlId="donationAmount" className="mb-3">
                    <Form.Label>Enter Donation Amount (ISLM)</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Amount in ISLM"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                    />
                </Form.Group>
                {isConnected ? (
                    <Button className="donate-button mb-2" style={{ ...iconButtonStyle, width: 'auto', height: 'auto', borderRadius: '5px' }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = iconButtonStyle.backgroundColor} onClick={handleDonate}>
                        Donate Now
                    </Button>
                ) : (
                    <Alert variant="danger" className="mt-3">
                        Please connect your wallet to donate.
                    </Alert>
                )}
                {message && (
                    <Alert variant={message.includes('successful') ? 'success' : 'danger'} className="mt-3">
                        {message}
                    </Alert>
                )}
                <div className="social-share-buttons d-flex justify-content-start mt-3">
                    {['facebook', 'whatsapp', 'twitter', 'instagram', 'link'].map(platform => (
                        <button
                            key={platform}
                            onClick={() => handleShare(platform)}
                            className="share-button"
                            style={iconButtonStyle}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = iconButtonStyle.backgroundColor}
                        >
                            {platform === 'facebook' && <FaFacebookF />}
                            {platform === 'whatsapp' && <FaWhatsapp />}
                            {platform === 'twitter' && <FaTwitter />}
                            {platform === 'instagram' && <FaInstagram />}
                            {platform === 'link' && <FaLink />}
                        </button>
                    ))}
                </div>
            </section>

            <section className="donors mt-4">
                <h2>Donors</h2>
                <ul>
                    {donation?.donors && donation.donors.length > 0 ? donation.donors.map((donor, index) => (
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
};

export default DonationDetail;
