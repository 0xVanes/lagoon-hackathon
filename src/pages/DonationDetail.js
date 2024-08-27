import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button, Alert, Form, Table } from 'react-bootstrap';
import { FaFacebookF, FaWhatsapp, FaInstagram, FaLink, FaTwitter } from 'react-icons/fa';
import { ethers } from 'ethers';
import proposalData from './abi/Proposal.json';
import lagoonTokenData from './abi/LagoonToken.json';
import lgnNftData from './abi/lgnNft.json';

const DonationDetail = ({ donation, onBack }) => {
    const { isConnected, address } = useAccount();
    const [donationAmount, setDonationAmount] = useState('');
    const [message, setMessage] = useState('');
    const [donors, setDonors] = useState([]);
    const [raisedAmount, setRaisedAmount] = useState('0');
    const [donorCount, setDonorCount] = useState(0);

    const proposalAbi = proposalData.proposalAbi;
    const proposalAddress = proposalData.proposalAddress;

    const lagoonTokenAbi = lagoonTokenData.tokenAbi;
    const lagoonTokenAddress = lagoonTokenData.tokenAddress;

    const lagoonNftAbi = lgnNftData.nftAbi;
    const lagoonNftAddress = lgnNftData.nftAddress;

    useEffect(() => {
        if (isConnected && donation?.id) {
            fetchDonorData();
            fetchRaisedAmount();
            fetchDonorCount();
        }
    }, [isConnected, donation?.id]); 

    const fetchRaisedAmount = async () => {
        try {
            if (!donation?.id) {
                console.error('Donation ID is not defined');
                return;
            }
    
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const proposalContract = new ethers.Contract(proposalAddress, proposalAbi, provider);
            
            console.log('Fetching raised amount for proposal ID:', donation.id);
            const proposal = await proposalContract.getProposal(donation.id);

            setRaisedAmount(ethers.utils.formatEther(proposal.balance)); // Update the state with the formatted raised amount
        } catch (error) {
            console.error('Error fetching raised amount:', error.message || error);
        }
    };

    const fetchDonorCount = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const proposalContract = new ethers.Contract(proposalAddress, proposalAbi, provider);
    
            console.log('Fetching donor count for proposal ID:', donation.id);
            const count = await proposalContract.getDonorCount(donation.id);
    
            setDonorCount(count.toNumber()); // Update the state with the donor count
        } catch (error) {
            console.error('Error fetching donor count:', error);
        }
    };

    const fetchDonorData = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const proposalContract = new ethers.Contract(proposalAddress, proposalAbi, provider);
    
            console.log('Fetching donor data for proposal ID:', donation.id);
            const donors = await proposalContract.getDonors(donation.id);
    
            const donorsData = donors.map(donor => ({
                time: new Date(donor.time * 1000).toLocaleString(), // Convert timestamp to human-readable format
                walletAddress: donor.walletAddress, // Donor's wallet address
                amount: ethers.utils.formatEther(donor.amount), // Convert amount from Wei to Ether
            }));
    
            setDonors(donorsData);
        } catch (error) {
            console.error('Error fetching donor data:', error);
        }
    };
    


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

    const handleReceiveTokens = async () => {
        try {
            if (!isConnected) {
                setMessage('Please connect your wallet first');
                return;
            }
    
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            const signer = provider.getSigner();
    
            const lagoonTokenContract = new ethers.Contract(lagoonTokenAddress, lagoonTokenAbi, signer);
            
            let tokensToReceive = 0;

            if (parseFloat(donationAmount) < 1100) {
                tokensToReceive = 10;
            } else if (parseFloat(donationAmount) < 2200) {
                tokensToReceive = 20;
            } else if (parseFloat(donationAmount) < 5500) {
                tokensToReceive = 50;
            } else {
                tokensToReceive = 100;
            }

            console.log(`Distributing ${tokensToReceive} Lagoon tokens...`);
        
            const tx = await lagoonTokenContract.distributeTokens(address, ethers.utils.parseEther(tokensToReceive.toString()), {
                gasLimit: 500000, 
            });
    
            console.log('Transaction submitted:', tx.hash);
    
            const receipt = await tx.wait();
            console.log('Transaction receipt:', receipt);
    
            if (receipt.status === 1) {
                setMessage('Tokens distributed successfully!');
            } else {
                setMessage('Token distribution failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during token distribution:', error);
            setMessage('Token distribution failed.');
        }
    };  
    
    const handleReceiveNft = async () => {
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
    
            const lagoonNftContract = new ethers.Contract(lagoonNftAddress, lagoonNftAbi, signer);
    
            console.log(`Minting NFT for donation amount:`, donationAmount);
    
            const tx = await lagoonNftContract.mintNFT(address, ethers.utils.parseEther(donationAmount), {
                gasLimit: 500000, 
            });
    
            console.log('Transaction submitted:', tx.hash);
    
            const receipt = await tx.wait();
            console.log('Transaction receipt:', receipt);
    
            if (receipt.status === 1) {
                setMessage('NFT minted successfully!');
            } else {
                setMessage('NFT minting failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during NFT minting:', error);
            setMessage('NFT minting failed.');
        }
    };        

    const handleWithdraw = async () => {
        try {
            if (!isConnected) {
                setMessage('Please connect your wallet first');
                return;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            const signer = provider.getSigner();

            const proposalContract = new ethers.Contract(proposalAddress, proposalAbi, signer);

            console.log('Attempting to withdraw funds for proposal ID:', donation.id);

            const tx = await proposalContract.withdraw(donation.id, {
                gasLimit: 500000,
            });

            console.log('Transaction submitted:', tx.hash);

            const receipt = await tx.wait();
            console.log('Transaction receipt:', receipt);

            if (receipt.status === 1) {
                setMessage('Withdrawal successful!');
            } else {
                setMessage('Withdrawal failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during withdrawal:', error);
            setMessage('Withdrawal failed.');
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
                window.location.reload();
            } else {
                setMessage('Donation failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during donation:', error);
    
            let errorMessage = 'Donation failed.';
    
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
                <p><strong>Total Raised:</strong> {raisedAmount} ISLM / {donation?.goal || "N/A"} ISLM Goal</p>
                <p><strong>Number of Donors:</strong> {donorCount}</p> {/* Display the donor count */}
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
                    <>
                        <Button className="donate-button mb-2" style={{ ...iconButtonStyle, width: 'auto', height: 'auto', borderRadius: '5px' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = iconButtonStyle.backgroundColor} onClick={handleDonate}>
                            Donate Now
                        </Button>
                        <Button className="token-button mb-2" style={{ ...iconButtonStyle, width: 'auto', height: 'auto', borderRadius: '5px' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = iconButtonStyle.backgroundColor} onClick={handleReceiveTokens}>
                            Receive Lagoon Tokens
                        </Button>
                        <Button className="nft-button mb-2" style={{ ...iconButtonStyle, width: 'auto', height: 'auto', borderRadius: '5px' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = iconButtonStyle.backgroundColor} onClick={handleReceiveNft}>
                            Receive NFT
                        </Button>
                        <Button className="withdraw-button mb-2" style={{ ...iconButtonStyle, width: 'auto', height: 'auto', borderRadius: '5px', marginLeft: '5px' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = iconButtonStyle.backgroundColor} onClick={handleWithdraw}>
                            Withdraw Funds
                        </Button>
                    </>
                ) : (
                    <Alert variant="danger" className="mt-3">
                        Please connect your wallet to donate, withdraw or receive tokens.
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
                {donors.length > 0 ? (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Wallet Address</th>
                                <th>Amount (ISLM)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donors.map((donor, index) => (
                                <tr key={index}>
                                    <td>{donor.time}</td>
                                    <td>{donor.walletAddress}</td>
                                    <td>{donor.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <p>No donors yet.</p>
                )}
            </section>
        </div>
    );
};

export default DonationDetail;
