import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import RealEstateWaqfTokenData from './abi/RealEstateWaqfToken.json';

const tokenAbi = RealEstateWaqfTokenData.tokenAbi;
const CONTRACT_ADDRESS = RealEstateWaqfTokenData.tokenAddress;

const App = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [proposalDescription, setProposalDescription] = useState('');
  const [priceInRupiah, setPriceInRupiah] = useState('');
  const [proposals, setProposals] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else {
      window.alert('Please install MetaMask!');
    }
  };

  const loadBlockchainData = async () => {
    setLoading(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    if (!Array.isArray(tokenAbi) || !CONTRACT_ADDRESS) {
      console.error("Invalid ABI or Contract Address");
      setLoading(false);
      return;
    }

    const landTokenization = new web3.eth.Contract(tokenAbi, CONTRACT_ADDRESS);
    setContract(landTokenization);

    const proposalCount = await landTokenization.methods.proposalCount().call();
    const loadedProposals = [];
    for (let i = 1; i <= proposalCount; i++) {
      const proposal = await landTokenization.methods.proposals(i).call();
      loadedProposals.push(proposal);
    }
    setProposals(loadedProposals);

    const investorsData = [];
    for (let i = 0; i < accounts.length; i++) {
      const investorBalance = await landTokenization.methods.landTokenBalance(accounts[i]).call();
      if (investorBalance > 0) {
        investorsData.push({ address: accounts[i], balance: investorBalance });
      }
    }
    setInvestors(investorsData);
    setLoading(false);
  };

  const createProposal = async () => {
    await contract.methods.createProposal(proposalDescription, priceInRupiah).send({ from: account });
  };

  const voteOnProposal = async (proposalId, support) => {
    await contract.methods.voteOnProposal(proposalId, support).send({ from: account });
  };

  const convertToToken = async (proposalId) => {
    const proposal = proposals.find(p => p.id === proposalId);
    await contract.methods.convertToToken(proposalId).send({ from: account, value: proposal.priceInRupiah });
  };

  const invest = async (proposalId, amount) => {
    await contract.methods.invest(proposalId, amount).send({ from: account, value: amount });
  };

  const sellTokens = async (proposalId, amount) => {
    await contract.methods.sellTokens(proposalId, amount).send({ from: account });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', color: '#4CAF50' }}>Land Tokenization dApp</h1>
      <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Connected Account: {account}</p>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#4CAF50' }}>Create Proposal</h2>
        <input 
          type="text" 
          placeholder="Description (including what it is used for, the address of the land, area in sqm)" 
          value={proposalDescription} 
          onChange={(e) => setProposalDescription(e.target.value)} 
          style={{ padding: '10px', width: '100%', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input 
          type="text" 
          placeholder="Certification" 
          style={{ padding: '10px', width: '100%', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button 
          style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
        >
          Verify
        </button>
        <input 
          type="text" 
          placeholder="Nazir's Address" 
          style={{ padding: '10px', width: '100%', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button 
          style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
        >
          Verify
        </button>
        <input 
          type="number" 
          placeholder="Price in Rupiah" 
          value={priceInRupiah} 
          onChange={(e) => setPriceInRupiah(e.target.value)} 
          style={{ padding: '10px', width: '100%', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={createProposal} 
          style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
        >
          Create Proposal
        </button>
        <p>There will be a 2.5% fee for Transactions</p>
      </div>

      <div>
        <h2 style={{ color: '#4CAF50' }}>Proposals</h2>
        {loading ? (
          <p>Loading proposals...</p>
        ) : (
          proposals.map((proposal, index) => (
            <div key={index} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}>
              <p><strong>ID:</strong> {Number(proposal.id).toString()}</p>
              <p><strong>Description:</strong> {proposal.description}</p>
              <p><strong>Price in Rupiah:</strong> {Number(proposal.priceInRupiah).toString()}</p>
              <p><strong>Support Votes:</strong> {Number(proposal.supportVotes).toString()} / {Number(proposal.totalVotes).toString()}</p>
              <p><strong>Token Supply:</strong> {Number(proposal.tokenSupply).toString()}</p>
              <button 
                onClick={() => voteOnProposal(proposal.id, true)} 
                style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
              >
                Vote Support
              </button>
              <button 
                onClick={() => voteOnProposal(proposal.id, false)} 
                style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e53935'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
              >
                Vote Against
              </button>
              <button 
                onClick={() => convertToToken(proposal.id)} 
                style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#2196F3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1976D2'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2196F3'}
              >
                Convert to Token
              </button>
              <button 
                onClick={() => invest(proposal.id, priceInRupiah)} 
                style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#FF9800', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#FB8C00'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#FF9800'}
              >
                Invest
              </button>
              <button 
                onClick={() => sellTokens(proposal.id, priceInRupiah)} 
                style={{ padding: '5px 10px', backgroundColor: '#FF9800', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#FB8C00'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#FF9800'}
              >
                Sell Tokens
              </button>
            </div>
          ))
        )}
      </div>

      <div>
        <h2 style={{ color: '#4CAF50' }}>Investors</h2>
        {investors.length === 0 ? (
          <p>No investors found.</p>
        ) : (
          investors.map((investor, index) => (
            <div key={index} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}>
              <p><strong>Address:</strong> {investor.address}</p>
              <p><strong>Token Balance:</strong> {Number(investor.balance).toString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
